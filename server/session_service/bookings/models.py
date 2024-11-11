from django.db import models

# Create your models here.

class TutorAvailability(models.Model):
    SESSION_TYPE_CHOICES = (
        ('trial', 'Trial'), 
        ('standard', 'Standard'),
    )
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('booked', 'Booked'),
        ('completed', 'Completed'),
    )
    tutor_id = models.IntegerField()
    session_type = models.CharField(choices=SESSION_TYPE_CHOICES, max_length=8)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    credits_required = models.IntegerField()
    status = models.CharField(choices=STATUS_CHOICES, max_length=9)
    created_at =  models.DateTimeField(auto_now_add=True)

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
    availability = models.ForeignKey(TutorAvailability, on_delete=models.CASCADE)
    student_id = models.IntegerField()
    booking_status = models.CharField(choices=BOOKING_STATUS_CHOICES, max_length=25)
    canceled_at = models.DateTimeField(null=True, blank=True)
    refund_status = models.BooleanField(default=False)
    video_call_link = models.CharField(max_length=255, null=True)
    created_at = models.DateTimeField(auto_now_add=True)