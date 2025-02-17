from django.shortcuts import get_object_or_404
from rest_framework import generics
from .models import TutorAvailability, Bookings, Report
from .serializers import TutorAvailabilitySerializer, BookingsSerializer, ReportSerializer, ReportUpdateSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.db import transaction
from django.conf import settings
import requests
from protos.client import update_user_credits, lock_credits_in_escrow, refund_credits_from_escrow, release_credits_from_escrow
from .permissions import IsAdminOrOwnerPermission, ValidateRoomNamePermission
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from rest_framework.views import APIView
from django.db.models import Q 
from django.utils.timezone import now
from .tasks import send_cancellation_notification, send_booking_notification
from .utils import get_room_name
import os
from dotenv import load_dotenv

load_dotenv()

# Create your views here.

class TutorAvailabilityList(generics.ListCreateAPIView):
    queryset = TutorAvailability.objects.all()
    serializer_class = TutorAvailabilitySerializer

    # Override the default to handle the case if the tutor try to create duplicate slot with same time
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            # Check if the error is specifically about overlapping slots
            if "This time slot overlaps with an existing confirmed or ongoing booking." or "This time slot overlaps with an existing available slot." in str(e):
                # Return the error with a 409 status code for conflict
                return Response({"detail": str(e)}, status=status.HTTP_409_CONFLICT)
            else:
                # Return the error with the default 400 Bad Request status code
                return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Save the instance if valid
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class TutorAvailabilityDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TutorAvailability.objects.all()
    serializer_class = TutorAvailabilitySerializer 
    permission_classes = [IsAdminOrOwnerPermission]

    def patch(self, request, *args, **kwargs):
        session = self.get_object()
        booking = session.bookings.filter(booking_status='confirmed').first()

        if session.bookings.filter(booking_status='canceled_by_tutor').first():
            return Response({"error": "The session was already canceled by the tutor."}, status=status.HTTP_400_BAD_REQUEST)

        if not booking:
            return Response({"error": "No confirmed booking found to cancel."}, status=status.HTTP_400_BAD_REQUEST)

        new_status = request.data.get('booking_status')

        if new_status not in ['canceled_by_student', 'canceled_by_tutor']:
            return Response({"error": "Invalid booking status."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            success = refund_credits_from_escrow(booking_id=booking.id)
            if not success:
                return Response({"error": "Failed to refund credits from escrow."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Refund credits via Payment Service
            refund_success = update_user_credits(booking.student_id, session.credits_required, refund_from_escrow=True)
            if not refund_success:
                return Response({"error": "Failed to refund credits to user."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
            # Instead of direct RabbitMQ call, use Celery task
            send_cancellation_notification.delay(booking.id, new_status)

            if session.start_time and session.start_time - timezone.now() >= timedelta(hours=3) and new_status == 'canceled_by_student':
                session.is_booked = False
                session.save()

            booking.booking_status = new_status    
            booking.canceled_at = timezone.now()
            booking.refund_status = True
            booking.save()

            return Response({"message": "Session canceled and credits refunded successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def delete(self, request, *args, **kwargs):
        session = self.get_object()

        # Check if any related bookings have a 'confirmed' status
        confirmed_booking = session.bookings.filter(booking_status='confirmed').exists()
        if confirmed_booking:
            return Response(
                {"error": "Unable to delete the session as it has been booked by a student."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # If no confirmed booking exists, proceed with deletion
        return super().delete(request, *args, **kwargs)
    
class BookingsList(generics.ListCreateAPIView):
    queryset = Bookings.objects.all()
    serializer_class = BookingsSerializer

    @transaction.atomic
    def perform_create(self, serializer):
        booking = serializer.save()

        availability_id = booking.availability.id 
        booking_id = booking.id
        student_id = booking.student_id 
        tutor_id = booking.availability.tutor_id
        
        tutor_availability = get_object_or_404(TutorAvailability, id=availability_id)
        credits_required = tutor_availability.credits_required
        
        student_data = requests.get(
            f"{settings.USER_SERVICE_URL}users/{student_id}/"
        ).json()

        if student_data['balance_credits'] < credits_required:
            raise ValidationError({"error": "Insufficient credits"}, code=status.HTTP_400_BAD_REQUEST)

        if not update_user_credits(student_id, student_data['balance_credits'] - credits_required):
            raise ValidationError("Failed to update user balance")

        if not lock_credits_in_escrow( 
                student_id=student_id,
                tutor_id=tutor_availability.tutor_id,
                booking_id=booking_id,
                credits_required=credits_required):
            update_user_credits(student_id, student_data['balance_credits'])
            raise ValidationError("Failed to lock credits in escrow")
         
        # Generate a unique and secure room name
        room_name = get_room_name(booking_id, tutor_id, student_id)
        
        # Update the booking with the room name
        booking.video_call_link = room_name  # Now `video_call_link` acts as `room_name`
        booking.save()

        tutor_availability.is_booked = True
        tutor_availability.save()

        # Pass booking_id instead of booking object
        send_booking_notification.delay(booking.id, student_data)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class BookingsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Bookings.objects.all()
    serializer_class = BookingsSerializer
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        booking = self.get_object()
        current_time = now()
        start_time = booking.availability.start_time

        # Define the valid 5-minute window (5 minutes before and after start time)
        valid_time_window_start = start_time - timedelta(minutes=5)
        valid_time_window_end = start_time + timedelta(minutes=5)

        # Check if the current time is within the valid window for the student
        if 'student_joined_at' in request.data:
            if valid_time_window_start <= current_time <= valid_time_window_end:
                request.data['student_joined_within_5_min'] = True

        # Check if the current time is within the valid window for the tutor
        if 'tutor_joined_at' in request.data:
            if valid_time_window_start <= current_time <= valid_time_window_end:
                request.data['tutor_joined_within_5_min'] = True

        response = super().update(request, *args, **kwargs)
        booking.refresh_from_db()  # Reload the booking object to ensure it's up to date

        # After update, check conditions and perform actions
        if 'booking_status' in request.data and request.data['booking_status'] == 'completed':
            session_type = booking.availability.session_type
            if booking.student_joined_within_5_min and booking.tutor_joined_within_5_min:
                
                if release_credits_from_escrow(session_type, booking_id=booking.id):
                        booking.booking_status = 'completed'
                else: 
                    return Response({"error": "Failed to refund credits from escrow"},
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    
            elif booking.tutor_joined_within_5_min and not booking.student_joined_within_5_min:

                if release_credits_from_escrow(session_type, booking_id=booking.id):
                        booking.booking_status = 'no_show_by_student'
                else: 
                    return Response({"error": "Failed to refund credits from escrow"},
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    
            elif not booking.tutor_joined_within_5_min and booking.student_joined_within_5_min:

                # Refund credits from escrow and deduct balance
                if refund_credits_from_escrow(booking_id=booking.id):
                    if update_user_credits(
                            user_id=booking.student_id,
                            new_balance=booking.availability.credits_required + (booking.availability.credits_required * 10 // 100),
                            refund_from_escrow=True
                        ): 
                        booking.booking_status = 'no_show_by_tutor'
                        booking.refund_status = True
                    else:
                        return Response({"error": "Failed to deduct balance credits"},
                                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else: 
                    return Response({"error": "Failed to refund credits from escrow"},
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        booking.save()
        return response 

class DailyRoomCreateView(APIView):
    """
    API Endpoint to create Daily.co rooms dynamically.
    """
    permission_classes = [ValidateRoomNamePermission]

    def create_daily_room(self, name=None, properties=None):
        """
        Create or retrieve an existing room using Daily API.
        If room exists, return existing room details.        
        :param name: Optional room name
        :param properties: Additional room properties like `max_participants`
        :return: JSON response with room details
        """
        DAILY_API_URL = os.getenv('DAILY_API_ROOM_URL')

        headers = {
            "Authorization": f"Bearer {settings.DAILY_API_KEY}",
            "Content-Type": "application/json",
        }

        try:
            check_response = requests.get(
                f"{DAILY_API_URL}/{name}",
                headers=headers
            )

            if check_response.status_code == 200:
                # Room exists, return existing room details
                return check_response.json()

        except requests.exceptions.RequestException:
            # Room doesn't exist, proceed with creation
            pass

        data = {
            "name": name,  # Name is optional; Daily will auto-generate if not provided
            "properties": properties or {},
            "privacy": "private"
        }

        response = requests.post(DAILY_API_URL, json=data, headers=headers)

        print(response.json())
        if response.status_code == 200:
            return response.json()
        else:
            response.raise_for_status()

    def create_meeting_token(self, room_name):
        """
        Generate a secure meeting token for the specified room.
        """
        DAILY_API_URL = os.getenv('DAILY_API_MEETING_TOKEN_URL')
        headers = {
            "Authorization": f"Bearer {settings.DAILY_API_KEY}",
            "Content-Type": "application/json",
        }
        data = {
            "properties": {
                "room_name": room_name, 
                "is_owner": False,  # User permissions; adjust as needed
                "exp": int((timezone.now() + timezone.timedelta(hours=1.5)).timestamp()),  # Expiration time
            }
        }
        response = requests.post(DAILY_API_URL, json=data, headers=headers)
        response.raise_for_status()
        return response.json()

    def post(self, request):
        try:
            room_name = request.data.get("room_name") 
            BASE_VIDEO_CALL_URL = os.getenv('BASE_VIDEO_CALL_URL')
            booking = Bookings.objects.get(
                Q(video_call_link=room_name) | Q(video_call_link=BASE_VIDEO_CALL_URL + room_name),
            )

            # Customize room properties
            properties = {
                "exp": int(booking.availability.end_time.timestamp()),  # Expiration timestamp
                "max_participants": 2,
                "enable_prejoin_ui": True,
            }

            room = self.create_daily_room(name=room_name, properties=properties)

            token_response = self.create_meeting_token(room_name)
            token = token_response.get("token")

            booking.video_call_link = room.get('url')
            booking.save()
            return Response({
                "room": room, 
                "token": token,  # Include the token in the response
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class ReportList(generics.ListCreateAPIView):
    serializer_class = ReportSerializer

    def get_serializer_context(self):
        print('get_serializer_context')
        context = super().get_serializer_context()
        return context

    def get_queryset(self):
        print('get_queryset')
        booking_id = self.kwargs.get('pk')
        if booking_id:
            return Report.objects.filter(booking_id=booking_id)
        return Report.objects.all().select_related('booking', 'booking__availability')
    
class ReportDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportUpdateSerializer

class TutorCreditsHistoryView(generics.ListAPIView):
    serializer_class = BookingsSerializer

    def get_queryset(self):
        tutor_id = self.kwargs.get('tutor_id')
        return Bookings.objects.filter(
            availability__tutor_id=tutor_id,
            booking_status='completed'
        ).select_related('availability')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        credits_history = []

        for booking in queryset:
            credits_required = booking.availability.credits_required
            # Trial sessions get 25%, standard sessions get 80% of required credits
            earned_credits = (credits_required * 25) // 100 if booking.availability.session_type == 'trial' else (credits_required * 80) // 100

            credits_history.append({
                'id': booking.id,
                'session_type': booking.availability.session_type,
                'credits_earned': earned_credits,
                'created_at': booking.created_at,
            })

        return Response(credits_history)