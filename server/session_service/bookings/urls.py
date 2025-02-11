from django.urls import path
from .views import *

urlpatterns = [
    path('tutor-availabilities/', TutorAvailabilityList.as_view()),
    path('tutor-availabilities/<int:pk>/', TutorAvailabilityDetail.as_view()), 
    path('bookings/', BookingsList.as_view()),
    path('bookings/<int:pk>/', BookingsDetail.as_view()), 
    path('create-daily-room/', DailyRoomCreateView.as_view()),
    path('reports/', ReportList.as_view()),
    path('reports/<int:pk>/', ReportList.as_view()),
    path('reports/respond/<int:pk>/', ReportDetail.as_view()),
]