from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def home(request):
    return JsonResponse({
        "message": "FIGR.IT Backend API is running"
    })


urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "api/accounts/",
        include("accounts.urls")
    ),

    path(
        "api/students/",
        include("students.urls")
    ),

    path(
        "api/counsellors/",
        include("counsellors.urls")
    ),

    path(
        "api/alumni/",
        include("alumni.urls")
    ),

    path(
        "api/colleges/",
        include("colleges.urls")
    ),
    path(
    "api/students/",
    include("students.urls")
),

    path("", home),
]