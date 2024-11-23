from django.urls import path
from .views import *

urlpatterns = [
    path('tutor-availabilities/', TutorAvailabilityView.as_view()),
    path('tutor-availabilities/<int:pk>/', TutorAvailabilityView.as_view()),
    path('bookings/', BookingsView.as_view())
]