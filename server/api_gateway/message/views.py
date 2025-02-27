from rest_framework.views import APIView
from auth.authentication import JWTAuthentication
import os
import requests
import logging
from rest_framework.response import Response
from rest_framework import status

# Get logger for the message app
logger = logging.getLogger('message')

class MessageView(APIView):
    authentication_classes = [JWTAuthentication]
    
    def get(self, request, user_id, selected_id=None):
        try:
            # Construct URL and log the request forwarding
            if selected_id:
                message_service_url = os.getenv('MESSAGE_SERVICE_URL') + f'messages/history/{user_id}/{selected_id}/'
                logger.info(f"Forwarding chat history request to message service: user {user_id} with {selected_id}")
            else:
                message_service_url = os.getenv('MESSAGE_SERVICE_URL') + f'messages/chat-users/{user_id}/'
                logger.info(f"Forwarding chat users request to message service for user {user_id}")
            
            # Forward request to message service
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.get(message_service_url, json=request.data, headers=headers)
            
            # Log service response status
            if response.status_code >= 400:
                logger.error(f"Message service returned error: {response.status_code}")
            
            return Response(response.json(), status=response.status_code)
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to message service: {str(e)}")
            return Response(
                {"error": "Failed to connect to message service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )