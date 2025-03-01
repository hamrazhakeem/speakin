from django.http import JsonResponse
from rest_framework.views import APIView
import os
import requests
import logging
from rest_framework.response import Response
from rest_framework import status
from auth.authentication import JWTAuthentication

# Get logger for the session app
logger = logging.getLogger("session")

# Create your views here.


class TutorAvailabilityView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request, pk=None):
        try:
            if pk:
                session_service_url = (
                    os.getenv("SESSION_SERVICE_URL") + f"tutor-availabilities/{pk}/"
                )
                logger.info(
                    f"Forwarding tutor availability fetch request to session service for ID {pk}"
                )
            else:
                session_service_url = (
                    os.getenv("SESSION_SERVICE_URL") + "tutor-availabilities/"
                )
                logger.info(
                    "Forwarding tutor availabilities list request to session service"
                )

            response = requests.get(session_service_url, json=request.data)

            if response.status_code >= 400:
                logger.error(f"Session service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to session service: {str(e)}")
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        try:
            session_service_url = (
                os.getenv("SESSION_SERVICE_URL") + "tutor-availabilities/"
            )
            logger.info(
                "Forwarding tutor availability creation request to session service"
            )

            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.post(
                session_service_url, json=request.data, headers=headers
            )

            if response.status_code >= 400:
                logger.error(f"Session service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to session service: {str(e)}")
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def patch(self, request, pk):
        try:
            session_service_url = (
                os.getenv("SESSION_SERVICE_URL") + f"tutor-availabilities/{pk}/"
            )
            logger.info(
                f"Forwarding tutor availability update request to session service for ID {pk}"
            )

            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.patch(
                session_service_url, json=request.data, headers=headers
            )

            if response.status_code >= 400:
                logger.error(f"Session service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to session service: {str(e)}")
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request, pk):
        try:
            session_service_url = (
                os.getenv("SESSION_SERVICE_URL") + f"tutor-availabilities/{pk}/"
            )
            logger.info(
                f"Forwarding tutor availability deletion request to session service for ID {pk}"
            )

            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.delete(
                session_service_url, json=request.data, headers=headers
            )

            if response.status_code == 204:
                return JsonResponse(
                    {"message": "No Content"}, status=response.status_code
                )
            else:
                if response.status_code >= 400:
                    logger.error(
                        f"Session service returned error: {response.status_code}"
                    )
                return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to session service: {str(e)}")
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class BookingsView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request, pk=None):
        try:
            if pk:
                session_service_url = (
                    os.getenv("SESSION_SERVICE_URL") + f"bookings/{pk}/"
                )
                logger.info(
                    f"Forwarding booking fetch request to session service for ID {pk}"
                )
            else:
                session_service_url = os.getenv("SESSION_SERVICE_URL") + "bookings/"
                logger.info("Forwarding bookings list request to session service")

            response = requests.get(session_service_url, json=request.data)

            if response.status_code >= 400:
                logger.error(f"Session service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to session service: {str(e)}")
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        try:
            session_service_url = os.getenv("SESSION_SERVICE_URL") + "bookings/"
            logger.info("Forwarding booking creation request to session service")

            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.post(
                session_service_url, json=request.data, headers=headers
            )

            if response.status_code >= 400:
                logger.error(f"Session service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to session service: {str(e)}")
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def patch(self, request, pk):
        try:
            session_service_url = os.getenv("SESSION_SERVICE_URL") + f"bookings/{pk}/"
            logger.info(
                f"Forwarding booking update request to session service for ID {pk}"
            )

            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.patch(
                session_service_url, json=request.data, headers=headers
            )

            if response.status_code >= 400:
                logger.error(f"Session service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to session service: {str(e)}")
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class DailyRoomCreateView(APIView):
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        try:
            session_service_url = (
                os.getenv("SESSION_SERVICE_URL") + "create-daily-room/"
            )
            logger.info("Forwarding Daily room creation request to session service")

            raw_body = request.body
            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.post(
                session_service_url,
                data=raw_body,
                headers={**headers, "Content-Type": "application/json"},
            )

            if response.status_code >= 400:
                logger.error(f"Session service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to session service: {str(e)}")
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ReportView(APIView):
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        try:
            session_service_url = os.getenv("SESSION_SERVICE_URL") + "reports/"
            logger.info("Forwarding report creation request to session service")

            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.post(
                session_service_url, json=request.data, headers=headers
            )

            if response.status_code >= 400:
                logger.error(f"Session service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to session service: {str(e)}")
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get(self, request, pk=None):
        try:
            if pk:
                session_service_url = (
                    os.getenv("SESSION_SERVICE_URL") + f"reports/{pk}/"
                )
                logger.info(
                    f"Forwarding report fetch request to session service for ID {pk}"
                )
            else:
                session_service_url = os.getenv("SESSION_SERVICE_URL") + "reports/"
                logger.info("Forwarding reports list request to session service")

            response = requests.get(session_service_url, json=request.data)

            if response.status_code >= 400:
                logger.error(f"Session service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to session service: {str(e)}")
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def patch(self, request, pk):
        try:
            session_service_url = (
                os.getenv("SESSION_SERVICE_URL") + f"reports/respond/{pk}/"
            )
            logger.info(
                f"Forwarding report response request to session service for ID {pk}"
            )

            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.patch(
                session_service_url, json=request.data, headers=headers
            )

            if response.status_code >= 400:
                logger.error(f"Session service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to session service: {str(e)}")
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class TutorCreditsHistoryView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request, tutor_id):
        try:
            session_service_url = (
                os.getenv("SESSION_SERVICE_URL")
                + f"bookings/tutor-credits-history/{tutor_id}/"
            )
            logger.info(
                f"Forwarding tutor credits history request to session service for tutor {tutor_id}"
            )

            response = requests.get(session_service_url, json=request.data)

            if response.status_code >= 400:
                logger.error(f"Session service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to session service: {str(e)}")
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
