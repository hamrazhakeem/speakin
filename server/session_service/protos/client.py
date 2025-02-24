import grpc
import os
from .generated.user_service_pb2 import UpdateUserCreditsRequest
from .generated.user_service_pb2_grpc import UserServiceStub
from .generated.payment_service_pb2 import LockCreditsRequest, RefundLockedCreditsRequest, ReleaseLockedCreditsRequest
from .generated.payment_service_pb2_grpc import PaymentServiceStub

def update_user_credits(user_id, new_balance, refund_from_escrow=None):
    try:
        with grpc.insecure_channel(os.getenv('USER_SERVICE_GRPC_HOST') + ':50051') as channel:
            user_stub = UserServiceStub(channel)
            response = user_stub.UpdateUserCredits(UpdateUserCreditsRequest(
                user_id=user_id,
                credits=new_balance,
                is_deduction=not refund_from_escrow,  # If refunding, this is not a deduction
                refund_from_escrow=refund_from_escrow or False
            ))
            return response.success
    except grpc.RpcError as e:
        print(f"Failed to connect to user service: {e.details()}")
        return False
    
def lock_credits_in_escrow(student_id, tutor_id, booking_id, credits_required):
    try:
        with grpc.insecure_channel(os.getenv('PAYMENT_SERVICE_GRPC_HOST') + ':50052') as channel:
            payment_stub = PaymentServiceStub(channel)
            response = payment_stub.LockCredits(LockCreditsRequest(
                student_id=student_id,
                tutor_id=tutor_id,
                booking_id=booking_id,
                credits_locked=credits_required,
                status='locked'
            ))
            print('creditsssssss looocked')
            return response.success
    except grpc.RpcError as e:
        print(f"Failed to lock credits in escrow: {e.details()} (Code: {e.code()})")
        return False
    
def refund_credits_from_escrow(booking_id):
    try:
        with grpc.insecure_channel(os.getenv('PAYMENT_SERVICE_GRPC_HOST') + ':50052') as channel:
            payment_stub = PaymentServiceStub(channel)
            response = payment_stub.RefundLockedCredits(RefundLockedCreditsRequest(
                booking_id=booking_id,
            ))
            return response.success
    except grpc.RpcError as e:
        print(f"Failed to refund credits from escrow: {e.details()} (Code: {e.code()})")
        return False
    
def release_credits_from_escrow(session_type, booking_id):
    try:
        with grpc.insecure_channel(os.getenv('PAYMENT_SERVICE_GRPC_HOST') + ':50052') as channel:
            payment_stub = PaymentServiceStub(channel)
            response = payment_stub.ReleaseLockedCredits(ReleaseLockedCreditsRequest(
                session_type=session_type,
                booking_id=booking_id,
            ))
            print('releasign from escrowwwww')
            return response.success
    except grpc.RpcError as e:
        print(f"Failed to refund credits from escrow: {e.details()} (Code: {e.code()})")
        return False