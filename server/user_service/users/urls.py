from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('sign_up/', sign_up, name='sign_up'),
    path('verify_otp/', verify_otp, name='verify_otp'),
    path('sign_in/', sign_in, name='sign_in'),
    path('resend_otp/', resend_otp, name='resend_otp'),
    path('forgot_password/', forgot_password, name='forgot_password'),
    path('forgot_password_verify_otp/', forgot_password_verify_otp, name='forgot_password_verify_otp'),
    path('set_new_password/', set_new_password, name='set_new_password'),
    path('resend_forgot_password_otp/', resend_forgot_password_otp, name='resend_forgot_password_otp'),
    path('get_user/<int:id>/', UserProfileView.as_view() , name='get_user'),
    path('update_user/<int:id>/', UserUpdateView.as_view(), name='update_user'),
    path('admin_signin/', admin_signin, name='admin_signin'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]