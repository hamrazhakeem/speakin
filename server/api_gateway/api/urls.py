from django.urls import path
from . import views

urlpatterns = [
    path('sign_up/', views.sign_up, name='sign_up'),
    path('verify_otp/', views.verify_otp, name='verify_otp'),
    path('sign_in/', views.sign_in, name='sign_in'),
    path('token_refresh/', views.token_refresh, name='token_refresh'),
    path('resend_otp/', views.resend_otp, name='resend_otp'),
    path('forgot_password/', views.forgot_password, name='forgot_password'),
    path('forgot_password_verify_otp/', views.forgot_password_verify_otp, name='forgot_password_verify_otp'),
    path('set_new_password/', views.set_new_password, name='set_new_password'),
    path('resend_forgot_password_otp/', views.resend_forgot_password_otp, name='resend_forgot_password_otp'),
    path('get_user/<int:id>/', views.get_user, name='get_user'),
    path('update_user/<int:id>/', views.update_user, name='update_user'),
    path('admin_signin/', views.admin_signin, name='admin_signin'),
]
