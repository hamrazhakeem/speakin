import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes
from django.core.files.uploadedfile import TemporaryUploadedFile
from .permissions import IsAuthenticatedWithJWT
# Create your views here.

BASE_URL = 'http://host.docker.internal:8000/'

def post_api(endpoint, permissions):
    @csrf_exempt
    @api_view(['POST'])
    @permission_classes(permissions)
    def api_view_func(request, id=None):
        try:
            # Prepare headers
            headers = dict(request.headers)
            headers.pop('Content-Type', None)  # Remove Content-Type header

            # Initialize data structures for files and payload 
            files_data = {}
            json_data = {}

            # Separate files from non-file data
            for key, value in request.data.items():
                if isinstance(value, InMemoryUploadedFile) or isinstance(value, TemporaryUploadedFile):
                    files_data[key] = (value.name, value, value.content_type)  # Handle file fields
                else:
                    json_data[key] = value 
            print('json->>>>>',json_data, 'files->>>>>>>',files_data)
            if id:
                endpoint_with_id = endpoint.replace('<int:id>', str(id))
                response = requests.post(
                    f'{BASE_URL}{endpoint_with_id}',
                    data=json_data,  # Use 'data' for non-file data
                    files=files_data,  # Use 'files' for file data
                    headers=headers
                )
            else:
            # Make the POST request to the user service
                response = requests.post(
                    f'{BASE_URL}{endpoint}',
                    data=json_data,  # Use 'data' for non-file data
                    files=files_data,  # Use 'files' for file data
                    headers=headers
                ) 
            
            return JsonResponse(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': 'Failed to connect to user_service', 'details': str(e)}, status=500)
    
    return api_view_func

def get_api(endpoint, permissions):
    @csrf_exempt
    @api_view(['GET'])
    @permission_classes(permissions)
    def api_view_func(request, id=None):
        try:
            token = request.headers.get('Authorization')
            if id:
                endpoint_with_id = endpoint.replace('<int:id>', str(id))
                response = requests.get(
                    f'{BASE_URL}{endpoint_with_id}',
                    headers={'Authorization': token}, 
                    json=request.data
                )
            else:
                response = requests.get(
                    f'{BASE_URL}{endpoint}',
                    headers={'Authorization': token},  
                    json=request.data
                )
            return JsonResponse(response.json(), status=response.status_code, safe=False)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': 'Failed to connect to user_service', 'details': str(e)}, status=500)
    
    return api_view_func

def patch_api(endpoint, permissions):
    @csrf_exempt
    @api_view(['PATCH'])
    @permission_classes(permissions)
    def api_view_func(request, id):
        try:
            token = request.headers.get('Authorization')
            if id:
                endpoint_with_id = endpoint.replace('<int:id>', str(id))

                files_data = {}
                json_data = {}

                # Separate files from non-file data
                for key, value in request.data.items():
                    if isinstance(value, InMemoryUploadedFile) or isinstance(value, TemporaryUploadedFile):
                        files_data[key] = (value.name, value, value.content_type)  # Handle file fields
                    else:
                        json_data[key] = value 

                response = requests.patch(
                    f'{BASE_URL}{endpoint_with_id}',
                    headers={'Authorization': token},  
                    data=json_data,  # Use 'data' for non-file data
                    files=files_data,
                ) 
            else:
                files_data = {}
                json_data = {}

                # Separate files from non-file data
                for key, value in request.data.items():
                    if isinstance(value, InMemoryUploadedFile) or isinstance(value, TemporaryUploadedFile):
                        files_data[key] = (value.name, value, value.content_type)  # Handle file fields
                    else:
                        json_data[key] = value 

                response = requests.patch(
                    f'{BASE_URL}{endpoint}',
                    headers={'Authorization': token},  
                    data=json_data,  # Use 'data' for non-file data
                    files=files_data,
                )
            return JsonResponse(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': 'Failed to connect to user_service', 'details': str(e)}, status=500)
    
    return api_view_func

def delete_api(endpoint, permissions):
    @csrf_exempt
    @api_view(['DELETE'])
    @permission_classes(permissions)
    def api_view_func(request, id):
        try:
            token = request.headers.get('Authorization')
            endpoint_with_id = endpoint.replace('<int:id>', str(id))
            
            # Make the DELETE request to the external API
            response = requests.delete(
                f'{BASE_URL}{endpoint_with_id}',
                headers={'Authorization': token}, 
                json=request.data
            )
            
            # Attempt to parse JSON response, but fallback to text if JSON is invalid
            try:
                response_data = response.json()  # Try to parse JSON
            except ValueError:
                response_data = response.text  # Fallback to raw text if not valid JSON
            
            return JsonResponse(response_data, status=response.status_code, safe=False)

        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': 'Failed to connect to user_service', 'details': str(e)}, status=500)

    return api_view_func

# Define views using the generalized function
update_user = patch_api('users/<int:id>/', permissions=[IsAuthenticatedWithJWT])
get_user = get_api('users/<int:id>/', permissions=[IsAuthenticatedWithJWT])
sign_up = post_api('sign_up/', permissions=[AllowAny])
verify_otp = post_api('verify_otp/', permissions=[AllowAny]) 
sign_in = post_api('sign_in/', permissions=[AllowAny])
token_refresh = post_api('token/refresh/', permissions=[AllowAny]) 
resend_otp = post_api('resend_otp/', permissions=[AllowAny])
forgot_password = post_api('forgot_password/', permissions=[AllowAny])
forgot_password_verify_otp = post_api('forgot_password_verify_otp/', permissions=[AllowAny]) 
set_new_password = post_api('set_new_password/', permissions=[AllowAny]) 
resend_forgot_password_otp = post_api('resend_forgot_password_otp/', permissions=[AllowAny])
admin_signin = post_api('admin_signin/', permissions=[AllowAny])
get_countries = get_api('get_countries/', permissions=[AllowAny])
get_platform_languages = get_api('get_platform_languages/', permissions=[AllowAny])
get_spoken_languages = get_api('get_spoken_languages/', permissions=[AllowAny])
tutor_request = post_api('tutor_request/', permissions=[AllowAny]) 
get_users = get_api('users/', permissions=[IsAuthenticatedWithJWT]) 
block_unblock_user = patch_api('block_unblock_user/<int:id>/', permissions=[IsAuthenticatedWithJWT])  
approve_tutor = patch_api('users/<int:id>/', permissions=[IsAuthenticatedWithJWT])
deny_tutor = delete_api('users/<int:id>/', permissions=[IsAuthenticatedWithJWT]) 
tutor_sign_in = post_api('tutor_sign_in/', permissions=[AllowAny]) 
change_password = post_api('change_password/', permissions=[IsAuthenticatedWithJWT])
edit_teaching_language = post_api('edit_teaching_language/<int:id>/', permissions=[IsAuthenticatedWithJWT])