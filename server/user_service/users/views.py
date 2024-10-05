from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import UserSerializer
from .models import User
from django.core.mail import send_mail
from django.conf import settings
import random
import string
from django.contrib.auth.hashers import make_password, check_password
import uuid
from django.core.cache import cache
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.template.loader import render_to_string
from rest_framework.generics import RetrieveAPIView, UpdateAPIView

CACHE_TTL = 300

# Create your views here.

def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

def send_otp_email(subject, email, html):
    subject = subject
    html_message = html
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [email]
    send_mail(subject, '', from_email, recipient_list, html_message=html_message, fail_silently=False)

@api_view(['POST'])
def sign_up(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        otp = generate_otp()
        
        cache_key = str(uuid.uuid4())

        cache.set(f'otp_{cache_key}', otp, timeout=CACHE_TTL)

        cache.set(f'user_data_{cache_key}', {
            'email': serializer.validated_data['email'],
            'name': serializer.validated_data['name'],
            'password': make_password(serializer.validated_data['password']),
            'user_type': serializer.validated_data['user_type'],
        })

        send_otp_email('Your OTP for SpeakIn Registration', serializer.validated_data['email'], render_to_string('emails/otp_email.html', {'otp': otp}))

        return Response({'message': 'Please verify your OTP!', 'cache_key': cache_key}, status=status.HTTP_201_CREATED)
    return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def verify_otp(request):
    email  = request.data.get('email') 
    otp = request.data.get('otp')
    cache_key = request.data.get('cache_key')
    print(cache_key)
 
    session_otp = cache.get(f'otp_{cache_key}')
    user_data = cache.get(f'user_data_{cache_key}') 

    print(session_otp, otp, user_data)
    
    if session_otp and otp == session_otp and user_data and user_data['email'] == email:
        user = User.objects.create(
            email=user_data['email'],
            name=user_data['name'],
            password=user_data['password'],
            user_type=user_data['user_type']
        )

        refresh = RefreshToken.for_user(user)

        cache.delete(f'otp_{cache_key}')
        cache.delete(f'user_data_{cache_key}')

        return Response({
            'message': 'OTP verified successfully! User created.',
            'access': str(refresh.access_token),
            'refresh': str(refresh), 
            'name': user.name,
            'id': user.id,
        }, status=status.HTTP_200_OK)
 
    return Response({'message': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def sign_in(request):
    email = request.data.get('email')
    password = request.data.get('password')
  
    user = authenticate(request, username=email, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'name': user.name,
            'id': user.id,
        }, status=status.HTTP_200_OK)

    return Response({'detail': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def resend_otp(request):
    email = request.data.get('email')
    cache_key = request.data.get('cache_key')

    if not email or not cache_key:
        return Response({'message': 'Email and cache key are required.'}, status=status.HTTP_400_BAD_REQUEST)

    user_data = cache.get(f'user_data_{cache_key}')
    if not user_data or user_data['email'] != email:
        return Response({'message': 'User data not found. Please sign up again.'}, status=status.HTTP_404_NOT_FOUND)

    otp = generate_otp()
    cache.set(f'otp_{cache_key}', otp, timeout=CACHE_TTL)

    send_otp_email('Resend: Your OTP for SpeakIn Registration', email, render_to_string('emails/resend_otp_email.html', {'otp': otp}))

    return Response({'message': 'New OTP sent successfully!'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def resend_forgot_password_otp(request):
    email = request.data.get('email')
    cache_key = request.data.get('cache_key')

    if not email or not cache_key:
        return Response({'message': 'Email and cache key are required.'}, status=status.HTTP_400_BAD_REQUEST)

    user_data = cache.get(f'user_data_{cache_key}')
    if not user_data or user_data['email'] != email:
        return Response({'message': 'User data not found. Please try again.'}, status=status.HTTP_404_NOT_FOUND)

    otp = generate_otp()
    cache.set(f'otp_{cache_key}', otp, timeout=CACHE_TTL)

    send_otp_email('Resend: Your OTP for Password Reset', email, render_to_string('emails/resend_otp_email.html', {'otp': otp}))

    return Response({'message': 'New OTP sent successfully!'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email')
    
    if User.objects.filter(email=email).exists():
        otp = generate_otp()

        cache_key = str(uuid.uuid4())
        cache.set(f'otp_{cache_key}', otp, timeout=CACHE_TTL)

        cache.set(f'user_data_{cache_key}', {
            'email': email,
        })

        send_otp_email('Your OTP for SpeakIn Password Reset', email, render_to_string('emails/forgot_password_email.html', {'otp': otp}))

        return Response({'message': 'OTP has been sent to your email.', 'cache_key': cache_key}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Email not found.'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def forgot_password_verify_otp(request):
    email  = request.data.get('email') 
    otp = request.data.get('otp')
    cache_key = request.data.get('cache_key')
 
    session_otp = cache.get(f'otp_{cache_key}')
    user_data = cache.get(f'user_data_{cache_key}') 
    
    if session_otp and otp == session_otp and user_data and user_data['email'] == email:
        cache.delete(f'otp_{cache_key}')
        
        return Response({'message': 'OTP verified successfully! You can create new password now.'}, status=status.HTTP_200_OK)
 
    return Response({'message': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def set_new_password(request):
    email = request.data.get('email')
    new_password = request.data.get('newPassword')
    cache_key = request.data.get('cache_key')
    
    user_data = cache.get(f'user_data_{cache_key}')
    
    if user_data and user_data['email'] == email:
        try:
            user = User.objects.get(email=email)
            user.password = make_password(new_password)
            user.save()
            
            cache.delete(f'user_data_{cache_key}')
            
            return Response({'message': 'Password updated successfully!'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({'message': 'Invalid cache key or email'}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'

class UserUpdateView(UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'

    def get_user(self, id):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            return None 

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def admin_signin(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(request, username=email, password=password)
    if user is not None and user.is_superuser:
        is_admin = user.is_superuser
        print(is_admin)
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'name': user.name,
            'id': user.id,
            'is_admin': is_admin,
        }, status=status.HTTP_200_OK)
    return Response({'detail': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)