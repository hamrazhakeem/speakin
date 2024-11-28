from django.http import JsonResponse
from rest_framework.views import APIView
import os
import requests
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsAuthenticatedWithJWT

# Create your views here.

class TutorAvailabilityView(APIView):
    permission_classes = [IsAuthenticatedWithJWT]
    def get(self, request, pk=None):
        try:
            if pk:
                session_service_url = os.getenv('SESSION_SERVICE_URL') + f'tutor-availabilities/{pk}/'
            else:
                session_service_url = os.getenv('SESSION_SERVICE_URL') + 'tutor-availabilities/'
            response = requests.get(session_service_url, json=request.data)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )        
        
    def post(self, request):
        try:
            session_service_url = os.getenv('SESSION_SERVICE_URL') + 'tutor-availabilities/'
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.post(session_service_url, json=request.data, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
    def patch(self, request, pk):
        try:
            session_service_url = os.getenv('SESSION_SERVICE_URL') + f'tutor-availabilities/{pk}/'
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.patch(session_service_url, json=request.data, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request, pk):
        try:
            session_service_url = os.getenv('SESSION_SERVICE_URL') + f'tutor-availabilities/{pk}/'
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.delete(session_service_url, json=request.data, headers=headers)
            if response.status_code == 204:
                return JsonResponse({'message': 'No Content'}, status=response.status_code)
            else:
                return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    
class BookingsView(APIView):
    permission_classes = [IsAuthenticatedWithJWT]
    def get(self, request):
        try:
            session_service_url = os.getenv('SESSION_SERVICE_URL') + 'bookings/'
            response = requests.get(session_service_url, json=request.data)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )        
        
    def post(self, request):
        try:
            session_service_url = os.getenv('SESSION_SERVICE_URL') + 'bookings/'
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.post(session_service_url, json=request.data, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
    def patch(self, request, pk):
        try:
            session_service_url = os.getenv('SESSION_SERVICE_URL') + f'bookings/{pk}/'
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.patch(session_service_url, json=request.data, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
# class GenerateTwilioTokenView(APIView):
#     permission_classes = [IsAuthenticatedWithJWT]

#     def post(self, request):
#         try:
#             user_service_url = os.getenv('SESSION_SERVICE_URL') + 'bookings/generate-twilio-token/'
#             raw_body = request.body
#             headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
#             response = requests.post(user_service_url, data=raw_body, headers={**headers, "Content-Type": "application/json"})
#             return Response(response.json(), status=response.status_code)
#         except requests.exceptions.RequestException as e:
#             return Response( 
#                 {"error": "Failed to connect to session service.", "details": str(e)},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             )

class DailyRoomCreateView(APIView):
    permission_classes = [IsAuthenticatedWithJWT]

    def post(self, request):
        try:
            user_service_url = os.getenv('SESSION_SERVICE_URL') + 'create-daily-room/'
            raw_body = request.body
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.post(user_service_url, data=raw_body, headers={**headers, "Content-Type": "application/json"})
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response( 
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )