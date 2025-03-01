from django.db import models

# Create your models here.


class Message(models.Model):
    sender_id = models.IntegerField()
    recipient_id = models.IntegerField()
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["timestamp"]


class Notification(models.Model):
    recipient_id = models.IntegerField()
    sender_id = models.IntegerField()
    message = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        db_table = "message_notification"
        ordering = ["-timestamp"]
