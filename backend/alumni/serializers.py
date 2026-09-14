from django.contrib.auth.models import User
from rest_framework import serializers

from .models import AlumniProfile, MentorshipRequest


class AlumniProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    name = serializers.SerializerMethodField()
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = AlumniProfile
        fields = [
            "id",
            "username",
            "name",
            "email",
            "graduation_year",
            "college",
            "degree",
            "field_of_study",
            "company",
            "job_title",
            "experience_years",
            "city",
            "bio",
            "skills",
            "linkedin_url",
            "avatar",
            "is_available_for_mentorship",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "username",
            "name",
            "email",
            "created_at",
            "updated_at",
        ]

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class AlumniListSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = AlumniProfile
        fields = [
            "id",
            "username",
            "name",
            "graduation_year",
            "college",
            "degree",
            "field_of_study",
            "company",
            "job_title",
            "experience_years",
            "city",
            "bio",
            "skills",
            "linkedin_url",
            "avatar",
            "is_available_for_mentorship",
        ]

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class MentorshipRequestSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    alumni_name = serializers.SerializerMethodField()

    class Meta:
        model = MentorshipRequest
        fields = [
            "id",
            "student",
            "student_name",
            "alumni",
            "alumni_name",
            "topic",
            "message",
            "status",
            "response",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "student",
            "student_name",
            "alumni_name",
            "status",
            "response",
            "created_at",
            "updated_at",
        ]

    def get_student_name(self, obj):
        return obj.student.get_full_name() or obj.student.username

    def get_alumni_name(self, obj):
        return obj.alumni.get_full_name() or obj.alumni.username