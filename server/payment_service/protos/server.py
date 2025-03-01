from django.utils import timezone
import django
import grpc
from concurrent import futures
import logging

# Get logger for the payment app
logger = logging.getLogger("payment")

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
                logger.info(
                    f"Locking credits for booking {request.booking_id}: student {request.student_id}, tutor {request.tutor_id}"
                )
                escrow_transaction = Escrow.objects.create(
                    student_id=request.student_id,
                    tutor_id=request.tutor_id,
                    booking_id=request.booking_id,
                    credits_locked=request.credits_locked,
                    status=request.status,  # 'locked'
                )
                escrow_transaction.save()
                logger.info(f"Credits locked successfully: {escrow_transaction.status}")
                return payment_service_pb2.LockCreditsResponse(success=True)

            except Exception as e:
                logger.error(f"Error locking credits: {str(e)}")
                context.set_details(f"Error locking credits: {e}")
                context.set_code(grpc.StatusCode.INTERNAL)
                return payment_service_pb2.LockCreditsResponse(success=False)

    def RefundLockedCredits(self, request, context):
        with connection.cursor():
            try:
                logger.info(f"Processing refund for booking {request.booking_id}")
                escrow_transaction = Escrow.objects.get(
                    booking_id=request.booking_id, status="locked"
                )

                escrow_transaction.status = "refunded"
                escrow_transaction.released_at = timezone.now()
                escrow_transaction.save()

                logger.info(
                    f"Credits refunded successfully for booking {request.booking_id}"
                )
                return payment_service_pb2.RefundLockedCreditsResponse(success=True)
            except Escrow.DoesNotExist:
                logger.warning(
                    f"Escrow transaction not found for booking {request.booking_id}"
                )
                context.set_details("Escrow transaction not found")
                context.set_code(grpc.StatusCode.NOT_FOUND)
                return payment_service_pb2.RefundLockedCreditsResponse(success=False)
            except Exception as e:
                logger.error(
                    f"Error processing refund for booking {request.booking_id}: {str(e)}"
                )
                context.set_details(f"Error processing refund: {e}")
                context.set_code(grpc.StatusCode.INTERNAL)
                return payment_service_pb2.RefundLockedCreditsResponse(success=False)

    def ReleaseLockedCredits(self, request, context):
        with connection.cursor():
            try:
                logger.info(
                    f"Processing credit release for booking {request.booking_id}"
                )
                escrow_transaction = Escrow.objects.get(
                    booking_id=request.booking_id,
                    status__in=[
                        "locked",
                        "released",
                    ],  # Only fetch if status is 'locked' or 'released'
                )

                if escrow_transaction.status == "released":
                    logger.info(
                        f"Credits already released for booking {request.booking_id}"
                    )
                    return payment_service_pb2.ReleaseLockedCreditsResponse(
                        success=True
                    )

                session_type = request.session_type
                escrow_transaction.status = "released"
                escrow_transaction.released_at = timezone.now()
                escrow_transaction.save()

                user_id = escrow_transaction.tutor_id
                credits_locked = escrow_transaction.credits_locked

                if session_type == "standard":
                    credits = (credits_locked * 80) // 100
                    logger.info(
                        f"Releasing standard session credits ({credits}) to tutor {user_id}"
                    )
                    update_user_credits(user_id, credits)

                elif session_type == "trial":
                    logger.info(
                        f"Releasing trial session credits ({credits_locked}) to tutor {user_id}"
                    )
                    update_user_credits(user_id, credits_locked)

                logger.info(
                    f"Credits released successfully for booking {request.booking_id}"
                )
                return payment_service_pb2.RefundLockedCreditsResponse(success=True)

            except Escrow.DoesNotExist:
                logger.warning(
                    f"Escrow transaction not found for booking {request.booking_id}"
                )
                context.set_details("Escrow transaction not found")
                context.set_code(grpc.StatusCode.NOT_FOUND)
                return payment_service_pb2.RefundLockedCreditsResponse(success=False)
            except Exception as e:
                logger.error(
                    f"Error releasing credits for booking {request.booking_id}: {str(e)}"
                )
                context.set_details(f"Error processing release: {e}")
                context.set_code(grpc.StatusCode.INTERNAL)
                return payment_service_pb2.RefundLockedCreditsResponse(success=False)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    payment_service_pb2_grpc.add_PaymentServiceServicer_to_server(
        PaymentService(), server
    )
    server.add_insecure_port("[::]:50052")
    logger.info("Payment gRPC server starting on port 50052")
    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
