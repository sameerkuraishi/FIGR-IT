from django.contrib import admin

from .models import College, Course, Branch


@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "short_name",
        "college_type",
        "city",
        "state",
        "nirf_rank",
        "average_package",
    )

    list_filter = (
        "college_type",
        "state",
        "city",
    )

    search_fields = (
        "name",
        "short_name",
        "city",
        "state",
    )


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "college",
        "degree",
        "duration_years",
        "annual_fees",
    )

    list_filter = (
        "degree",
        "duration_years",
    )

    search_fields = (
        "name",
        "college__name",
    )


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "course",
        "code",
        "duration_years",
        "seats",
    )

    search_fields = (
        "name",
        "code",
        "course__name",
        "course__college__name",
    )