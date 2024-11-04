import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from rest_framework import permissions
from rest_framework.exceptions import AuthenticationFailed

import os

SECRET_KEY = os.getenv('SIGNING_KEY')

class IsAuthenticatedWithJWT(permissions.BasePermission):
    """
    Custom permission to only allow access to users with a valid JWT token.
    """

    def has_permission(self, request, view):
        token = request.headers.get('Authorization', '').split(' ')[-1]
        if not token:
            raise AuthenticationFailed('Authorization header missing.')

        try:
            jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            return True  
        except ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired.')
        except InvalidTokenError:
            raise AuthenticationFailed('Invalid token.')