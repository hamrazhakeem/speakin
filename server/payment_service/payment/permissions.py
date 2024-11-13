from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
import base64
import json

class IsOwner(BasePermission):
    def decode_jwt(self, token):
        """Decodes the JWT and returns the payload."""
        parts = token.split('.')
        if len(parts) != 3:
            return None  # Invalid JWT format

        payload_base64 = parts[1]
        payload_json = base64.urlsafe_b64decode(payload_base64 + '==')
        payload = json.loads(payload_json)
        return payload

    def has_permission(self, request, view):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise PermissionDenied("Authorization token is missing or invalid")

        token = auth_header.split(' ')[1]
        payload = self.decode_jwt(token)

        if payload is None:
            raise PermissionDenied("Invalid JWT token")

        user_id = payload.get('user_id')
        # Compare user_id in JWT with the user_id in the request data
        if int(request.data.get('user_id')) != user_id:
            raise PermissionDenied("You do not have permission to access this resource.")

        return True