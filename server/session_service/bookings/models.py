from django.db import models

# Create your models here.

class TutorAvailability(models.Model):
    SESSION_TYPE_CHOICES = (
        ('trial', 'Trial'), 
        ('standard', 'Standard'),
    )
    tutor_id = models.IntegerField()
    session_type = models.CharField(choices=SESSION_TYPE_CHOICES, max_length=8)
    language_to_teach = models.CharField(max_length=100)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    credits_required = models.IntegerField()
    is_booked = models.BooleanField(default=False)
    created_at =  models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

class Bookings(models.Model):
    BOOKING_STATUS_CHOICES = (
        ('confirmed', 'Confirmed'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('canceled_by_tutor', 'Canceled by Tutor'),
        ('canceled_by_student', 'Canceled by Student'),
        ('no_show_by_tutor', 'No-show by Tutor'),
        ('no_show_by_student', 'No-show by Student'),
    )
    availability = models.ForeignKey(TutorAvailability, related_name='bookings', on_delete=models.CASCADE)
    student_id = models.IntegerField()
    booking_status = models.CharField(choices=BOOKING_STATUS_CHOICES, max_length=25)
    canceled_at = models.DateTimeField(null=True, blank=True)
    refund_status = models.BooleanField(default=False)
    video_call_link = models.CharField(max_length=255, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']