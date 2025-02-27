import base64
import json
from .models import StripeAccount
from django.db import transaction
from .models import Transactions
from protos.client import update_user_credits
import stripe
from django.conf import settings
import logging

# Get logger for the payment app
logger = logging.getLogger('payment')

stripe.api_key = settings.STRIPE_SECRET_KEY

def decode_jwt(token):
    """Decodes the JWT and returns the payload."""
    parts = token.split('.')
    if len(parts) != 3:
        logger.error("Invalid JWT format: token does not have three parts")
        return None  # Invalid JWT format

    payload_base64 = parts[1]
    payload_json = base64.urlsafe_b64decode(payload_base64 + '==')
    payload = json.loads(payload_json)
    logger.debug("JWT decoded successfully")
    return payload

@transaction.atomic
def handle_checkout_completed(session):
    try:
        credits = int(session['metadata']['credits'])
        user_id = int(session['metadata']['user_id'])
        transaction_type = session['metadata']['transaction_type']

        logger.info(f"Processing checkout completion for user {user_id}: {credits} credits")

        transaction = Transactions.objects.create(
            user_id=user_id,
            amount=session['amount_total'] / 100,  # Convert from paise to rupees 
            purchased_credits=credits,
            transaction_type=transaction_type,
            status='completed',
            reference_id=session['payment_intent'],
        ) 
        logger.info(f"Transaction created: ID {transaction.id}")

        # Notify user service via gRPC
        grpc_success = update_user_credits(user_id, credits)
        
        # Handle gRPC failure by initiating a refund
        if not grpc_success:
            logger.error(f"Failed to update user credits for user {user_id}, initiating refund")
            refund_transaction(transaction, session['payment_intent'])
    
    except Exception as e:
        logger.error(f"Error processing payment: {str(e)}")
        raise

def refund_transaction(transaction, payment_intent):
    """ Initiates a refund with Stripe and updates the transaction status """
    try:
        logger.info(f"Initiating refund for transaction {transaction.id}")
        # Create a refund
        stripe.Refund.create(payment_intent=payment_intent)
        
        # Update transaction status to 'refunded'
        transaction.status = 'refunded'
        transaction.save()
        logger.info(f"Refund completed for transaction {transaction.id}")

    except Exception as e:
        logger.error(f"Refund failed for transaction {transaction.id}: {str(e)}")

def handle_account_verification(account, event_type):
    try:
        if event_type == 'file.created':
            logger.info("Processing file.created event for account verification")
            # Retrieve the account details using the file object
            account_details = stripe.Account.list(
                limit=1,
                created={'gte': account.get('created', 0) - 60}  # Look for accounts created in the last minute
            )
            logger.debug('Account details retrieved from Stripe')
            
            if account_details and account_details.data:
                account_id = account_details.data[0].id
                logger.info(f'Found matching account: {account_id}')
                
                stripe_account = StripeAccount.objects.get(stripe_account_id=account_id)
                stripe_account.is_verified = True
                stripe_account.save()
                logger.info(f'Account {account_id} marked as verified')
            else:
                logger.warning('No matching account found')
                
        elif event_type == 'account.updated':
            logger.info(f"Processing account.updated event for account {account.id}")
            stripe_account = StripeAccount.objects.get(stripe_account_id=account.id)
            is_verified = (
                account.charges_enabled and 
                account.payouts_enabled and 
                account.details_submitted
            )
            stripe_account.is_verified = is_verified
            stripe_account.save()
            logger.info(f'Account {account.id} verification status updated to {is_verified}')
        
    except StripeAccount.DoesNotExist:
        logger.error(f"No matching Stripe account found")
    except Exception as e:
        logger.error(f"Error in handle_account_verification: {str(e)}")