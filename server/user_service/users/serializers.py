from rest_framework import serializers
from .models import User, LanguageSpoken, LanguageToLearn, Language, Proficiency, TutorLanguageToTeach, TutorDetails

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password', 'user_type', 'country', 'profile_image']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.country = validated_data.get('country', instance.country)
        if 'profile_image' in validated_data:
            instance.profile_image = validated_data['profile_image']
        instance.save()
        return instance
     
class LanguageSpokenSerializer(serializers.ModelSerializer):
    language = serializers.SlugRelatedField(slug_field='name', queryset=Language.objects.all())
    proficiency = serializers.SlugRelatedField(slug_field='level', queryset=Proficiency.objects.all())

    class Meta:
        model = LanguageSpoken
        fields = '__all__'

class LanguageToLearnSerializer(serializers.ModelSerializer):
    language = serializers.SlugRelatedField(slug_field='name', queryset=Language.objects.filter(name__in=['English', 'Mandarin', 'Arabic', 'French', 'Spanish']))
    proficiency = serializers.SlugRelatedField(slug_field='level', queryset=Proficiency.objects.exclude(level='Native'))

    class Meta:
        model = LanguageToLearn
        fields = '__all__'

class TutorDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorDetails
        fields = '__all__'

class TutorLanguageToTeachSerializer(serializers.ModelSerializer):
    language = serializers.SlugRelatedField(slug_field='name', queryset=Language.objects.filter(name__in=['English', 'Mandarin', 'Arabic', 'French', 'Spanish']))

    class Meta:
        model = TutorLanguageToTeach
        fields = '__all__'
