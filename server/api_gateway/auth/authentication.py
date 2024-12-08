import jwt
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import os

SECRET_KEY = os.getenv('SIGNING_KEY')

class JWTAuthentication(BaseAuthentication):
    """
    Custom Authentication for validating JWT tokens in the API Gateway.
    """
    def authenticate(self, request):
        # Check for Authorization header
        auth_header = request.headers.get('Authorization', '')

        if not auth_header or not auth_header.startswith('Bearer '):
            # If no token is present, return None. Let views handle unprotected routes.
            raise AuthenticationFailed('Token missing.')

        # Extract the token from the header
        token = auth_header.split('Bearer ')[-1].strip()

        try:
            # Decode the token
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])

            # Pass the payload and token downstream (if required)
            return (payload, token)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired.')

        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token.')
