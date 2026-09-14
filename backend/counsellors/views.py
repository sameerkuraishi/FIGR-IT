from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CounsellorProfile, CounsellingSession
from .serializers import (
    CounsellorProfileSerializer,
    CounsellorListSerializer,
    CounsellingSessionSerializer,
)


class CounsellorProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get_profile(self, user):
        profile, _ = CounsellorProfile.objects.get_or_create(user=user)
        return profile

    def get(self, request):
        profile = self.get_profile(request.user)
        serializer = CounsellorProfileSerializer(profile)
        return Response(serializer.data)
    def put(self, request):
        profile = self.get_profile(request.user)
        serializer = CounsellorProfileSerializer(profile, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data)
class CounsellorListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        counsellors = CounsellorProfile.objects.filter(is_available=True).select_related("user")
        serializer = CounsellorListSerializer(counsellors, many=True)
        return Response(serializer.data)
class CounsellingSessionListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = (
            CounsellingSession.objects
            .filter(student=request.user)
            .select_related("student", "counsellor")
            .order_by("-scheduled_at")
        )
        serializer = CounsellingSessionSerializer(sessions, many=True)
        return Response(serializer.data)

    def post(self, request):
        counsellor_id = request.data.get("counsellor")
        scheduled_at = request.data.get("scheduled_at")
        topic = request.data.get("topic")
        duration_minutes = request.data.get("duration_minutes", 30)
        notes = request.data.get("notes", "")

        if not counsellor_id:
            return Response({"error": "counsellor is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not scheduled_at:
            return Response({"error": "scheduled_at is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not topic:
            return Response({"error": "topic is required."}, status=status.HTTP_400_BAD_REQUEST)

        counsellor = get_object_or_404(User, id=counsellor_id)

        if not hasattr(counsellor, "counsellor_profile"):
            return Response({"error": "Selected user is not a counsellor."}, status=status.HTTP_400_BAD_REQUEST)

        if not counsellor.counsellor_profile.is_available:
            return Response({"error": "Counsellor is currently unavailable."}, status=status.HTTP_400_BAD_REQUEST)

        session = CounsellingSession.objects.create(
            student=request.user,
            counsellor=counsellor,
            scheduled_at=scheduled_at,
            duration_minutes=duration_minutes,
            topic=topic,
            notes=notes,
        )
        serializer = CounsellingSessionSerializer(session)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CounsellorSessionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = (
            CounsellingSession.objects
            .filter(counsellor=request.user)
            .select_related("student", "counsellor")
            .order_by("-scheduled_at")
        )
        serializer = CounsellingSessionSerializer(sessions, many=True)
        return Response(serializer.data)


class CounsellorSessionUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, session_id):
        session = get_object_or_404(CounsellingSession, id=session_id, counsellor=request.user)

        new_status = request.data.get("status")
        allowed_statuses = ["CONFIRMED", "CANCELLED", "COMPLETED"]

        if new_status not in allowed_statuses:
            return Response(
                {"error": "Invalid status. Use CONFIRMED, CANCELLED, or COMPLETED."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        session.status = new_status

        if "notes" in request.data:
            session.notes = request.data.get("notes", "")

        if "meeting_link" in request.data:
            session.meeting_link = request.data.get("meeting_link", "")

        session.save()

        serializer = CounsellingSessionSerializer(session)
        return Response(serializer.data)


class CounsellorStudentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = CounsellingSession.objects.filter(counsellor=request.user).select_related("student")

        students = {}
        for session in sessions:
            s = session.student
            students[s.id] = {
                "id": s.id,
                "username": s.username,
                "email": s.email,
                "first_name": s.first_name,
                "last_name": s.last_name,
            }

        return Response(list(students.values()))