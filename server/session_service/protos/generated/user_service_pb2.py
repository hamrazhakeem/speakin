# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: grpc_services/user_service.proto
# Protobuf Python Version: 5.27.2
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(
    _runtime_version.Domain.PUBLIC,
    5,
    27,
    2,
    '',
    'grpc_services/user_service.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n grpc_services/user_service.proto\x12\x0cuser_service\"n\n\x18UpdateUserCreditsRequest\x12\x0f\n\x07user_id\x18\x01 \x01(\x05\x12\x0f\n\x07\x63redits\x18\x02 \x01(\x05\x12\x14\n\x0cis_deduction\x18\x03 \x01(\x08\x12\x1a\n\x12refund_from_escrow\x18\x04 \x01(\x08\",\n\x19UpdateUserCreditsResponse\x12\x0f\n\x07success\x18\x01 \x01(\x08\x32s\n\x0bUserService\x12\x64\n\x11UpdateUserCredits\x12&.user_service.UpdateUserCreditsRequest\x1a\'.user_service.UpdateUserCreditsResponseb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'grpc_services.user_service_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  DESCRIPTOR._loaded_options = None
  _globals['_UPDATEUSERCREDITSREQUEST']._serialized_start=50
  _globals['_UPDATEUSERCREDITSREQUEST']._serialized_end=160
  _globals['_UPDATEUSERCREDITSRESPONSE']._serialized_start=162
  _globals['_UPDATEUSERCREDITSRESPONSE']._serialized_end=206
  _globals['_USERSERVICE']._serialized_start=208
  _globals['_USERSERVICE']._serialized_end=323
# @@protoc_insertion_point(module_scope)
