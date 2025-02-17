from django.contrib.auth.hashers import make_password
from .tasks import send_email_task
from .utils import (
    generate_otp, get_signin_url, cache_otp_data, cache_user_data, format_email_context, get_email_template_path, create_google_calendar_link
)
import uuid
from django.utils.dateparse import parse_datetime

class EmailService:
    @staticmethod
    def send_registration_email(email, user_data):
        """Handle registration email and OTP caching"""
        otp = generate_otp()
        cache_key = str(uuid.uuid4())
        
        # Use helpers for caching
        cache_otp_data(cache_key, otp)
        cache_user_data(cache_key, {
            'email': user_data['email'],
            'name': user_data['name'],
            'password': make_password(user_data['password']),
            'user_type': user_data['user_type'],
        })

        # Use helpers for email context and template
        context = format_email_context({'otp': otp})
        template = get_email_template_path('otp_email')

        send_email_task.delay(
            'Your OTP for SpeakIn Registration',
            email,
            template,
            context
        )

        return cache_key

    @staticmethod
    def send_tutor_verification_email(email):
        """Handle registration email and OTP caching"""
        otp = generate_otp()
        cache_key = str(uuid.uuid4())

        cache_otp_data(cache_key, otp)
        cache_user_data(cache_key, {
            'email': email
        })

        context = format_email_context({'otp': otp})
        template = get_email_template_path('otp_email')

        send_email_task.delay(
            'Your OTP for SpeakIn Registration',
            email,
            template,
            context
        )

        return cache_key

    @staticmethod
    def resend_registration_otp(email, cache_key):
        """Handle resending registration OTP"""
        otp = generate_otp()
        cache_otp_data(cache_key, otp)

        context = format_email_context({'otp': otp})
        template = get_email_template_path('resend_otp_email')

        send_email_task.delay(
            'Resend: Your OTP for SpeakIn Registration',
            email,
            template,
            context
        )        

    @staticmethod
    def send_forgot_password_email(email):
        """Handle forgot password email and OTP caching"""
        otp = generate_otp()
        cache_key = str(uuid.uuid4())
        
        cache_otp_data(cache_key, otp)
        cache_user_data(cache_key, {'email': email})

        context = format_email_context({'otp': otp})
        template = get_email_template_path('forgot_password_email')

        send_email_task.delay(
            'Your OTP for SpeakIn Password Reset',
            email,
            template,
            context
        )

        return cache_key

    @staticmethod
    def resend_forgot_password_otp(email, cache_key):
        """Handle resending forgot password OTP"""
        otp = generate_otp()
        cache_otp_data(cache_key, otp)
        print(otp)

        context = format_email_context({'otp': otp})
        template = get_email_template_path('resend_otp_email')

        send_email_task.delay(
            'Resend: Your OTP for Password Reset',
            email,
            template,
            context
        )

    @staticmethod
    def send_tutor_approval_email(user):
        """Send tutor approval email"""
        signin_url = get_signin_url()
        
        context = format_email_context({
            'tutor_name': user.name,
            'signin_url': signin_url
        })
        template = get_email_template_path('tutor_approval_email')

        send_email_task.delay(
            'Your Tutor Account has been Approved!',
            user.email,
            template,
            context
        )

    @staticmethod
    def send_tutor_denial_email(user):
        """Send tutor denial email"""
        context = format_email_context({
            'tutor_name': user.name
        })
        template = get_email_template_path('tutor_denial_email')

        send_email_task.delay(
            'Your Tutor Account Application has been Denied',
            user.email,
            template,
            context
        )

    @staticmethod
    def send_language_change_approval_email(user, language_name, tutor_name):
        """Send language change approval email"""
        context = format_email_context({
            'language': language_name,
            'tutor_name': tutor_name
        })
        template = get_email_template_path('language_to_teach_change_approval_email')

        send_email_task.delay(
            'SpeakIn Language Change Approval',
            user.email,
            template,
            context
        )

    @staticmethod
    def send_language_change_denial_email(user, new_language, tutor_name, old_language):
        """Send language change denial email"""
        context = format_email_context({
            'language': new_language,
            'tutor_name': tutor_name,
            'old_language': old_language
        })
        template = get_email_template_path('language_to_teach_change_denial_email')

        send_email_task.delay( 
            'SpeakIn Language Change Denial',
            user.email,
            template,
            context
        ) 

    @staticmethod
    def send_booking_notification_email(booking_data, tutor_data):
        start_time = parse_datetime(booking_data['start_time'])
        end_time = parse_datetime(booking_data['end_time'])

        # Prepare calendar event data for tutor
        tutor_event_data = {
            'session_type': booking_data['session_type'],
            'language': booking_data['language'],
            'student_name': booking_data['student_name'],
            'start_time': start_time,
            'end_time': end_time,
        }

        tutor_context = format_email_context({
            'tutor_name': tutor_data['name'],
            'student_name': booking_data['student_name'],
            'session_type': booking_data['session_type'],
            'start_time': start_time,
            'end_time': end_time,
            'language': booking_data['language'],
            'calendar_event': create_google_calendar_link(tutor_event_data)
        })

        send_email_task.delay(
            'New Session Booking',
            tutor_data['email'],
            get_email_template_path('tutor_booking_notification'),
            tutor_context      
        )

            # Prepare calendar event data for student
        student_event_data = {
            'session_type': booking_data['session_type'],
            'language': booking_data['language'],
            'tutor_name': tutor_data['name'],
            'start_time': start_time,
            'end_time': end_time,
        }

        # Send email to student
        student_context = { 
            'student_name': booking_data['student_name'],
            'tutor_name': tutor_data['name'],
            'session_type': booking_data['session_type'],
            'start_time': start_time,
            'end_time': end_time,
            'language': booking_data['language'],
            'calendar_event': create_google_calendar_link(student_event_data)
        }
        
        send_email_task.delay(
            'Booking Confirmation',
            booking_data['student_email'],
            get_email_template_path('student_booking_notification'),
            student_context
        )

    @staticmethod
    def send_cancellation_notification_email(data: dict) -> None:
        """Handle cancellation notification emails"""
        start_time = parse_datetime(data['start_time'])
        
        if data['cancelled_by'] == 'tutor':
            # Send to student
            context = format_email_context({
                'student_name': data['student_name'],
                'tutor_name': data['tutor_name'],
                'session_type': data['session_type'],
                'start_time': start_time,
                'language': data['language'],
                'credits_required': data['credits_required']
            })
            
            send_email_task.delay(
                'Session Cancelled by Tutor',
                data['student_email'],
                get_email_template_path('tutor_cancellation_notification'),
                context
            )
        else:
            # Send to tutor
            context = format_email_context({
                'tutor_name': data['tutor_name'],
                'student_name': data['student_name'],
                'session_type': data['session_type'],
                'start_time': start_time,
                'language': data['language']
            })
            
            send_email_task.delay(
                'Session Cancelled by Student',
                data['tutor_email'],
                get_email_template_path('student_cancellation_notification'),
                context
            )

    @staticmethod
    def send_account_suspension_email(user):
        """Send account suspension notification email"""
        context = format_email_context({
            'user_name': user.name
        })
        template = get_email_template_path('account_suspension_email')

        send_email_task.delay(
            'Important: Your SpeakIn Account Has Been Suspended',
            user.email,
            template,
            context
        )

    @staticmethod
    def send_account_reactivation_email(user):
        """Send account reactivation notification email"""
        context = format_email_context({
            'user_name': user.name
        })
        template = get_email_template_path('account_reactivation_email')

        send_email_task.delay(
            'Good News: Your SpeakIn Account Has Been Reactivated',
            user.email,
            template,
            context
        )