from django.contrib import admin

from .models import AlumniProfile, MentorshipRequest


@admin.register(AlumniProfile)
class AlumniProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "college",
        "company",
        "job_title",
        "experience_years",
        "is_available_for_mentorship",
    )

    list_filter = (
        "is_available_for_mentorship",
        "graduation_year",
    )

    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
        "college",
        "company",
        "job_title",
    )


@admin.register(MentorshipRequest)
class MentorshipRequestAdmin(admin.ModelAdmin):
    list_display = (
        "student",
        "alumni",
        "topic",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
    )

    search_fields = (
        "student__username",
        "alumni__username",
        "topic",
    )