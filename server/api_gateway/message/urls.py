from django.urls import path
from .views import *

urlpatterns = [
    path('messages/users/<int:user_id>/', MessageView.as_view())
]
