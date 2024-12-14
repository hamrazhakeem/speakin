from django.db import models

# Create your models here.

class Message(models.Model):
    sender_id = models.IntegerField()  # Foreign key to User Service
    recipient_id = models.IntegerField()  # Foreign key to User Service
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']