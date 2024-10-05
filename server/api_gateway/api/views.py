import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes

# Create your views here.

BASE_URL = 'http://host.docker.internal:8000'

def post_api(endpoint, permissions):
    @csrf_exempt
    @api_view(['POST'])
    @permission_classes(permissions)
    def api_view_func(request):
        try:
            response = requests.post(
                f'{BASE_URL}{endpoint}',
                json=request.data
            )
            return JsonResponse(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': 'Failed to connect to user_service', 'details': str(e)}, status=500)
    
    return api_view_func

def get_api(endpoint, permissions):
    @csrf_exempt
    @api_view(['GET'])
    @permission_classes(permissions)
    def api_view_func(request, id):
        try:
            endpoint_with_id = endpoint.replace('<int:id>', str(id))
            response = requests.get(
                f'{BASE_URL}{endpoint_with_id}',
                json=request.data
            )
            return JsonResponse(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': 'Failed to connect to user_service', 'details': str(e)}, status=500)
    
    return api_view_func

def put_api(endpoint, permissions):
    @csrf_exempt
    @api_view(['PUT'])
    @permission_classes(permissions)
    def api_view_func(request, id):
        try:
            endpoint_with_id = endpoint.replace('<int:id>', str(id))

            files = {}
            for key, value in request.data.items():
                if isinstance(value, list):
                    for item in value:
                        if isinstance(item, InMemoryUploadedFile):
                            files[key] = item
                elif isinstance(value, InMemoryUploadedFile):
                    files[key] = value

            response = requests.put(
                f'{BASE_URL}{endpoint_with_id}',
                data=request.data,  # Use 'data' for multipart/form-data
                files=files 
            )
            return JsonResponse(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': 'Failed to connect to user_service', 'details': str(e)}, status=500)
    
    return api_view_func


# Define views using the generalized function
update_user = put_api('/users/update_user/<int:id>/', permissions=[IsAuthenticated])
get_user = get_api('/users/get_user/<int:id>/', permissions=[IsAuthenticated])
sign_up = post_api('/users/sign_up/', permissions=[AllowAny])
verify_otp = post_api('/users/verify_otp/', permissions=[AllowAny])
sign_in = post_api('/users/sign_in/', permissions=[AllowAny])
token_refresh = post_api('/users/token/refresh/', permissions=[AllowAny])
resend_otp = post_api('/users/resend_otp/', permissions=[AllowAny])
forgot_password = post_api('/users/forgot_password/', permissions=[AllowAny])
forgot_password_verify_otp = post_api('/users/forgot_password_verify_otp/', permissions=[AllowAny])
set_new_password = post_api('/users/set_new_password/', permissions=[AllowAny])
resend_forgot_password_otp = post_api('/users/resend_forgot_password_otp/', permissions=[AllowAny])
admin_signin = post_api('/users/admin_signin/', permissions=[AllowAny])