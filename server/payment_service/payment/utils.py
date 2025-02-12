import base64
import json
from .models import StripeAccount
from django.db import transaction
from .models import Transactions
from protos.client import update_user_credits
import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

def decode_jwt(token):
    """Decodes the JWT and returns the payload."""
    parts = token.split('.')
    if len(parts) != 3:
        return None  # Invalid JWT format

    payload_base64 = parts[1]
    payload_json = base64.urlsafe_b64decode(payload_base64 + '==')
    payload = json.loads(payload_json)
    return payload

@transaction.atomic
def handle_checkout_completed(session):
    try:
        credits = int(session['metadata']['credits'])
        user_id = int(session['metadata']['user_id'])
        transaction_type = session['metadata']['transaction_type']

        transaction = Transactions.objects.create(
            user_id=user_id,
            amount=session['amount_total'] / 100,  # Convert from paise to rupees 
            purchased_credits=credits,
            transaction_type=transaction_type,
            status='completed',
            reference_id=session['payment_intent'],
        ) 
        # Notify user service via gRPC
        grpc_success = update_user_credits(user_id, credits)
        
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
        transaction.status = 'refunded'
        transaction.save()

    except Exception as e:
        print(f"Refund failed: {str(e)}")

def handle_account_verification(account):
    try:
        stripe_account = StripeAccount.objects.get(stripe_account_id=account.id)
        print('account', account)
        # Check if the account is fully verified
        is_verified = (
            account.charges_enabled and 
            account.payouts_enabled and 
            account.details_submitted
        )
        
        stripe_account.is_verified = is_verified
        stripe_account.save()
        
    except StripeAccount.DoesNotExist:
        print(f"No matching Stripe account found for {account.id}")