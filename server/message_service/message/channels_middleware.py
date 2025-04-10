from channels.middleware import BaseMiddleware
from django.db import close_old_connections
from django.core.exceptions import PermissionDenied
from .authentication import JWTAuthentication
import logging

logger = logging.getLogger("message")


class JWTWebsocketMiddleware(BaseMiddleware):
    """Middleware to authenticate WebSocket connections using JWT."""

    async def __call__(self, scope, receive, send):
        close_old_connections()

        query_string = scope.get("query_string", b"").decode("utf-8")
        query_parameters = dict(qp.split("=") for qp in query_string.split("&"))
        token = query_parameters.get("token", None)

        if not token:
            logger.warning("WebSocket connection attempt without token")
            await send({"type": "websocket.close", "code": 4000})  # Missing token
            return

        authentication = JWTAuthentication()
        try:
            user = await authentication.authenticate_websocket(token)
            if user:
                # Attach the payload (or user_id) to the scope
                scope["user"] = user
                logger.info(f"WebSocket authenticated for user {user.id}")
            else:
                logger.warning("WebSocket authentication failed: invalid credentials")
                await send(
                    {"type": "websocket.close", "code": 4000}  # Authentication failed
                )
                return

            # Call the next middleware or consumer
            return await super().__call__(scope, receive, send)
        except PermissionDenied:
            logger.error("WebSocket authentication failed: invalid token")
            await send({"type": "websocket.close", "code": 4002})  # Invalid token
