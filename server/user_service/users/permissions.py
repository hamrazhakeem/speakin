from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from django.conf import settings
import jwt
import logging

# Get logger for the user app
logger = logging.getLogger("users")

User = get_user_model()  # Get the User model


class IsAdminOrUserSelf(BasePermission):
    """
    Custom permission to allow access only if the user is an admin
    or the user ID in the JWT token matches the user ID in the URL.
    """

    def has_permission(self, request, view):
        logger.debug("Checking user permissions")
        if request.method == "GET":
            return True
        # Extract user ID from URL, assumed to be passed as `id`
        user_id_in_url = view.kwargs.get(
            "pk"
        )  # Assumes URL pattern includes `<int:id>`
        # Get JWT token from the request header
        token = request.headers.get("Authorization")
        if not token:
            logger.warning("No Authorization token provided")
            return False

        # Remove "Bearer" prefix if it exists
        if token.startswith("Bearer "):
            token = token.split(" ")[1]

        try:
            # Decode the JWT token
            logger.debug("Attempting to decode JWT token")
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id_in_token = decoded_token.get("user_id")

            user = User.objects.filter(id=user_id_in_token).first()
            if not user:
                logger.warning(f"User not found for ID: {user_id_in_token}")
                return False

            # Check if the user is admin
            is_admin = user.is_superuser

            # Allow if user is admin or if user_id in token matches user_id in URL
            return is_admin or user_id_in_url == user_id_in_token

        except jwt.ExpiredSignatureError:
            logger.error("Token has expired")
            raise PermissionDenied("Token has expired.")
        except jwt.InvalidTokenError:
            logger.error("Invalid token provided")
            raise PermissionDenied("Invalid token.")
