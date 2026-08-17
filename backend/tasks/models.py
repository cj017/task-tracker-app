from django.db import models
from django.contrib.auth.models import User


class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')

    def __str__(self):
        return self.title

class Task(models.Model):
    STATUS_CHOICES = [
        ('todo', 'Не выполнено'),
        ('in_progress', 'В процессе'),
        ('done', 'Выполнено'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Низкий'),
        ('medium', 'Средний'),
        ('high', 'Высокий'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    project=models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')

    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')

    due_date= models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# Create your models here.
