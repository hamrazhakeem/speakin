from rest_framework import serializers
from .models import Transactions

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