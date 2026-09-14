from rest_framework import serializers

from .models import College, Course, Branch, CollegeCutoff


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch

        fields = [
            "id",
            "name",
            "code",
            "duration_years",
            "seats",
            "eligibility",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]


class CourseSerializer(serializers.ModelSerializer):
    branches = BranchSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Course

        fields = [
            "id",
            "college",
            "name",
            "degree",
            "duration_years",
            "description",
            "eligibility",
            "annual_fees",
            "branches",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "branches",
            "created_at",
            "updated_at",
        ]


class CollegeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = College

        fields = [
            "id",
            "name",
            "short_name",
            "college_type",
            "city",
            "state",
            "nirf_rank",
            "average_package",
            "highest_package",
            "annual_fees",
            "logo",
        ]


class CollegeDetailSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = College

        fields = [
            "id",
            "name",
            "short_name",
            "college_type",
            "city",
            "state",
            "address",
            "website",
            "description",
            "nirf_rank",
            "established_year",
            "average_package",
            "highest_package",
            "annual_fees",
            "logo",
            "courses",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "courses",
            "created_at",
            "updated_at",
        ]


class CollegeCutoffSerializer(serializers.ModelSerializer):
    college_name = serializers.CharField(
        source="college.name",
        read_only=True
    )

    branch_name = serializers.CharField(
        source="branch.name",
        read_only=True
    )

    college_short_name = serializers.CharField(
        source="college.short_name",
        read_only=True
    )

    class Meta:
        model = CollegeCutoff

        fields = [
            "id",
            "college",
            "college_name",
            "college_short_name",
            "branch",
            "branch_name",
            "category",
            "gender",
            "home_state",
            "year",
            "opening_rank",
            "closing_rank",
            "round_number",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "college_name",
            "college_short_name",
            "branch_name",
            "created_at",
            "updated_at",
        ]