from rest_framework import serializers
from .models import Transactions, StripeAccount

class TransactionsSerializer(serializers.ModelSerializer):
    price_per_credit = serializers.FloatField(write_only=True)
    currency = serializers.CharField(max_length=10, write_only=True)
    class Meta:
        model = Transactions
        fields = ['id', 'user_id', 'amount', 'purchased_credits', 'transaction_type', 'transaction_date', 'status', 'reference_id', 'price_per_credit', 'currency']
        read_only_fields = ['id', 'transaction_date']

    def validate_amount(self, amount):
        if amount <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return amount

    def validate(self, data):
        if data.get('transaction_type') == 'refund' and data.get('status') != 'completed':
            raise serializers.ValidationError("Refund transactions must have a status of 'completed'.")
        return data
    
class StripeAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = StripeAccount
        fields = ['id', 'user_id', 'stripe_account_id', 'is_verified']

class WithdrawalSerializer(serializers.Serializer):
    credits = serializers.IntegerField(min_value=1)
    
    def validate_credits(self, value):
        # Access the raw data using self.initial_data before validation
        balance_credits = self.initial_data.get('balance_credits')
        
        if balance_credits is None:
            raise serializers.ValidationError("Balance credits data is missing.")
        
        if value > balance_credits:
            raise serializers.ValidationError("Insufficient credits balance")
        
        return value
