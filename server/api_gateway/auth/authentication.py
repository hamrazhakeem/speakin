import jwt
import logging
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import os

# Get the logger for the auth module
logger = logging.getLogger("api_gateway")

SECRET_KEY = os.getenv("SIGNING_KEY")


class JWTAuthentication(BaseAuthentication):
    """
    Custom Authentication for validating JWT tokens in the API Gateway.
    """

    def authenticate(self, request):
        # Check for Authorization header
        auth_header = request.headers.get("Authorization", "")

        if not auth_header or not auth_header.startswith("Bearer "):
            logger.warning(
                f"Authentication failed: Token missing in request from {request.META.get('REMOTE_ADDR')}"
            )
            raise AuthenticationFailed("Token missing.")

        # Extract the token from the header
        token = auth_header.split("Bearer ")[-1].strip()

        try:
            # Decode the token
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            # Log successful authentication
            user_id = payload.get("user_id", "unknown")
            logger.info(f"User {user_id} authenticated successfully")

            # Pass the payload and token downstream (if required)
            return (payload, token)

        except jwt.ExpiredSignatureError:
            logger.warning(
                f"Authentication failed: Token expired for request from {request.META.get('REMOTE_ADDR')}"
            )
            return None, {"error": "Token has expired.", "status_code": 401}

        except jwt.InvalidTokenError:
            logger.warning(
                f"Authentication failed: Invalid token from {request.META.get('REMOTE_ADDR')}"
            )
            return None, {"error": "Invalid token.", "status_code": 401}
