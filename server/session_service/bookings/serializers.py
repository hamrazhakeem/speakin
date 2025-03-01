from rest_framework import serializers
from .models import TutorAvailability, Bookings, Report
from django.utils import timezone
import requests
from django.conf import settings


class BookingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookings
        fields = [
            "id",
            "availability",
            "student_id",
            "booking_status",
            "canceled_at",
            "refund_status",
            "video_call_link",
            "created_at",
            "student_joined_within_5_min",
            "tutor_joined_within_5_min",
            "student_joined_at",
            "tutor_joined_at",
        ]

    def validate(self, data):
        if "availability" in data:
            availability = data["availability"]
            student_id = data["student_id"]
            session_type = availability.session_type
            start_time = availability.start_time
            end_time = availability.end_time
            tutor_id = availability.tutor_id

            # Check if it's a trial session and if student already completed a trial with this tutor
            if session_type == "trial":
                # Check for any trial session (completed, confirmed, or ongoing)
                existing_trial = Bookings.objects.filter(
                    availability__tutor_id=tutor_id,
                    student_id=student_id,
                    availability__session_type="trial",
                    booking_status__in=["completed", "confirmed", "ongoing"],
                ).first()
                if existing_trial:
                    if existing_trial.booking_status == "completed":
                        raise serializers.ValidationError(
                            "You have already completed a trial session with this tutor."
                        )
                    elif existing_trial.booking_status == "confirmed":
                        if existing_trial.availability.end_time > timezone.now():
                            raise serializers.ValidationError(
                                "You can only book one trial session per tutor. Please cancel your existing trial booking if you wish to book a different time slot."
                            )
                    else:
                        raise serializers.ValidationError(
                            "Your trial session with this tutor is currently in progress."
                        )

            if session_type == "standard":
                completed_trials = Bookings.objects.filter(
                    availability__tutor_id=tutor_id,
                    student_id=student_id,
                    availability__session_type="trial",
                    booking_status="completed",
                )
                if not completed_trials.exists():
                    raise serializers.ValidationError(
                        "You must complete a trial session with this tutor before booking a standard session."
                    )

            # Check for time conflicts with other confirmed bookings
            overlapping_bookings = Bookings.objects.filter(
                student_id=student_id,
                booking_status__in=["confirmed", "ongoing"],
                availability__start_time__lt=end_time,
                availability__end_time__gt=start_time,
            )
            if overlapping_bookings.exists():
                raise serializers.ValidationError(
                    "You already have a confirmed booking during this time period."
                )

        return data


class TutorAvailabilitySerializer(serializers.ModelSerializer):
    bookings = BookingsSerializer(many=True, read_only=True)

    class Meta:
        model = TutorAvailability
        fields = [
            "id",
            "tutor_id",
            "session_type",
            "language_to_teach",
            "start_time",
            "end_time",
            "credits_required",
            "is_booked",
            "created_at",
            "bookings",
        ]

    def validate(self, data):
        start_time = data["start_time"]
        end_time = data["end_time"]
        tutor_id = data["tutor_id"]

        conflicting_slots = TutorAvailability.objects.filter(
            tutor_id=tutor_id, start_time__lt=end_time, end_time__gt=start_time
        )

        # Filter out slots that are already booked and check if any are confirmed or ongoing
        conflicting_bookings = Bookings.objects.filter(
            availability__in=conflicting_slots,
            booking_status__in=["confirmed", "ongoing"],
        )

        # If any conflicting bookings exist, raise a validation error
        if conflicting_bookings.exists():
            raise serializers.ValidationError(
                "This time slot overlaps with an existing confirmed or ongoing booking."
            )

        # If no bookings are found, check for available (unbooked) slots
        if conflicting_slots.filter(is_booked=False).exists():
            raise serializers.ValidationError(
                "This time slot overlaps with an existing available slot."
            )

        return data


class ReportSerializer(serializers.ModelSerializer):
    reporter_details = serializers.SerializerMethodField()
    tutor_details = serializers.SerializerMethodField()
    tutor_report_stats = serializers.SerializerMethodField()
    tutor_report_history = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            "id",
            "booking",
            "reporter_id",
            "description",
            "status",
            "admin_response",
            "created_at",
            "reporter_details",
            "tutor_details",
            "tutor_report_stats",
            "tutor_report_history",
        ]
        read_only_fields = ["status", "admin_response"]

    def get_reporter_details(self, obj):
        try:
            response = requests.get(
                f"{settings.USER_SERVICE_URL}/users/{obj.reporter_id}/",
                headers=self.context["request"].headers,
            )
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            return None

    def get_tutor_details(self, obj):
        try:
            tutor_id = obj.booking.availability.tutor_id
            response = requests.get(
                f"{settings.USER_SERVICE_URL}/users/{tutor_id}/",
                headers=self.context["request"].headers,
            )
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            return None

    def get_tutor_report_stats(self, obj):
        tutor_id = obj.booking.availability.tutor_id
        return Report.get_tutor_report_stats(tutor_id)

    def get_tutor_report_history(self, obj):
        tutor_id = obj.booking.availability.tutor_id
        # Get only reports created before the current report
        history = Report.objects.filter(
            booking__availability__tutor_id=tutor_id,
            created_at__lt=obj.created_at,  # Only get reports created before this one
        ).order_by("-created_at")
        return ReportHistorySerializer(history, many=True).data

    def validate(self, data):
        # Ensure the reporter can only report their own booking
        booking = data["booking"]
        reporter_id = data["reporter_id"]

        if booking.student_id != reporter_id:
            raise serializers.ValidationError("You can only report your own bookings.")

        # Ensure the booking is completed
        if booking.booking_status != "completed":
            raise serializers.ValidationError("You can only report completed sessions.")

        # Check if a report already exists for this booking
        existing_report = Report.objects.filter(
            booking=booking, reporter_id=reporter_id
        ).exists()

        if existing_report:
            raise serializers.ValidationError(
                "You have already submitted a report for this session."
            )

        return data


class ReportUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ["status", "admin_response"]

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class ReportHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ["id", "description", "status", "created_at", "admin_response"]
