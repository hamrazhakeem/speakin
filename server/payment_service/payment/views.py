import stripe
from rest_framework import status
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from .models import Transactions, StripeAccount, Escrow
from .serializers import TransactionsSerializer, WithdrawalSerializer, StripeAccountSerializer, EscrowSerializer
from .permissions import IsOwner
from protos.client import update_user_credits
import os 
from dotenv import load_dotenv
from django.conf import settings
from rest_framework import generics
from .utils import handle_account_verification, handle_checkout_completed
import logging

# Get logger for the payment app
logger = logging.getLogger('payment')

load_dotenv()
 
stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCheckoutSession(APIView): 
    permission_classes = [IsOwner] 
    def post(self, request): 
        serializer = TransactionsSerializer(data=request.data)
        if serializer.is_valid(): 
            credits = serializer.validated_data['purchased_credits']  
            price_per_credit = serializer.validated_data['price_per_credit']
            currency = serializer.validated_data['currency']
            user_id = serializer.validated_data['user_id']
            transaction_type = serializer.validated_data['transaction_type']
 
            try:
                logger.info(f"Creating checkout session for user {user_id}: {credits} credits")
                # Create Stripe checkout session 
                unit_amount = int(price_per_credit * 100) 
                session = stripe.checkout.Session.create( 
                    payment_method_types=['card'],
                    line_items=[{
                        'price_data': {
                            'currency': currency, 
                            'product_data': {
                                'name': 'Credits',
                                'description': f'{credits} credits',
                            }, 
                            'unit_amount': unit_amount,
                        },
                        'quantity': credits,
                    }],
                    mode='payment',
                    success_url = f"{os.getenv('FRONTEND_DOMAIN')}/payment/success?session_id={{CHECKOUT_SESSION_ID}}&amount={price_per_credit * credits}&credits={credits}",
                    cancel_url=f"{os.getenv('FRONTEND_DOMAIN')}/payment/cancel",
                    metadata={
                        'credits': credits,
                        'user_id': user_id,
                        'transaction_type': transaction_type, 
                    }
                )
                logger.info(f"Checkout session created successfully: {session.id}")
                return Response({
                    'session_id': session.id,
                    'amount': unit_amount,
                    'quantity': credits}, status=status.HTTP_200_OK)
            except Exception as e:
                logger.error(f"Error creating checkout session: {str(e)}")
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        logger.warning(f"Invalid serializer data: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StripeWebhook(APIView):
    def post(self, request):
        try:
            logger.info("Processing Stripe webhook event")
            payload = request.body 
            sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
            event = stripe.Webhook.construct_event(
                payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET'), tolerance=360000000000000000000000000000
            ) 
            logger.info(f"Webhook event type: {event['type']}")

        except Exception as e:
            logger.error(f"Webhook error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except stripe.error.SignatureVerificationError as e:
            logger.error("Invalid webhook signature")
            return JsonResponse({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)

        event_type = event['type']

        if event_type == 'checkout.session.completed':
            logger.info("Processing checkout.session.completed event")
            session = event['data']['object']
            handle_checkout_completed(session)
        elif event_type == 'file.created':
            logger.info("Processing file.created event")
            handle_account_verification({
                'data': {
                    'object': event.data.object
                },
                'created': event.created,
                'type': event.type
            }, event_type)
        elif event_type == 'account.updated':
            logger.info("Processing account.updated event")
            account = event.data.object
            handle_account_verification(account, event_type)

        return JsonResponse({'status': 'success'}, status=status.HTTP_200_OK)

class StripeAccountDetail(generics.RetrieveAPIView):
    queryset = StripeAccount.objects.all()
    serializer_class = StripeAccountSerializer
    permission_classes = [IsOwner]

    def get(self, request, user_id):
        try:
            logger.info(f"Fetching Stripe account details for user {user_id}")
            stripe_account = StripeAccount.objects.get(user_id=user_id)
            if stripe_account.is_verified:
                logger.info(f"Stripe account verified for user {user_id}")
                return Response({'isVerified': True}, status=status.HTTP_200_OK)
            else: 
                logger.info(f"Stripe account not verified for user {user_id}")
                return Response({'isVerified': False}, status=status.HTTP_200_OK)
        except StripeAccount.DoesNotExist:
            logger.warning(f"No Stripe account found for user {user_id}")
            return Response({'error': 'Stripe account not found for the specified user.'}, status=status.HTTP_404_NOT_FOUND)

class StripeAccountList(generics.ListCreateAPIView):
    queryset = StripeAccount.objects.all()
    serializer_class = StripeAccountSerializer
    permission_classes = [IsOwner]

    def post(self, request):
        try:
            user_id = request.data.get('user_id')
            email = request.data.get('email')
            logger.info(f"Creating/updating Stripe account for user {user_id}")

            existing_account = StripeAccount.objects.filter(user_id=user_id).first()
            
            if existing_account:
                logger.info(f"Creating account links for existing account: {existing_account.stripe_account_id}")
                account_links = stripe.AccountLink.create(
                    account=existing_account.stripe_account_id,
                    refresh_url=f"{settings.FRONTEND_DOMAIN}/stripe/refresh",
                    return_url=f"{settings.FRONTEND_DOMAIN}/withdraw",
                    type='account_onboarding',
                )
                return Response({
                    'url': account_links.url
                }, status=status.HTTP_200_OK)

            logger.info("Creating new Stripe Connect account")
            account = stripe.Account.create(
                type='express',  
                country='US',
                email=email,
                capabilities={
                    'transfers': {'requested': True},
                },
            )

            StripeAccount.objects.create(
                user_id=request.data.get('user_id'),  
                stripe_account_id=account.id 
            ) 
            logger.info(f"Created new Stripe account: {account.id}")

            account_links = stripe.AccountLink.create(
                account=account.id,
                refresh_url=f"{settings.FRONTEND_DOMAIN}/stripe/refresh",
                return_url=f"{settings.FRONTEND_DOMAIN}/withdraw",
                type='account_onboarding',
            )
            
            return Response({ 
                'url': account_links.url
            })
            
        except Exception as e:
            logger.error(f"Error creating/updating Stripe account: {str(e)}")
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class WithdrawView(APIView):
    permission_classes = [IsOwner]
    def post(self, request):
        serializer = WithdrawalSerializer(data=request.data)
    
        if not serializer.is_valid():
            logger.warning(f"Invalid withdrawal request: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            credits = serializer.validated_data['credits']
            amount_inr = credits * 150  # 1 credit = 150 rupees
            user_id = request.data.get('user_id')
            logger.info(f"Processing withdrawal for user {user_id}: {credits} credits ({amount_inr} INR)")
            
            stripe_account = StripeAccount.objects.get(user_id=user_id)

            if not stripe_account.is_verified:
                logger.warning(f"Withdrawal rejected: Unverified Stripe account for user {user_id}")
                return Response({
                    'error': 'Your Stripe account is not fully verified yet'
                }, status=status.HTTP_400_BAD_REQUEST)

            USD_TO_INR_RATE = 83.0
            amount_usd = amount_inr / USD_TO_INR_RATE
            amount_usd_cents = int(round(amount_usd * 100))

            logger.info(f"Creating transfer of {amount_usd_cents} USD cents to account {stripe_account.stripe_account_id}")
            transfer = stripe.Transfer.create(
                amount=amount_usd_cents,
                currency='usd',
                destination=stripe_account.stripe_account_id,
                description=f'Withdrawal of {credits} credits (INR {amount_inr})'
            )

            transaction = Transactions.objects.create(
                user_id=user_id,
                amount=amount_inr,
                purchased_credits=None,
                transaction_type='withdrawal',
                status='completed',
                reference_id=transfer.id
            )
            logger.info(f"Created transaction record: {transaction.id}")
            
            grpc_success = update_user_credits(
                user_id, 
                request.data.get('balance_credits') - credits, 
                is_deduction=True
            )
            
            if not grpc_success:
                logger.error(f"Failed to update user credits, reversing transfer for user {user_id}")
                stripe.Transfer.create_reversal(
                    transfer.id,
                    amount=amount_usd_cents
                )
                transaction.status = 'failed'
                transaction.save()
                return Response({
                    'error': 'Failed to update credits'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            logger.info(f"Withdrawal completed successfully for user {user_id}")
            return Response({
                'message': 'Withdrawal successful',
                'transaction_id': transaction.id,
                'amount_inr': amount_inr,
                'amount_usd': amount_usd
            })
            
        except StripeAccount.DoesNotExist:
            logger.warning(f"No Stripe account found for user {user_id}")
            return Response({
                'error': 'Please connect your Stripe account first'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Withdrawal error: {str(e)}")
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class TransactionsDetail(generics.ListAPIView):
    serializer_class = TransactionsSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        logger.info(f"Fetching transaction history for user {user_id}")
        return Transactions.objects.filter(user_id=user_id).order_by('-transaction_date')
    
class TransactionsList(generics.ListAPIView):
    serializer_class = TransactionsSerializer
    queryset = Transactions.objects.all().order_by('-transaction_date')

class EscrowList(generics.ListAPIView):
    serializer_class = EscrowSerializer
    queryset = Escrow.objects.all().order_by('-created_at')