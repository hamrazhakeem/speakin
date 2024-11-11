from rest_framework import serializers
from .models import TutorAvailability, Bookings
from django.db.models import F

class TutorAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorAvailability
        fields = ['id', 'tutor_id', 'session_type', 'start_time', 'end_time', 'credits_required', 'status', 'created_at']

    def validate(self, data):
        start_time = data['start_time']
        end_time = data['end_time']
        tutor_id = data['tutor_id']

        # Check if there are any conflicting slots
        conflicting_slots = TutorAvailability.objects.filter(
            tutor_id=tutor_id,
            start_time__lt=end_time,
            end_time__gt=start_time,
            status__in=['available', 'booked']  # Only consider available or booked slots
        )

        # If there are conflicts, raise a validation error
        if conflicting_slots.exists():
            raise serializers.ValidationError("This time slot overlaps with an existing slot.")

        return data

class BookingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookings
        fields = ['id', 'availability', 'student_id', 'booking_status', 'canceled_at', 'refund_status', 'video_call_link', 'created_at']

    def validate(self, data):
        availability = data['availability']
        student_id = data['student_id'] 
        session_type = availability.session_type
        start_time = availability.start_time
        end_time = availability.end_time
        
        # Check if it's a trial session and if student already completed a trial with this tutor
        if session_type == 'trial':
            existing_trials = Bookings.objects.filter(
                availability__tutor_id=availability.tutor_id,
                student_id=student_id,
                availability__session_type='trial',
                booking_status='completed'
            )
            if existing_trials.exists():
                raise serializers.ValidationError("You have already completed a trial with this tutor.")

        # Check for time conflicts with other confirmed bookings
        overlapping_bookings = Bookings.objects.filter(
            student_id=student_id,
            booking_status='confirmed',
            availability__start_time__lt=end_time,
            availability__end_time__gt=start_time
        )
        if overlapping_bookings.exists():
            raise serializers.ValidationError("You already have a confirmed booking during this time period.")

        return data