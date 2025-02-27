import os
import django
import pika
import json
import time
from datetime import datetime
from typing import Dict, Any
from enum import Enum
import logging

# Get logger for the user app
logger = logging.getLogger('users')

class NotificationType(Enum):
    BOOKING = 'booking'
    CANCELLATION = 'cancellation'

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'user_service.settings')
django.setup()

from users.services import EmailService

class SessionNotificationConsumer:
    def __init__(self):
        self.email_service = EmailService()
        logger.info("Initializing SessionNotificationConsumer")
        self.connect()

    def connect(self):
        while True:
            try:
                logger.info("Attempting to connect to RabbitMQ")
                credentials = pika.PlainCredentials(
                    os.getenv('RABBITMQ_USER'),
                    os.getenv('RABBITMQ_PASS')
                )
                self.connection = pika.BlockingConnection(
                    pika.ConnectionParameters(
                        host='rabbitmq',
                        credentials=credentials,
                        heartbeat=600,
                        blocked_connection_timeout=300
                    )
                )
                self.channel = self.connection.channel()
                
                logger.debug("Declaring DLX exchange and queue")
                self.channel.exchange_declare(exchange='dlx', exchange_type='direct')
                self.channel.queue_declare(queue='failed_notifications', durable=True)
                self.channel.queue_bind(
                    queue='failed_notifications',
                    exchange='dlx',
                    routing_key='failed_notifications'
                )                

                self.channel.queue_declare(queue='session_notifications', durable=True)
                self.channel.basic_qos(prefetch_count=1)
                self.email_service = EmailService()
                logger.info('Successfully connected to RabbitMQ')
                break
            except Exception as e:
                logger.error(f"Failed to connect to RabbitMQ: {str(e)}")
                time.sleep(5)

    def process_booking_notification(self, data: Dict[str, Any]) -> None:
        """Handle booking notifications"""
        logger.info(f"Processing booking notification for booking {data.get('booking_data', {}).get('id')}")
        self.email_service.send_booking_notification_email(
            data['booking_data'],
            data['tutor_data']
        )
        logger.debug("Booking notification email sent successfully")

    def process_cancellation_notification(self, data: Dict[str, Any]) -> None:
        """Handle cancellation notifications"""
        logger.info(f"Processing cancellation notification for session with student {data.get('student_name')}")
        self.email_service.send_cancellation_notification_email(
            cancelled_by=data['cancelled_by'],
            student_name=data['student_name'],
            student_email=data['student_email'],
            tutor_name=data['tutor_name'],
            tutor_email=data['tutor_email'],
            session_type=data['session_type'],
            start_time=datetime.fromisoformat(data['start_time']),
            language=data['language'],
            credits_required=data['credits_required']
        )
        logger.debug("Cancellation notification email sent successfully")

    def callback(self, ch, method, properties, body):
        try:
            message = json.loads(body)
            logger.info(f"Received message of type: {message.get('type')}")

            if message['type'] == NotificationType.CANCELLATION.value:
                self.email_service.send_cancellation_notification_email(message['data'])
            elif message['type'] == NotificationType.BOOKING.value:
                self.email_service.send_booking_notification_email(
                    message['data']['booking_data'],
                    message['data']['tutor_data']
                )
            
            ch.basic_ack(delivery_tag=method.delivery_tag)
            logger.debug("Message processed and acknowledged")
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            # Reject the message and requeue if it's not been redelivered
            ch.basic_reject(delivery_tag=method.delivery_tag, requeue=not method.redelivered)

    def start_consuming(self):
        while True:
            try:
                logger.info("Starting to consume session notifications...")
                self.channel.basic_consume(
                    queue='session_notifications',
                    on_message_callback=self.callback
                )
                self.channel.start_consuming()
            except Exception as e:
                logger.error(f"Consumer connection lost: {str(e)}")
                time.sleep(5)
                self.connect()

if __name__ == '__main__':
    consumer = SessionNotificationConsumer()
    consumer.start_consuming()