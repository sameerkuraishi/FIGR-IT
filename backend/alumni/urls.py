from django.urls import path

from .views import (
    AlumniProfileView,
    AlumniListView,
    MentorshipRequestListCreateView,
    AlumniMentorshipRequestListView,
    MentorshipRequestUpdateView,
)


urlpatterns = [
    path(
        "profile/",
        AlumniProfileView.as_view(),
        name="alumni-profile"
    ),

    path(
        "",
        AlumniListView.as_view(),
        name="alumni-list"
    ),

    path(
        "mentorship/",
        MentorshipRequestListCreateView.as_view(),
        name="mentorship-list-create"
    ),

    path(
        "my-mentorship/",
        AlumniMentorshipRequestListView.as_view(),
        name="alumni-mentorship"
    ),

    path(
        "mentorship/<int:request_id>/update/",
        MentorshipRequestUpdateView.as_view(),
        name="mentorship-update"
    ),
]