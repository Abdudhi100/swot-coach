from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ("id","email","password")
    def create(self, validated_data):
        return User.objects.create_user(email=validated_data["email"], password=validated_data["password"])

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    def validate(self, attrs):
        user = authenticate(email=attrs["email"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        attrs["user"] = user
        return attrs
