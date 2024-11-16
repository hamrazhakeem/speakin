from django.shortcuts import get_object_or_404
from rest_framework import generics
from .models import TutorAvailability, Bookings
from .serializers import TutorAvailabilitySerializer, BookingsSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.db import transaction
from django.conf import settings
import requests
from grpc_services.grpc_client import deduct_balance_credits, lock_credits_in_escrow, refund_credits_from_escrow
from .permissoins import IsAdminOrOwnerPermission
from django.utils import timezone
from datetime import timedelta

# Create your views here.

class TutorAvailabilityList(generics.ListCreateAPIView):
    queryset = TutorAvailability.objects.all()
    serializer_class = TutorAvailabilitySerializer

    def get_queryset(self):
        queryset = TutorAvailability.objects.all()
        
        # Annotate each availability with a custom status
        current_time = timezone.now()
        
        for availability in queryset:
            # Calculate time difference to start time
            time_to_start = availability.start_time - current_time
            
            # Check if within 3 hours and not booked
            if (time_to_start <= timedelta(hours=3) and 
                time_to_start > timedelta(hours=0) and 
                not availability.is_booked and 
                not availability.bookings.exists()):
                availability.custom_status = 'expired_unbooked'
            else:
                availability.custom_status = 'normal'
        
        return queryset

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
            refund_success = deduct_balance_credits(booking.student_id, session.credits_required, refund_from_escrow=True)
            if not refund_success:
                return Response({"error": "Failed to refund credits to user."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
            if session.start_time and session.start_time - timezone.now() >= timedelta(hours=3) and new_status == 'canceled_by_student':
                session.is_booked = False
                session.save()

            booking.booking_status = new_status    
            booking.canceled_at = timezone.now()
            booking.refund_status = True
            booking.save()

            return Response({"message": "Session canceled and credits refunded."}, status=status.HTTP_204_NO_CONTENT)

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
        
        tutor_availability = get_object_or_404(TutorAvailability, id=availability_id)
        credits_required = tutor_availability.credits_required
        
        user_service_url = f"{settings.USER_SERVICE_URL}users/{student_id}/balance/"
        user_response = requests.get(user_service_url)
        if user_response.status_code != 200: 
            raise ValidationError("User not found")
        
        user_data = user_response.json()

        if user_data['balance_credits'] < credits_required:
            raise ValidationError({"error": "Insufficient credits"}, code=status.HTTP_400_BAD_REQUEST)

        if not deduct_balance_credits(student_id, user_data['balance_credits'] - credits_required):
            raise ValidationError("Failed to update user balance")

        if not lock_credits_in_escrow( 
                student_id=student_id,
                tutor_id=tutor_availability.tutor_id,
                booking_id=booking_id,
                credits_required=credits_required):
            deduct_balance_credits(student_id, user_data['balance_credits'])
            raise ValidationError("Failed to lock credits in escrow")
         
        tutor_availability.is_booked = True
        tutor_availability.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class BookingsDetail(generics.ListAPIView):
    queryset = Bookings.objects.all()
    serializer_class = BookingsSerializer
    lookup_field = 'student_id'

    def get_queryset(self):
        queryset = super().get_queryset()
        student_id = self.kwargs.get(self.lookup_field)
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        return queryset.select_related('availability')