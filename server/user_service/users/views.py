from django.shortcuts import get_object_or_404
from rest_framework import status, generics, serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import (
    ChangePasswordSerializer,
    TeachingLanguageChangeRequestSerializer,
    UserSerializer,
    TutorDetailsSerializer,
)
from .models import (
    LanguageSpoken,
    LanguageToLearn,
    TeachingLanguageChangeRequest,
    TutorDetails,
    TutorLanguageToTeach,
    User,
    Language,
    Proficiency,
)
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
from .tasks import process_video_upload
from django.core.files.base import ContentFile
import logging

# Get logger for the user app
logger = logging.getLogger("users")

# Create your views here.


@api_view(["POST"])
def sign_up(request):
    logger.info("Processing new user signup request")
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        cache_key = EmailService.send_registration_email(
            serializer.validated_data["email"], serializer.validated_data
        )
        logger.info(f"Registration email sent to {serializer.validated_data['email']}")
        return Response(
            {"message": "Please verify your OTP!", "cache_key": cache_key},
            status=status.HTTP_201_CREATED,
        )
    logger.warning(f"Invalid signup data: {serializer.errors}")
    return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def verify_otp(request):
    email = request.data.get("email")
    otp = request.data.get("otp")
    cache_key = request.data.get("cache_key")
    logger.info(f"Verifying OTP for email: {email}")

    session_otp = cache.get(f"otp_{cache_key}")
    user_data = cache.get(f"user_data_{cache_key}")

    if session_otp and otp == session_otp and user_data and user_data["email"] == email:
        user = User.objects.create(
            email=user_data["email"],
            name=user_data["name"],
            password=user_data["password"],
            user_type=user_data["user_type"],
        )
        logger.info(f"New user created: {user.email}")

        refresh = RefreshToken.for_user(user)

        cache.delete(f"otp_{cache_key}")
        cache.delete(f"user_data_{cache_key}")
        logger.info(f"OTP and user data deleted for cache key: {cache_key}")

        return Response(
            {
                "message": "OTP verified successfully! User created.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "name": user.name,
                "id": user.id,
                "credits": user.balance_credits,
            },
            status=status.HTTP_200_OK,
        )

    return Response({"message": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def sign_in(request):
    email = request.data.get("email")
    password = request.data.get("password")
    logger.info(f"Processing sign in request for: {email}")

    user = authenticate(request, username=email, password=password)

    if user is not None and not user.user_type == "tutor":
        if user.with_google:
            logger.warning(f"Google account sign-in attempt: {email}")
            return Response(
                {
                    "detail": "You have created account with google, Click sign in with google"
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
        if not user.is_active:
            logger.warning(f"Blocked user sign-in attempt: {email}")
            return Response(
                {"detail": "Your account has been blocked. Please contact support."},
                status=status.HTTP_403_FORBIDDEN,
            )
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        access_token["is_admin"] = user.is_staff
        logger.info(f"Successful sign-in: {email}")
        return Response(
            {
                "access": str(access_token),
                "refresh": str(refresh),
                "name": user.name,
                "id": user.id,
                "credits": user.balance_credits,
            },
            status=status.HTTP_200_OK,
        )

    logger.warning(f"Failed sign-in attempt: {email}")
    return Response(
        {"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(["POST"])
def resend_otp(request):
    email = request.data.get("email")
    cache_key = request.data.get("cache_key")

    if not email or not cache_key:
        logger.warning(f"Invalid resend OTP request: {email} or {cache_key}")
        return Response(
            {"message": "Email and cache key are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user_data = cache.get(f"user_data_{cache_key}")
    if not user_data or user_data["email"] != email:
        logger.warning(f"User data not found for email: {email}")
        return Response(
            {"message": "User data not found. Please sign up again."},
            status=status.HTTP_404_NOT_FOUND,
        )

    EmailService.resend_registration_otp(email, cache_key)
    logger.info(f"New OTP sent successfully to: {email}")
    return Response(
        {"message": "New OTP sent successfully!"}, status=status.HTTP_200_OK
    )


@api_view(["POST"])
def resend_forgot_password_otp(request):
    email = request.data.get("email")
    cache_key = request.data.get("cache_key")

    if not email or not cache_key:
        logger.warning(
            f"Invalid resend forgot password OTP request: {email} or {cache_key}"
        )
        return Response(
            {"message": "Email and cache key are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user_data = cache.get(f"user_data_{cache_key}")
    if not user_data or user_data["email"] != email:
        logger.warning(f"User data not found for email: {email}")
        return Response(
            {"message": "User data not found. Please try again."},
            status=status.HTTP_404_NOT_FOUND,
        )

    EmailService.resend_forgot_password_otp(email, cache_key)
    logger.info(f"New OTP sent successfully to: {email}")
    return Response(
        {"message": "New OTP sent successfully!"}, status=status.HTTP_200_OK
    )


@api_view(["POST"])
def forgot_password(request):
    email = request.data.get("email")

    if User.objects.filter(email=email).exists():
        user = User.objects.get(email=email)
        if user.with_google:
            logger.warning(f"Google account forgot password attempt: {email}")
            return Response(
                {
                    "error": 'You created your account using Google. Please click "Sign in with Google"'
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if user.user_type == "tutor":
            tutor_details = TutorDetails.objects.filter(user=user).first()
            if tutor_details and tutor_details.status == "pending":
                logger.warning(f"Tutor account is still pending approval: {email}")
                return Response(
                    {"error": "Your tutor account is still pending approval."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        cache_key = EmailService.send_forgot_password_email(email)

        logger.info(f"OTP sent successfully to: {email}")
        return Response(
            {"message": "OTP has been sent to your email.", "cache_key": cache_key},
            status=status.HTTP_200_OK,
        )

    return Response({"error": "Email not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
def forgot_password_verify_otp(request):
    email = request.data.get("email")
    otp = request.data.get("otp")
    cache_key = request.data.get("cache_key")

    session_otp = cache.get(f"otp_{cache_key}")
    user_data = cache.get(f"user_data_{cache_key}")

    if session_otp and otp == session_otp and user_data and user_data["email"] == email:
        cache.delete(f"otp_{cache_key}")

        logger.info(f"OTP deleted for cache key: {cache_key}")
        return Response(
            {"message": "OTP verified successfully! You can create new password now."},
            status=status.HTTP_200_OK,
        )

    return Response({"message": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def set_new_password(request):
    email = request.data.get("email")
    new_password = request.data.get("newPassword")
    cache_key = request.data.get("cache_key")

    user_data = cache.get(f"user_data_{cache_key}")

    if user_data and user_data["email"] == email:
        try:
            user = User.objects.get(email=email)
            user.password = make_password(new_password)

            user.save()

            cache.delete(f"user_data_{cache_key}")

            logger.info(f"User data deleted for cache key: {cache_key}")
            return Response(
                {"message": "Password updated successfully!"}, status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            logger.warning(f"User not found for email: {email}")
            return Response(
                {"message": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
    else:
        logger.warning(f"Invalid cache key or email: {cache_key} or {email}")
        return Response(
            {"message": "Invalid cache key or email"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class LoginWithGoogle(APIView):
    def post(self, request):
        if "code" in request.data:
            code = request.data["code"]
            id_token = get_id_token(code)

            if "email" not in id_token:
                logger.error("Invalid token or missing email")
                return Response(
                    {"detail": "Invalid token or missing email"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            email = id_token["email"]
            name = id_token["name"]

            # First check if user exists and is blocked
            try:
                existing_user = User.objects.get(email=email)
                if not existing_user.is_active:
                    logger.warning(f"Blocked user sign-in attempt: {email}")
                    return Response(
                        {
                            "detail": "Your account has been blocked. Please contact support."
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
            except User.DoesNotExist:
                logger.warning(f"User not found for email: {email}")
                pass

            # If user is not blocked or doesn't exist, proceed with get_user_or_create
            user = get_user_or_create(email, name)

            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            access_token["is_admin"] = user.is_staff
            logger.info(f"Successful sign-in: {email}")
            return Response(
                {
                    "access": str(access_token),
                    "refresh": str(refresh),
                    "role": "user",
                    "name": user.name,
                    "id": user.id,
                    "credits": user.balance_credits,
                },
                status=status.HTTP_200_OK,
            )

        logger.error("No Google auth code provided")
        return Response(
            {"detail": "Code not provided"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
def tutor_verify_email(request):
    email = request.data.get("email")
    if not email:
        logger.warning(f"Invalid tutor email request: {email}")
        return Response(
            {"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    # Check if email already exists
    if User.objects.filter(email=email).exists():
        logger.warning(f"Email already exists: {email}")
        return Response(
            {
                "error": "This email address is already registered. Please use a different email."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Send email with OTP
    cache_key = EmailService.send_tutor_verification_email(email)

    logger.info(f"Tutor verification email sent to: {email}")
    return Response({"cache_key": cache_key}, status=status.HTTP_200_OK)


@api_view(["POST"])
def tutor_verify_otp(request):
    email = request.data.get("email")
    otp = request.data.get("otp")
    cache_key = request.data.get("cache_key")

    stored_otp = cache.get(f"otp_{cache_key}")
    if not stored_otp or stored_otp != otp:
        logger.warning(f"Invalid OTP attempt for tutor: {email}")
        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

    cache.delete(cache_key)
    logger.info(f"OTP deleted for cache key: {cache_key}")
    return Response(
        {"message": "Email verified successfully"}, status=status.HTTP_200_OK
    )


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrUserSelf]

    def get_object(self):
        user_id = self.kwargs.get("pk")
        logger.info(f"Retrieved user details for ID: {user_id}")
        return User.objects.get(pk=user_id)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        logger.info(f"User updated successfully: {kwargs.get('pk')}")
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        logger.info(f"Partial update request received for user ID: {kwargs.get('pk')}")
        return self.update(request, *args, **kwargs)

    def perform_update(self, serializer):
        logger.info("Entering perform_update")
        if serializer.is_valid():
            with transaction.atomic():
                user = serializer.save()
                logger.info(f"User saved: {user.email}")

        language_spoken_data = self.request.data.get("language_spoken")
        if language_spoken_data:
            try:
                languages = json.loads(language_spoken_data)
                LanguageSpoken.objects.filter(user=user).delete()
                for lang_data in languages:
                    if lang_data.get("language") and lang_data.get("proficiency"):
                        language, _ = Language.objects.get_or_create(
                            name=lang_data["language"]
                        )
                        proficiency, _ = Proficiency.objects.get_or_create(
                            level=lang_data["proficiency"]
                        )
                        LanguageSpoken.objects.create(
                            user=user, language=language, proficiency=proficiency
                        )
                logger.info("Languages spoken updated successfully")
            except json.JSONDecodeError:
                logger.warning("Invalid JSON format for language_spoken")
            except Exception as e:
                logger.error(f"Error updating languages spoken: {str(e)}")

        # Handle language_to_learn data
        language_to_learn_data = self.request.data.get("language_to_learn")
        if language_to_learn_data:
            try:
                languages = json.loads(language_to_learn_data)
                # Delete existing languages first
                LanguageToLearn.objects.filter(user=user).delete()

                # Create new language entries
                for lang_data in languages:
                    if lang_data.get("language") and lang_data.get("proficiency"):
                        language, _ = Language.objects.get_or_create(
                            name=lang_data["language"]
                        )
                        proficiency, _ = Proficiency.objects.get_or_create(
                            level=lang_data["proficiency"]
                        )
                        LanguageToLearn.objects.create(
                            user=user, language=language, proficiency=proficiency
                        )
                logger.info("Languages to learn updated successfully")
            except json.JSONDecodeError:
                logger.warning("Invalid JSON format for language_to_learn")
            except Exception as e:
                logger.error(f"Error updating languages to learn: {str(e)}")

        else:
            logger.warning("Serializer is not valid")
            logger.warning(serializer.errors)

        if user.user_type == "tutor":
            logger.info("User is a tutor")
            try:
                tutor_details = TutorDetails.objects.get(user=user)
                logger.info(f"Tutor status: {tutor_details.status}")

                speakin_name = self.request.data.get("speakin_name")
                required_credits = self.request.data.get("required_credits")
                logger.info(
                    f"speakin_name: {speakin_name}, required_credits: {required_credits}"
                )
                if speakin_name:
                    tutor_details.speakin_name = speakin_name
                if required_credits:
                    tutor_details.required_credits = required_credits

                tutor_details.save()
                logger.info("TutorDetails updated")
            except TutorDetails.DoesNotExist:
                logger.warning("TutorDetails not found")

    def patch(self, request, *args, **kwargs):

        try:
            # Call the original partial update functionality
            response = self.partial_update(request, *args, **kwargs)

            return response
        except TutorDetails.DoesNotExist:
            logger.warning("Tutor details not found.")
            return Response(
                {"error": "Tutor details not found."}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error in partial update: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TutorRequest(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def perform_update(self, serializer):
        if serializer.is_valid():
            with transaction.atomic():
                user = serializer.save()

                if user.user_type == "tutor":
                    logger.info("User is a tutor")
                    try:
                        tutor_details = TutorDetails.objects.get(user=user)

                        if (
                            tutor_details.status == "pending"
                            and self.request.data.get("action") == "approve"
                        ):
                            tutor_details.status = "approved"
                            tutor_details.save()
                            EmailService.send_tutor_approval_email(user)
                    except TutorDetails.DoesNotExist:
                        logger.warning("TutorDetails not found")

    def perform_destroy(self, instance):
        if instance.user_type == "tutor":
            try:
                tutor_details = TutorDetails.objects.get(user=instance)
                if tutor_details.status == "pending":
                    tutor_details.status = "denied"
                    tutor_details.save()

                    EmailService.send_tutor_denial_email(instance)

                    instance.delete()
                    logger.info("Tutor account denied and deleted.")
                    return Response(
                        {"message": "Tutor account denied and deleted."},
                        status=status.HTTP_204_NO_CONTENT,
                    )
                else:
                    logger.warning("Tutor cannot be denied, status is not pending.")
                    return Response(
                        {"error": "Tutor cannot be denied, status is not pending."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except TutorDetails.DoesNotExist:
                logger.warning("Tutor details not found.")
                return Response(
                    {"error": "Tutor details not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            instance.delete()
            logger.info("User deleted successfully.")
            return Response(
                {"message": "User deleted successfully."},
                status=status.HTTP_204_NO_CONTENT,
            )


@api_view(["POST"])
def admin_signin(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(request, username=email, password=password)
    if user is not None and user.is_superuser:
        is_admin = user.is_superuser
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        access_token["is_admin"] = user.is_staff
        logger.info("Admin sign-in successful")
        return Response(
            {
                "access": str(access_token),
                "refresh": str(refresh),
                "name": user.name,
                "id": user.id,
                "is_admin": is_admin,
            },
            status=status.HTTP_200_OK,
        )
    logger.error("Admin sign-in failed")
    return Response(
        {"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED
    )


class CountryList(APIView):
    def get(self, request):
        country_choices = [(country.name, country.alpha_2) for country in countries]
        logger.info("Country list retrieved")
        return Response(country_choices)


class PlatformLanguageList(APIView):
    def get(self, request):
        languages = Language.objects.filter(
            name__in=["English", "Chinese", "Arabic", "French", "Spanish", "Hindi"]
        )
        proficiencies = [
            {"level": prof.level, "description": prof.get_level_display()}
            for prof in Proficiency.objects.exclude(Q(level="Native") | Q(level="C2"))
        ]
        logger.info("Platform language list retrieved")
        return Response(
            {
                "languages": [{"id": lang.id, "name": lang.name} for lang in languages],
                "proficiencies": proficiencies,
            }
        )


class SpokenLanguageList(APIView):
    def get(self, request):
        languages = Language.objects.all()
        allowed_proficiencies = ["B1", "B2", "C1", "C2", "Native"]
        proficiencies = [
            {"level": prof.level, "description": prof.get_level_display()}
            for prof in Proficiency.objects.filter(level__in=allowed_proficiencies)
        ]
        logger.info("Spoken language list retrieved")
        return Response(
            {
                "languages": [{"id": lang.id, "name": lang.name} for lang in languages],
                "proficiencies": proficiencies,
            }
        )


@api_view(["POST"])
@transaction.atomic
def tutor_request(request):
    try:
        logger.info("Tutor request received")
        data = request.data

        # Pre-validate unique fields before creating any objects
        speakin_name = data.get("speakinName")
        email = data.get("email")

        # Validation checks...
        if User.objects.filter(email=email).exists():
            logger.warning(f"Email already exists: {email}")
            return Response(
                {
                    "error": "This email address is already registered. Please use a different email."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if TutorDetails.objects.filter(speakin_name=speakin_name).exists():
            logger.warning(f"SpeakIn Name already exists: {speakin_name}")
            return Response(
                {
                    "error": "This SpeakIn Name is already taken. Please choose a different name."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Get files from request
        video_file = request.FILES.get("video")
        image_file = request.FILES.get("image")
        profile_image = request.FILES.get("profile_image")

        # Create User instance
        user = User.objects.create(
            email=email,
            name=data["fullName"],
            profile_image=profile_image,
            password=make_password(data["password"]),
            user_type="tutor",
            country=data["country"],
        )

        is_native = data["isNative"].lower() == "true"

        if is_native:
            govt_id = image_file
            certificate = None
        else:
            govt_id = None
            certificate = image_file

        # Create TutorDetails without video
        tutor_details = TutorDetails.objects.create(
            user=user,
            speakin_name=speakin_name,
            about=data["about"],
            required_credits=data["hourlyRate"],
            govt_id=govt_id,
            certificate=certificate,
        )

        # Process languages and other data...
        language_instance = Language.objects.get(name=data["teachingLanguage"])
        is_native_value = data["isNative"] == "true"

        TutorLanguageToTeach.objects.create(
            user=user, is_native=is_native_value, language=language_instance
        )

        # Process spoken languages...
        spoken_languages_str = data.get("spokenLanguages", "[]")
        try:
            spoken_languages = json.loads(spoken_languages_str)
            if not isinstance(spoken_languages, list):
                spoken_languages = [spoken_languages]

            # Pre-validate all languages and proficiencies before creating any objects
            language_proficiency_pairs = []
            for spoken_lang in spoken_languages:
                try:
                    language_obj = Language.objects.get(name=spoken_lang["language"])
                    proficiency_obj = Proficiency.objects.get(
                        level=spoken_lang["proficiency"]
                    )
                    language_proficiency_pairs.append((language_obj, proficiency_obj))
                except Language.DoesNotExist:
                    return Response(
                        {
                            "error": f"Language '{spoken_lang['language']}' does not exist."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                except Proficiency.DoesNotExist:
                    return Response(
                        {
                            "error": f"Proficiency level '{spoken_lang['proficiency']}' does not exist."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            # Create all LanguageSpoken records
            for language_obj, proficiency_obj in language_proficiency_pairs:
                LanguageSpoken.objects.create(
                    user=user, language=language_obj, proficiency=proficiency_obj
                )
            logger.info("Languages spoken updated successfully")
        except json.JSONDecodeError:
            raise ValueError("Invalid spokenLanguages format")

        # Handle video upload
        if video_file:
            # Read the file content
            video_content = video_file.read()

            # Create a new ContentFile with the video content
            video_file_content = ContentFile(video_content)
            video_file_content.name = video_file.name

            # Pass the serializable content to the task
            process_video_upload.delay(
                "TutorDetails",
                tutor_details.id,
                {
                    "content": video_content,
                    "name": video_file.name,
                    "content_type": video_file.content_type,
                },
            )

            logger.info("Video upload processed successfully")

        logger.info("Tutor request submitted successfully")
        return Response(
            {
                "message": "Tutor request submitted successfully! Video upload is being processed.",
                "user_id": user.id,
            },
            status=status.HTTP_201_CREATED,
        )

    except ValueError as e:
        transaction.set_rollback(True)
        logger.error(f"ValueError: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        transaction.set_rollback(True)
        logger.error(f"Unexpected error: {str(e)}")
        return Response(
            {"error": "An error occurred while processing your request."},
            status=status.HTTP_400_BAD_REQUEST,
        )


class BlockUnblockUser(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, id):
        try:
            user = User.objects.get(id=id)
            is_active = request.data.get("is_active", False)

            # Only send email if status is actually changing
            if user.is_active != is_active:
                user.is_active = is_active
                user.save()

                if is_active:
                    EmailService.send_account_reactivation_email(user)
                    message = "User unblocked successfully!"
                else:
                    EmailService.send_account_suspension_email(user)
                    message = "User blocked successfully!"

                logger.info(f"User status changed: {user.is_active}")
                return Response({"message": message}, status=status.HTTP_200_OK)

            logger.info("No change in user status")
            return Response(
                {"message": "No change in user status"}, status=status.HTTP_200_OK
            )

        except User.DoesNotExist:
            logger.warning("User not found")
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def tutor_sign_in(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(request, username=email, password=password)
    if user is not None and user.user_type != "student":
        # Check if the user is a tutor and verify the tutor status
        if user.user_type == "tutor":
            try:
                tutor_details = (
                    user.tutor_details
                )  # Access the related TutorDetails model
                if tutor_details.status == "pending":
                    logger.warning("Tutor account is still pending approval")
                    return Response(
                        {"detail": "Your tutor account is still pending approval."},
                        status=status.HTTP_403_FORBIDDEN,
                    )
            except TutorDetails.DoesNotExist:
                logger.warning("Tutor details not found.")
                return Response(
                    {"detail": "Tutor details not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

        # If tutor is approved or user is admin, allow sign-in
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        access_token["is_admin"] = user.is_staff
        logger.info("Tutor sign-in successful")
        return Response(
            {
                "access": str(access_token),
                "refresh": str(refresh),
                "name": user.name,
                "id": user.id,
                "credits": user.balance_credits,
                "required_credits": user.tutor_details.required_credits,
            },
            status=status.HTTP_200_OK,
        )

    logger.error("Invalid email or password")
    return Response(
        {"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED
    )


class ChangePassword(APIView):
    def post(self, request):
        logger.info("Change password request received")
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            # If valid, update the password
            serializer.update_password(request.user)
            logger.info("Password changed successfully")
            return Response(
                {"detail": "Password changed successfully"}, status=status.HTTP_200_OK
            )
        logger.error("Invalid password change request")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TeachingLanguageChangeRequestList(generics.ListCreateAPIView):
    queryset = TeachingLanguageChangeRequest.objects.all()
    serializer_class = TeachingLanguageChangeRequestSerializer

    def perform_create(self, serializer):
        logger.info("Teaching language change request received")
        existing_request = TeachingLanguageChangeRequest.objects.filter(
            user=self.request.user, status="pending"
        ).first()

        if existing_request:
            logger.warning(
                "You already have a pending request to change your teaching language."
            )
            raise serializers.ValidationError(
                {
                    "error": "You already have a pending request to change your teaching language."
                }
            )

        video_file = self.request.FILES.get("intro_video")
        if video_file:
            # Read the file content
            video_content = video_file.read()

            # Create request without video first
            instance = serializer.save(user=self.request.user)

            # Pass the serializable content to the task
            process_video_upload.delay(
                "TeachingLanguageChangeRequest",
                instance.id,
                {
                    "content": video_content,
                    "name": video_file.name,
                    "content_type": video_file.content_type,
                },
            )
        else:
            instance = serializer.save(user=self.request.user)
        logger.info("Teaching language change request saved successfully")
        return instance


class TeachingLanguageChangeRequestDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TeachingLanguageChangeRequest.objects.all()
    serializer_class = TeachingLanguageChangeRequestSerializer
    permission_classes = [IsAdminUser]

    @transaction.atomic
    def patch(self, request, pk):
        try:
            logger.info("Teaching language change request approved")
            change_request = get_object_or_404(TeachingLanguageChangeRequest, id=pk)

            # Create or update TutorLanguageToTeach
            TutorLanguageToTeach.objects.update_or_create(
                user=change_request.user,
                defaults={
                    "language_id": change_request.new_language.id,
                    "is_native": change_request.is_native,
                },
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

            logger.info("Tutor details updated successfully")
            tutor_details.save()

            # Update User name
            logger.info("Updating profile", change_request.profile_image)
            user = change_request.user
            user.name = change_request.full_name
            user.profile_image = change_request.profile_image
            user.save()

            EmailService.send_language_change_approval_email(
                user, change_request.new_language.name, tutor_details.speakin_name
            )

            # Delete the change request
            change_request.delete()

            logger.info("Language change request approved successfully")
            return Response(
                {"message": "Language change request approved successfully"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @transaction.atomic
    def delete(self, request, pk):
        try:
            change_request = get_object_or_404(TeachingLanguageChangeRequest, id=pk)
            logger.info("Teaching language change request found")
            tutor_details = TutorDetails.objects.get(user=change_request.user)
            user = change_request.user

            # Get the current language name before deleting
            old_language = TutorLanguageToTeach.objects.get(user=user).language.name
            new_language_name = change_request.new_language.name

            change_request.delete()

            EmailService.send_language_change_denial_email(
                user, new_language_name, tutor_details.speakin_name, old_language
            )

            logger.info("Language change request denied successfully")
            return Response(
                {"message": "Language change request denied successfully"},
                status=status.HTTP_200_OK,
            )

        except TutorLanguageToTeach.DoesNotExist:
            logger.warning("Old language data for tutor not found.")
            return Response(
                {"error": "Old language data for tutor not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserBalance(generics.GenericAPIView):
    def get(self, request, pk):
        try:
            user = User.objects.get(id=pk)
            logger.info(f"User balance retrieved: {user.balance_credits}")
            return Response({"balance_credits": user.balance_credits})
        except User.DoesNotExist:
            logger.warning("User not found")
            return Response({"error": "User not found"}, status=404)


class TutorDetail(generics.RetrieveAPIView):
    queryset = TutorDetails.objects.all()
    serializer_class = TutorDetailsSerializer

    def get_object(self):
        logger.info("Tutor detail request received")
        user_id = self.kwargs.get("pk")
        return get_object_or_404(TutorDetails, user_id=user_id)
