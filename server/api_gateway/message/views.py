from rest_framework.views import APIView
from auth.authentication import JWTAuthentication
import os
import requests
from rest_framework.response import Response
from rest_framework import status

class MessageView(APIView):
    authentication_classes = [JWTAuthentication]
    def get(self, request, user_id, selected_id=None):
        try:
            if selected_id:
                message_service_url = os.getenv('MESSAGE_SERVICE_URL') + f'messages/history/{user_id}/{selected_id}/'
            else:
                message_service_url = os.getenv('MESSAGE_SERVICE_URL') + f'messages/chat-users/{user_id}/'
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.get(message_service_url, json=request.data, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to message service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )   