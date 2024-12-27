import stripe
from rest_framework import status
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from django.db import transaction
from .models import Transactions, StripeAccount
from .serializers import TransactionsSerializer, WithdrawalSerializer, StripeAccountSerializer
from .permissions import IsOwner
from protos.client import update_user_credits
import os 
from dotenv import load_dotenv
from django.conf import settings
from rest_framework import generics
from .utils import handle_account_verification, handle_checkout_completed

load_dotenv()
 
# Create your views here. 
  
stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCheckoutSession(APIView): 
    permission_classes = [IsOwner] 
    def post(self, request): 
        serializer = TransactionsSerializer(data=request.data)
        if serializer.is_valid(): 
            credits = serializer.validated_data['purchased_credits']  # Assuming 'purchased_credits' is in request data
            price_per_credit = serializer.validated_data['price_per_credit']
            currency = serializer.validated_data['currency']
            user_id = serializer.validated_data['user_id']  # Get user_id from the request data
            transaction_type = serializer.validated_data['transaction_type']
 
            try:
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
                            'unit_amount': unit_amount,  # Amount in paise
                        },
                        'quantity': credits,
                    }],
                    mode='payment',
                    success_url = f"{os.getenv('FRONTEND_DOMAIN')}/payment/success?session_id={{CHECKOUT_SESSION_ID}}&amount={price_per_credit * credits}&credits={credits}",
                    cancel_url=f"{os.getenv('FRONTEND_DOMAIN')}/payment/cancel",
                    metadata={
                        'credits': credits,
                        'user_id': user_id,  # Pass user_id in metadata
                        'transaction_type': transaction_type, 
                    }
                )

                return Response({
                    'session_id': session.id,
                    'amount': unit_amount,
                    'quantity': credits}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StripeWebhook(APIView):
    def post(self, request):
        try:
            payload = request.body 
            sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
            event = stripe.Webhook.construct_event(
                payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET'), # tolerance=300 # Increase to 10 minutes (600 seconds)
            ) 

        except Exception as e:
            print('errrrrrrroddd', str(e))
            return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except stripe.error.SignatureVerificationError as e:
            return JsonResponse({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)

        event_type = event['type']

        # Handle other events (checkout session completed)
        if event_type == 'checkout.session.completed':
            session = event['data']['object']
            handle_checkout_completed(session)
        # elif event_type == 'financial_connections.account.created':
        elif event.type == 'account.updated':
            account = event.data.object
            handle_account_verification(account)

        return JsonResponse({'status': 'success'}, status=status.HTTP_200_OK)

class StripeAccountDetailView(generics.RetrieveAPIView):
    queryset = StripeAccount.objects.all()
    serializer_class = StripeAccountSerializer
    permission_classes = [IsOwner]

    def get(self, request, user_id):
        try:
            stripe_account = StripeAccount.objects.get(user_id=user_id)
            if stripe_account.is_verified:
                return Response({'isVerified': True}, status=status.HTTP_200_OK)
            else: 
                return Response({'isVerified': False}, status=status.HTTP_200_OK)
        except StripeAccount.DoesNotExist:
            return Response({'error': 'Stripe account not found for the specified user.'}, status=status.HTTP_404_NOT_FOUND)

class StripeAccountListView(generics.ListCreateAPIView):
    queryset = StripeAccount.objects.all()
    serializer_class = StripeAccountSerializer
    permission_classes = [IsOwner]

    def post(self, request):
        try:
            user_id = request.data.get('user_id')
            email = request.data.get('email')
            print('request.data', request.data)

            existing_account = StripeAccount.objects.filter(user_id=user_id).first()
            
            if existing_account:
                # If it exists, create account links for verification using the existing account ID
                account_links = stripe.AccountLink.create(
                    account=existing_account.stripe_account_id,
                    refresh_url=f"{settings.FRONTEND_DOMAIN}/stripe/refresh",
                    return_url=f"{settings.FRONTEND_DOMAIN}/withdraw",
                    type='account_onboarding',
                )
                return Response({
                    'url': account_links.url
                }, status=status.HTTP_200_OK)

            # Create a Stripe Connect account
            account = stripe.Account.create(
                type='express',  
                country='US',
                email=email,
                capabilities={
                    'transfers': {'requested': True},
                },
            )

            # Save the account details
            StripeAccount.objects.create(
                user_id=request.data.get('user_id'),  
                stripe_account_id=account.id 
            ) 
            print('raccount')
            # Create account links for verification 
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
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class WithdrawView(APIView):
    permission_classes = [IsOwner]
    def post(self, request):
        serializer = WithdrawalSerializer(data=request.data)
    
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            credits = serializer.validated_data['credits']
            amount_inr = credits * 150  # 1 credit = 150 rupees
            
            # Get user's Stripe account
            stripe_account = StripeAccount.objects.get(user_id=request.data.get('user_id'))

            if not stripe_account.is_verified:
                return Response({
                    'error': 'Your Stripe account is not fully verified yet'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Convert INR to USD for the transfer
            # Using a fixed exchange rate for example. In production, use a real-time rate
            USD_TO_INR_RATE = 83.0  # Update this rate regularly
            amount_usd = amount_inr / USD_TO_INR_RATE
            print('amount_usd', amount_usd)
            # Round to 2 decimal places and convert to cents
            amount_usd_cents = int(round(amount_usd * 100))

            # Create transfer in USD
            transfer = stripe.Transfer.create(
                amount=amount_usd_cents,  # Amount in USD cents
                currency='usd',  # Use USD instead of INR
                destination=stripe_account.stripe_account_id,
                description=f'Withdrawal of {credits} credits (INR {amount_inr})'
            )
            print('transfer', transfer)
            # Create transaction record (store the INR amount for reference)
            transaction = Transactions.objects.create(
                user_id=request.data.get('user_id'),
                amount=amount_inr,  # Store original INR amount
                purchased_credits=None,
                transaction_type='withdrawal',
                status='completed',
                reference_id=transfer.id
            )
            
            # Update user credits via gRPC
            grpc_success = update_user_credits(
                request.data.get('user_id'), 
                request.data.get('balance_credits') - credits, 
                is_deduction=True
            )
            
            if not grpc_success:
                # Reverse the transfer if gRPC call fails
                stripe.Transfer.create_reversal(
                    transfer.id,
                    amount=amount_usd_cents
                )
                transaction.status = 'failed'
                transaction.save()
                return Response({
                    'error': 'Failed to update credits'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({
                'message': 'Withdrawal successful',
                'transaction_id': transaction.id,
                'amount_inr': amount_inr,
                'amount_usd': amount_usd
            })
            
        except StripeAccount.DoesNotExist:
            return Response({
                'error': 'Please connect your Stripe account first'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class TransactionsDetailView(generics.ListAPIView):
    serializer_class = TransactionsSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Transactions.objects.filter(user_id=user_id).order_by('-transaction_date')