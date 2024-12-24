from django.urls import path
from .views import *

urlpatterns = [
    path('create-checkout-session/', CreateCheckoutSession.as_view()),
    path('webhook/', StripeWebhook.as_view()),
    path('stripe-account/<int:user_id>/', StripeAccountDetailView.as_view()),
    path('stripe-account/', StripeAccountListView.as_view()),
    path('withdraw/', WithdrawView.as_view()),
    path('transactions/<int:user_id>/', TransactionsDetailView.as_view()),
]