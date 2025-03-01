from rest_framework.response import Response
from .models import Message, Notification
from rest_framework import status
from .serializers import MessageSerializer, NotificationSerializer
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from .permissions import IsOwner
import logging

# Get logger for the message app
logger = logging.getLogger("message")


@api_view(["GET"])
@permission_classes([IsOwner])
def get_chat_users(request, user_id):
    """
    Get all users that the current user has chatted with
    """
    try:
        logger.info(f"Retrieving chat users for user {user_id}")

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

        logger.info(f"Found {len(chat_users)} chat users for user {user_id}")
        return Response(list(chat_users), status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error retrieving chat users for user {user_id}: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([IsOwner])
def get_chat_history(request, user_id, selected_id):
    """
    Get chat history between two users
    """
    try:
        logger.info(
            f"Retrieving chat history between users {user_id} and {selected_id}"
        )

        messages = Message.objects.filter(
            (Q(sender_id=user_id) & Q(recipient_id=selected_id))
            | (Q(sender_id=selected_id) & Q(recipient_id=user_id))
        ).order_by("timestamp")

        serializer = MessageSerializer(messages, many=True)
        logger.info(
            f"Retrieved {len(messages)} messages between users {user_id} and {selected_id}"
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(
            f"Error retrieving chat history between users {user_id} and {selected_id}: {str(e)}"
        )
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([IsOwner])
def get_notifications(request, user_id):
    """
    Get all notifications for a user
    """
    try:
        notifications = Notification.objects.filter(recipient_id=user_id).order_by(
            "-timestamp"
        )
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error retrieving notifications: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([IsOwner])
def get_notification_count(request, user_id):
    try:
        count = Notification.objects.filter(recipient_id=user_id, is_read=False).count()
        return Response({"count": count}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error retrieving notification count: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["DELETE"])
@permission_classes([IsOwner])
def clear_all_notifications(request, user_id):
    try:
        Notification.objects.filter(recipient_id=user_id).delete()
        return Response(
            {"message": "All notifications cleared"}, status=status.HTTP_200_OK
        )
    except Exception as e:
        logger.error(f"Error clearing notifications: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
