import json
from rest_framework import serializers
from .models import User, LanguageSpoken, LanguageToLearn, Language, Proficiency, TutorLanguageToTeach, TutorDetails, TeachingLanguageChangeRequest
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
     
class LanguageSpokenSerializer(serializers.ModelSerializer):
    language = serializers.SlugRelatedField(slug_field='name', queryset=Language.objects.all())
    proficiency = serializers.SlugRelatedField(slug_field='level', queryset=Proficiency.objects.all())

    class Meta:
        model = LanguageSpoken
        fields = ['language', 'proficiency']

class LanguageToLearnSerializer(serializers.ModelSerializer):
    language = serializers.SlugRelatedField(slug_field='name', queryset=Language.objects.filter(name__in=['English', 'Chinese', 'Arabic', 'French', 'Spanish', 'Hindi']))
    proficiency = serializers.SlugRelatedField(slug_field='level', queryset=Proficiency.objects.all())

    class Meta:
        model = LanguageToLearn
        fields = ['language', 'proficiency']

class TutorDetailsSerializer(serializers.ModelSerializer):
    language_spoken = LanguageSpokenSerializer(many=True, read_only=True, source='user.language_spoken')

    class Meta:
        model = TutorDetails
        fields = ['id','user','speakin_name', 'about', 'required_credits', 'intro_video', 'certificate', 'govt_id', 'status', 'rating', 'total_reviews', 'language_spoken']

    def create(self, validated_data):
        user_id = validated_data.pop('user_id')  # Assuming user_id is passed in the request
        user = User.objects.get(id=user_id)  # Retrieve the user instance
        return TutorDetails.objects.create(user=user, **validated_data)
 
class TutorLanguageToTeachSerializer(serializers.ModelSerializer):
    language = serializers.SlugRelatedField(slug_field='name', queryset=Language.objects.filter(name__in=['English', 'Chinese', 'Arabic', 'French', 'Spanish', 'Hindi']))
    
    class Meta:
        model = TutorLanguageToTeach
        fields = ['language', 'is_native']

class UserSerializer(serializers.ModelSerializer):
    tutor_details = TutorDetailsSerializer(read_only=True)  # Include Tutor details
    language_spoken = LanguageSpokenSerializer(many=True, read_only=True)  # Include languages spoken
    tutor_language_to_teach = TutorLanguageToTeachSerializer(many=True, read_only=True)
    language_to_learn = LanguageToLearnSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'user_type', 'country', 'profile_image', 'tutor_details', 'language_spoken', 'tutor_language_to_teach', 'balance_credits', 'is_active', 'password', 'language_to_learn']
        extra_kwargs = {
            'password': {'write_only': True}
        } 

    def create(self, validated_data): 
        # Hash the password before saving the user 
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'password':
                setattr(instance, attr, make_password(value))
            elif attr == 'profile_image':
                instance.profile_image = value
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance
  
    def to_representation(self, instance):
        """Customize which fields are included based on the user type."""
        representation = super().to_representation(instance)
 
        # Only include `language_to_learn` for students
        if instance.user_type != 'student':
            representation.pop('language_to_learn', None)
            
        # Only include `tutor_language_to_teach` for tutors
        if instance.user_type != 'tutor':
            representation.pop('tutor_language_to_teach', None)
            representation.pop('tutor_details', None)

        return representation
    
class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

    def validate(self, attrs):
        user = self.context['request'].user
        
        if not user.check_password(attrs['current_password']):
            raise serializers.ValidationError({"current_password": "Current password is incorrect."})
        
        return attrs 

    def update_password(self, user):
        # Set the new password
        user.set_password(self.validated_data['new_password'])
        user.save()

class UserEmailStatusSerializer(serializers.ModelSerializer):
    """Serializer to include email and is_active status of the user."""
    class Meta:
        model = User
        fields = ['email', 'is_active']

class TeachingLanguageChangeRequestSerializer(serializers.ModelSerializer):
    user = UserEmailStatusSerializer(read_only=True)
    tutor_language_to_teach = TutorLanguageToTeachSerializer(many=True, source='user.tutor_language_to_teach', read_only=True)
    new_language = serializers.SlugRelatedField(
        slug_field='name', 
        queryset=Language.objects.all()
    )
    
    class Meta:
        model = TeachingLanguageChangeRequest
        fields = ['id', 'new_language', 'is_native', 'certificate', 'govt_id', 'intro_video',  
                 'full_name', 'about', 'status', 'user', 'tutor_language_to_teach', 'profile_image']
        read_only_fields = ['status']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Convert Language object to string in representation
        if instance.new_language:
            representation['new_language'] = instance.new_language.name
        return representation

    def to_internal_value(self, data):
        # Handle new_language field as a string (language name) and convert it to the corresponding language ID
        new_language_name = data.get('new_language') 
        if new_language_name:
            try:
                language = Language.objects.get(name=new_language_name)
                data['new_language'] = language.name
            except Language.DoesNotExist:
                raise serializers.ValidationError({'new_language': f"Language '{new_language_name}' not found."})

        is_native = data.get('is_native')
        if is_native is not None:
            data['is_native'] = is_native.lower() == 'true'

        # Handle image upload based on is_native flag
        image_file = data.get('imageUpload') 
        if image_file:
            if data['is_native']:
                data['govt_id'] = image_file
                data['certificate'] = None
            else:
                data['certificate'] = image_file
                data['govt_id'] = None

        return super().to_internal_value(data)

    def validate_spoken_languages(self, value):
        if not value:
            raise serializers.ValidationError("At least one spoken language is required.")
        
        valid_proficiencies = {'Native', 'C2', 'C1', 'B2', 'B1', 'A2', 'A1'}
        for lang in value:
            if not lang.get('proficiency'):
                raise serializers.ValidationError("Proficiency level is required for each language.")
            if lang['proficiency'] not in valid_proficiencies:
                raise serializers.ValidationError(f"Invalid proficiency level: {lang['proficiency']}")
        
        return value

    def create(self, validated_data):
        # Remove imageUpload from validated_data if it exists
        validated_data.pop('imageUpload', None)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Remove imageUpload from validated_data if it exists
        validated_data.pop('imageUpload', None)
        return super().update(instance, validated_data)