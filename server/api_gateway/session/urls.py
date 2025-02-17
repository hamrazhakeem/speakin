from django.urls import path
from .views import *

urlpatterns = [
    path('tutor-availabilities/', TutorAvailabilityView.as_view()),
    path('tutor-availabilities/<int:pk>/', TutorAvailabilityView.as_view()),
    path('bookings/', BookingsView.as_view()),
    path('bookings/<int:pk>/', BookingsView.as_view()),
    path('create-daily-room/', DailyRoomCreateView.as_view()),
    path('reports/', ReportView.as_view()),
    path('reports/<int:pk>/', ReportView.as_view()),
    path('reports/respond/<int:pk>/', ReportView.as_view()),
    path('bookings/tutor-credits-history/<int:tutor_id>/', TutorCreditsHistoryView.as_view()),
]