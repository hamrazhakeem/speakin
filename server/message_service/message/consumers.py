import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            user = self.scope['user']
            chat_with_user = self.scope['url_route']['kwargs']['chat_id']
            user_ids = [int(user.id), int(chat_with_user)]
            user_ids = sorted(user_ids)
            self.private_chat_room = f"chat_{user_ids[0]}--{user_ids[1]}"

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

        except Exception as e:
            print(f"Connection failed: {str(e)}")
            await self.close()

    async def receive(self, text_data=None, bytes_data=None):
        try:
            data = json.loads(text_data)
            message_content = data['message']
            recipient_id = int(self.scope['url_route']['kwargs']['chat_id'])
            sender_id = self.scope['user'].id 

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
        except Exception as e:
            print(f"Error in receive: {str(e)}")

    async def disconnect(self, code):
        self.channel_layer.group_discard(
            self.private_chat_room,
            self.channel_name
        )

    async def chat_message(self, event):
        message = event['message']
        sender_id = event['sender_id'] 
        await self.send(text_data=json.dumps({
            'message': message,
            'sender_id': sender_id
        }))

    async def new_conversation(self, event):
        """Handle new conversation notifications"""
        await self.send(text_data=json.dumps({
            "type": "new_conversation",
            "user_id": event["user_id"]
        }))

    @sync_to_async
    def save_message(self, sender_id, recipient_id, content):
        """Save the message to the database."""
        Message.objects.create(
            sender_id=sender_id,
            recipient_id=recipient_id,
            content=content
        )