from django.shortcuts import get_object_or_404
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import ChangePasswordSerializer, TeachingLanguageChangeRequestSerializer, UserSerializer, TutorDetailsSerializer
from .models import LanguageSpoken, LanguageToLearn, TeachingLanguageChangeRequest, TutorDetails, TutorLanguageToTeach, User, Language, Proficiency
from django.contrib.auth.hashers import make_password
from django.core.cache import cache
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from pycountry import countries
import json
from django.db import transaction
from django.db.models import Q 
from rest_framework.permissions import IsAdminUser
from .permissions import IsAdminOrUserSelf
from .utils import get_user_or_create, get_id_token
from .services import EmailService

# Create your views here.

@api_view(['POST'])
def sign_up(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        cache_key = EmailService.send_registration_email(
            serializer.validated_data['email'],
            serializer.validated_data
        )
        
        return Response({
            'message': 'Please verify your OTP!',
            'cache_key': cache_key
        }, status=status.HTTP_201_CREATED)
    return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def tutor_verify_email(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Send email with OTP
    cache_key = EmailService.send_tutor_verification_email(email)
    
    return Response({'cache_key': cache_key}, status=status.HTTP_200_OK)

@api_view(['POST'])
def tutor_verify_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')
    cache_key = request.data.get('cache_key')
     
    stored_otp = cache.get(f'otp_{cache_key}')
    print('stored otp', stored_otp)
    if not stored_otp or stored_otp != otp:
        return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
        
    cache.delete(cache_key)
    return Response({'message': 'Email verified successfully'}, status=status.HTTP_200_OK)

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
            'credits': user.balance_credits
        }, status=status.HTTP_200_OK)
 
    return Response({'message': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def sign_in(request):
    email = request.data.get('email')
    password = request.data.get('password')
  
    user = authenticate(request, username=email, password=password)

    if user is not None and not user.user_type == 'tutor':
        if user.with_google:
            return Response({'detail': 'You have created account with google, Click sign in with google'}, status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        access_token['is_admin'] = user.is_staff
        return Response({
            'access': str(access_token),
            'refresh': str(refresh),
            'name': user.name,
            'id': user.id,
            'credits': user.balance_credits
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

    EmailService.resend_registration_otp(email, cache_key)
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

    EmailService.resend_forgot_password_otp(email, cache_key)
    return Response({'message': 'New OTP sent successfully!'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email')
    
    if User.objects.filter(email=email).exists():
        user = User.objects.get(email=email)
        if user.with_google:
            return Response({
                'error': 'You created your account using Google. Please click "Sign in with Google"'
            }, status=status.HTTP_403_FORBIDDEN)

        if user.user_type == 'tutor':
            tutor_details = TutorDetails.objects.filter(user=user).first()
            if tutor_details and tutor_details.status == 'pending':
                return Response({
                    'error': 'Your tutor account is still pending approval.'
                }, status=status.HTTP_403_FORBIDDEN)

        cache_key = EmailService.send_forgot_password_email(email)

        return Response({
            'message': 'OTP has been sent to your email.',
            'cache_key': cache_key
        }, status=status.HTTP_200_OK)

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

class LoginWithGoogle(APIView):
    def post(self, request):
        if 'code' in request.data:
            code = request.data['code']
            id_token = get_id_token(code)
            
            if 'email' not in id_token:
                return Response({"detail": "Invalid token or missing email"}, status=status.HTTP_400_BAD_REQUEST)
            
            email = id_token['email']
            name = id_token['name']
     
            user = get_user_or_create(email, name)
            
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            access_token['is_admin'] = user.is_staff
            return Response({
                'access': str(access_token),
                'refresh': str(refresh),
                'role':"user", 
                'name': user.name,
                'id': user.id,
                'credits': user.balance_credits
            }, status=status.HTTP_200_OK)
        
        return Response({"detail": "Code not provided"}, status=status.HTTP_400_BAD_REQUEST)

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrUserSelf]

    def get_object(self):
        user_id = self.kwargs.get('pk')
        return User.objects.get(pk=user_id)
 
    def update(self, request, *args, **kwargs): 
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial) 
        serializer.is_valid(raise_exception=True) 
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
 
    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def perform_update(self, serializer):
        print("Entering perform_update")
        if serializer.is_valid():
            with transaction.atomic():
                user = serializer.save()
                print(f"User saved: {user.email}")

        language_spoken_data = self.request.data.get('language_spoken')
        if language_spoken_data:
            try:
                languages = json.loads(language_spoken_data)
                LanguageSpoken.objects.filter(user=user).delete()
                for lang_data in languages:
                    if lang_data.get('language') and lang_data.get('proficiency'):
                        language, _ = Language.objects.get_or_create(name=lang_data['language'])
                        proficiency, _ = Proficiency.objects.get_or_create(level=lang_data['proficiency'])
                        LanguageSpoken.objects.create(user=user, language=language, proficiency=proficiency)
                print("Languages spoken updated successfully")
            except json.JSONDecodeError:
                print("Invalid JSON format for language_spoken")
            except Exception as e:
                print(f"Error updating languages spoken: {str(e)}")

        # Handle language_to_learn data
        language_to_learn_data = self.request.data.get('language_to_learn')
        if language_to_learn_data:
            try:
                language_data = json.loads(language_to_learn_data)  # Expecting a list (e.g., [{"language": "French", "proficiency": "Beginner"}])
                
                if not language_data:  # Empty array case: delete existing LanguageToLearn entry
                    LanguageToLearn.objects.filter(user=user).delete()
                    print("Existing language to learn deleted successfully.")
                
                elif len(language_data) == 1:  # Single entry expected in the list
                    language_entry = language_data[0]
                    language_name = language_entry.get('language')
                    proficiency_level = language_entry.get('proficiency')

                    if language_name and proficiency_level:
                        language, _ = Language.objects.get_or_create(name=language_name)
                        proficiency, _ = Proficiency.objects.get_or_create(level=proficiency_level)
                        
                        # Delete existing entry and create new one
                        LanguageToLearn.objects.filter(user=user).delete()
                        LanguageToLearn.objects.create(user=user, language=language, proficiency=proficiency)
                        print("Language to learn updated successfully.")
            
            except json.JSONDecodeError:
                print("Invalid JSON format for language_to_learn")
            except Exception as e: 
                print(f"Error updating language to learn: {str(e)}")
        
        else:
            print("Serializer is not valid")
            print(serializer.errors)

        if user.user_type == 'tutor': 
            print("User is a tutor")
            try:
                tutor_details = TutorDetails.objects.get(user=user)
                print(f"Tutor status: {tutor_details.status}")

                speakin_name = self.request.data.get('speakin_name')
                required_credits = self.request.data.get('required_credits')
                print(speakin_name, required_credits)
                if speakin_name:
                    tutor_details.speakin_name = speakin_name
                if required_credits:
                    tutor_details.required_credits = required_credits
                
                tutor_details.save()
                print("TutorDetails updated")
            except TutorDetails.DoesNotExist:
                print("TutorDetails not found")


    def patch(self, request, *args, **kwargs):
        
        try:        
            # Call the original partial update functionality
            response = self.partial_update(request, *args, **kwargs) 
            
            return response
        except TutorDetails.DoesNotExist:
            return Response({"error": "Tutor details not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TutorRequest(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def perform_update(self, serializer):
        if serializer.is_valid():
            with transaction.atomic():
                user = serializer.save()

                if user.user_type == 'tutor': 
                    print("User is a tutor")
                    try:
                        tutor_details = TutorDetails.objects.get(user=user)
  
                        if tutor_details.status == 'pending' and self.request.data.get('action') == 'approve':
                            tutor_details.status = 'approved'
                            tutor_details.save()
                            EmailService.send_tutor_approval_email(user)
                    except TutorDetails.DoesNotExist:
                        print("TutorDetails not found")

    def perform_destroy(self, instance):
        if instance.user_type == 'tutor':
            try:
                tutor_details = TutorDetails.objects.get(user=instance)
                if tutor_details.status == 'pending':
                    tutor_details.status = 'denied'
                    tutor_details.save()
                    
                    EmailService.send_tutor_denial_email(instance)

                    instance.delete()
                    return Response({"message": "Tutor account denied and deleted."}, status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response({"error": "Tutor cannot be denied, status is not pending."}, status=status.HTTP_400_BAD_REQUEST)
            except TutorDetails.DoesNotExist:
                return Response({"error": "Tutor details not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            instance.delete()
            return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def admin_signin(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(request, username=email, password=password)
    if user is not None and user.is_superuser:
        is_admin = user.is_superuser
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        access_token['is_admin'] = user.is_staff
        return Response({
            'access': str(access_token),
            'refresh': str(refresh),
            'name': user.name,
            'id': user.id,
            'is_admin': is_admin,
        }, status=status.HTTP_200_OK)
    return Response({'detail': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

class CountryList(APIView):
    def get(self, request):
        country_choices = [(country.name, country.alpha_2) for country in countries]
        return Response(country_choices)

class PlatformLanguageList(APIView):
    def get(self, request):
        languages = Language.objects.filter(name__in=['English', 'Chinese', 'Arabic', 'French', 'Spanish', 'Hindi'])
        proficiencies = [{'level': prof.level, 'description': prof.get_level_display()} 
                        for prof in Proficiency.objects.exclude(Q(level='Native') | Q(level='C2'))]
        return Response({
            'languages': [{'id': lang.id, 'name': lang.name} for lang in languages], 
            'proficiencies': proficiencies,
        })

 
class SpokenLanguageList(APIView):
    def get(self, request):
        languages = Language.objects.all()
        allowed_proficiencies = ['B1', 'B2', 'C1', 'C2', 'Native']
        proficiencies = [{'level': prof.level, 'description': prof.get_level_display()} for prof in Proficiency.objects.filter(level__in=allowed_proficiencies)]
        return Response({
            'languages': [{'id': lang.id, 'name': lang.name} for lang in languages],
            'proficiencies': proficiencies
        })

@api_view(['POST'])
@transaction.atomic
def tutor_request(request):
    try:
        data = request.data

        # Pre-validate unique fields before creating any objects
        speakin_name = data.get('speakinName')
        email = data.get('email')
        
        # Check if email exists
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'This email address is already registered. Please use a different email.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Check if speakinName exists
        if TutorDetails.objects.filter(speakin_name=speakin_name).exists():
            return Response(
                {'error': 'This SpeakIn Name is already taken. Please choose a different name.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        video_file = request.FILES.get('video')
        image_file = request.FILES.get('image')
        profile_image = request.FILES.get('profile_image')

        # Create the User instance
        user = User.objects.create(
            email=email,
            name=data['fullName'],
            profile_image=profile_image,
            password=make_password(data['password']),
            user_type='tutor',
            country=data['country'],
        )

        is_native = data['isNative'].lower() == 'true'

        if is_native:
            govt_id = image_file
            certificate = None
        else:
            govt_id = None
            certificate = image_file

        # Create the TutorDetails instance
        TutorDetails.objects.create(
            user=user,
            speakin_name=speakin_name,
            about=data['about'],
            required_credits=data['hourlyRate'],
            intro_video=video_file,
            govt_id=govt_id,
            certificate=certificate,
        )

        language_instance = Language.objects.get(name=data['teachingLanguage'])
        is_native_value = data['isNative'] == 'true'

        # Handle Languages to Teach
        TutorLanguageToTeach.objects.create(
            user=user,
            is_native=is_native_value,
            language=language_instance
        )

        # Handle Spoken Languages
        spoken_languages_str = data.get('spokenLanguages', '[]')

        try:
            spoken_languages = json.loads(spoken_languages_str)
            if not isinstance(spoken_languages, list):
                spoken_languages = [spoken_languages]

            # Pre-validate all languages and proficiencies before creating any objects
            language_proficiency_pairs = []
            for spoken_lang in spoken_languages:
                try:
                    language_obj = Language.objects.get(name=spoken_lang['language'])
                    proficiency_obj = Proficiency.objects.get(level=spoken_lang['proficiency'])
                    language_proficiency_pairs.append((language_obj, proficiency_obj))
                except Language.DoesNotExist:
                    return Response(
                        {'error': f"Language '{spoken_lang['language']}' does not exist."}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                except Proficiency.DoesNotExist:
                    return Response(
                        {'error': f"Proficiency level '{spoken_lang['proficiency']}' does not exist."}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Create all LanguageSpoken records
            for language_obj, proficiency_obj in language_proficiency_pairs:
                LanguageSpoken.objects.create(
                    user=user,
                    language=language_obj,
                    proficiency=proficiency_obj
                )

        except json.JSONDecodeError:
            raise ValueError('Invalid spokenLanguages format')

        return Response({'message': 'Tutor request submitted successfully!'}, status=status.HTTP_201_CREATED)

    except ValueError as e:
        transaction.set_rollback(True)
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        transaction.set_rollback(True)
        print(f"Unexpected error: {str(e)}")  # Log the unexpected error
        return Response({'error': 'An error occurred while processing your request.'}, status=status.HTTP_400_BAD_REQUEST)

class BlockUnblockUser(APIView):
    permission_classes = [IsAdminUser]
    def patch(self, request, id):
        try: 
            user = User.objects.get(id=id)
            user.is_active = not user.is_active
            user.save() 
            if user.is_active:
                return Response({'message': 'User unblocked successfully!'}, status=status.HTTP_200_OK)
            return Response({'message': 'User blocked successfully!'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST) 

@api_view(['POST'])
def tutor_sign_in(request):
    email = request.data.get('email')
    password = request.data.get('password')
  
    user = authenticate(request, username=email, password=password)
    if user is not None and user.user_type != 'student':
        # Check if the user is a tutor and verify the tutor status
        if user.user_type == 'tutor':
            try:
                tutor_details = user.tutor_details  # Access the related TutorDetails model
                if tutor_details.status == 'pending':
                    return Response(
                        {'detail': 'Your tutor account is still pending approval.'},
                        status=status.HTTP_403_FORBIDDEN
                    )
            except TutorDetails.DoesNotExist:
                return Response(
                    {'detail': 'Tutor details not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # If tutor is approved or user is admin, allow sign-in
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        access_token['is_admin'] = user.is_staff
        return Response({
            'access': str(access_token),
            'refresh': str(refresh),
            'name': user.name,
            'id': user.id,
            'credits': user.balance_credits,
            'required_credits': user.tutor_details.required_credits,
        }, status=status.HTTP_200_OK)
    
    return Response({'detail': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

class ChangePassword(APIView):
    def post(self, request):
        print(request.data) 
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            # If valid, update the password
            serializer.update_password(request.user)
            return Response({"detail": "Password changed successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TeachingLanguageChangeRequestList(generics.ListCreateAPIView):
    queryset = TeachingLanguageChangeRequest.objects.all()
    serializer_class = TeachingLanguageChangeRequestSerializer
        
    def perform_create(self, serializer):
        # Pass the authenticated user to the serializer
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # Check if the user already has a pending language change request
        existing_request = TeachingLanguageChangeRequest.objects.filter(user=request.user, status='pending').first()
        
        if existing_request:
            return Response({'error': 'You already have a pending request to change your teaching language. Please wait for it to be resolved before submitting a new request.'}, status=status.HTTP_400_BAD_REQUEST)
 
        # If no existing request, proceed with the creation
        return super().create(request, *args, **kwargs)

class TeachingLanguageChangeRequestDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TeachingLanguageChangeRequest.objects.all()
    serializer_class = TeachingLanguageChangeRequestSerializer
    permission_classes = [IsAdminUser]

    @transaction.atomic
    def patch(self, request, pk):
        try:
            change_request = get_object_or_404(TeachingLanguageChangeRequest, id=pk)
            
            # Create or update TutorLanguageToTeach
            TutorLanguageToTeach.objects.update_or_create(
                user=change_request.user,
                defaults={
                    'language_id': change_request.new_language.id,
                    'is_native': change_request.is_native
                }
            )
            
            # Update TutorDetails
            tutor_details = TutorDetails.objects.get(user=change_request.user)
            if change_request.is_native:
                tutor_details.govt_id = change_request.govt_id
                tutor_details.certificate = None
            else:
                tutor_details.govt_id = None
                tutor_details.certificate = change_request.certificate 
            tutor_details.intro_video = change_request.intro_video
            tutor_details.about = change_request.about
            tutor_details.save()
            
            # Update User name
            print('Updating profile', change_request.profile_image)
            user = change_request.user
            user.name = change_request.full_name
            user.profile_image = change_request.profile_image
            user.save()
            
            EmailService.send_language_change_approval_email(
                user,
                change_request.new_language.name,
                tutor_details.speakin_name
            )
            
            # Delete the change request
            change_request.delete()
            
            return Response({
                'message': 'Language change request approved successfully'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        
    @transaction.atomic
    def delete(self, request, pk):
        try:
            change_request = get_object_or_404(TeachingLanguageChangeRequest, id=pk)
            tutor_details = TutorDetails.objects.get(user=change_request.user)
            user = change_request.user

            # Get the current language name before deleting
            old_language = TutorLanguageToTeach.objects.get(user=user).language.name
            new_language_name = change_request.new_language.name

            change_request.delete() 

            EmailService.send_language_change_denial_email(
                user,
                new_language_name,
                tutor_details.speakin_name,
                old_language
            )

            return Response({
                'message': 'Language change request denied successfully'
            }, status=status.HTTP_200_OK)
            
        except TutorLanguageToTeach.DoesNotExist:
            return Response({
                'error': 'Old language data for tutor not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        
class UserBalance(generics.GenericAPIView):
    def get(self, request, pk):
        try:
            user = User.objects.get(id=pk)
            return Response({"balance_credits": user.balance_credits})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)  
        
class TutorDetail(generics.RetrieveAPIView):
    queryset = TutorDetails.objects.all()
    serializer_class = TutorDetailsSerializer

    def get_object(self):
        user_id = self.kwargs.get('pk') 
        return get_object_or_404(TutorDetails, user_id=user_id)