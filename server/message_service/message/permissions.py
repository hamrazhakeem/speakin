from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from .utils import decode_jwt
import logging

# Get logger for the message app
logger = logging.getLogger("message")


class IsOwner(BasePermission):
    def has_permission(self, request, view):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            logger.warning("Authorization header missing or invalid format")
            raise PermissionDenied("Authorization token is missing or invalid")

        token = auth_header.split(" ")[1]
        payload = decode_jwt(token)

        if payload is None:
            logger.warning("Invalid JWT token provided")
            raise PermissionDenied("Invalid JWT token")

        token_user_id = payload.get("user_id")

        # Get all URL parameters that contain user IDs
        url_user_ids = [
            value
            for key, value in view.kwargs.items()
            if isinstance(value, int) and ("user_id" in key or "selected_id" in key)
        ]

        # Check if the token's user_id matches any of the URL user IDs
        if token_user_id not in url_user_ids:
            logger.warning(
                f"User {token_user_id} attempted to access resource for users {url_user_ids}"
            )
            raise PermissionDenied("You do not have permission to access this resource")

        logger.info(f"Access granted to user {token_user_id}")
        return True
