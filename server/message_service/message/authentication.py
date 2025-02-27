import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from django.conf import settings
from django.core.exceptions import PermissionDenied
from asgiref.sync import sync_to_async
import os
from .utils import get_user_by_id
import logging

# Get logger for the message app
logger = logging.getLogger('message')

SECRET_KEY = os.getenv('SIGNING_KEY')

class JWTAuthentication:
    @sync_to_async
    def authenticate_websocket(self, token):
        """Authenticate the WebSocket connection using a JWT token."""
        try:
            # Decode the JWT using the SECRET_KEY from the user service
            logger.debug("Attempting to decode JWT token")
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
            
            if not user_id:
                logger.error("JWT token missing user_id in payload")
                raise PermissionDenied("Invalid token payload")

            logger.debug(f"JWT token decoded successfully for user {user_id}")
            user = get_user_by_id(user_id)

            return user  
        except ExpiredSignatureError:
            logger.warning("JWT token has expired")
            raise PermissionDenied("Token has expired")
        except InvalidTokenError:
            logger.error("Invalid JWT token provided")
            raise PermissionDenied("Invalid token")
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            raise PermissionDenied("Authentication failed")