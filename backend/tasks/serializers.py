from rest_framework import serializers
from .models import Project, Task


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "description",
        ]

    def create(self, validated_data):
        user = self.context["request"].user

        return Project.objects.create(
            user=user,
            **validated_data
        )


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