from django.urls import path
from .views import *

urlpatterns = [
    path('create-checkout-session/', CreateCheckoutSession.as_view()),
    path('webhook/', StripeWebhook.as_view()),
]