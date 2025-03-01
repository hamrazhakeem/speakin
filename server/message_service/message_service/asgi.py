"""
ASGI config for message_service project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from message import routing
from message.channels_middleware import JWTWebsocketMiddleware

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "message_service.settings")

application = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": application,
        "websocket": JWTWebsocketMiddleware(
            AuthMiddlewareStack(URLRouter(routing.websocket_urlpatterns))
        ),
    }
)
