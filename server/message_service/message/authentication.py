import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from django.conf import settings
from django.core.exceptions import PermissionDenied
from asgiref.sync import sync_to_async
import os
from .utils import get_user_by_id

SECRET_KEY = os.getenv('SIGNING_KEY')

class JWTAuthentication:
    @sync_to_async
    def authenticate_websocket(self, token):
        """Authenticate the WebSocket connection using a JWT token."""
        try:
            # Decode the JWT using the SECRET_KEY from the user service
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
            if not user_id:
                raise PermissionDenied("Invalid token payload")

            user = get_user_by_id(user_id)

            return user  
        except ExpiredSignatureError:
            raise PermissionDenied("Token has expired")
        except InvalidTokenError:
            raise PermissionDenied("Invalid token")