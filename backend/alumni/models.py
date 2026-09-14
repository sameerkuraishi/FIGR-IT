from django.contrib.auth.models import User
from django.db import models


class AlumniProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="alumni_profile"
    )

    graduation_year = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    college = models.CharField(
        max_length=200,
        blank=True
    )

    degree = models.CharField(
        max_length=200,
        blank=True
    )

    field_of_study = models.CharField(
        max_length=200,
        blank=True
    )

    company = models.CharField(
        max_length=200,
        blank=True
    )

    job_title = models.CharField(
        max_length=200,
        blank=True
    )

    experience_years = models.PositiveIntegerField(
        default=0
    )

    city = models.CharField(
        max_length=100,
        blank=True
    )

    bio = models.TextField(
        blank=True
    )

    skills = models.TextField(
        blank=True
    )

    linkedin_url = models.URLField(
        blank=True
    )

    avatar = models.URLField(
        blank=True
    )

    is_available_for_mentorship = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.user.get_full_name() or self.user.username


class MentorshipRequest(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("ACCEPTED", "Accepted"),
        ("REJECTED", "Rejected"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="mentorship_requests"
    )

    alumni = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="alumni_mentorship_requests"
    )

    topic = models.CharField(
        max_length=300
    )

    message = models.TextField(
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    response = models.TextField(
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
            f"{self.student.username} -> "
            f"{self.alumni.username} ({self.status})"
        )