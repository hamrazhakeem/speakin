import grpc
import os
from .generated.user_service_pb2 import UpdateUserCreditsRequest
from .generated.user_service_pb2_grpc import UserServiceStub
from .generated.payment_service_pb2 import LockCreditsRequest, RefundLockedCreditsRequest, ReleaseLockedCreditsRequest
from .generated.payment_service_pb2_grpc import PaymentServiceStub
import logging

# Get logger for the session app
logger = logging.getLogger('bookings')

def update_user_credits(user_id, new_balance, refund_from_escrow=None):
    try:
        logger.info(f"Initiating gRPC call to update credits for user {user_id}")
        with grpc.insecure_channel(os.getenv('USER_SERVICE_GRPC_HOST') + ':50051') as channel:
            user_stub = UserServiceStub(channel)
            response = user_stub.UpdateUserCredits(UpdateUserCreditsRequest(
                user_id=user_id,
                credits=new_balance,
                is_deduction=not refund_from_escrow,  # If refunding, this is not a deduction
                refund_from_escrow=refund_from_escrow or False
            ))
            if response.success:
                logger.info(f"Successfully updated credits for user {user_id}")
            return response.success
    except grpc.RpcError as e:
        logger.error(f"Failed to connect to user service: {e.details()}")
        return False
    
def lock_credits_in_escrow(student_id, tutor_id, booking_id, credits_required):
    try:
        logger.info(f"Initiating credit lock for booking {booking_id}: student {student_id}, tutor {tutor_id}")
        with grpc.insecure_channel(os.getenv('PAYMENT_SERVICE_GRPC_HOST') + ':50052') as channel:
            payment_stub = PaymentServiceStub(channel)
            response = payment_stub.LockCredits(LockCreditsRequest(
                student_id=student_id,
                tutor_id=tutor_id,
                booking_id=booking_id,
                credits_locked=credits_required,
                status='locked'
            ))
            if response.success:
                logger.info(f"Successfully locked {credits_required} credits for booking {booking_id}")
            return response.success
    except grpc.RpcError as e:
        logger.error(f"Failed to lock credits in escrow: {e.details()} (Code: {e.code()})")
        return False
    
def refund_credits_from_escrow(booking_id):
    try:
        logger.info(f"Initiating credit refund for booking {booking_id}")
        with grpc.insecure_channel(os.getenv('PAYMENT_SERVICE_GRPC_HOST') + ':50052') as channel:
            payment_stub = PaymentServiceStub(channel)
            response = payment_stub.RefundLockedCredits(RefundLockedCreditsRequest(
                booking_id=booking_id,
            ))
            if response.success:
                logger.info(f"Successfully refunded credits for booking {booking_id}")
            return response.success
    except grpc.RpcError as e:
        logger.error(f"Failed to refund credits from escrow: {e.details()} (Code: {e.code()})")
        return False
    
def release_credits_from_escrow(session_type, booking_id):
    try:
        logger.info(f"Initiating credit release for booking {booking_id}")
        with grpc.insecure_channel(os.getenv('PAYMENT_SERVICE_GRPC_HOST') + ':50052') as channel:
            payment_stub = PaymentServiceStub(channel)
            response = payment_stub.ReleaseLockedCredits(ReleaseLockedCreditsRequest(
                session_type=session_type,
                booking_id=booking_id,
            ))
            if response.success:
                logger.info(f"Successfully released credits for booking {booking_id}")
            return response.success
    except grpc.RpcError as e:
        logger.error(f"Failed to release credits from escrow: {e.details()} (Code: {e.code()})")
        return False