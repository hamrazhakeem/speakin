# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: payment_service.proto
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
    'payment_service.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x15payment_service.proto\"v\n\x12LockCreditsRequest\x12\x12\n\nstudent_id\x18\x01 \x01(\x05\x12\x10\n\x08tutor_id\x18\x02 \x01(\x05\x12\x12\n\nbooking_id\x18\x03 \x01(\x05\x12\x16\n\x0e\x63redits_locked\x18\x04 \x01(\x05\x12\x0e\n\x06status\x18\x05 \x01(\t\"&\n\x13LockCreditsResponse\x12\x0f\n\x07success\x18\x01 \x01(\x08\"0\n\x1aRefundLockedCreditsRequest\x12\x12\n\nbooking_id\x18\x02 \x01(\x05\".\n\x1bRefundLockedCreditsResponse\x12\x0f\n\x07success\x18\x01 \x01(\x08\"G\n\x1bReleaseLockedCreditsRequest\x12\x14\n\x0csession_type\x18\x01 \x01(\t\x12\x12\n\nbooking_id\x18\x02 \x01(\x05\"/\n\x1cReleaseLockedCreditsResponse\x12\x0f\n\x07success\x18\x01 \x01(\x08\x32\xf1\x01\n\x0ePaymentService\x12\x38\n\x0bLockCredits\x12\x13.LockCreditsRequest\x1a\x14.LockCreditsResponse\x12P\n\x13RefundLockedCredits\x12\x1b.RefundLockedCreditsRequest\x1a\x1c.RefundLockedCreditsResponse\x12S\n\x14ReleaseLockedCredits\x12\x1c.ReleaseLockedCreditsRequest\x1a\x1d.ReleaseLockedCreditsResponseb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'payment_service_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  DESCRIPTOR._loaded_options = None
  _globals['_LOCKCREDITSREQUEST']._serialized_start=25
  _globals['_LOCKCREDITSREQUEST']._serialized_end=143
  _globals['_LOCKCREDITSRESPONSE']._serialized_start=145
  _globals['_LOCKCREDITSRESPONSE']._serialized_end=183
  _globals['_REFUNDLOCKEDCREDITSREQUEST']._serialized_start=185
  _globals['_REFUNDLOCKEDCREDITSREQUEST']._serialized_end=233
  _globals['_REFUNDLOCKEDCREDITSRESPONSE']._serialized_start=235
  _globals['_REFUNDLOCKEDCREDITSRESPONSE']._serialized_end=281
  _globals['_RELEASELOCKEDCREDITSREQUEST']._serialized_start=283
  _globals['_RELEASELOCKEDCREDITSREQUEST']._serialized_end=354
  _globals['_RELEASELOCKEDCREDITSRESPONSE']._serialized_start=356
  _globals['_RELEASELOCKEDCREDITSRESPONSE']._serialized_end=403
  _globals['_PAYMENTSERVICE']._serialized_start=406
  _globals['_PAYMENTSERVICE']._serialized_end=647
# @@protoc_insertion_point(module_scope)