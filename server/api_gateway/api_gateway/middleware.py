class HostHeaderFixMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # For development only - bypass host validation for Prometheus
        if 'HTTP_HOST' in request.META:
            if request.META['HTTP_HOST'] in ['message_service', 'message_service:8003', 
                                           'user_service', 'user_service:8000',
                                           'payment_service', 'payment_service:8001',
                                           'session_service', 'session_service:8002',
                                           'api_gateway', 'api_gateway:8080']:
                # Set to a valid hostname for Django
                request.META['HTTP_HOST'] = 'localhost'
        
        return self.get_response(request)