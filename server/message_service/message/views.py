from rest_framework.response import Response
from .models import Message
from rest_framework import status
from .serializers import MessageSerializer
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from .permissions import IsOwner

@api_view(['GET'])
@permission_classes([IsOwner])
def get_chat_users(request, user_id):
    """
    Get all users that the current user has chatted with
    """
    try:
        # Get all messages where user is either sender or recipient
        messages = Message.objects.filter(
            Q(sender_id=user_id) | Q(recipient_id=user_id)
        )

        # Extract unique user IDs
        chat_users = set()
        for message in messages:
            if message.sender_id != user_id:
                chat_users.add(message.sender_id)
            if message.recipient_id != user_id:
                chat_users.add(message.recipient_id)

        return Response(list(chat_users), status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsOwner])
def get_chat_history(request, user_id, selected_id):
    """
    Get chat history between two users
    """
    try:
        messages = Message.objects.filter(
            (Q(sender_id=user_id) & Q(recipient_id=selected_id)) |
            (Q(sender_id=selected_id) & Q(recipient_id=user_id))
        ).order_by('timestamp')

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )