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
from grpc_services.grpc_client import deduct_balance_credits, lock_credits_in_escrow
from .permissoins import IsAdminOrOwnerPermission

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
            if "This time slot overlaps with an existing slot." in str(e):
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
         
        tutor_availability.status = 'booked'
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