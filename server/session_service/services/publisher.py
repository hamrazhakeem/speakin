import pika
import json
import time
import logging
import os
from enum import Enum

logger = logging.getLogger(__name__)


class NotificationType(Enum):
    BOOKING = "booking"
    CANCELLATION = "cancellation"


class RabbitMQPublisher:
    def __init__(self):
        self.max_retries = 3
        self.credentials = pika.PlainCredentials(
            os.getenv("RABBITMQ_USER"), os.getenv("RABBITMQ_PASS")
        )
        self.queue_name = "session_notifications"

    def _get_connection(self):
        return pika.BlockingConnection(
            pika.ConnectionParameters(
                host="rabbitmq",
                credentials=self.credentials,
                heartbeat=600,
                blocked_connection_timeout=300,
            )
        )

    def publish_notification(self, notification_data, notification_type):
        retry_count = 0
        while retry_count < self.max_retries:
            try:
                connection = self._get_connection()
                channel = connection.channel()

                message = {
                    "type": notification_type.value,
                    "data": notification_data,
                    "timestamp": time.time(),
                }

                channel.queue_declare(queue=self.queue_name, durable=True)

                channel.basic_publish(
                    exchange="",
                    routing_key=self.queue_name,
                    body=json.dumps(message),
                    properties=pika.BasicProperties(
                        delivery_mode=2, content_type="application/json"
                    ),
                )
                connection.close()
                return True
            except Exception as e:
                retry_count += 1
                if retry_count == self.max_retries:
                    logger.error(
                        f"Failed to publish message after {self.max_retries} attempts: {e}"
                    )
                    return False
                time.sleep(2**retry_count)
