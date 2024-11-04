from django.urls import path
from .views import *

urlpatterns = [
    path('create_checkout_session/', CreateCheckoutSession.as_view(), name='create_checkout_session'),
    path('webhook/', StripeWebhook.as_view(), name='webhook'),
]