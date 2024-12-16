from django.urls import path
from . import views

urlpatterns = [
    path('messages/chat-users/<int:user_id>/', views.get_chat_users),
    path('messages/history/<int:user_id>/<int:selected_id>/', views.get_chat_history)
]