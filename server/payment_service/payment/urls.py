from django.urls import path
from .views import *

urlpatterns = [
    path("create-checkout-session/", CreateCheckoutSession.as_view()),
    path("webhook/", StripeWebhook.as_view()),
    path("stripe-account/<int:user_id>/", StripeAccountDetail.as_view()),
    path("stripe-account/", StripeAccountList.as_view()),
    path("withdraw/", WithdrawView.as_view()),
    path("transactions/<int:user_id>/", TransactionsDetail.as_view()),
    path("transactions/", TransactionsList.as_view()),
    path("escrow/", EscrowList.as_view()),
]
