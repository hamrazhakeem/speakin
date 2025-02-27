import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message
import logging

# Get logger for the message app
logger = logging.getLogger('message')

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            user = self.scope['user']
            chat_with_user = self.scope['url_route']['kwargs']['chat_id']
            user_ids = [int(user.id), int(chat_with_user)]
            user_ids = sorted(user_ids)
            self.private_chat_room = f"chat_{user_ids[0]}--{user_ids[1]}"

            logger.info(f"WebSocket connection attempt: user {user.id} connecting to chat with user {chat_with_user}")

            # Notify both users about the new conversation
            await self.channel_layer.group_send(
                f"user_{chat_with_user}",
                {
                    "type": "new_conversation",
                    "user_id": user.id
                }
            )
            
            await self.channel_layer.group_send(
                f"user_{user.id}",
                {
                    "type": "new_conversation",
                    "user_id": chat_with_user
                }
            )

            await self.channel_layer.group_add(
                self.private_chat_room,
                self.channel_name
            )

            await self.accept()
            logger.info(f"WebSocket connection established for chat room: {self.private_chat_room}")

        except Exception as e:
            logger.error(f"WebSocket connection failed: {str(e)}")
            await self.close()

    async def receive(self, text_data=None, bytes_data=None):
        try:
            data = json.loads(text_data)
            message_content = data['message']
            recipient_id = int(self.scope['url_route']['kwargs']['chat_id'])
            sender_id = self.scope['user'].id 

            logger.info(f"Received message from user {sender_id} to user {recipient_id}")

            # Save the message to the database
            await self.save_message(sender_id, recipient_id, message_content)

            # Send the message to the private chat
            await self.channel_layer.group_send(
                self.private_chat_room,
                {
                    'type': 'chat_message',
                    'message': message_content,
                    'sender_id': sender_id
                }
            )
            logger.debug(f"Message sent to chat room: {self.private_chat_room}")
        except Exception as e:
            logger.error(f"Error processing received message: {str(e)}")

    async def disconnect(self, code):
        logger.info(f"WebSocket disconnecting from chat room: {self.private_chat_room}")
        await self.channel_layer.group_discard(
            self.private_chat_room,
            self.channel_name
        )
        logger.info(f"WebSocket disconnected from chat room: {self.private_chat_room}")

    async def chat_message(self, event):
        message = event['message']
        sender_id = event['sender_id']
        logger.debug(f"Broadcasting message from user {sender_id} to chat room: {self.private_chat_room}")
        await self.send(text_data=json.dumps({
            'message': message,
            'sender_id': sender_id
        }))

    async def new_conversation(self, event):
        """Handle new conversation notifications"""
        logger.info(f"Sending new conversation notification for user {event['user_id']}")
        await self.send(text_data=json.dumps({
            "type": "new_conversation",
            "user_id": event["user_id"]
        }))

    @sync_to_async
    def save_message(self, sender_id, recipient_id, content):
        """Save the message to the database."""
        try:
            Message.objects.create(
                sender_id=sender_id,
                recipient_id=recipient_id,
                content=content
            )
            logger.info(f"Message saved to database: from user {sender_id} to user {recipient_id}")
        except Exception as e:
            logger.error(f"Failed to save message to database: {str(e)}")