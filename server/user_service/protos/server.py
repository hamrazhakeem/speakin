import django
import grpc
from concurrent import futures
import logging

# Get logger for the user app
logger = logging.getLogger('users')

django.setup()

from users.models import User
import protos.generated.user_service_pb2_grpc as user_service_pb2_grpc
import protos.generated.user_service_pb2 as user_service_pb2

from django.db import connection

class UserService(user_service_pb2_grpc.UserServiceServicer):
    def UpdateUserCredits(self, request, context):
        with connection.cursor():
            try:
                logger.info(f"Updating credits for user {request.user_id}")
                user = User.objects.get(id=request.user_id)
                logger.debug(f"Current balance: {user.balance_credits}")

                if request.refund_from_escrow:
                    logger.info(f"Processing refund from escrow: {request.credits} credits")
                    user.balance_credits += request.credits
                elif request.is_deduction:
                    logger.info(f"Processing credit deduction: setting balance to {request.credits}")
                    user.balance_credits = request.credits
                else:
                    logger.info(f"Adding {request.credits} credits to balance")
                    user.balance_credits += request.credits

                user.save()
                logger.info(f"Updated balance for user {request.user_id}: {user.balance_credits}")
                return user_service_pb2.UpdateUserCreditsResponse(success=True)

            except User.DoesNotExist:
                logger.warning(f"User not found: {request.user_id}")
                context.set_details('User not found.')
                context.set_code(grpc.StatusCode.NOT_FOUND)
                return user_service_pb2.UpdateUserCreditsResponse(success=False)
            except Exception as e:
                logger.error(f"Error updating credits for user {request.user_id}: {str(e)}")
                context.set_details(f"An unexpected error occurred: {e}")
                context.set_code(grpc.StatusCode.INTERNAL)
                return user_service_pb2.UpdateUserCreditsResponse(success=False)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    user_service_pb2_grpc.add_UserServiceServicer_to_server(UserService(), server)
    server.add_insecure_port('[::]:50051')
    logger.info("User service gRPC server starting on port 50051")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()