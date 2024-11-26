from django.http import JsonResponse
from rest_framework.views import APIView
import os
import requests
from rest_framework.response import Response
from rest_framework import status
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
from .permissions import IsAuthenticatedWithJWT


# Create your views here.

class UserSignUpView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'sign-up/'
            response = requests.post(user_service_url, json=request.data)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class UserSignInView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'sign-in/'
            response = requests.post(user_service_url, json=request.data)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class GoogleSignInView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'google-sign-in/'
            response = requests.post(user_service_url, json=request.data)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class TutorSignInView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'tutor-sign-in/'
            response = requests.post(user_service_url, json=request.data)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )    
        
class TutorRequestView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'tutor-request/'
            json_data = {key: value for key, value in request.data.items() if not isinstance(value, TemporaryUploadedFile)}
            files_data = {key: (value.name, value, value.content_type) for key, value in request.data.items() if isinstance(value, TemporaryUploadedFile)}
            response = requests.post(user_service_url, data=json_data, files=files_data)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )    
        
class AdminSignInView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'admin-sign-in/'
            response = requests.post(user_service_url, json=request.data)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )   

class UserVerifyOtpView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'verify-otp/'
            response = requests.post(user_service_url, json=request.data)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class UserResendOtpView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'resend-otp/'
            response = requests.post(user_service_url, json=request.data)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class UserTokenRefreshView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'token/refresh/'
            response = requests.post(user_service_url, json=request.data)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class UserForgotPasswordView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'forgot-password/'
            response = requests.post(user_service_url, json=request.data)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class UserForgotPasswordVerifyOtpView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'forgot-password-verify-otp/'
            response = requests.post(user_service_url, json=request.data)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class UserForgotPasswordResendOtpView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'forgot-password-resend-otp/'
            response = requests.post(user_service_url, json=request.data)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class UserSetNewPasswordView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'set-new-password/'
            response = requests.post(user_service_url, json=request.data)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class UserChangePasswordView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'change-password/'
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.post(user_service_url, json=request.data, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class UserView(APIView):
    permission_classes=[IsAuthenticatedWithJWT]
    def get(self, request, pk=None):
        try:
            if not pk:
                user_service_url = os.getenv('USER_SERVICE_URL') + 'users/'
            else: 
                user_service_url = f"{os.getenv('USER_SERVICE_URL')}users/{pk}/"
            response = requests.get(user_service_url)
            print('response in gateway',response)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def patch(self, request, pk):
        try:
            if 'verify-tutor' in request.path:
                user_service_url = os.getenv('USER_SERVICE_URL') + f'users/{pk}/verify-tutor/'
            else:
                user_service_url = os.getenv('USER_SERVICE_URL') + f'users/{pk}/'
            data_items = list(request.data.items())
            json_data = {key: value for key, value in data_items if not isinstance(value, (InMemoryUploadedFile))}
            files_data = {key: (value.name, value, value.content_type) for key, value in data_items if isinstance(value, (InMemoryUploadedFile))}
            print(json_data, files_data)
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.patch(user_service_url, data=json_data, files=files_data, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e: 
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
    def delete(self, request, pk):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + f'users/{pk}/verify-tutor/'
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.delete(user_service_url, json=request.data, headers=headers)
            if response.status_code == 204:
                return JsonResponse({'message': 'No Content'}, status=response.status_code)
            else:
                return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class TutorDetailsView(APIView):
    def get(self, request, pk):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + f'tutor-details/{pk}/'
            response = requests.get(user_service_url)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class TeachingLanguageChangeRequestView(APIView):
    permission_classes=[IsAuthenticatedWithJWT]
    def get(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'teaching-language-change-requests/'
            response = requests.get(user_service_url)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
    def patch(self, request, pk):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + f'teaching-language-change-requests/{pk}/'
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.patch(user_service_url, json=request.data, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
    def delete(self, request, pk):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + f'teaching-language-change-requests/{pk}/'
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.delete(user_service_url, json=request.data, headers=headers)
            if response.status_code == 204:
                return JsonResponse({'message': 'No Content'}, status=response.status_code)
            else:
                return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
    def post(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'teaching-language-change-requests/'
            json_data = {key: value for key, value in request.data.items() if not isinstance(value, TemporaryUploadedFile)}
            files_data = {key: (value.name, value, value.content_type) for key, value in request.data.items() if isinstance(value, TemporaryUploadedFile)}
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.post(user_service_url, data=json_data, files=files_data, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class PlatformLanguageView(APIView):
    def get(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'platform-languages/'
            response = requests.get(user_service_url)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class SpokenLanguageView(APIView):
    def get(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'spoken-languages/'
            response = requests.get(user_service_url)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class CountryView(APIView):
    def get(self, request):
        try:
            user_service_url = os.getenv('USER_SERVICE_URL') + 'countries/'
            response = requests.get(user_service_url)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )