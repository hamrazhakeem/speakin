from django.db import models
from django.contrib.auth.models import AbstractUser
import pycountry
from django.contrib.auth.models import BaseUserManager

# Create your models here. 

class CustomUserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('user_type', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, name, password=password, **extra_fields)

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('tutor', 'Tutor'),
        ('admin', 'Admin'),
    )

    username = None
    country_choices = [(country.name, country.alpha_2) for country in pycountry.countries]
    
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)

    country = models.CharField(max_length=100, choices=country_choices, blank=True, null=True)

    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'user_type']

    objects = CustomUserManager()

    def __str__(self):
        return self.email

class Language(models.Model):
    LANGUAGE_CHOICES = [
        (language.alpha_2, language.name) 
        for language in pycountry.languages 
        if hasattr(language, 'alpha_2')
    ]

    name = models.CharField(max_length=50, unique=True, choices=LANGUAGE_CHOICES)

    def __str__(self):
        return self.name

class Proficiency(models.Model):
    LEVEL_CHOICES = (
        ('A1', 'A1 - Beginner'),
        ('A2', 'A2 - Elementary'),
        ('B1', 'B1 - Intermediate'),
        ('B2', 'B2 - Upper-Intermediate'),
        ('C1', 'C1 - Advanced'),
        ('C2', 'C2 - Proficient'),
        ('Native', 'Native'), 
    )

    level = models.CharField(max_length=25, unique=True, choices=LEVEL_CHOICES)

    def __str__(self):
        return self.level
    
class TutorDetails(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    speakinName = models.CharField(max_length=150, unique=True)
    about = models.CharField(max_length=500)
    required_credits = models.PositiveIntegerField(default=0)
    profile_image = models.ImageField(upload_to='tutor_profile_images/', blank=True, null=True)
    intro_video = models.FileField(upload_to='tutor_intro_videos/', blank=True, null=True)
    certificate = models.ImageField(upload_to='tutor_certificate_images/', blank=True, null=True)
    govt_id = models.ImageField(upload_to='tutor_govt_id_images/', blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    total_reviews = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=10, default='pending')

class LanguageSpoken(models.Model):
    user = models.ForeignKey(User, related_name='language_spoken', on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    proficiency = models.ForeignKey(Proficiency, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.name} {self.language.name} ({self.proficiency.level})"

class LanguageToLearn(models.Model):
    user = models.ForeignKey(User, related_name='language_to_learn', on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE, limit_choices_to={'name__in': ['English', 'Mandarin', 'Arabic', 'French', 'Spanish']})
    proficiency = models.ForeignKey(Proficiency, on_delete=models.CASCADE, limit_choices_to={'level__ne': 'Native'}) 

    def __str__(self):
        return f"{self.user.name} {self.language.name} ({self.proficiency.level})"
    
class TutorLanguageToTeach(models.Model):
    user = models.ForeignKey(User, related_name='tutor_language_to_teach', on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE, limit_choices_to={'name__in': ['English', 'Mandarin', 'Arabic', 'French', 'Spanish']})
    is_native = models.BooleanField()