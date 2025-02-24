from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from .models import User, TutorDetails, Language, TutorLanguageToTeach, LanguageSpoken, TeachingLanguageChangeRequest
from django.core.files import File
import json
import os
from django.apps import apps
from django.core.files.base import ContentFile
import boto3
from botocore.exceptions import ClientError
from io import BytesIO

@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={'max_retries': 3},
    retry_backoff=True
)
def send_email_task(self, subject, recipient, template_name, context):
    try:
        html_message = render_to_string(template_name, context)
        
        send_mail(
            subject=subject,
            message='',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient],
            html_message=html_message,
            fail_silently=False
        )
    except Exception as exc:
        self.retry(exc=exc)

@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={'max_retries': 3},
    retry_backoff=True
)
def process_video_upload(self, model_name, instance_id, file_data):
    """
    Process video upload directly to S3
    Args:
        model_name: Name of the model ('TutorDetails' or 'TeachingLanguageChangeRequest')
        instance_id: ID of the instance
        file_data: Dictionary containing file information
    """
    try:
        # Validate model_name
        if model_name not in ['TutorDetails', 'TeachingLanguageChangeRequest']:
            raise ValueError(f"Invalid model name: {model_name}")

        # Get the appropriate model class
        if model_name == 'TutorDetails':
            instance = TutorDetails.objects.get(id=instance_id)
        else:
            instance = TeachingLanguageChangeRequest.objects.get(id=instance_id)
        
        # Create a ContentFile from the file data
        file_content = ContentFile(
            file_data['content'],
            name=file_data['name']
        )
        
        # Save directly to S3 via Django's storage backend
        file_name = f"tutor_intro_videos/{instance_id}_{file_data['name']}"
        instance.intro_video.save(
            file_name,
            file_content,
            save=True
        )
        
        return True
    except Exception as exc:
        print(f"Error in video upload task: {str(exc)}")
        self.retry(exc=exc)