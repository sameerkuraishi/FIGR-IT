from django.contrib.auth.models import User
from django.db import models
class StudentProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="student_profile"
    )
    date_of_birth = models.DateField(
        null=True,
        blank=True
    )
    class_name = models.CharField(
        max_length=50,
        blank=True
    )
    stream = models.CharField(
        max_length=100,
        blank=True
    )
    school = models.CharField(
        max_length=200,
        blank=True
    )
    city = models.CharField(
        max_length=100,
        blank=True
    )
    interests = models.TextField(
        blank=True
    )
    skills = models.TextField(
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
            self.user.get_full_name()
            or self.user.username
        )
class Assessment(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="assessments"
    )
    title = models.CharField(
        max_length=200,
        default="Career Assessment"
    )
    started_at = models.DateTimeField(
        auto_now_add=True
    )
    completed_at = models.DateTimeField(
        null=True,
        blank=True
    )
    score = models.FloatField(
        default=0
    )
    is_completed = models.BooleanField(
        default=False
    )
    def __str__(self):
        return (
            f"{self.student.username} - "
            f"{self.title}"
        )
class AssessmentQuestion(models.Model):
    assessment = models.ForeignKey(
        Assessment,
        on_delete=models.CASCADE,
        related_name="questions"
    )
    question = models.TextField()
    category = models.CharField(
        max_length=100,
        blank=True
    )
    question_order = models.PositiveIntegerField(
        default=1
    )
    def __str__(self):
        return self.question[:80]
class AssessmentAnswer(models.Model):
    assessment = models.ForeignKey(
        Assessment,
        on_delete=models.CASCADE,
        related_name="answers"
    )
    question = models.ForeignKey(
        AssessmentQuestion,
        on_delete=models.CASCADE,
        related_name="answers"
    )
    answer = models.TextField()
    score = models.FloatField(
        default=0
    )
    answered_at = models.DateTimeField(
        auto_now=True
    )
    def __str__(self):
        return (
            f"{self.assessment.student.username} "
            f"- Answer"
        )
class AssessmentResult(models.Model):
    assessment = models.OneToOneField(
        Assessment,
        on_delete=models.CASCADE,
        related_name="result"
    )
    recommended_career = models.CharField(
        max_length=200
    )
    confidence = models.FloatField(
        default=0
    )
    explanation = models.TextField(
        blank=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    def __str__(self):
        return (
            f"{self.assessment.student.username} "
            f"- {self.recommended_career}"
        )
class CareerRecommendation(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="career_recommendations"
    )
    career = models.CharField(
        max_length=200
    )
    match_percentage = models.FloatField(
        default=0
    )
    reason = models.TextField(
        blank=True
    )
    required_skills = models.TextField(
        blank=True
    )
    roadmap = models.TextField(
        blank=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    def __str__(self):
        return (
            f"{self.student.username} "
            f"- {self.career}"
        )
class CareerRoadmap(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="career_roadmaps"
    )
    career = models.CharField(
        max_length=200
    )
    current_level = models.CharField(
        max_length=100,
        default="Beginner"
    )
    missing_skills = models.TextField(
        blank=True
    )
    recommended_skills = models.TextField(
        blank=True
    )
    projects = models.TextField(
        blank=True
    )
    roadmap = models.TextField(
        blank=True
    )
    duration_months = models.PositiveIntegerField(
        default=12
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )
    def __str__(self):
        return (
            f"{self.student.username} "
            f"- {self.career} Roadmap"
        )