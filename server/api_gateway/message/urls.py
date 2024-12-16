from django.urls import path
from .views import *

urlpatterns = [
    path('messages/chat-users/<int:user_id>/', MessageView.as_view()),
    path('messages/history/<int:user_id>/<int:selected_id>/', MessageView.as_view())
]
