from django.urls import path
from .views import *

urlpatterns = [
    path('create-checkout-session/', CreateCheckoutSessionView.as_view()),
    path('webhook/', WebhookView.as_view()),
    path('stripe-account/<int:user_id>/', StripeAccountView.as_view()),
    path('stripe-account/', StripeAccountView.as_view()),
    path('withdraw/', WithdrawView.as_view()),
    path('transactions/<int:user_id>/', TransactionsView.as_view()),
    path('transactions/', TransactionsView.as_view()),
    path('escrow/', EscrowView.as_view()),
]