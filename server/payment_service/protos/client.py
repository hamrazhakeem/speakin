import grpc
from .generated.user_service_pb2 import UpdateUserCreditsRequest
from .generated.user_service_pb2_grpc import UserServiceStub
import os
import logging

# Get logger for the payment app
logger = logging.getLogger("payment")


def update_user_credits(user_id, credits, is_deduction=False, refund_from_escrow=False):
    try:
        with grpc.insecure_channel(
            os.getenv("USER_SERVICE_GRPC_HOST") + ":50051"
        ) as channel:
            logger.info(f"Initiating gRPC call to update credits for user {user_id}")
            stub = UserServiceStub(channel)

            request = UpdateUserCreditsRequest(
                user_id=user_id,
                credits=credits,
                is_deduction=is_deduction,
                refund_from_escrow=refund_from_escrow,
            )
            response = stub.UpdateUserCredits(request)
            if response.success:
                logger.info(f"Successfully updated credits for user {user_id}")
            return response.success
    except grpc.RpcError as e:
        logger.error(f"gRPC error: {str(e)}")
        return False
