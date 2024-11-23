from django.http import JsonResponse
from rest_framework.views import APIView
import os
import requests
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsAuthenticatedWithJWT

# Create your views here.

class CreateCheckoutSessionView(APIView):
    permission_classes=[IsAuthenticatedWithJWT]
    def post(self, request):
        try:
            payment_service_url = os.getenv('PAYMENT_SERVICE_URL') + 'create-checkout-session/'
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.post(payment_service_url, json=request.data, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to payment service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class WebhookView(APIView):
    def post(self, request):
        try:
            payment_service_url = os.getenv('PAYMENT_SERVICE_URL') + 'webhook/'
            raw_body = request.body
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.post(payment_service_url, data=raw_body, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to payment service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )