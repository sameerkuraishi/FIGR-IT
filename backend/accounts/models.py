from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):

    ROLE_CHOICES = [
        ("STUDENT", "Student"),
        ("COUNSELLOR", "Counsellor"),
        ("ALUMNI", "Alumni"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="STUDENT",
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
    )

    avatar = models.URLField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return f"{self.user.username} - {self.role}"