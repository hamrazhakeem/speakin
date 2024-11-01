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
    path('users/<int:id>/', views.users, name='users'),
    path('update_user/<int:id>/', views.update_user, name='update_user'),
    path('admin_signin/', views.admin_signin, name='admin_signin'),
    path('get_countries/', views.get_countries, name='get_countries'),
    path('get_platform_languages/', views.get_platform_languages, name='get_platform_languages'),
    path('get_spoken_languages/', views.get_spoken_languages, name='get_spoken_languages'),
    path('tutor_request/', views.tutor_request, name='tutor_request'),
    path('get_users/', views.get_users, name='get_users'),
    path('block_unblock_user/<int:id>/', views.block_unblock_user, name='block_unblock_user'),
    path('approve_tutor/<int:id>/', views.approve_tutor, name='approve_tutor'),
    path('deny_tutor/<int:id>/', views.deny_tutor, name='deny_tutor'),
    path('tutor_sign_in/', views.tutor_sign_in, name='tutor_sign_in'),
    path('change_password/', views.change_password, name='change_password'),
    path('edit_teaching_language/', views.edit_teaching_language, name='edit_teaching_language'),
    path('language_change_requests/', views.language_change_requests, name='language_change_requests'),
    path('approve_language_change/<int:id>/', views.approve_language_change, name='approve_language_change'),
    path('deny_language_change/<int:id>/', views.deny_language_change, name='deny_language_change'),
    path('google_sign_in/', views.google_sign_in, name='google_sign_in')
]
