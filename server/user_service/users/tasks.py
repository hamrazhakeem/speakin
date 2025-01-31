from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from .models import User, TutorDetails, Language, TutorLanguageToTeach, LanguageSpoken, TeachingLanguageChangeRequest
from django.core.files import File
import json
import os
from django.apps import apps

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
def process_video_upload(self, model_name, instance_id, video_path):
    """
    Generic task to process video uploads
    Args:
        model_name: Name of the model ('TutorDetails' or 'TeachingLanguageChangeRequest')
        instance_id: ID of the instance
        video_path: Path to the temporarily stored video file
    """
    try:
        # Get the appropriate model class
        model_class = apps.get_model('users', model_name)
        instance = model_class.objects.get(id=instance_id)
        
        # Open and save the video file
        with open(video_path, 'rb') as video_file:
            file_name = video_path.split('/')[-1]
            instance.intro_video.save(
                file_name,
                File(video_file),
                save=True
            )
        
        # Clean up temporary file
        if os.path.exists(video_path):
            os.remove(video_path)
            
        return True
    except Exception as exc:
        print(f"Error in video upload task: {str(exc)}")
        if os.path.exists(video_path):
            os.remove(video_path)
        self.retry(exc=exc)