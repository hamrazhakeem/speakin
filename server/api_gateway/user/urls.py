from django.urls import path
from .views import *

urlpatterns = [
    path('sign-up/', UserSignUpView.as_view()),
    path('sign-in/', UserSignInView.as_view()),
    path('google-sign-in/', GoogleSignInView.as_view()),
    path('tutor-sign-in/', TutorSignInView.as_view()),
    path('tutor-request/', TutorRequestView.as_view()),
    path('admin/sign-in/', AdminSignInView.as_view()),
    path('verify-otp/', UserVerifyOtpView.as_view()),
    path('resend-otp/', UserResendOtpView.as_view()),
    path('forgot-password/', UserForgotPasswordView.as_view()),
    path('forgot-password-verify-otp/', UserForgotPasswordVerifyOtpView.as_view()),
    path('forgot-password-resend-otp/', UserForgotPasswordResendOtpView.as_view()),
    path('set-new-password/', UserSetNewPasswordView.as_view()),
    path('change-password/', UserChangePasswordView.as_view()),
    path('token/refresh/', UserTokenRefreshView.as_view()),
    path('users/', UserView.as_view()),
    path('users/<int:pk>/', UserView.as_view()),
    path('users/<int:pk>/verify-tutor/', UserView.as_view()),
    path('teaching-language-change-requests/', TeachingLanguageChangeRequestView.as_view()),
    path('teaching-language-change-requests/<int:pk>/', TeachingLanguageChangeRequestView.as_view()),
    path('platform-languages/', PlatformLanguageView.as_view()),
    path('spoken-languages/', SpokenLanguageView.as_view()),
    path('countries/', CountryView.as_view()),
]