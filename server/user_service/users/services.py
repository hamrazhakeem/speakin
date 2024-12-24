from django.contrib.auth.hashers import make_password
from .tasks import send_email_task
from .utils import (
    generate_otp, get_signin_url, cache_otp_data, cache_user_data, format_email_context, get_email_template_path
)
import uuid

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