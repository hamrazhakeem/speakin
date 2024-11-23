from django.urls import path
from .views import *

urlpatterns = [
    path('create-checkout-session/', CreateCheckoutSessionView.as_view()),
    path('webhook/', WebhookView.as_view()),
]