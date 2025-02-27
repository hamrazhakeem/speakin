from rest_framework.exceptions import PermissionDenied
from .models import Bookings, TutorAvailability
from rest_framework.permissions import BasePermission
from .models import Bookings
from django.db.models import Q 
from .utils import decode_jwt
import logging

# Get logger for the session app
logger = logging.getLogger('bookings')

class IsAdminOrOwnerPermission(BasePermission):
    def has_permission(self, request, view):
        from .views import BookingsDetail  # Lazy import

        # Skip checks for GET requests
        if request.method == 'GET':
            logger.debug("Skipping permission check for GET request")
            return True

        # Decode the token and extract user details
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            logger.warning("Missing or invalid Authorization header format")
            raise PermissionDenied("Authorization token is missing or invalid")

        token = auth_header.split(' ')[1]
        payload = decode_jwt(token)

        if not payload:
            logger.warning("Invalid JWT token provided")
            raise PermissionDenied("Invalid JWT token")

        user_id = payload.get('user_id')
        is_admin = payload.get('is_admin', False)

        if user_id is None:
            logger.error("User ID missing in JWT payload")
            raise PermissionDenied("User ID is missing in the JWT payload")

        logger.debug(f"User ID: {user_id}, Is Admin: {is_admin}")

        # If the user is an admin, allow access
        if is_admin:
            logger.info(f"Admin access granted for user {user_id}")
            return True

        # Fetch the object being accessed (either Booking or TutorAvailability)
        if isinstance(view, BookingsDetail):
            booking = Bookings.objects.get(id=view.kwargs.get('pk'))  # Assuming 'pk' is passed in the URL
            if booking.student_id == user_id:
                logger.info(f"Access granted to student {user_id} for booking {booking.id}")
                return True  # Allow student to update their own booking or tutor to update their booking
            else:
                logger.warning(f"Access denied: User {user_id} attempted to modify booking {booking.id}")
                raise PermissionDenied("You do not have permission to modify this booking.")

        availability_id = view.kwargs.get('pk')
        if not availability_id:
            logger.error("Availability ID missing in request")
            raise PermissionDenied("Availability ID is missing")

        try:
            availability = TutorAvailability.objects.get(id=availability_id)

            # Allow tutor if they own the availability
            if availability.tutor_id == user_id:
                logger.info(f"Access granted to tutor {user_id} for availability {availability_id}")
                return True

            # Check if the student has a confirmed booking for the given availability
            booking = Bookings.objects.filter(availability=availability, student_id=user_id).first()
            if booking:
                logger.info(f"Access granted to student {user_id} for booked availability {availability_id}")
                return True

        except TutorAvailability.DoesNotExist:
            logger.error(f"Availability {availability_id} not found")
            raise PermissionDenied("The specified availability does not exist")

        # If none of the conditions matched, deny access
        logger.warning(f"Access denied: User {user_id} attempted unauthorized access")
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
                logger.warning("Missing or invalid Authorization header format")
                raise PermissionDenied("Invalid or missing token.")
            
            token = auth_header.split(" ")[1]
            payload = decode_jwt(token)
            
            # Extract user ID and role from the decoded token
            user_id = payload.get("user_id")
            logger.debug(f"Validating room access for user {user_id}")
            
            room_name = request.data.get("room_name")
            if not room_name:
                logger.warning("Room name missing in request")
                raise PermissionDenied("Room name is required")
            
            BASE_VIDEO_CALL_URL = "https://speakin.daily.co/"

            booking = Bookings.objects.get(
                Q(student_id=user_id) | Q(availability__tutor_id=user_id),
                Q(video_call_link=room_name) | Q(video_call_link=BASE_VIDEO_CALL_URL + room_name),
                Q(booking_status='confirmed') | Q(booking_status='ongoing')
            )

            logger.info(f"Room access granted for user {user_id} to room {room_name}")
            return True 

        except Bookings.DoesNotExist:
            logger.warning(f"Invalid booking or unauthorized access attempt by user {user_id}")
            raise PermissionDenied("Invalid booking or unauthorized access")
        except Exception as e:
            logger.error(f"Error validating room access: {str(e)}")
            raise PermissionDenied(str(e))