import django
import grpc
from concurrent import futures

django.setup()

from users.models import User
import protos.generated.user_service_pb2_grpc as user_service_pb2_grpc
import protos.generated.user_service_pb2 as user_service_pb2

from django.db import connection

class UserService(user_service_pb2_grpc.UserServiceServicer):
    def UpdateUserCredits(self, request, context):
        with connection.cursor():
            try:
                user = User.objects.get(id=request.user_id)
                
                if request.refund_from_escrow:
                    user.balance_credits += request.credits
                elif request.is_deduction:
                    user.balance_credits = request.credits
                else:
                    user.balance_credits += request.credits

                user.save()
                return user_service_pb2.UpdateUserCreditsResponse(success=True)

            except User.DoesNotExist:
                context.set_details('User not found.')
                context.set_code(grpc.StatusCode.NOT_FOUND)
                return user_service_pb2.UpdateUserCreditsResponse(success=False)
            except Exception as e:
                context.set_details(f"An unexpected error occurred: {e}")
                context.set_code(grpc.StatusCode.INTERNAL)
                return user_service_pb2.UpdateUserCreditsResponse(success=False)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    user_service_pb2_grpc.add_UserServiceServicer_to_server(UserService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()