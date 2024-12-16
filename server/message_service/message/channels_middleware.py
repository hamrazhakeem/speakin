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
