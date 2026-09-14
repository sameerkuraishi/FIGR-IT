from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import AlumniProfile, MentorshipRequest
from .serializers import (
    AlumniProfileSerializer,
    AlumniListSerializer,
    MentorshipRequestSerializer,
)


class AlumniProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, created = AlumniProfile.objects.get_or_create(
            user=request.user
        )

        serializer = AlumniProfileSerializer(profile)

        return Response(serializer.data)

    def put(self, request):
        profile, created = AlumniProfile.objects.get_or_create(
            user=request.user
        )

        serializer = AlumniProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class AlumniListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        alumni = AlumniProfile.objects.filter(
            is_available_for_mentorship=True
        ).select_related("user")

        serializer = AlumniListSerializer(
            alumni,
            many=True
        )

        return Response(serializer.data)


class MentorshipRequestListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        requests = MentorshipRequest.objects.filter(
            student=request.user
        ).select_related("student", "alumni")

        serializer = MentorshipRequestSerializer(
            requests,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):
        alumni_id = request.data.get("alumni")

        if not alumni_id:
            return Response(
                {"error": "alumni is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        alumni = get_object_or_404(
            User,
            id=alumni_id
        )

        try:
            alumni_profile = alumni.alumni_profile
        except AlumniProfile.DoesNotExist:
            return Response(
                {"error": "This user is not an alumni."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not alumni_profile.is_available_for_mentorship:
            return Response(
                {"error": "This alumni is not available for mentorship."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = MentorshipRequestSerializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save(
                student=request.user,
                alumni=alumni
            )

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class AlumniMentorshipRequestListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        requests = MentorshipRequest.objects.filter(
            alumni=request.user
        ).select_related("student", "alumni")

        serializer = MentorshipRequestSerializer(
            requests,
            many=True
        )

        return Response(serializer.data)


class MentorshipRequestUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, request_id):
        mentorship = get_object_or_404(
            MentorshipRequest,
            id=request_id
        )

        if mentorship.alumni != request.user:
            return Response(
                {"error": "You are not allowed to update this request."},
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get("status")

        allowed_statuses = [
            "ACCEPTED",
            "REJECTED",
            "COMPLETED",
            "CANCELLED",
        ]

        if new_status not in allowed_statuses:
            return Response(
                {
                    "error": (
                        "Invalid status. "
                        "Use ACCEPTED, REJECTED, COMPLETED or CANCELLED."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        mentorship.status = new_status

        if "response" in request.data:
            mentorship.response = request.data["response"]

        mentorship.save()

        serializer = MentorshipRequestSerializer(
            mentorship
        )

        return Response(serializer.data)