import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
from .permissions import IsAuthenticatedWithJWT

# Constants
BASE_URL = 'http://host.docker.internal:8000/'

# Helper Functions
def _prepare_data(request):
    """Helper to separate files from JSON data in request."""
    files_data = { key: (value.name, value, value.content_type) for key, value in request.data.items() if isinstance(value, (InMemoryUploadedFile, TemporaryUploadedFile))}
    json_data = {key: value for key, value in request.data.items() if not isinstance(value, (InMemoryUploadedFile, TemporaryUploadedFile))}
    return json_data, files_data

def _request_with_files(method, url, json_data, files_data, headers):
    """Send HTTP request with files and JSON data."""
    return requests.request(
        method,
        url,
        data=json_data,
        files=files_data,
        headers=headers
    )

# API Wrapper Functions
def post_api(endpoint, permissions=[AllowAny]):
    @csrf_exempt
    @api_view(['POST'])
    @permission_classes(permissions)
    def api_view_func(request, id=None):
        headers = {k: v for k, v in request.headers.items() if k != 'Content-Type'}
        json_data, files_data = _prepare_data(request)
        endpoint_url = f'{BASE_URL}{endpoint.replace("<int:id>", str(id))}' if id else f'{BASE_URL}{endpoint}'
        
        try:
            response = _request_with_files('POST', endpoint_url, json_data, files_data, headers)
            return JsonResponse(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': 'Failed to connect to user_service', 'details': str(e)}, status=500)
    
    return api_view_func

def get_api(endpoint, permissions=[AllowAny]):
    @csrf_exempt
    @api_view(['GET'])
    @permission_classes(permissions)
    def api_view_func(request, id=None):
        endpoint_url = f'{BASE_URL}{endpoint.replace("<int:id>", str(id))}' if id else f'{BASE_URL}{endpoint}'
        headers = {'Authorization': request.headers.get('Authorization')}
        
        try:
            response = requests.get(endpoint_url, headers=headers, json=request.data)
            return JsonResponse(response.json(), status=response.status_code, safe=False)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': 'Failed to connect to user_service', 'details': str(e)}, status=500)
    
    return api_view_func

def patch_api(endpoint, permissions=[AllowAny]):
    @csrf_exempt
    @api_view(['PATCH'])
    @permission_classes(permissions)
    def api_view_func(request, id=None):
        token = request.headers.get('Authorization')
        json_data, files_data = _prepare_data(request)
        endpoint_url = f'{BASE_URL}{endpoint.replace("<int:id>", str(id))}' if id else f'{BASE_URL}{endpoint}'
        
        try:
            response = _request_with_files('PATCH', endpoint_url, json_data, files_data, {'Authorization': token})
            return JsonResponse(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': 'Failed to connect to user_service', 'details': str(e)}, status=500)
    
    return api_view_func

def delete_api(endpoint, permissions=[AllowAny]):
    @csrf_exempt
    @api_view(['DELETE'])
    @permission_classes(permissions)
    def api_view_func(request, id):
        endpoint_url = f'{BASE_URL}{endpoint.replace("<int:id>", str(id))}'
        token = request.headers.get('Authorization')
        
        try:
            response = requests.delete(endpoint_url, headers={'Authorization': token}, json=request.data)
            response_data = response.json() if response.headers.get('Content-Type') == 'application/json' else response.text
            return JsonResponse(response_data, status=response.status_code, safe=False)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': 'Failed to connect to user_service', 'details': str(e)}, status=500)
    
    return api_view_func

# User Service
# User Authentication Endpoints
sign_up = post_api('sign_up/')
verify_otp = post_api('verify_otp/')
sign_in = post_api('sign_in/')
tutor_sign_in = post_api('tutor_sign_in/')
token_refresh = post_api('token/refresh/')
resend_otp = post_api('resend_otp/')
forgot_password = post_api('forgot_password/')
forgot_password_verify_otp = post_api('forgot_password_verify_otp/')
set_new_password = post_api('set_new_password/')
resend_forgot_password_otp = post_api('resend_forgot_password_otp/')
admin_signin = post_api('admin_signin/')

# Data Retrieval Endpoints
get_countries = get_api('get_countries/')
get_platform_languages = get_api('get_platform_languages/') 
get_spoken_languages = get_api('get_spoken_languages/')
 
# Tutor Request Endpoints
tutor_request = post_api('tutor_request/') 
edit_teaching_language = post_api('edit_teaching_language/', permissions=[IsAuthenticatedWithJWT]) 
language_change_requests = get_api('language_change_requests/', permissions=[IsAuthenticatedWithJWT])
approve_language_change = patch_api('verify_language_change/<int:id>/', permissions=[IsAuthenticatedWithJWT])
deny_language_change = delete_api('verify_language_change/<int:id>/', permissions=[IsAuthenticatedWithJWT])

# User Management Endpoints 
update_user = patch_api('users/<int:id>/', permissions=[IsAuthenticatedWithJWT])
get_users = get_api('users/', permissions=[IsAuthenticatedWithJWT])
users = get_api('users/<int:id>/', permissions=[IsAuthenticatedWithJWT])
block_unblock_user = patch_api('block_unblock_user/<int:id>/', permissions=[IsAuthenticatedWithJWT])

# Tutor Verification Endpoints
approve_tutor = patch_api('tutor_request_verify/<int:id>/', permissions=[IsAuthenticatedWithJWT])
deny_tutor = delete_api('tutor_request_verify/<int:id>/', permissions=[IsAuthenticatedWithJWT])
 
# Password Management Endpoints
change_password = post_api('change_password/', permissions=[IsAuthenticatedWithJWT]) 