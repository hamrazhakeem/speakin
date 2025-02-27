import logging
from django.conf import settings

# Use user_service logger for your custom middleware
logger = logging.getLogger('user_service')

class HostHeaderFixMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        logger.debug(f"HostHeaderFixMiddleware initialized (Debug mode: {settings.DEBUG})")

    def __call__(self, request):
        # Only modify headers in DEBUG mode
        if settings.DEBUG and 'HTTP_HOST' in request.META:
            original_host = request.META['HTTP_HOST']
            if original_host in ['message_service', 'message_service:8003', 
                               'user_service', 'user_service:8000',
                               'payment_service', 'payment_service:8001',
                               'session_service', 'session_service:8002',
                               'api_gateway', 'api_gateway:8080']:
                # Set to a valid hostname for Django
                request.META['HTTP_HOST'] = 'localhost'
                logger.debug(f"Modified HTTP_HOST from '{original_host}' to 'localhost'")
        
        return self.get_response(request)