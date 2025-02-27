from rest_framework.response import Response
from rest_framework import status
import requests
import urllib
import jwt
import os
from dotenv import load_dotenv
import random
import string
from django.core.cache import cache
from django.conf import settings
from .models import User, Language, Proficiency
import pycountry
import logging

# Get logger for the user app
logger = logging.getLogger('users')

# Load environment variables from .env file
load_dotenv()

def populate_languages():
    logger.info("Starting language population")
    for language in pycountry.languages:
        if hasattr(language, 'alpha_2') and hasattr(language, 'name'):  
            Language.objects.get_or_create(name=language.name)
    logger.info("Language population completed")

def populate_proficiencies():
    logger.info("Starting proficiency levels population")
    levels = [ 
        ('A1', 'A1 - Beginner'),
        ('A2', 'A2 - Elementary'),
        ('B1', 'B1 - Intermediate'),
        ('B2', 'B2 - Upper-Intermediate'),
        ('C1', 'C1 - Advanced'),
        ('C2', 'C2 - Proficient'),
        ('Native', 'Native'),
    ]
    for level, description in levels:
        Proficiency.objects.get_or_create(level=level)
    logger.info("Proficiency levels population completed")

def cache_otp_data(cache_key, otp, timeout=None):
    """Helper to cache OTP data"""
    timeout = timeout or settings.CACHE_TTL
    logger.debug(f"Caching OTP for key: {cache_key}")
    cache.set(f'otp_{cache_key}', otp, timeout=timeout)

def cache_user_data(cache_key, user_data, timeout=None):
    """Helper to cache user data"""
    timeout = timeout or settings.CACHE_TTL
    logger.debug(f"Caching user data for key: {cache_key}")
    cache.set(f'user_data_{cache_key}', user_data, timeout=timeout)

def format_email_context(context_data):
    """Helper to format email context data"""
    logger.debug("Formatting email context data")
    return {k: v for k, v in context_data.items() if v is not None}

def get_email_template_path(template_name):
    """Helper to get full email template path"""
    logger.debug(f"Getting email template path for: {template_name}")
    return f'emails/{template_name}.html'

def get_id_token(code):
    token_endpoint = 'https://oauth2.googleapis.com/token'
    logger.info("Initiating Google OAuth token exchange")
    
    # Load client_id and client_secret from environment variables
    client_id = os.getenv('GOOGLE_CLIENT_ID')
    client_secret = os.getenv('GOOGLE_CLIENT_SECRET')

    payload = {
        'code': code,
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': 'postmessage',
        'grant_type': 'authorization_code'
    }

    body = urllib.parse.urlencode(payload)
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post(token_endpoint, data=body, headers=headers)

    if response.ok:
        id_token = response.json()['id_token']
        return jwt.decode(id_token, options={"verify_signature": False})

def generate_otp():
    """Generate a 6-digit OTP."""
    otp = ''.join(random.choices(string.digits, k=6))
    logger.debug("Generated new OTP")
    return otp

def get_signin_url():
    """Get the frontend signin URL."""
    frontend_origin = settings.CORS_ALLOWED_ORIGINS
    
    if not frontend_origin:
        logger.error("No local frontend origin found in CORS_ALLOWED_ORIGINS")
        raise ValueError("No local frontend origin found in CORS_ALLOWED_ORIGINS")
    
    logger.debug(f"Generated signin URL with origin: {frontend_origin}")
    return f"{frontend_origin}/tutor/sign-in/"

def get_user_or_create(email, name):
    """Get existing user or create new one."""
    try:
        user = User.objects.get(email=email)
        if not user.is_active:
            logger.warning(f"Blocked user attempted access: {email}")
            return Response({'error': 'User is blocked'}, status=status.HTTP_400_BAD_REQUEST)
        logger.info(f"Existing user retrieved: {email}")
        return user
    except User.DoesNotExist:
        logger.info(f"Creating new user: {email}")
        user = User.objects.create_user(
            email=email, 
            name=name, 
            user_type='student', 
            with_google=True, 
            password=None
        )
        return user

def create_google_calendar_link(event_data):
    """Generate Google Calendar event link"""
    try:
        logger.info("Generating Google Calendar event link")
        base_url = "https://calendar.google.com/calendar/render"
        
        # Format event details
        event = {
            'action': 'TEMPLATE',
            'text': f"SpeakIn {event_data['session_type']} Session",
            'dates': f"{event_data['start_time'].strftime('%Y%m%dT%H%M%SZ')}/{event_data['end_time'].strftime('%Y%m%dT%H%M%SZ')}",
            'location': 'Online Session'
        }
        
        # Build query string
        query_string = urllib.parse.urlencode(event)
        logger.debug(f"Generated calendar link: {base_url}?{query_string}")
        return f"{base_url}?{query_string}"
    except Exception as e:
        logger.error(f"Error generating calendar link: {str(e)}")
        return str(e)