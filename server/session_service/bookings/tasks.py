from celery import shared_task
import requests
from django.conf import settings
from services.publisher import RabbitMQPublisher, NotificationType
from .models import Bookings
from rest_framework.exceptions import ValidationError

@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={'max_retries': 3},
    retry_backoff=True
)
def send_cancellation_notification(self, booking_id, new_status):
    try:        
        booking = Bookings.objects.get(id=booking_id)
        
        # Fetch user data
        student_data = requests.get(
            f"{settings.USER_SERVICE_URL}users/{booking.student_id}/"
        ).json()
        
        tutor_data = requests.get(
            f"{settings.USER_SERVICE_URL}users/{booking.availability.tutor_id}/"
        ).json()

        cancellation_data = {
            'cancelled_by': 'student' if new_status == 'canceled_by_student' else 'tutor',
            'student_name': student_data['name'],
            'student_email': student_data['email'],
            'tutor_name': tutor_data['tutor_details']['speakin_name'],
            'tutor_email': tutor_data['email'],
            'session_type': booking.availability.session_type,
            'start_time': booking.availability.start_time.isoformat(),
            'language': booking.availability.language_to_teach,
            'credits_required': booking.availability.credits_required
        }

        # Send notification via RabbitMQ
        rabbitmq_publisher = RabbitMQPublisher()
        if not rabbitmq_publisher.publish_notification(
            cancellation_data, 
            NotificationType.CANCELLATION
        ):
            raise Exception("Failed to send cancellation notification")
            
        return True
        
    except Exception as exc:
        self.retry(exc=exc)

@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={'max_retries': 3},
    retry_backoff=True
)
def send_booking_notification(self, booking_id, student_data):
    try:        
        booking = Bookings.objects.get(id=booking_id)
        
        # Fetch tutor data for notification
        tutor_data = requests.get(
            f"{settings.USER_SERVICE_URL}users/{booking.availability.tutor_id}/"
        ).json()

        # Send booking notification
        notification_data = {
            'booking_data': {
                'session_type': booking.availability.session_type,
                'start_time': booking.availability.start_time.isoformat(),
                'end_time': booking.availability.end_time.isoformat(),
                'language': booking.availability.language_to_teach,
                'student_name': student_data['name'],
                'student_email': student_data['email'],
            },
            'tutor_data': {
                'name': tutor_data['tutor_details']['speakin_name'],
                'email': tutor_data['email']
            } 
        }

        rabbitmq_publisher = RabbitMQPublisher()
        if not rabbitmq_publisher.publish_notification(
            notification_data, 
            NotificationType.BOOKING
        ):
            raise ValidationError("Failed to send booking notification")
        
        return True

    except Exception as exc:
        self.retry(exc=exc)