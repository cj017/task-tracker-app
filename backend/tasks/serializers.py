from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Project, Task


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "description",
        ]

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "project",
            "status",
            "priority",
            "due_date",
            "created_at",
        ]

        read_only_fields = [
            "created_at",
        ]

    def validate_project(self, project):
        request = self.context["request"]

        if project.user_id != request.user.id:
            raise serializers.ValidationError("Вы не можете создавать задачи в чужом проекте.")

        return project
