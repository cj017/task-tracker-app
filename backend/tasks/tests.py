from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Project


class ProjectApiTests(APITestCase):
    def test_authenticated_user_can_create_project(self):
        user = User.objects.create_user(username="project-owner", password="strong-password")
        self.client.force_authenticate(user=user)

        response = self.client.post(
            "/api/projects/",
            {"title": "Новый проект", "description": "Описание проекта"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.get().user, user)
