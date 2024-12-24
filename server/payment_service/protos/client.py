import grpc
from .generated.user_service_pb2 import UpdateUserCreditsRequest
from .generated.user_service_pb2_grpc import UserServiceStub

def update_user_credits(user_id, credits , is_deduction=False, refund_from_escrow=False):
    try:
        with grpc.insecure_channel('user_service:50051') as channel:
            print('notifying service in payment service client')
            stub = UserServiceStub(channel)
            request = UpdateUserCreditsRequest(
                user_id=user_id, 
                credits=credits,
                is_deduction=is_deduction,
                refund_from_escrow=refund_from_escrow
            )
            response = stub.UpdateUserCredits(request)
            return response.success
    except grpc.RpcError as e:
        print(f"gRPC error: {str(e)}")
        return False