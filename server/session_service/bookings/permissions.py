import base64
import json
from rest_framework.exceptions import PermissionDenied
from .models import Bookings, TutorAvailability
from rest_framework.permissions import BasePermission
from .models import Bookings
from rest_framework.exceptions import ValidationError

def decode_jwt(token):
    """Decodes the JWT and returns the payload."""
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None  # Invalid JWT format

        payload_base64 = parts[1]
        payload_json = base64.urlsafe_b64decode(payload_base64 + '==')
        payload = json.loads(payload_json)
        return payload
    except Exception:
        return None

class IsAdminOrOwnerPermission(BasePermission):
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
        payload = decode_jwt(token)

        if not payload:
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

        availability_id = view.kwargs.get('pk')  # Fetch the availability ID from the URL
        if not availability_id:
            raise PermissionDenied("Availability ID is missing")

        try:
            availability = TutorAvailability.objects.get(id=availability_id)

            # Allow tutor if they own the availability
            if availability.tutor_id == user_id:
                return True

            # Check if the student has a confirmed booking for the given availability
            booking = Bookings.objects.filter(availability=availability, student_id=user_id).first()
            if booking:
                return True

        except TutorAvailability.DoesNotExist:
            raise PermissionDenied("The specified availability does not exist")

        # If none of the conditions matched, deny access
        raise PermissionDenied("You do not have permission to perform this operation.")
    
class ValidateRoomNamePermission(BasePermission):
    """
    Custom permission to validate room name based on the user role (tutor or student).
    Ensures that:
    - If the user is a tutor, the room_name must contain the tutor ID matching the JWT token.
    - If the user is a student, the room_name must contain the student ID matching the JWT token.
    """
    
    def has_permission(self, request, view):
        try:
            # Extract JWT token from the Authorization header
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                raise PermissionDenied("Invalid or missing token.")
            
            token = auth_header.split(" ")[1]
            payload = decode_jwt(token)
            
            # Extract user ID and role from the decoded token
            user_id = payload.get("user_id")
            print(user_id)
            if not user_id:
                raise PermissionDenied("Invalid token payload.")
            
            # Get room_name from request
            room_name = request.data.get("room_name")
            if not room_name:
                raise ValidationError("Room name is required.")

            # Extract the original tutor_id and student_id from the room name hash
            try:
                # Assuming the original data used to generate the room name is still accessible
                # You could store these values and match them to check who is authorized for this room
                # Or, you could use a DB lookup to fetch the booking details.
                # room_name_hash = room_name.replace("room_", "")  # Strip 'room_' prefix
                # Use the room name hash to look up the corresponding booking record and get the tutor_id, student_id
                # e.g., fetch room details from DB, assuming room_name_hash links to a booking object
                booking = Bookings.objects.get(video_call_link=room_name)
                room_tutor_id = booking.availability.tutor_id
                room_student_id = booking.student_id
                booking_status = booking.booking_status  # e.g., 'confirmed', 'canceled_by_student', etc.
            except Bookings.DoesNotExist:
                raise PermissionDenied("Room name not found in database.")

            # If booking status is not confirmed, deny access
            if booking_status != 'confirmed':
                raise PermissionDenied("This room is no longer available. The booking status is not confirmed.")

            # Validate room_name based on user role
            if room_tutor_id != user_id and room_student_id != user_id:
                raise PermissionDenied("You are not authorized for this room.")

            # If all checks pass
            return True
        
        except Exception as e:
            raise PermissionDenied(str(e))