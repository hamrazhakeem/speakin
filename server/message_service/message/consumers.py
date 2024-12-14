import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.core.exceptions import PermissionDenied

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # token = self.scope['query_string'].decode().split('=')[-1]  # Extract token after '?token='
        # print('token', token)
        # if not token:
        #     await self.close()  # Close the connection if no token is provided
        #     return
        
        try:
            # Decode the token and extract user ID
            # user_id = get_user_id.get_user_id(token)
            user = self.scope['user']

            print('user', user)
            chat_with_user = self.scope['url_route']['kwargs']['chat_id']
            user_ids = [int(user.id), int(chat_with_user)]
            user_ids = sorted(user_ids)
            self.room_group_name = f"chat_{user_ids[0]}--{user_ids[1]}"
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
 
            # Accept the connection
            await self.accept()

        except Exception as e:
            print(f"Connection failed: {str(e)}")
            await self.close()

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        message = data['message']
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def disconnect(self, code):
        self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))


# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.chat_id = self.scope['url_route']['kwargs']['chat_id']
#         self.room_group_name = f'chat_{self.chat_id}'

#         await self.channel_layer.group_add(
#             self.room_group_name,
#             self.channel_name
#         )

#         await self.accept()

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(
#             self.room_group_name,
#             self.channel_name
#         )

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         message = data['message']

#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 'type': 'chat_message',
#                 'message': message
#             }
#         )

#     async def chat_message(self, event):
#         message = event['message']
#         await self.send(text_data=json.dumps({
#             'message': message
#         }))