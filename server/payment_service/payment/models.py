from django.db import models

# Create your models here.

class Transactions(models.Model):
    TRANSACTION_TYPE_CHOICES = [
        ('credit_purchase', 'Credit Purchase'),
        ('subscription', 'Subscription'),
        ('platform_fee', 'Platform Fee'),  # New transaction type
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('refunded', 'Refunded'),
    ]

    user_id = models.IntegerField(null=True) 
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    purchased_credits = models.IntegerField(null=True)
    transaction_type = models.CharField(max_length=50, choices=TRANSACTION_TYPE_CHOICES)
    transaction_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    reference_id = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f'Transaction {self.id} - {self.transaction_type} for user {self.user_id}'
    
class Escrow(models.Model):
    student_id = models.IntegerField()
    tutor_id = models.IntegerField()
    booking_id = models.IntegerField() 
    credits_locked = models.IntegerField()
    status = models.CharField(
        max_length=20,
        choices=[('locked', 'Locked'), ('released', 'Released'), ('refunded', 'Refunded')],
        default='locked'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    released_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Escrow Transaction for student {self.student_id}"