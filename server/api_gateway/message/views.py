# import asyncio
# import websockets
# from django.http import HttpResponseNotAllowed
# from django.views import View
# from django.core.asgi import ASGIHandler
from rest_framework.views import APIView
from auth.authentication import JWTAuthentication
import os
import requests
from rest_framework.response import Response
from rest_framework import status

# class WebSocketProxy(View):
#     """
#     Forwards WebSocket connections from the API Gateway to the Message Service.
#     """

#     async def proxy_websocket(self, client_websocket, message_service_url):
#         """
#         Proxy messages between the client WebSocket and the Message Service WebSocket.
#         """
#         try:
#             # Connect to the Message Service WebSocket
#             async with websockets.connect(message_service_url) as service_websocket:
#                 # Task: Forward messages from client to service
#                 async def client_to_service():
#                     async for message in client_websocket:
#                         await service_websocket.send(message) 

#                 # Task: Forward messages from service to client
#                 async def service_to_client():
#                     async for message in service_websocket:
#                         await client_websocket.send(message)

#                 # Run both tasks concurrently
#                 await asyncio.gather(client_to_service(), service_to_client())
#         except Exception as e:
#             print(f"WebSocket Proxy Error: {e}")
#             await client_websocket.close()

#     async def handle_websocket(self, scope, receive, send):
#         """
#         Handles WebSocket connection and forwards it to the Message Service.
#         """
#         message_service_url = "ws://localhost:8000/ws/chat/chat_room/"  # Update with actual Message Service URL
#         client_websocket = websockets.WebSocketCommonProtocol()
#         await client_websocket.accept(receive, send)

#         # Proxy traffic between client and message service
#         await self.proxy_websocket(client_websocket, message_service_url)

#     def dispatch(self, request, *args, **kwargs):
#         """
#         Intercepts WebSocket connections and delegates them to the proxy handler.
#         """
#         if request.method == 'GET' and request.META.get('HTTP_UPGRADE', '').lower() == 'websocket':
#             # Handle WebSocket requests via ASGI
#             return ASGIHandler()(request.scope, self.handle_websocket)
#         return HttpResponseNotAllowed(['GET'])

class MessageView(APIView):
    authentication_classes = [JWTAuthentication]
    def get(self, request, user_id):
        try:
            message_service_url = os.getenv('MESSAGE_SERVICE_URL') + f'messages/users/{user_id}/'
            response = requests.get(message_service_url, json=request.data)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to connect to session service.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )  