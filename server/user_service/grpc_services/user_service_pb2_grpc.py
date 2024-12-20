# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc
import warnings

from grpc_services import user_service_pb2 as grpc__services_dot_user__service__pb2

GRPC_GENERATED_VERSION = '1.67.1'
GRPC_VERSION = grpc.__version__
_version_not_supported = False

try:
    from grpc._utilities import first_version_is_lower
    _version_not_supported = first_version_is_lower(GRPC_VERSION, GRPC_GENERATED_VERSION)
except ImportError:
    _version_not_supported = True

if _version_not_supported:
    raise RuntimeError(
        f'The grpc package installed is at version {GRPC_VERSION},'
        + f' but the generated code in grpc_services/user_service_pb2_grpc.py depends on'
        + f' grpcio>={GRPC_GENERATED_VERSION}.'
        + f' Please upgrade your grpc module to grpcio>={GRPC_GENERATED_VERSION}'
        + f' or downgrade your generated code using grpcio-tools<={GRPC_VERSION}.'
    )


class UserServiceStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.AddPurchasedCredits = channel.unary_unary(
                '/user_service.UserService/AddPurchasedCredits',
                request_serializer=grpc__services_dot_user__service__pb2.AddPurchasedCreditsRequest.SerializeToString,
                response_deserializer=grpc__services_dot_user__service__pb2.AddPurchasedCreditsResponse.FromString,
                _registered_method=True)
        self.DeductBalanceCredits = channel.unary_unary(
                '/user_service.UserService/DeductBalanceCredits',
                request_serializer=grpc__services_dot_user__service__pb2.DeductBalanceCreditsRequest.SerializeToString,
                response_deserializer=grpc__services_dot_user__service__pb2.DeductBalanceCreditsResponse.FromString,
                _registered_method=True)


class UserServiceServicer(object):
    """Missing associated documentation comment in .proto file."""

    def AddPurchasedCredits(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def DeductBalanceCredits(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_UserServiceServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'AddPurchasedCredits': grpc.unary_unary_rpc_method_handler(
                    servicer.AddPurchasedCredits,
                    request_deserializer=grpc__services_dot_user__service__pb2.AddPurchasedCreditsRequest.FromString,
                    response_serializer=grpc__services_dot_user__service__pb2.AddPurchasedCreditsResponse.SerializeToString,
            ),
            'DeductBalanceCredits': grpc.unary_unary_rpc_method_handler(
                    servicer.DeductBalanceCredits,
                    request_deserializer=grpc__services_dot_user__service__pb2.DeductBalanceCreditsRequest.FromString,
                    response_serializer=grpc__services_dot_user__service__pb2.DeductBalanceCreditsResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'user_service.UserService', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))
    server.add_registered_method_handlers('user_service.UserService', rpc_method_handlers)


 # This class is part of an EXPERIMENTAL API.
class UserService(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def AddPurchasedCredits(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(
            request,
            target,
            '/user_service.UserService/AddPurchasedCredits',
            grpc__services_dot_user__service__pb2.AddPurchasedCreditsRequest.SerializeToString,
            grpc__services_dot_user__service__pb2.AddPurchasedCreditsResponse.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)

    @staticmethod
    def DeductBalanceCredits(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(
            request,
            target,
            '/user_service.UserService/DeductBalanceCredits',
            grpc__services_dot_user__service__pb2.DeductBalanceCreditsRequest.SerializeToString,
            grpc__services_dot_user__service__pb2.DeductBalanceCreditsResponse.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)
