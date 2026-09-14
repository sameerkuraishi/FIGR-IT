from rest_framework import serializers

from .models import (
    StudentProfile,
    Assessment,
    AssessmentQuestion,
    AssessmentAnswer,
    AssessmentResult,
    CareerRecommendation,
)


# ============================================================
# STUDENT PROFILE SERIALIZER
# ============================================================

class StudentProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentProfile

        fields = [
            "id",
            "user",
            "date_of_birth",
            "class_name",
            "stream",
            "school",
            "city",
            "interests",
            "skills",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "created_at",
            "updated_at",
        ]


# ============================================================
# ASSESSMENT QUESTION SERIALIZER
# ============================================================

class AssessmentQuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = AssessmentQuestion

        fields = [
            "id",
            "assessment",
            "question",
            "category",
            "question_order",
        ]

        read_only_fields = [
            "id",
            "assessment",
        ]


# ============================================================
# ASSESSMENT ANSWER SERIALIZER
# ============================================================

class AssessmentAnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = AssessmentAnswer

        fields = [
            "id",
            "assessment",
            "question",
            "answer",
            "score",
            "answered_at",
        ]

        read_only_fields = [
            "id",
            "assessment",
            "answered_at",
        ]


# ============================================================
# ASSESSMENT SERIALIZER
# ============================================================

class AssessmentSerializer(serializers.ModelSerializer):

    questions = AssessmentQuestionSerializer(
        many=True,
        read_only=True
    )

    answers = AssessmentAnswerSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Assessment

        fields = [
            "id",
            "student",
            "title",
            "started_at",
            "completed_at",
            "score",
            "is_completed",
            "questions",
            "answers",
        ]

        read_only_fields = [
            "id",
            "student",
            "started_at",
            "completed_at",
            "score",
            "is_completed",
            "questions",
            "answers",
        ]


# ============================================================
# ASSESSMENT RESULT SERIALIZER
# ============================================================

class AssessmentResultSerializer(serializers.ModelSerializer):

    class Meta:
        model = AssessmentResult

        fields = [
            "id",
            "assessment",
            "recommended_career",
            "confidence",
            "explanation",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "assessment",
            "created_at",
        ]


# ============================================================
# CAREER RECOMMENDATION SERIALIZER
# ============================================================

class CareerRecommendationSerializer(serializers.ModelSerializer):

    class Meta:
        model = CareerRecommendation

        fields = [
            "id",
            "student",
            "career",
            "match_percentage",
            "reason",
            "required_skills",
            "roadmap",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "student",
            "created_at",
        ]