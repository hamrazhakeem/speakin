from rest_framework.views import APIView
import os
import requests
from rest_framework.response import Response
from rest_framework import status
from auth.authentication import JWTAuthentication

# Create your views here.

class CreateCheckoutSessionView(APIView):
    authentication_classes=[JWTAuthentication]
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

class StripeAccountView(APIView):
    authentication_classes=[JWTAuthentication]
    def get(self, request, user_id):
        try:
            payment_service_url = os.getenv('PAYMENT_SERVICE_URL') + f'stripe-account/{user_id}/'
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.get(payment_service_url, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to payment service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            ) 
        
    def post(self, request):
        try:
            print('request.data', request.data)
            payment_service_url = os.getenv('PAYMENT_SERVICE_URL') + 'stripe-account/'
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.post(payment_service_url, json=request.data, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to payment service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )  

class WithdrawView(APIView):
    authentication_classes=[JWTAuthentication]
    def post(self, request):
        try:
            payment_service_url = os.getenv('PAYMENT_SERVICE_URL') + 'withdraw/'
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.post(payment_service_url, json=request.data, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to payment service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class TransactionsView(APIView):
    authentication_classes=[JWTAuthentication]
    def get(self, request, user_id):
        try:
            payment_service_url = os.getenv('PAYMENT_SERVICE_URL') + f'transactions/{user_id}/'
            headers = {key: value for key, value in request.headers.items() if key != 'Content-Type'}
            response = requests.get(payment_service_url, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to payment service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )