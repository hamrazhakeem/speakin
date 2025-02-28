from rest_framework import serializers
from .models import Message, Notification

class MessageSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ")  # ISO format

    class Meta:
        model = Message
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ")

    class Meta:
        model = Notification
        fields = ['id', 'sender_id', 'message', 'timestamp', 'is_read']