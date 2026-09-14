from django.urls import path

from .views import (
    CounsellorProfileView,
    CounsellorListView,
    CounsellingSessionListCreateView,
    CounsellorSessionListView,
    CounsellorSessionUpdateView,
    CounsellorStudentListView,
)


urlpatterns = [

    # Counsellor profile
    path(
        "profile/",
        CounsellorProfileView.as_view(),
        name="counsellor-profile"
    ),

    # Available counsellors for students
    path(
        "",
        CounsellorListView.as_view(),
        name="counsellor-list"
    ),

    # Student creates booking / sees own bookings
    path(
        "sessions/",
        CounsellingSessionListCreateView.as_view(),
        name="counselling-sessions"
    ),

    # Counsellor dashboard - all assigned sessions
    path(
        "my-sessions/",
        CounsellorSessionListView.as_view(),
        name="counsellor-my-sessions"
    ),

    # Counsellor changes session status
    path(
        "sessions/<int:session_id>/update/",
        CounsellorSessionUpdateView.as_view(),
        name="counsellor-session-update"
    ),

    # Counsellor's students
    path(
        "my-students/",
        CounsellorStudentListView.as_view(),
        name="counsellor-students"
    ),
]