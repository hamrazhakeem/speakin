# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: grpc_services/payment_service.proto
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
    'grpc_services/payment_service.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n#grpc_services/payment_service.proto\"v\n\x12LockCreditsRequest\x12\x12\n\nstudent_id\x18\x01 \x01(\x05\x12\x10\n\x08tutor_id\x18\x02 \x01(\x05\x12\x12\n\nbooking_id\x18\x03 \x01(\x05\x12\x16\n\x0e\x63redits_locked\x18\x04 \x01(\x05\x12\x0e\n\x06status\x18\x05 \x01(\t\"&\n\x13LockCreditsResponse\x12\x0f\n\x07success\x18\x01 \x01(\x08\x32J\n\x0ePaymentService\x12\x38\n\x0bLockCredits\x12\x13.LockCreditsRequest\x1a\x14.LockCreditsResponseb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'grpc_services.payment_service_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  DESCRIPTOR._loaded_options = None
  _globals['_LOCKCREDITSREQUEST']._serialized_start=39
  _globals['_LOCKCREDITSREQUEST']._serialized_end=157
  _globals['_LOCKCREDITSRESPONSE']._serialized_start=159
  _globals['_LOCKCREDITSRESPONSE']._serialized_end=197
  _globals['_PAYMENTSERVICE']._serialized_start=199
  _globals['_PAYMENTSERVICE']._serialized_end=273
# @@protoc_insertion_point(module_scope)