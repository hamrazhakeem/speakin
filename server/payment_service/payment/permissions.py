from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from .utils import decode_jwt
import logging

# Get logger for the payment app
logger = logging.getLogger('payment')

class IsOwner(BasePermission):
    def has_permission(self, request, view):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            logger.warning("Missing or invalid Authorization header format")
            raise PermissionDenied("Authorization token is missing or invalid")

        token = auth_header.split(' ')[1]
        payload = decode_jwt(token)

        if payload is None:
            logger.warning("Invalid JWT token provided")
            raise PermissionDenied("Invalid JWT token")

        user_id = payload.get('user_id')

        user_id_from_data = request.data.get('user_id')
        user_id_from_url = view.kwargs.get('user_id') 

        if user_id_from_data:
            if int(user_id_from_data) != user_id:
                logger.warning(f"Permission denied: token user_id {user_id} does not match request user_id {user_id_from_data}")
                raise PermissionDenied("You do not have permission to access this resource.")
        elif user_id_from_url:
            if int(user_id_from_url) != user_id:
                logger.warning(f"Permission denied: token user_id {user_id} does not match URL user_id {user_id_from_url}")
                raise PermissionDenied("You do not have permission to access this resource.")
        else:
            logger.warning("Permission denied: user_id not found in request data or URL")
            raise PermissionDenied("User ID is required.")

        logger.info(f"Permission granted for user {user_id}")
        return True