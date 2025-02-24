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
                print('going to update')
                user = User.objects.get(id=request.user_id)
                print('user')
                print('user', user.balance_credits)
                if request.refund_from_escrow:
                    print('this works')
                    user.balance_credits += request.credits
                elif request.is_deduction:
                    print('maybe this works')
                    user.balance_credits = request.credits
                else:
                    print('maybe thissss')
                    user.balance_credits += request.credits

                user.save()
                print('user', user.balance_credits)
                return user_service_pb2.UpdateUserCreditsResponse(success=True)

            except User.DoesNotExist:
                print('user not found')
                context.set_details('User not found.')
                context.set_code(grpc.StatusCode.NOT_FOUND)
                return user_service_pb2.UpdateUserCreditsResponse(success=False)
            except Exception as e:
                print('errorr in updating credits', e)
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