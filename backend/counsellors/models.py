from django.contrib.auth.models import User
from django.db import models


class CounsellorProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="counsellor_profile"
    )

    qualification = models.CharField(
        max_length=200,
        blank=True
    )

    specialization = models.CharField(
        max_length=300,
        blank=True
    )

    experience_years = models.PositiveIntegerField(
        default=0
    )

    organization = models.CharField(
        max_length=200,
        blank=True
    )

    bio = models.TextField(
        blank=True
    )

    city = models.CharField(
        max_length=100,
        blank=True
    )

    phone = models.CharField(
        max_length=20,
        blank=True
    )

    avatar = models.URLField(
        blank=True
    )

    is_available = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return (
            self.user.get_full_name()
            or self.user.username
        )


class CounsellingSession(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("CONFIRMED", "Confirmed"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="counselling_sessions"
    )

    counsellor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="counsellor_sessions"
    )

    scheduled_at = models.DateTimeField()

    duration_minutes = models.PositiveIntegerField(
        default=30
    )

    topic = models.CharField(
        max_length=300
    )

    notes = models.TextField(
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    meeting_link = models.URLField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return (
            f"{self.student.username} - "
            f"{self.counsellor.username}"
        )