from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ")  # ISO format

    class Meta:
        model = Message
        fields = '__all__'