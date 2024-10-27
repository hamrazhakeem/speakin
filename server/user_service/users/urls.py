from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

urlpatterns = [
    path('sign_up/', sign_up, name='sign_up'),
    path('verify_otp/', verify_otp, name='verify_otp'),
    path('sign_in/', sign_in, name='sign_in'),
    path('resend_otp/', resend_otp, name='resend_otp'),
    path('forgot_password/', forgot_password, name='forgot_password'),
    path('forgot_password_verify_otp/', forgot_password_verify_otp, name='forgot_password_verify_otp'),
    path('set_new_password/', set_new_password, name='set_new_password'),
    path('resend_forgot_password_otp/', resend_forgot_password_otp, name='resend_forgot_password_otp'),
    path('admin_signin/', admin_signin, name='admin_signin'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 

    path('users/', UserList.as_view()),
    path('users/<int:pk>/', UserDetail.as_view()),
    path('block_unblock_user/<int:id>/', BlockUnblockUserView.as_view(), name='block_unblock_user'),
    path('change_password/', ChangePasswordView.as_view(), name='change_password'),
    path('verify_language_change/<int:id>/', TeachingLanguageChangeRequestView.as_view(), name='language_change_requests'),

    path('get_countries/', CountryListView.as_view(), name='get_countries'),
    path('get_platform_languages/', PlatformLanguageListView.as_view(), name='get_platform_languages'),
    path('get_spoken_languages/', SpokenLanguageListView.as_view(), name='get_spoken_languages'),
    path('tutor_request/', tutor_request, name='tutor_request'),
    path('language_change_requests/', TeachingLanguageChangeRequestView.as_view(), name='language_change_requests'),

    path('tutor_sign_in/', tutor_sign_in, name='tutor_sign_in'),
    path('edit_teaching_language/<int:id>/', TeachingLanguageChangeRequestView.as_view(), name='edit_teaching_language'),
]