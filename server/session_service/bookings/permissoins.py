import base64
import json
from rest_framework.exceptions import PermissionDenied
from .models import Bookings, TutorAvailability
from rest_framework.permissions import BasePermission

class IsAdminOrOwnerPermission(BasePermission):
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
        from .views import BookingsDetail, TutorAvailabilityDetail  # Lazy import

        # Skip checks for GET requests
        if request.method == 'GET':
            return True

        # Decode the token and extract user details
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise PermissionDenied("Authorization token is missing or invalid")

        token = auth_header.split(' ')[1]
        payload = self.decode_jwt(token)

        if payload is None:
            raise PermissionDenied("Invalid JWT token")

        user_id = payload.get('user_id')
        is_admin = payload.get('is_admin', False)

        if user_id is None:
            raise PermissionDenied("User ID is missing in the JWT payload")

        # Log for debugging
        print(f"User ID: {user_id}, Is Admin: {is_admin}")

        # If the user is an admin, allow access
        if is_admin:
            return True

        # Fetch the object being accessed (either Booking or TutorAvailability)
        if isinstance(view, BookingsDetail):
            booking = Bookings.objects.get(id=view.kwargs.get('pk'))  # Assuming 'pk' is passed in the URL
            if booking.student_id == user_id:
                return True  # Allow student to update their own booking or tutor to update their booking
            else:
                raise PermissionDenied("You do not have permission to modify this booking.")

        elif isinstance(view, TutorAvailabilityDetail):
            availability = TutorAvailability.objects.get(id=view.kwargs.get('pk'))  # Assuming 'pk' is passed in the URL
            print(availability.tutor_id, user_id)
            if availability.tutor_id == user_id:
                return True  # Allow tutor to update their own availability
            else:
                raise PermissionDenied("You do not have permission to modify this availability.")

        # If none of the conditions matched, deny access
        raise PermissionDenied("You do not have permission to perform this operation.")