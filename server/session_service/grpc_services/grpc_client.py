import grpc
from .user_service_pb2 import DeductBalanceCreditsRequest
from .user_service_pb2_grpc import UserServiceStub
from .payment_service_pb2 import LockCreditsRequest, RefundLockedCreditsRequest
from .payment_service_pb2_grpc import PaymentServiceStub

def deduct_balance_credits(user_id, new_balance, refund_from_escrow=None):
    try:
        with grpc.insecure_channel('user_service:50051') as channel:
            user_stub = UserServiceStub(channel)
            response = user_stub.DeductBalanceCredits(DeductBalanceCreditsRequest(
                user_id=user_id,
                new_balance_credits=new_balance, 
                refund_from_escrow=refund_from_escrow
            ))
            return response.success
    except grpc.RpcError as e:
        print(f"Failed to connect to user service: {e.details()}")  # Detailed error logging
        return False
    
def lock_credits_in_escrow(student_id, tutor_id, booking_id, credits_required):
    try:
        with grpc.insecure_channel('payment_service:50052') as channel:
            payment_stub = PaymentServiceStub(channel)
            response = payment_stub.LockCredits(LockCreditsRequest(
                student_id=student_id,
                tutor_id=tutor_id,
                booking_id=booking_id,
                credits_locked=credits_required,
                status='locked'
            ))
            return response.success
    except grpc.RpcError as e:
        print(f"Failed to lock credits in escrow: {e.details()} (Code: {e.code()})")
        return False
    
def refund_credits_from_escrow(booking_id):
    try:
        with grpc.insecure_channel('payment_service:50052') as channel:
            payment_stub = PaymentServiceStub(channel)
            response = payment_stub.RefundLockedCredits(RefundLockedCreditsRequest(
                booking_id=booking_id,
            ))
            return response.success
    except grpc.RpcError as e:
        print(f"Failed to refund credits from escrow: {e.details()} (Code: {e.code()})")
        return False