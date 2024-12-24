from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from .utils import decode_jwt

class IsOwner(BasePermission):
    def has_permission(self, request, view):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            raise PermissionDenied("Authorization token is missing or invalid")

        token = auth_header.split(' ')[1]
        payload = decode_jwt(token)

        if payload is None:
            raise PermissionDenied("Invalid JWT token")

        user_id = payload.get('user_id')

        user_id_from_data = request.data.get('user_id')
        user_id_from_url = view.kwargs.get('user_id') 

        if user_id_from_data:
            if int(user_id_from_data) != user_id:
                raise PermissionDenied("You do not have permission to access this resource.")
        elif user_id_from_url:
            if int(user_id_from_url) != user_id:
                raise PermissionDenied("You do not have permission to access this resource.")
        else:
            raise PermissionDenied("User ID is required.")

        return True