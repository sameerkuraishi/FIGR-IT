from django.contrib.auth.models import User
from rest_framework import serializers

from .models import CounsellorProfile, CounsellingSession


class CounsellorProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    first_name = serializers.CharField(
        source="user.first_name",
        read_only=True
    )

    last_name = serializers.CharField(
        source="user.last_name",
        read_only=True
    )

    class Meta:
        model = CounsellorProfile

        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "qualification",
            "specialization",
            "experience_years",
            "organization",
            "bio",
            "city",
            "phone",
            "avatar",
            "is_available",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "created_at",
            "updated_at",
        ]


class CounsellorListSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    name = serializers.SerializerMethodField()

    class Meta:
        model = CounsellorProfile

        fields = [
            "id",
            "username",
            "name",
            "qualification",
            "specialization",
            "experience_years",
            "organization",
            "bio",
            "city",
            "avatar",
            "is_available",
        ]

    def get_name(self, obj):
        return (
            obj.user.get_full_name()
            or obj.user.username
        )


class CounsellingSessionSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    counsellor_name = serializers.SerializerMethodField()

    class Meta:
        model = CounsellingSession

        fields = [
            "id",
            "student",
            "student_name",
            "counsellor",
            "counsellor_name",
            "scheduled_at",
            "duration_minutes",
            "topic",
            "notes",
            "status",
            "meeting_link",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "student_name",
            "counsellor_name",
            "created_at",
            "updated_at",
        ]

    def get_student_name(self, obj):
        return (
            obj.student.get_full_name()
            or obj.student.username
        )

    def get_counsellor_name(self, obj):
        return (
            obj.counsellor.get_full_name()
            or obj.counsellor.username
        )