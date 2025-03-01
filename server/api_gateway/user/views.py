from django.http import JsonResponse
from rest_framework.views import APIView
import os
import requests
import logging
from rest_framework.response import Response
from rest_framework import status
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
from auth.authentication import JWTAuthentication

# Get logger for the user app
logger = logging.getLogger("user")

# Create your views here.


class UserSignUpView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv("USER_SERVICE_URL") + "sign-up/"
            logger.info("Forwarding user signup request to user service")

            response = requests.post(user_service_url, json=request.data)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserSignInView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv("USER_SERVICE_URL") + "sign-in/"
            logger.info("Forwarding user signin request to user service")

            response = requests.post(user_service_url, json=request.data)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class GoogleSignInView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv("USER_SERVICE_URL") + "google-sign-in/"
            logger.info("Forwarding Google signin request to user service")

            response = requests.post(user_service_url, json=request.data)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class TutorVerifyEmailView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv("USER_SERVICE_URL") + "tutor/verify-email/"
            logger.info("Forwarding tutor email verification request to user service")

            response = requests.post(user_service_url, json=request.data)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class TutorVerifyOtpView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv("USER_SERVICE_URL") + "tutor/verify-otp/"
            logger.info("Forwarding tutor OTP verification request to user service")

            response = requests.post(user_service_url, json=request.data)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class TutorSignInView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv("USER_SERVICE_URL") + "tutor-sign-in/"
            logger.info("Forwarding tutor signin request to user service")

            response = requests.post(user_service_url, json=request.data)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class TutorRequestView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv("USER_SERVICE_URL") + "tutor-request/"
            logger.info("Forwarding tutor request to user service")
            json_data = {
                key: value
                for key, value in request.data.items()
                if not isinstance(value, TemporaryUploadedFile)
            }
            files_data = {
                key: (value.name, value, value.content_type)
                for key, value in request.data.items()
                if isinstance(value, TemporaryUploadedFile)
            }
            response = requests.post(user_service_url, data=json_data, files=files_data)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AdminSignInView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv("USER_SERVICE_URL") + "admin-sign-in/"
            logger.info("Forwarding admin signin request to user service")
            response = requests.post(user_service_url, json=request.data)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserVerifyOtpView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv("USER_SERVICE_URL") + "verify-otp/"
            logger.info("Forwarding user OTP verification request to user service")
            response = requests.post(user_service_url, json=request.data)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserResendOtpView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv("USER_SERVICE_URL") + "resend-otp/"
            logger.info("Forwarding user resend OTP request to user service")
            response = requests.post(user_service_url, json=request.data)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserTokenRefreshView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv("USER_SERVICE_URL") + "token/refresh/"
            logger.info("Forwarding user token refresh request to user service")
            response = requests.post(user_service_url, json=request.data)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserForgotPasswordView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv("USER_SERVICE_URL") + "forgot-password/"
            logger.info("Forwarding user forgot password request to user service")
            response = requests.post(user_service_url, json=request.data)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserForgotPasswordVerifyOtpView(APIView):
    def post(self, request):
        try:
            user_service_url = (
                os.getenv("USER_SERVICE_URL") + "forgot-password-verify-otp/"
            )
            logger.info(
                "Forwarding user forgot password verify OTP request to user service"
            )
            response = requests.post(user_service_url, json=request.data)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserForgotPasswordResendOtpView(APIView):
    def post(self, request):
        try:
            user_service_url = (
                os.getenv("USER_SERVICE_URL") + "forgot-password-resend-otp/"
            )
            logger.info(
                "Forwarding user forgot password resend OTP request to user service"
            )
            response = requests.post(user_service_url, json=request.data)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserSetNewPasswordView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv("USER_SERVICE_URL") + "set-new-password/"
            logger.info("Forwarding user set new password request to user service")
            response = requests.post(user_service_url, json=request.data)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserChangePasswordView(APIView):
    def post(self, request):
        try:
            user_service_url = os.getenv("USER_SERVICE_URL") + "change-password/"
            logger.info("Forwarding user change password request to user service")
            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.post(
                user_service_url, json=request.data, headers=headers
            )

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request, pk=None):
        try:
            if not pk:
                user_service_url = os.getenv("USER_SERVICE_URL") + "users/"
                logger.info("Forwarding users list request to user service")
            else:
                user_service_url = f"{os.getenv('USER_SERVICE_URL')}users/{pk}/"
                logger.info(
                    f"Forwarding user details request to user service for ID {pk}"
                )
            response = requests.get(user_service_url)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def patch(self, request, pk):
        try:
            if "verify-tutor" in request.path:
                user_service_url = (
                    os.getenv("USER_SERVICE_URL") + f"users/{pk}/verify-tutor/"
                )
                logger.info(
                    f"Forwarding tutor verification request to user service for ID {pk}"
                )
            else:
                user_service_url = os.getenv("USER_SERVICE_URL") + f"users/{pk}/"
                logger.info(
                    f"Forwarding user update request to user service for ID {pk}"
                )
            data_items = list(request.data.items())
            json_data = {
                key: value
                for key, value in data_items
                if not isinstance(value, (InMemoryUploadedFile))
            }
            files_data = {
                key: (value.name, value, value.content_type)
                for key, value in data_items
                if isinstance(value, (InMemoryUploadedFile))
            }

            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.patch(
                user_service_url, data=json_data, files=files_data, headers=headers
            )

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request, pk):
        try:
            user_service_url = (
                os.getenv("USER_SERVICE_URL") + f"users/{pk}/verify-tutor/"
            )
            logger.info(
                f"Forwarding tutor verification deletion request to user service for ID {pk}"
            )

            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.delete(
                user_service_url, json=request.data, headers=headers
            )

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            if response.status_code == 204:
                return JsonResponse(
                    {"message": "No Content"}, status=response.status_code
                )
            else:
                return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class TutorDetailsView(APIView):
    def get(self, request, pk):
        try:
            user_service_url = os.getenv("USER_SERVICE_URL") + f"tutor-details/{pk}/"
            logger.info(f"Forwarding tutor details request to user service for ID {pk}")
            response = requests.get(user_service_url)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class TeachingLanguageChangeRequestView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            user_service_url = (
                os.getenv("USER_SERVICE_URL") + "teaching-language-change-requests/"
            )
            logger.info(
                "Forwarding teaching language change requests list request to user service"
            )
            response = requests.get(user_service_url)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def patch(self, request, pk):
        try:
            user_service_url = (
                os.getenv("USER_SERVICE_URL")
                + f"teaching-language-change-requests/{pk}/"
            )
            logger.info(
                f"Forwarding teaching language change request update request to user service for ID {pk}"
            )
            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.patch(
                user_service_url, json=request.data, headers=headers
            )

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request, pk):
        try:
            user_service_url = (
                os.getenv("USER_SERVICE_URL")
                + f"teaching-language-change-requests/{pk}/"
            )
            logger.info(
                f"Forwarding teaching language change request deletion request to user service for ID {pk}"
            )
            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.delete(
                user_service_url, json=request.data, headers=headers
            )

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            if response.status_code == 204:
                return JsonResponse(
                    {"message": "No Content"}, status=response.status_code
                )
            else:
                return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        try:
            user_service_url = (
                os.getenv("USER_SERVICE_URL") + "teaching-language-change-requests/"
            )
            logger.info(
                "Forwarding teaching language change request creation request to user service"
            )
            json_data = {
                key: value
                for key, value in request.data.items()
                if not isinstance(value, TemporaryUploadedFile)
            }
            files_data = {
                key: (value.name, value, value.content_type)
                for key, value in request.data.items()
                if isinstance(value, TemporaryUploadedFile)
            }
            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.post(
                user_service_url, data=json_data, files=files_data, headers=headers
            )

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PlatformLanguageView(APIView):
    def get(self, request):
        try:
            user_service_url = os.getenv("USER_SERVICE_URL") + "platform-languages/"
            logger.info("Forwarding platform languages list request to user service")
            response = requests.get(user_service_url)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SpokenLanguageView(APIView):
    def get(self, request):
        try:
            user_service_url = os.getenv("USER_SERVICE_URL") + "spoken-languages/"
            logger.info("Forwarding spoken languages list request to user service")
            response = requests.get(user_service_url)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CountryView(APIView):
    def get(self, request):
        try:
            user_service_url = os.getenv("USER_SERVICE_URL") + "countries/"
            logger.info("Forwarding countries list request to user service")
            response = requests.get(user_service_url)

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class BlockUnblockUser(APIView):
    def patch(self, request, id):
        try:
            user_service_url = (
                os.getenv("USER_SERVICE_URL") + f"users/{id}/block-unblock/"
            )
            logger.info(
                f"Forwarding block unblock user request to user service for ID {id}"
            )
            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.patch(
                user_service_url, json=request.data, headers=headers
            )

            if response.status_code >= 400:
                logger.error(f"User service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to user service: {str(e)}")
            return Response(
                {"error": "Failed to connect to user service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
