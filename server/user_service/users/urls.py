from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('sign-up/', sign_up),
    path('verify-otp/', verify_otp),
    path('sign-in/', sign_in),
    path('google-sign-in/', LoginWithGoogle.as_view()),
    path('tutor-sign-in/', tutor_sign_in),
    path('tutor-request/', tutor_request),
    path('admin-sign-in/', admin_signin),
    path('resend-otp/', resend_otp),
    path('forgot-password/', forgot_password),
    path('forgot-password-verify-otp/', forgot_password_verify_otp),
    path('forgot-password-resend-otp/', resend_forgot_password_otp),
    path('set-new-password/', set_new_password),
    path('token/refresh/', TokenRefreshView.as_view()), 

    path('users/', UserList.as_view()),
    path('users/<int:pk>/', UserDetail.as_view()),
    path('tutor-details/<int:pk>/', TutorDetail.as_view()),
    path('users/<int:pk>/balance/', UserBalance.as_view()),
    path('change-password/', ChangePassword.as_view()),

    path('users/<int:pk>/verify-tutor/', TutorRequest.as_view()),

    path('countries/', CountryList.as_view()),
    path('platform-languages/', PlatformLanguageList.as_view()),
    path('spoken-languages/', SpokenLanguageList.as_view()),
    
    path('teaching-language-change-requests/', TeachingLanguageChangeRequestList.as_view()),
    path('teaching-language-change-requests/<int:pk>/', TeachingLanguageChangeRequestDetail.as_view()),
] 