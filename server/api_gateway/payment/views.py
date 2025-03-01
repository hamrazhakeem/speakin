from rest_framework.views import APIView
import os
import requests
import logging
from rest_framework.response import Response
from rest_framework import status
from auth.authentication import JWTAuthentication

# Get logger for the payment app
logger = logging.getLogger("payment")

# Create your views here.


class CreateCheckoutSessionView(APIView):
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        try:
            payment_service_url = (
                os.getenv("PAYMENT_SERVICE_URL") + "create-checkout-session/"
            )
            logger.info(
                "Forwarding checkout session creation request to payment service"
            )

            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.post(
                payment_service_url, json=request.data, headers=headers
            )

            if response.status_code >= 400:
                logger.error(f"Payment service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward request to payment service: {str(e)}")
            return Response(
                {"error": "Failed to connect to payment service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class WebhookView(APIView):
    def post(self, request):
        try:
            payment_service_url = os.getenv("PAYMENT_SERVICE_URL") + "webhook/"
            logger.info("Forwarding webhook request to payment service")

            raw_body = request.body
            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.post(
                payment_service_url, data=raw_body, headers=headers
            )

            if response.status_code >= 400:
                logger.error(f"Payment service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to forward webhook to payment service: {str(e)}")
            return Response(
                {"error": "Failed to connect to payment service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class StripeAccountView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request, user_id):
        try:
            payment_service_url = (
                os.getenv("PAYMENT_SERVICE_URL") + f"stripe-account/{user_id}/"
            )
            logger.info(
                f"Forwarding Stripe account fetch request to payment service for user {user_id}"
            )

            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.get(payment_service_url, headers=headers)

            if response.status_code >= 400:
                logger.error(f"Payment service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(
                f"Failed to forward Stripe account fetch request to payment service: {str(e)}"
            )
            return Response(
                {"error": "Failed to connect to payment service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        try:
            payment_service_url = os.getenv("PAYMENT_SERVICE_URL") + "stripe-account/"
            logger.info("Forwarding Stripe account creation request to payment service")

            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.post(
                payment_service_url, json=request.data, headers=headers
            )

            if response.status_code >= 400:
                logger.error(f"Payment service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(
                f"Failed to forward Stripe account creation request to payment service: {str(e)}"
            )
            return Response(
                {"error": "Failed to connect to payment service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class WithdrawView(APIView):
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        try:
            payment_service_url = os.getenv("PAYMENT_SERVICE_URL") + "withdraw/"
            logger.info("Forwarding withdrawal request to payment service")

            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.post(
                payment_service_url, json=request.data, headers=headers
            )

            if response.status_code >= 400:
                logger.error(f"Payment service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(
                f"Failed to forward withdrawal request to payment service: {str(e)}"
            )
            return Response(
                {"error": "Failed to connect to payment service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class TransactionsView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request, user_id=None):
        try:
            if user_id:
                payment_service_url = (
                    os.getenv("PAYMENT_SERVICE_URL") + f"transactions/{user_id}/"
                )
                logger.info(
                    f"Forwarding transactions fetch request to payment service for user {user_id}"
                )
            else:
                payment_service_url = os.getenv("PAYMENT_SERVICE_URL") + "transactions/"
                logger.info(
                    "Forwarding transactions fetch request to payment service for all users"
                )

            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.get(payment_service_url, headers=headers)

            if response.status_code >= 400:
                logger.error(f"Payment service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(
                f"Failed to forward transactions fetch request to payment service: {str(e)}"
            )
            return Response(
                {"error": "Failed to connect to payment service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class EscrowView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            payment_service_url = os.getenv("PAYMENT_SERVICE_URL") + "escrow/"
            logger.info("Forwarding escrow details fetch request to payment service")

            headers = {
                key: value
                for key, value in request.headers.items()
                if key != "Content-Type"
            }
            response = requests.get(payment_service_url, headers=headers)

            if response.status_code >= 400:
                logger.error(f"Payment service returned error: {response.status_code}")

            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(
                f"Failed to forward escrow details fetch request to payment service: {str(e)}"
            )
            return Response(
                {"error": "Failed to connect to payment service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
