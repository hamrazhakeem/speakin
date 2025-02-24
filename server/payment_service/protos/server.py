from django.utils import timezone
import django
import grpc
from concurrent import futures

django.setup()

from payment.models import Escrow
import protos.generated.payment_service_pb2_grpc as payment_service_pb2_grpc
import protos.generated.payment_service_pb2 as payment_service_pb2
from protos.client import update_user_credits

from django.db import connection

class PaymentService(payment_service_pb2_grpc.PaymentServiceServicer):
    def LockCredits(self, request, context):
        with connection.cursor():
            try:
                escrow_transaction = Escrow.objects.create(
                    student_id=request.student_id,
                    tutor_id=request.tutor_id,
                    booking_id=request.booking_id,
                    credits_locked=request.credits_locked,
                    status=request.status  # 'locked'
                )
                escrow_transaction.save()
                print("In excrow credits locked", escrow_transaction.status)
                return payment_service_pb2.LockCreditsResponse(success=True)
            
            except Exception as e:
                print('error', e)
                context.set_details(f"Error locking credits: {e}")
                context.set_code(grpc.StatusCode.INTERNAL)
                return payment_service_pb2.LockCreditsResponse(success=False)
            
    def RefundLockedCredits(self, request, context):
        with connection.cursor():
            try:
                escrow_transaction = Escrow.objects.get(
                    booking_id=request.booking_id,
                    status='locked'
                )

                escrow_transaction.status = 'refunded'
                escrow_transaction.released_at = timezone.now()
                escrow_transaction.save()
                
                return payment_service_pb2.RefundLockedCreditsResponse(success=True)
            except Escrow.DoesNotExist:
                print('does not exist')
                context.set_details("Escrow transaction not found")
                context.set_code(grpc.StatusCode.NOT_FOUND)
                return payment_service_pb2.RefundLockedCreditsResponse(success=False)
            except Exception as e:
                print('exception iiiiiiiin payment', e)
                context.set_details(f"Error processing refund: {e}")
                context.set_code(grpc.StatusCode.INTERNAL)
                return payment_service_pb2.RefundLockedCreditsResponse(success=False)
            
    def ReleaseLockedCredits(self, request, context):
        with connection.cursor():
            try:
                # Update the escrow transaction status to 'refunded'
                escrow_transaction = Escrow.objects.get(
                    booking_id=request.booking_id,
                    status__in=['locked', 'released']  # Only fetch if status is 'locked' or 'released'
                )
                print('found escrow_transaction', escrow_transaction)
                # Check if the status is already 'released'
                if escrow_transaction.status == 'released':
                    print('already released')
                    # Status is already 'released', return a success response
                    return payment_service_pb2.ReleaseLockedCreditsResponse(success=True)

                session_type=request.session_type
                escrow_transaction.status = 'released'
                escrow_transaction.released_at = timezone.now()
                escrow_transaction.save()
                print('escrow_transaction', escrow_transaction.status)
                user_id = escrow_transaction.tutor_id
                credits_locked = escrow_transaction.credits_locked
                print(user_id)
                if session_type == "standard":
                    # For standard sessions, calculate the tutor's share (80%) and platform fee (20%)
                    credits = (credits_locked * 80) // 100
                    print('updating creditssss', credits, user_id)
                    update_user_credits(user_id, credits) 
                    
                elif session_type == "trial":
                    print('updating in trial', credits, user_id)

                    # For trial sessions, release full credits to the tutor without applying platform fees
                    update_user_credits(user_id, credits_locked)

                return payment_service_pb2.RefundLockedCreditsResponse(success=True)
            
            except Escrow.DoesNotExist:
                print('escrow not found')
                context.set_details("Escrow transaction not found")
                context.set_code(grpc.StatusCode.NOT_FOUND)
                return payment_service_pb2.RefundLockedCreditsResponse(success=False)
            except Exception as e:
                print('eerrror in realsing credits', e)
                context.set_details(f"Error processing release: {e}")
                context.set_code(grpc.StatusCode.INTERNAL)
                return payment_service_pb2.RefundLockedCreditsResponse(success=False)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    payment_service_pb2_grpc.add_PaymentServiceServicer_to_server(PaymentService(), server)
    server.add_insecure_port('[::]:50052')  # You can change the port if needed
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()