import django
import grpc
from concurrent import futures

django.setup()

from payment.models import Escrow
import payment_service_pb2_grpc
import payment_service_pb2

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

                return payment_service_pb2.LockCreditsResponse(success=True)
            
            except Exception as e:
                context.set_details(f"Error locking credits: {e}")
                context.set_code(grpc.StatusCode.INTERNAL)
                return payment_service_pb2.LockCreditsResponse(success=False)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    payment_service_pb2_grpc.add_PaymentServiceServicer_to_server(PaymentService(), server)
    server.add_insecure_port('[::]:50052')  # You can change the port if needed
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()