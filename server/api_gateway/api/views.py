import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
from .permissions import IsAuthenticatedWithJWT

# Service URLs Configuration
SERVICE_URLS = {
    'user': 'http://host.docker.internal:8000/',
    'payment': 'http://host.docker.internal:8001/',
    'session': 'http://host.docker.internal:8002/'
}

class ServiceRouter:
    """Router class to handle microservice routing and requests"""
     
    @staticmethod
    def _prepare_data(request):
        """Helper to separate files from JSON data in request."""
        if request.path.endswith('/webhook/'):
            return request.body, {}  # Use raw body for webhook
        else:
            files_data = {
                key: (value.name, value, value.content_type) 
                for key, value in request.data.items() 
                if isinstance(value, (InMemoryUploadedFile, TemporaryUploadedFile))
            }
            json_data = {
                key: value 
                for key, value in request.data.items() 
                if not isinstance(value, (InMemoryUploadedFile, TemporaryUploadedFile))
            }
            return json_data, files_data

    @staticmethod
    def _request_with_files(method, url, json_data, files_data, headers, is_webhook=False):
        """Send HTTP request with files and JSON data."""
        if is_webhook:
            # Use raw data for webhooks to maintain payload integrity
            return requests.request(
                method,
                url,
                data=json_data,  # This is the raw payload in case of webhook
                headers=headers
            )
        else:
            # Standard handling with separated JSON and files
            return requests.request(
                method,
                url,
                data=json_data,
                files=files_data,
                headers=headers
            )

    @staticmethod
    def create_api_view(service, endpoint, method='GET', permissions=[AllowAny]):
        """Factory method to create API views for different services"""
        
        if service not in SERVICE_URLS:
            raise ValueError(f"Unknown service: {service}")

        base_url = SERVICE_URLS[service]

        @csrf_exempt
        @api_view([method])
        @permission_classes(permissions)
        def api_view_func(request, id=None):
            headers = {
                'Authorization': request.headers.get('Authorization'),
                **{k: v for k, v in request.headers.items() if k not in ['Content-Type', 'Authorization']}
            }
            
            endpoint_url = (
                f'{base_url}{endpoint.replace("<int:id>", str(id))}' 
                if id else f'{base_url}{endpoint}'
            )

            try:
                is_webhook = request.path.endswith('/webhook/')
                if method in ['POST', 'PATCH']:
                    json_data, files_data = ServiceRouter._prepare_data(request)
                    print('json dataaaaaaaaaaa', json_data)
                    response = ServiceRouter._request_with_files(
                        method, 
                        endpoint_url, 
                        json_data, 
                        files_data, 
                        headers,
                        is_webhook=is_webhook  # Pass webhook status to handler
                    )
                else:
                    response = requests.request(
                        method,
                        endpoint_url,
                        headers=headers, 
                        json=request.data 
                    )
                    print('response in api gatewayyyyyyyyyyyyy',response)
                if response.status_code == 204:
                    return JsonResponse({'message': 'No Content'}, status=response.status_code)

                # Handle both JSON and non-JSON responses
                return JsonResponse(response.json(), status=response.status_code, safe=False)

            except requests.exceptions.RequestException as e:
                return JsonResponse(
                    {
                        'error': f'Failed to connect to {service}_service',
                        'details': str(e)
                    },
                    status=500
                )

        return api_view_func

# Helper functions to create route handlers
def post_api(service, endpoint, permissions=[AllowAny]):
    return ServiceRouter.create_api_view(service, endpoint, 'POST', permissions)

def get_api(service, endpoint, permissions=[AllowAny]):
    return ServiceRouter.create_api_view(service, endpoint, 'GET', permissions)

def patch_api(service, endpoint, permissions=[AllowAny]):
    return ServiceRouter.create_api_view(service, endpoint, 'PATCH', permissions)

def delete_api(service, endpoint, permissions=[AllowAny]):
    return ServiceRouter.create_api_view(service, endpoint, 'DELETE', permissions)

# API Endpoints Configuration
# User Service Endpoints
sign_up = post_api('user', 'sign_up/')
verify_otp = post_api('user', 'verify_otp/')
sign_in = post_api('user', 'sign_in/')
google_sign_in = post_api('user', 'google_sign_in/')
tutor_sign_in = post_api('user', 'tutor_sign_in/')
token_refresh = post_api('user', 'token/refresh/')
resend_otp = post_api('user', 'resend_otp/')
forgot_password = post_api('user', 'forgot_password/')
forgot_password_verify_otp = post_api('user', 'forgot_password_verify_otp/')
set_new_password = post_api('user', 'set_new_password/')
resend_forgot_password_otp = post_api('user', 'resend_forgot_password_otp/')
admin_signin = post_api('user', 'admin_signin/')

# Data Retrieval Endpoints
get_countries = get_api('user', 'get_countries/')
get_platform_languages = get_api('user', 'get_platform_languages/')
get_spoken_languages = get_api('user', 'get_spoken_languages/')

# Tutor Request Endpoints
tutor_request = post_api('user', 'tutor_request/')
edit_teaching_language = post_api('user', 'edit_teaching_language/', permissions=[IsAuthenticatedWithJWT])
language_change_requests = get_api('user', 'language_change_requests/', permissions=[IsAuthenticatedWithJWT])
approve_language_change = patch_api('user', 'verify_language_change/<int:id>/', permissions=[IsAuthenticatedWithJWT])
deny_language_change = delete_api('user', 'verify_language_change/<int:id>/', permissions=[IsAuthenticatedWithJWT])

# User Management Endpoints
update_user = patch_api('user', 'users/<int:id>/', permissions=[IsAuthenticatedWithJWT])
get_users = get_api('user', 'users/', permissions=[IsAuthenticatedWithJWT])
users = get_api('user', 'users/<int:id>/', permissions=[IsAuthenticatedWithJWT])
block_unblock_user = patch_api('user', 'block_unblock_user/<int:id>/', permissions=[IsAuthenticatedWithJWT])
tutor_details = get_api('user', 'tutor-details/<int:id>/', permissions=[IsAuthenticatedWithJWT])
users_tutor_details = get_api('user', 'users-tutor-details/<int:id>/', permissions=[IsAuthenticatedWithJWT])

# Tutor Verification Endpoints
approve_tutor = patch_api('user', 'tutor_request_verify/<int:id>/', permissions=[IsAuthenticatedWithJWT])
deny_tutor = delete_api('user', 'tutor_request_verify/<int:id>/', permissions=[IsAuthenticatedWithJWT])

# Password Management Endpoints
change_password = post_api('user', 'change_password/', permissions=[IsAuthenticatedWithJWT])

# ----------------------------------------------------------------

# Payment Service Endpoints
# Payment Processing Endpoints 
create_checkout_session = post_api('payment', 'create_checkout_session/', permissions=[IsAuthenticatedWithJWT])

# Webhook Endpoints 
webhook = post_api('payment', 'webhook/')  

# ----------------------------------------------------------------

# Session Service Endpoints

get_tutor_availabilities = get_api('session' ,'tutor-availabilities/', permissions=[IsAuthenticatedWithJWT])
tutor_availabilities = get_api('session' ,'tutor-availabilities/<int:id>/', permissions=[IsAuthenticatedWithJWT])
create_tutor_availabilities = post_api('session', 'tutor-availabilities/', permissions=[IsAuthenticatedWithJWT]) 
delete_tutor_availabilities = delete_api('session', 'tutor-availabilities/<int:id>/', permissions=[IsAuthenticatedWithJWT])
bookings = post_api('session', 'bookings/', permissions=[IsAuthenticatedWithJWT])
get_bookings = get_api('session', 'bookings/', permissions=[IsAuthenticatedWithJWT])
get_user_bookings = get_api('session', 'bookings/student/<int:id>/', permissions=[IsAuthenticatedWithJWT])