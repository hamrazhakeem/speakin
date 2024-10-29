from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from django.conf import settings
import jwt

class IsAdminOrUserSelf(BasePermission):
    """
    Custom permission to allow access only if the user is an admin 
    or the user ID in the JWT token matches the user ID in the URL.
    """

    def has_permission(self, request, view):
        # Extract user ID from URL, assumed to be passed as `id`
        user_id_in_url = view.kwargs.get('pk')  # Assumes URL pattern includes `<int:id>`

        # Get JWT token from the request header
        token = request.headers.get('Authorization')
        if not token:
            return False

        # Remove "Bearer" prefix if it exists
        if token.startswith("Bearer "):
            token = token.split(" ")[1]

        try:
            # Decode the JWT token
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id_in_token = decoded_token.get('user_id')
            is_admin = decoded_token.get('is_admin', False)

            # Allow if user is admin or if user_id in token matches user_id in URL
            if is_admin or str(user_id_in_token) == str(user_id_in_url):
                return True
            else:
                raise PermissionDenied("You do not have permission to access this resource.")

        except jwt.ExpiredSignatureError:
            raise PermissionDenied("Token has expired.")
        except jwt.InvalidTokenError:
            raise PermissionDenied("Invalid token.")

        return False
