from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'user_type', 'languages_spoken', 'proficiency_in_language_spoken', 'country', 'language_to_learn', 'proficiency_in_learning_language']

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user