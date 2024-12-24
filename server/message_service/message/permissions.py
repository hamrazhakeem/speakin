from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from .utils import decode_jwt

class IsOwner(BasePermission):
    def has_permission(self, request, view):
        auth_header = request.headers.get('Authorization')
        print('auth_header',auth_header)
        if not auth_header or not auth_header.startswith('Bearer '):
            raise PermissionDenied("Authorization token is missing or invalid")

        token = auth_header.split(' ')[1]
        payload = self.decode_jwt(token)

        if payload is None:
            raise PermissionDenied("Invalid JWT token")

        token_user_id = payload.get('user_id')
        
        # Get all URL parameters that contain user IDs
        url_user_ids = [
            value for key, value in view.kwargs.items() 
            if isinstance(value, int) and ('user_id' in key or 'selected_id' in key)
        ]

        # Check if the token's user_id matches any of the URL user IDs
        if token_user_id not in url_user_ids:
            raise PermissionDenied("You do not have permission to access this resource")

        return True