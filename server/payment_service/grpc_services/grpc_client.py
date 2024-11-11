import grpc
from .user_service_pb2 import AddPurchasedCreditsRequest
from .user_service_pb2_grpc import UserServiceStub

def notify_user_service(user_id, credits):
    try:
        with grpc.insecure_channel('user_service:50051') as channel:
            stub = UserServiceStub(channel)
            request = AddPurchasedCreditsRequest(user_id=user_id, credits=credits)
            response = stub.AddPurchasedCredits(request)
            return response.success
    except grpc.RpcError as e:
        print(f"gRPC error: {str(e)}")
        return False