from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Message
from rest_framework import status
from .serializers import MessageSerializer
from django.db.models import Q

class MessageUsersView(APIView):
    def get(self, request, user_id, *args, **kwargs):
        partners = Message.objects.filter(
            Q(sender_id=user_id) | Q(recipient_id=user_id)
        ).values('sender_id', 'recipient_id').distinct()
        
        # Process and return unique partner IDs
        unique_partners = set()
        for partner in partners:
            if partner['sender_id'] != user_id:
                unique_partners.add(partner['sender_id'])
            if partner['recipient_id'] != user_id:
                unique_partners.add(partner['recipient_id'])
        
        return Response(list(unique_partners))