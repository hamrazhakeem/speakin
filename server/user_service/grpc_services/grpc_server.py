import django
import grpc
from concurrent import futures

django.setup()

from users.models import User
import user_service_pb2_grpc
import user_service_pb2

from django.db import connection

class UserService(user_service_pb2_grpc.UserServiceServicer):
    def AddPurchasedCredits(self, request, context):
        with connection.cursor():  # Ensure Django DB connection context
            user_id = request.user_id
            credits = request.credits

            try:
                user = User.objects.get(id=user_id)
                user.balance_credits += credits
                user.save()
                return user_service_pb2.AddPurchasedCreditsResponse(success=True)
            except User.DoesNotExist:
                context.set_details('User not found.')
                context.set_code(grpc.StatusCode.NOT_FOUND)
                return user_service_pb2.AddPurchasedCreditsResponse(success=False)
            
    def DeductBalanceCredits(self, request, context):
        with connection.cursor():
            user_id = request.user_id
            new_balance_credits = request.new_balance_credits
            refund_from_escrow = request.refund_from_escrow
            print('Initial debug - refund_from_escrow:', refund_from_escrow)  # Confirm the initial value

            try:
                user = User.objects.get(id=user_id)
                print('User fetched - balance:', user.balance_credits)  # Confirm the user was fetched

                if refund_from_escrow:
                    print('Inside escrow condition')  # Check if we enter this block
                    print('Balance before addition:', user.balance_credits)
                    user.balance_credits += new_balance_credits
                    user.save()
                    return user_service_pb2.DeductBalanceCreditsResponse(success=True)

                print('Outside escrow condition')  # This will print if `refund_from_escrow` is False
                user.balance_credits = new_balance_credits
                user.save()
                return user_service_pb2.DeductBalanceCreditsResponse(success=True)

            except User.DoesNotExist:
                context.set_details('User not found.')
                context.set_code(grpc.StatusCode.NOT_FOUND)
                return user_service_pb2.DeductBalanceCreditsResponse(success=False)

            except Exception as e:
                context.set_details(f"An unexpected error occurred: {e}")
                context.set_code(grpc.StatusCode.INTERNAL)
                return user_service_pb2.DeductBalanceCreditsResponse(success=False)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    user_service_pb2_grpc.add_UserServiceServicer_to_server(UserService(), server)
    server.add_insecure_port('[::]:50051')  # You can change the port if needed
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()