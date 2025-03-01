from django.urls import path
from .views import *

urlpatterns = [
    path("messages/chat-users/<int:user_id>/", MessageView.as_view()),
    path("messages/history/<int:user_id>/<int:selected_id>/", MessageView.as_view()),
    path("notifications/<int:user_id>/", NotificationView.as_view()),
    path("notifications/count/<int:user_id>/", NotificationCountView.as_view()),
    path("notifications/clear/<int:user_id>/", NotificationClearView.as_view()),
]
