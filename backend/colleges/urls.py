from django.urls import path

from .views import (
    CollegeListView,
    CollegeDetailView,
    CourseListView,
    BranchListView,
)
urlpatterns = [
    path(
        "",
        CollegeListView.as_view(),
        name="college-list"
    ),
    path(
        "<int:college_id>/",
        CollegeDetailView.as_view(),
        name="college-detail"
    ),

    path(
        "courses/",
        CourseListView.as_view(),
        name="course-list"
    ),

    path(
        "branches/",
        BranchListView.as_view(),
        name="branch-list"
    ),
]