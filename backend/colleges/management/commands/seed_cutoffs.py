from django.core.management.base import BaseCommand

from colleges.models import College, Course, Branch, CollegeCutoff


class Command(BaseCommand):
    help = "Seed sample college cutoff data"


    def handle(self, *args, **options):

        cutoff_data = [
            {
                "college": "IIT Delhi",
                "branch": "Computer Science and Engineering",
                "category": "OPEN",
                "gender": "OPEN",
                "home_state": "Delhi",
                "year": 2025,
                "opening_rank": 1,
                "closing_rank": 500,
                "round_number": 1,
            },
            {
                "college": "IIT Bombay",
                "branch": "Computer Science and Engineering",
                "category": "OPEN",
                "gender": "OPEN",
                "home_state": "Maharashtra",
                "year": 2025,
                "opening_rank": 1,
                "closing_rank": 500,
                "round_number": 1,
            },
            {
                "college": "IIT Kanpur",
                "branch": "Computer Science and Engineering",
                "category": "OPEN",
                "gender": "OPEN",
                "home_state": "Uttar Pradesh",
                "year": 2025,
                "opening_rank": 1,
                "closing_rank": 1000,
                "round_number": 1,
            },
            {
                "college": "IIT Madras",
                "branch": "Computer Science and Engineering",
                "category": "OPEN",
                "gender": "OPEN",
                "home_state": "Tamil Nadu",
                "year": 2025,
                "opening_rank": 1,
                "closing_rank": 600,
                "round_number": 1,
            },
            {
                "college": "NIT Trichy",
                "branch": "Computer Science and Engineering",
                "category": "OPEN",
                "gender": "OPEN",
                "home_state": "Tamil Nadu",
                "year": 2025,
                "opening_rank": 1000,
                "closing_rank": 5000,
                "round_number": 1,
            },
            {
                "college": "NIT Surathkal",
                "branch": "Computer Science and Engineering",
                "category": "OPEN",
                "gender": "OPEN",
                "home_state": "Karnataka",
                "year": 2025,
                "opening_rank": 2000,
                "closing_rank": 8000,
                "round_number": 1,
            },
            {
                "college": "NIT Warangal",
                "branch": "Computer Science and Engineering",
                "category": "OPEN",
                "gender": "OPEN",
                "home_state": "Telangana",
                "year": 2025,
                "opening_rank": 1500,
                "closing_rank": 7000,
                "round_number": 1,
            },
            {
                "college": "IIIT Hyderabad",
                "branch": "Computer Science and Engineering",
                "category": "OPEN",
                "gender": "OPEN",
                "home_state": "Telangana",
                "year": 2025,
                "opening_rank": 100,
                "closing_rank": 3000,
                "round_number": 1,
            },
            {
                "college": "IIIT Delhi",
                "branch": "Computer Science and Engineering",
                "category": "OPEN",
                "gender": "OPEN",
                "home_state": "Delhi",
                "year": 2025,
                "opening_rank": 2000,
                "closing_rank": 10000,
                "round_number": 1,
            },
            {
                "college": "IIIT Allahabad",
                "branch": "Computer Science and Engineering",
                "category": "OPEN",
                "gender": "OPEN",
                "home_state": "Uttar Pradesh",
                "year": 2025,
                "opening_rank": 3000,
                "closing_rank": 12000,
                "round_number": 1,
            },
        ]


        created_count = 0

        for data in cutoff_data:

            try:
                college = College.objects.get(
                    short_name=data["college"]
                )
            except College.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(
                        f"College not found: {data['college']}"
                    )
                )
                continue

            try:
                branch = Branch.objects.get(
                    course__college=college,
                    name=data["branch"]
                )
            except Branch.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(
                        f"Branch not found for: {data['college']}"
                    )
                )
                continue

            cutoff, created = CollegeCutoff.objects.update_or_create(
                college=college,
                branch=branch,
                category=data["category"],
                gender=data["gender"],
                home_state=data["home_state"],
                year=data["year"],
                round_number=data["round_number"],
                defaults={
                    "opening_rank": data["opening_rank"],
                    "closing_rank": data["closing_rank"],
                },
            )

            if created:
                created_count += 1

            self.stdout.write(
                f"Processed: {college.short_name} - {branch.name}"
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully processed {len(cutoff_data)} cutoff records."
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"New cutoff records created: {created_count}"
            )
        )