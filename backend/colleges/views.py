from django.db.models import Q

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import College, Course, Branch, CollegeCutoff
from .serializers import (
    CollegeListSerializer,
    CollegeDetailSerializer,
    CourseSerializer,
    BranchSerializer,
    CollegeCutoffSerializer,
)


class CollegeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        colleges = College.objects.all()

        search = request.query_params.get("search")
        city = request.query_params.get("city")
        state = request.query_params.get("state")
        college_type = request.query_params.get("type")

        if search:
            colleges = colleges.filter(
                Q(name__icontains=search) |
                Q(short_name__icontains=search) |
                Q(city__icontains=search) |
                Q(state__icontains=search)
            )

        if city:
            colleges = colleges.filter(city__iexact=city)

        if state:
            colleges = colleges.filter(state__iexact=state)

        if college_type:
            colleges = colleges.filter(college_type=college_type.upper())

        colleges = colleges.order_by("nirf_rank", "name")

        serializer = CollegeListSerializer(colleges, many=True)
        return Response(serializer.data)


class CollegeDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, college_id):
        try:
            college = College.objects.prefetch_related("courses__branches").get(id=college_id)
        except College.DoesNotExist:
            return Response({"error": "College not found."}, status=404)

        serializer = CollegeDetailSerializer(college)
        return Response(serializer.data)


class CourseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        courses = Course.objects.select_related("college").prefetch_related("branches")

        college_id = request.query_params.get("college")
        search = request.query_params.get("search")
        degree = request.query_params.get("degree")

        if college_id:
            courses = courses.filter(college_id=college_id)

        if search:
            courses = courses.filter(Q(name__icontains=search) | Q(description__icontains=search))

        if degree:
            courses = courses.filter(degree__icontains=degree)

        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)


class BranchListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        branches = Branch.objects.select_related("course", "course__college")

        course_id = request.query_params.get("course")
        search = request.query_params.get("search")

        if course_id:
            branches = branches.filter(course_id=course_id)

        if search:
            branches = branches.filter(Q(name__icontains=search) | Q(code__icontains=search))

        serializer = BranchSerializer(branches, many=True)
        return Response(serializer.data)


class CollegeCutoffView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cutoffs = CollegeCutoff.objects.select_related("college", "branch")

        rank = request.query_params.get("rank")
        category = request.query_params.get("category", "OPEN")
        gender = request.query_params.get("gender", "OPEN")
        state = request.query_params.get("state")
        year = request.query_params.get("year")
        college_id = request.query_params.get("college")
        branch_id = request.query_params.get("branch")

        if rank:
            try:
                rank = int(rank)
            except ValueError:
                return Response({"error": "rank must be a number."}, status=400)

            if rank <= 0:
                return Response({"error": "rank must be greater than 0."}, status=400)

            cutoffs = cutoffs.filter(opening_rank__lte=rank, closing_rank__gte=rank)

        if category:
            cutoffs = cutoffs.filter(category=category.upper())

        if gender:
            cutoffs = cutoffs.filter(gender=gender.upper())

        if state:
            cutoffs = cutoffs.filter(home_state__iexact=state)

        if year:
            try:
                year = int(year)
            except ValueError:
                return Response({"error": "year must be a number."}, status=400)

            cutoffs = cutoffs.filter(year=year)

        if college_id:
            cutoffs = cutoffs.filter(college_id=college_id)

        if branch_id:
            cutoffs = cutoffs.filter(branch_id=branch_id)

        cutoffs = cutoffs.order_by("closing_rank")

        serializer = CollegeCutoffSerializer(cutoffs, many=True)
        return Response(serializer.data)


class CollegePredictionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        rank = request.query_params.get("rank")
        category = request.query_params.get("category", "OPEN")
        gender = request.query_params.get("gender", "OPEN")
        home_state = request.query_params.get("home_state")
        branch = request.query_params.get("branch")
        year = request.query_params.get("year", 2025)

        # Validate rank
        if not rank:
            return Response({"error": "rank is required."}, status=400)

        try:
            rank = int(rank)
        except ValueError:
            return Response({"error": "rank must be a number."}, status=400)

        if rank <= 0:
            return Response({"error": "rank must be greater than 0."}, status=400)

        # Validate year
        try:
            year = int(year)
        except ValueError:
            return Response({"error": "year must be a number."}, status=400)

        # Base query
        cutoffs = CollegeCutoff.objects.select_related("college", "branch").filter(
            category=category.upper(),
            gender=gender.upper(),
            year=year,
            closing_rank__gte=rank,
        )

        # Prefer home state matches if any exist
        if home_state:
            state_matches = cutoffs.filter(home_state__iexact=home_state)
            if state_matches.exists():
                cutoffs = state_matches

        if branch:
            cutoffs = cutoffs.filter(branch__name__icontains=branch)

        cutoffs = cutoffs.order_by("closing_rank")

        safe, moderate, reach = [], [], []

        for cutoff in cutoffs:
            closing_rank = cutoff.closing_rank

            college_data = {
                "cutoff_id": cutoff.id,
                "college_id": cutoff.college.id,
                "college_name": cutoff.college.name,
                "short_name": cutoff.college.short_name,
                "college_type": cutoff.college.college_type,
                "city": cutoff.college.city,
                "state": cutoff.college.state,
                "branch_id": cutoff.branch.id,
                "branch_name": cutoff.branch.name,
                "opening_rank": cutoff.opening_rank,
                "closing_rank": closing_rank,
                "category": cutoff.category,
                "gender": cutoff.gender,
                "year": cutoff.year,
                "round": cutoff.round_number,
            }

            if rank <= closing_rank * 0.70:
                college_data["chance"] = "HIGH"
                safe.append(college_data)
            elif rank <= closing_rank * 0.90:
                college_data["chance"] = "MEDIUM"
                moderate.append(college_data)
            else:
                college_data["chance"] = "LOW"
                reach.append(college_data)

        return Response({
            "student_rank": rank,
            "category": category.upper(),
            "gender": gender.upper(),
            "home_state": home_state,
            "preferred_branch": branch,
            "year": year,
            "total_results": len(safe) + len(moderate) + len(reach),
            "safe": safe,
            "moderate": moderate,
            "reach": reach,
        })