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


from rest_framework import serializers
from django.utils import timezone
from .models import SWOTItem, Task, Streak

class SWOTItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SWOTItem
        fields = ["id", "type", "description", "frequency", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        return SWOTItem.objects.create(owner=self.context["request"].user, **validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["type"] = instance.type  # keep raw for frontend logic
        data["frequency"] = instance.frequency
        return data


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "swot_item", "date", "label", "status", "value", "created_at", "completed_at"]
        read_only_fields = ["id", "created_at", "completed_at"]

    def validate(self, attrs):
        # Enforce immutability for past dates on create/update
        request = self.context["request"]
        if request.method in ("PUT", "PATCH"):
            instance: Task = self.instance
            if instance and instance.date < timezone.localdate():
                raise serializers.ValidationError("Past tasks are immutable.")
        if request.method == "POST":
            # If you allow manual creation, block creating tasks in the past:
            if "date" in attrs and attrs["date"] < timezone.localdate():
                raise serializers.ValidationError("Cannot create tasks in the past.")
        return attrs


class StreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = Streak
        fields = ["count", "last_day"]
