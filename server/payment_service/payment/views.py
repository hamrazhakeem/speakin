import stripe
from rest_framework import status
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from django.db import transaction
from .models import Transactions
from .serializers import TransactionsSerializer
from grpc_services.grpc_client import notify_user_service
import os
from dotenv import load_dotenv

load_dotenv()  

# Create your views here. 
  
stripe.api_key = os.getenv('STRIPE_SECRET_KEY') 

class CreateCheckoutSession(APIView): 
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
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        
        try:

            event = stripe.Webhook.construct_event(
                payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET')
            )
        except ValueError as e:
            return JsonResponse({'error': 'Invalid payload'}, status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            return JsonResponse({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            handle_checkout_completed(session)

        return JsonResponse({'status': 'success'}, status=status.HTTP_200_OK)

@transaction.atomic
def handle_checkout_completed(session):
    try:
        credits = int(session['metadata']['credits'])
        user_id = int(session['metadata']['user_id'])
        transaction_type = session['metadata']['transaction_type']

        Transactions.objects.create(
            user_id=user_id,
            amount=session['amount_total'] / 100,  # Convert from paise to rupees 
            purchased_credits=credits,
            transaction_type=transaction_type,
            status='completed',
            reference_id=session['payment_intent'],
        ) 
        # Notify user service via gRPC
        grpc_success = notify_user_service(user_id, credits)
        
        # Handle gRPC failure by initiating a refund
        if not grpc_success:
            refund_transaction(transaction, session['payment_intent'])
    
    except Exception as e:
        print(f"Error processing payment: {str(e)}")
        raise


def refund_transaction(transaction, payment_intent):
    """ Initiates a refund with Stripe and updates the transaction status """
    try:
        # Create a refund
        stripe.Refund.create(payment_intent=payment_intent)
        
        # Update transaction status to 'refunded'
        transaction.status = 'refund'
        transaction.save()

    except Exception as e:
        print(f"Refund failed: {str(e)}")