from django.urls import path
from .views import *

urlpatterns = [
    path('tutor-availabilities/', TutorAvailabilityList.as_view()),
    path('tutor-availabilities/<int:pk>/', TutorAvailabilityDetail.as_view()), 
    path('bookings/', BookingsList.as_view()),
    path('bookings/student/<int:student_id>/', BookingsDetail.as_view()),
]