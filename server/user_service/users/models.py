from django.db import models
from django.contrib.auth.models import AbstractUser
import pycountry

# Create your models here.

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('tutor', 'Tutor'),
    )

    LANGUAGE_SPEAKING_CHOICES = [(language.alpha_2, language.name) for language in pycountry.languages if hasattr(language, 'alpha_2')]

    LANGUAGE_SPEAKING_PROFICIENCY_CHOICES = (
        ('A1', 'A1 - Beginner'),
        ('A2', 'A2 - Elementary'),
        ('B1', 'B1 - Intermediate'),
        ('B2', 'B2 - Upper-Intermediate'),
        ('C1', 'C1 - Advanced'),
        ('C2', 'C2 - Proficient'),
        ('Native', 'Native'),  
    )

    LANGUAGE_LEARNING_CHOICES = (
        ('english', 'English'),
        ('mandarin', 'Mandarin'),
        ('arabic', 'Arabic'),
        ('spanish', 'Spanish'),
        ('french', 'French'),
    )

    LANGUAGE_LEARNING_PROFIECIENCY_CHOICES = (
        ('A1', 'A1 - Beginner'),
        ('A2', 'A2 - Elementary'),
        ('B1', 'B1 - Intermediate'),
        ('B2', 'B2 - Upper-Intermediate'),
        ('C1', 'C1 - Advanced'),
        ('C2', 'C2 - Proficient'),
    )

    username = models.CharField(unique=False)

    country_choices = [(country.name, country.alpha_2) for country in pycountry.countries]

    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)

    languages_spoken = models.CharField(max_length=10, choices=LANGUAGE_SPEAKING_CHOICES, blank=True, null=True)
    proficiency_in_language_spoken = models.CharField(max_length=6, choices=LANGUAGE_SPEAKING_PROFICIENCY_CHOICES, blank=True, null=True)

    country = models.CharField(max_length=100, choices=country_choices, blank=True, null=True)
    
    language_to_learn = models.CharField(max_length=10, choices=LANGUAGE_LEARNING_CHOICES, blank=True, null=True)
    proficiency_in_learning_language = models.CharField(max_length=2, choices=LANGUAGE_LEARNING_PROFIECIENCY_CHOICES, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'user_type']

    def __str__(self):
        return self.email 