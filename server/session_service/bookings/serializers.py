from rest_framework import serializers
from .models import TutorAvailability, Bookings

class BookingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookings
        fields = ['id', 'availability', 'student_id', 'booking_status', 'canceled_at', 'refund_status', 'video_call_link', 'created_at', 'student_joined_within_5_min', 'tutor_joined_within_5_min', 'student_joined_at', 'tutor_joined_at']

    def validate(self, data):
        if 'availability' in data:
            availability = data['availability']
            student_id = data['student_id'] 
            session_type = availability.session_type
            start_time = availability.start_time
            end_time = availability.end_time
            tutor_id = availability.tutor_id
            
            # Check if it's a trial session and if student already completed a trial with this tutor
            if session_type == 'trial':
                existing_trials = Bookings.objects.filter(
                    availability__tutor_id=tutor_id,
                    student_id=student_id,
                    availability__session_type='trial',
                    booking_status='completed'
                )
                if existing_trials.exists():
                    raise serializers.ValidationError("You have already completed a trial with this tutor.")

            if session_type == 'standard':
                completed_trials = Bookings.objects.filter(
                    availability__tutor_id=tutor_id,
                    student_id=student_id,
                    availability__session_type='trial',
                    booking_status='completed'
                )
                if not completed_trials.exists():
                    raise serializers.ValidationError(
                        "You must complete a trial session with this tutor before booking a standard session."
                    )

            # Check for time conflicts with other confirmed bookings
            overlapping_bookings = Bookings.objects.filter(
                student_id=student_id,
                booking_status__in=['confirmed', 'ongoing'],
                availability__start_time__lt=end_time,
                availability__end_time__gt=start_time
            )
            if overlapping_bookings.exists():
                raise serializers.ValidationError("You already have a confirmed booking during this time period.")

        return data

class TutorAvailabilitySerializer(serializers.ModelSerializer):
    bookings = BookingsSerializer(many=True, read_only=True)

    class Meta:
        model = TutorAvailability
        fields = ['id', 'tutor_id', 'session_type', 'language_to_teach', 'start_time', 'end_time', 'credits_required', 'is_booked', 'created_at', 'bookings']

    def validate(self, data):
        start_time = data['start_time']
        end_time = data['end_time']
        tutor_id = data['tutor_id']

        conflicting_slots = TutorAvailability.objects.filter(
            tutor_id=tutor_id,
            start_time__lt=end_time,
            end_time__gt=start_time
        )

        # Filter out slots that are already booked and check if any are confirmed or ongoing
        conflicting_bookings = Bookings.objects.filter(
            availability__in=conflicting_slots,
            booking_status__in=['confirmed', 'ongoing']
        )

        # If any conflicting bookings exist, raise a validation error
        if conflicting_bookings.exists():
            raise serializers.ValidationError("This time slot overlaps with an existing confirmed or ongoing booking.")

        # If no bookings are found, check for available (unbooked) slots
        if conflicting_slots.filter(is_booked=False).exists():
            raise serializers.ValidationError("This time slot overlaps with an existing available slot.")

        return data