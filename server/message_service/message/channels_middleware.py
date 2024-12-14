# import json
# import base64
# from django.core.exceptions import PermissionDenied
# from channels.middleware import BaseMiddleware
# from rest_framework.exceptions import AuthenticationFailed
# from django.db import close_old_connections

# class JWTAuthentication():
#     @database_sync_to_async
#     def authenticate_websocket(self, scope, token):
#         try:
#             payload = jwt.decode(token , settings.SECRET_KEY, algorithms=['HS256'])
#             self.verify_token(payload=payload)

#             user_id = payload['user_id']
#             user = User.objects.get(id=user_id)
#             return user
#         except (InvalidTokenError, ExpiredSignatureError, User.DoesNotExist):
#             raise AuthenticationFailed("Invalid Token")

# class JWTWebsocketMiddleware(BaseMiddleware):
#     async def __call__(self, scope, receive, send):
#         close_old_connections()

#         query_string = scope.get("query_string", b"").decode('utf-8')
#         query_parameters = dict(qp.split("=") for qp in query_string.split("&"))
#         token = query_parameters.get("token", None)

#         if not token:
#             await send({
#                 "type": "websocket.close",
#                 "code": 4000
#             })

#         authentication = JWTAuthentication()
#         try: 
#             user = await authentication.authenticate_websocket(scope, token)
#             if user is not None:
#                 scope["user"] = user
#             else:
#                 await send({
#                     "type": "websocket.close",
#                     "code": 4000
#                 })
#             return await super().__call__(scope, receive, send)
#         except AuthenticationFailed:
#             await send({
#                 "type": "websocket.close",
#                 "code": 4002
#             })

# def decode_jwt(self, token):
#     """Decodes the JWT and returns the payload."""
#     try:
#         parts = token.split('.')
#         if len(parts) != 3:
#             raise ValueError("Invalid JWT format")

#         payload_base64 = parts[1]
#         # Fix padding for base64 decoding
#         payload_base64 += '=' * ((4 - len(payload_base64) % 4) % 4)
#         payload_json = base64.urlsafe_b64decode(payload_base64)
#         payload = json.loads(payload_json)
#         return payload
#     except (ValueError, json.JSONDecodeError) as e:
#         print(f"Failed to decode JWT: {str(e)}")
#         raise PermissionDenied("Invalid token")

# def get_user_id(token):
#     payload = decode_jwt(token)
#     user_id = payload.get('user_id')
#     return user_id

from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.db import close_old_connections
from django.core.exceptions import PermissionDenied
from .authentication import JWTAuthentication

class JWTWebsocketMiddleware(BaseMiddleware):
    """Middleware to authenticate WebSocket connections using JWT."""

    async def __call__(self, scope, receive, send):
        close_old_connections()

        # Extract token from query parameters
        query_string = scope.get("query_string", b"").decode("utf-8")
        query_parameters = dict(qp.split("=") for qp in query_string.split("&"))
        token = query_parameters.get("token", None)

        if not token:
            await send({
                "type": "websocket.close",
                "code": 4000  # Missing token
            })
            return

        authentication = JWTAuthentication()
        try:
            # Authenticate the token
            user = await authentication.authenticate_websocket(token)
            if user:
                # Attach the payload (or user_id) to the scope
                scope["user"] = user
            else:
                await send({
                    "type": "websocket.close",
                    "code": 4000  # Authentication failed
                })
                return 

            # Call the next middleware or consumer
            return await super().__call__(scope, receive, send)
        except PermissionDenied:
            await send({
                "type": "websocket.close",
                "code": 4002  # Invalid token
            })
