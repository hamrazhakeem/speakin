import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from django.conf import settings
from django.core.exceptions import PermissionDenied
from asgiref.sync import sync_to_async
import os
import requests
from .custom_user import CustomUser

SECRET_KEY = os.getenv('SIGNING_KEY')
USER_SERVICE_URL = os.getenv('USER_SERVICE_URL')

def get_user_by_id(user_id):
    try:
        # Construct the URL to get the user by ID
        url = f"{USER_SERVICE_URL}/users/{user_id}/"
        response = requests.get(url)
        
        # Check if the request was successful
        if response.status_code == 200:
            user_data = response.json()  # Return the user data as a dictionary
            return CustomUser(user_data)
        else:
            raise PermissionDenied("User not found in user service or invalid ID")
    except requests.exceptions.RequestException as e:
        raise PermissionDenied(f"Error occurred while fetching user: {str(e)}")

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