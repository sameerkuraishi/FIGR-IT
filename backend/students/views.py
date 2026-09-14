from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import (
    StudentProfile,
    Assessment,
    AssessmentQuestion,
    AssessmentAnswer,
    AssessmentResult,
    CareerRecommendation,
)
from .serializers import (
    StudentProfileSerializer,
    AssessmentSerializer,
    AssessmentAnswerSerializer,
    AssessmentResultSerializer,
    CareerRecommendationSerializer,
)
from .recommendation_engine import generate_recommendations
class StudentProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get_profile(self, user):
        profile, created = StudentProfile.objects.get_or_create(
            user=user
        )
        return profile
    def get(self, request):
        profile = self.get_profile(request.user)
        serializer = StudentProfileSerializer(profile)
        return Response(serializer.data)
    def put(self, request):
        profile = self.get_profile(request.user)
        serializer = StudentProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
class AssessmentListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        assessments = Assessment.objects.filter(
            student=request.user
        ).order_by("-started_at")
        serializer = AssessmentSerializer(
            assessments,
            many=True
        )
        return Response(serializer.data)
    def post(self, request):

        title = request.data.get(
            "title",
            "Career Assessment"
        )
        assessment = Assessment.objects.create(
            student=request.user,
            title=title
        )
        serializer = AssessmentSerializer(
            assessment
        )
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
class AssessmentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id):
        assessment = get_object_or_404(
            Assessment,
            id=assessment_id,
            student=request.user
        )
        serializer = AssessmentSerializer(
            assessment
        )
        return Response(serializer.data)
class AssessmentAnswerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, assessment_id):
        assessment = get_object_or_404(
            Assessment,
            id=assessment_id,
            student=request.user
        )
        if assessment.is_completed:

            return Response(
                {
                    "error": "Assessment is already completed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        question_id = request.data.get("question")
        answer_text = request.data.get("answer")
        score = request.data.get("score")
        if not question_id:
            return Response(
                {
                    "error": "question is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        if not answer_text:

            return Response(
                {
                    "error": "answer is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        if score is None:
            return Response(
                {
                    "error": "score is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            score = float(score) 
        except (ValueError, TypeError):
            return Response(
                {
                    "error": "score must be a number."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        if score < 1 or score > 5:
            return Response(
                {
                    "error": "score must be between 1 and 5."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        question = get_object_or_404(
            AssessmentQuestion,
            id=question_id,
            assessment=assessment
        )
        answer, created = AssessmentAnswer.objects.update_or_create(
            assessment=assessment,
            question=question,
            defaults={
                "answer": answer_text,
                "score": score,
            }
        )
        serializer = AssessmentAnswerSerializer(
            answer
        )
        return Response(
            serializer.data,
            status=(
                status.HTTP_201_CREATED
                if created
                else status.HTTP_200_OK
            )
        )
class AssessmentCompleteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, assessment_id):
        assessment = get_object_or_404(
            Assessment,
            id=assessment_id,
            student=request.user
        )
        if assessment.is_completed:

            return Response(
                {
                    "error": "Assessment is already completed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        answers = assessment.answers.all()
        total_questions = assessment.questions.count()
        answered_questions = answers.count()

        if total_questions == 0:

            return Response(
                {
                    "error": "Assessment has no questions."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if answered_questions < total_questions:

            return Response(
                {
                    "error": "Please answer all questions before completing the assessment.",
                    "total_questions": total_questions,
                    "answered_questions": answered_questions,
                    "remaining_questions": (
                        total_questions - answered_questions
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        total_score = sum(
            answer.score
            for answer in answers
        )
        assessment.score = total_score
        assessment.is_completed = True
        assessment.completed_at = timezone.now()
        assessment.save()
        maximum_score = total_questions * 5

        percentage = (
            (total_score / maximum_score) * 100
            if maximum_score > 0
            else 0
        )
        if percentage >= 80:
            career = "AI / Machine Learning Engineer"
            confidence = 90
        elif percentage >= 65:
            career = "Software Engineer"
            confidence = 80
        elif percentage >= 50:
            career = "Data Analyst"
            confidence = 70
        else:
            career = "Web Developer"
            confidence = 60
        result, created = AssessmentResult.objects.update_or_create(
            assessment=assessment,
            defaults={
                "recommended_career": career,
                "confidence": confidence,
                "explanation": (
                    "Assessment completed successfully. "
                    "The overall score was calculated from "
                    "the submitted answers."
                ),
            }
        )
        CareerRecommendation.objects.filter(
            student=request.user
        ).delete()

        recommendations = generate_recommendations(
            assessment
        )
        saved_recommendations = []
        for recommendation in recommendations[:5]:

            category_scores = recommendation.pop(
                "category_scores",
                {}
            )
            sorted_categories = sorted(
                category_scores.items(),
                key=lambda item: item[1],
                reverse=True
            )
            strongest_categories = [
                category
                for category, score in sorted_categories[:3]
            ]
            if strongest_categories:
                reason = (
                    "Your strongest assessment areas are: "
                    + ", ".join(strongest_categories)
                    + ". These areas align well with this career."
                )
            else:
                reason = (
                    "This career recommendation is based "
                    "on your assessment responses."
                )
            saved = CareerRecommendation.objects.create(
                student=request.user,
                career=recommendation["career"],
                match_percentage=recommendation[
                    "match_percentage"
                ],
                reason=reason,
                required_skills=recommendation[
                    "required_skills"
                ],
                roadmap=recommendation[
                    "roadmap"
                ],
            )
            saved_recommendations.append(saved)
        recommendation_serializer = (
            CareerRecommendationSerializer(
                saved_recommendations,
                many=True
            )
        )
        return Response(
            {
                "message": "Assessment completed successfully.",

                "assessment_id": assessment.id,

                "total_questions": total_questions,

                "answered_questions": answered_questions,

                "score": assessment.score,

                "score_percentage": round(
                    percentage,
                    2
                ),
                "result": AssessmentResultSerializer(
                    result
                ).data,

                "career_recommendations": (
                    recommendation_serializer.data
                ),
            },
            status=status.HTTP_200_OK
        )
class AssessmentResultView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id):
        assessment = get_object_or_404(
            Assessment,
            id=assessment_id,
            student=request.user
        )
        result = get_object_or_404(
            AssessmentResult,
            assessment=assessment
        )
        serializer = AssessmentResultSerializer(
            result
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
class CareerRecommendationView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        recommendations = (
            CareerRecommendation.objects
            .filter(student=request.user)
            .order_by("-match_percentage")
        )

        serializer = CareerRecommendationSerializer(
            recommendations,
            many=True
        )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
    def post(self, request):

        assessment_id = request.data.get(
            "assessment_id"
        )
        if not assessment_id:
            return Response(
                {
                    "error": "assessment_id is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            assessment = Assessment.objects.get(
                id=assessment_id,
                student=request.user
            )
        except Assessment.DoesNotExist:
            return Response(
                {
                    "error": "Assessment not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )
        if not assessment.is_completed:
            return Response(
                {
                    "error": (
                        "Complete the assessment "
                        "before generating recommendations."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        CareerRecommendation.objects.filter(
            student=request.user
        ).delete()
        recommendations = generate_recommendations(
            assessment
        )
        saved_recommendations = []
        for recommendation in recommendations[:5]:

            category_scores = recommendation.pop(
                "category_scores",
                {}
            )
            sorted_categories = sorted(
                category_scores.items(),
                key=lambda item: item[1],
                reverse=True
            )
            strongest_categories = [
                category
                for category, score in sorted_categories[:3]
            ]
            if strongest_categories:
                reason = (
                    "Your strongest assessment areas are: "
                    + ", ".join(strongest_categories)
                    + ". These areas align well with this career."
                )
            else:
                reason = (
                    "This career recommendation is based "
                    "on your assessment responses."
                )
            saved = CareerRecommendation.objects.create(
                student=request.user,
                career=recommendation["career"],
                match_percentage=recommendation[
                    "match_percentage"
                ],
                reason=reason,
                required_skills=recommendation[
                    "required_skills"
                ],
                roadmap=recommendation[
                    "roadmap"
                ],
            )
            saved_recommendations.append(
                saved
            )
        serializer = CareerRecommendationSerializer(
            saved_recommendations,
            many=True
        )
        return Response(
            {
                "message": (
                    "Career recommendations generated "
                    "successfully."
                ),
                "assessment_id": assessment.id,
                "recommendations": serializer.data,
            },
            status=status.HTTP_201_CREATED
        )