from django.core.management.base import BaseCommand

from colleges.models import College, Course, Branch


class Command(BaseCommand):
    help = "Seed sample colleges, courses and branches"


    def handle(self, *args, **options):

        colleges_data = [
            {
                "name": "Indian Institute of Technology Delhi",
                "short_name": "IIT Delhi",
                "college_type": "IIT",
                "city": "New Delhi",
                "state": "Delhi",
                "website": "https://home.iitd.ac.in/",
                "description": "Premier engineering and technology institute in India.",
                "nirf_rank": 4,
                "established_year": 1961,
                "average_package": 2500000,
                "highest_package": 100000000,
                "annual_fees": 250000,
            },
            {
                "name": "Indian Institute of Technology Bombay",
                "short_name": "IIT Bombay",
                "college_type": "IIT",
                "city": "Mumbai",
                "state": "Maharashtra",
                "website": "https://www.iitb.ac.in/",
                "description": "Leading institute for engineering, technology and research.",
                "nirf_rank": 3,
                "established_year": 1958,
                "average_package": 2800000,
                "highest_package": 120000000,
                "annual_fees": 250000,
            },
            {
                "name": "Indian Institute of Technology Kanpur",
                "short_name": "IIT Kanpur",
                "college_type": "IIT",
                "city": "Kanpur",
                "state": "Uttar Pradesh",
                "website": "https://www.iitk.ac.in/",
                "description": "Premier research and engineering institute.",
                "nirf_rank": 5,
                "established_year": 1959,
                "average_package": 2600000,
                "highest_package": 100000000,
                "annual_fees": 250000,
            },
            {
                "name": "Indian Institute of Technology Madras",
                "short_name": "IIT Madras",
                "college_type": "IIT",
                "city": "Chennai",
                "state": "Tamil Nadu",
                "website": "https://www.iitm.ac.in/",
                "description": "One of India's leading institutes for engineering and research.",
                "nirf_rank": 1,
                "established_year": 1959,
                "average_package": 2600000,
                "highest_package": 110000000,
                "annual_fees": 250000,
            },
            {
                "name": "National Institute of Technology Tiruchirappalli",
                "short_name": "NIT Trichy",
                "college_type": "NIT",
                "city": "Tiruchirappalli",
                "state": "Tamil Nadu",
                "website": "https://www.nitt.edu/",
                "description": "Leading National Institute of Technology.",
                "nirf_rank": 9,
                "established_year": 1964,
                "average_package": 1400000,
                "highest_package": 55000000,
                "annual_fees": 200000,
            },
            {
                "name": "National Institute of Technology Karnataka",
                "short_name": "NIT Surathkal",
                "college_type": "NIT",
                "city": "Surathkal",
                "state": "Karnataka",
                "website": "https://www.nitk.ac.in/",
                "description": "Premier technical institute located in Karnataka.",
                "nirf_rank": 17,
                "established_year": 1960,
                "average_package": 1200000,
                "highest_package": 45000000,
                "annual_fees": 200000,
            },
            {
                "name": "National Institute of Technology Warangal",
                "short_name": "NIT Warangal",
                "college_type": "NIT",
                "city": "Warangal",
                "state": "Telangana",
                "website": "https://www.nitw.ac.in/",
                "description": "Leading engineering and technology institute.",
                "nirf_rank": 21,
                "established_year": 1959,
                "average_package": 1300000,
                "highest_package": 50000000,
                "annual_fees": 200000,
            },
            {
                "name": "International Institute of Information Technology Hyderabad",
                "short_name": "IIIT Hyderabad",
                "college_type": "IIIT",
                "city": "Hyderabad",
                "state": "Telangana",
                "website": "https://www.iiit.ac.in/",
                "description": "Institute focused on information technology, AI and research.",
                "nirf_rank": 0,
                "established_year": 1998,
                "average_package": 2200000,
                "highest_package": 60000000,
                "annual_fees": 450000,
            },
            {
                "name": "Indian Institute of Information Technology Delhi",
                "short_name": "IIIT Delhi",
                "college_type": "IIIT",
                "city": "New Delhi",
                "state": "Delhi",
                "website": "https://iiitd.ac.in/",
                "description": "Research-oriented institute specializing in information technology.",
                "nirf_rank": 0,
                "established_year": 2008,
                "average_package": 2000000,
                "highest_package": 55000000,
                "annual_fees": 400000,
            },
            {
                "name": "Indian Institute of Information Technology Allahabad",
                "short_name": "IIIT Allahabad",
                "college_type": "IIIT",
                "city": "Prayagraj",
                "state": "Uttar Pradesh",
                "website": "https://www.iiita.ac.in/",
                "description": "Institute specializing in information technology and related disciplines.",
                "nirf_rank": 0,
                "established_year": 1999,
                "average_package": 1600000,
                "highest_package": 50000000,
                "annual_fees": 250000,
            },
        ]


        created_colleges = 0

        for data in colleges_data:
            college, created = College.objects.update_or_create(
                name=data["name"],
                defaults=data,
            )

            if created:
                created_colleges += 1

            self.stdout.write(
                f"College: {college.short_name}"
            )

            # -------------------------
            # B.Tech Computer Science
            # -------------------------

            cse_course, _ = Course.objects.update_or_create(
                college=college,
                name="B.Tech Computer Science and Engineering",
                defaults={
                    "degree": "B.Tech",
                    "duration_years": 4,
                    "description": "Undergraduate program in computer science and engineering.",
                    "eligibility": "10+2 with Physics, Chemistry and Mathematics.",
                    "annual_fees": college.annual_fees,
                },
            )

            Branch.objects.update_or_create(
                course=cse_course,
                name="Computer Science and Engineering",
                defaults={
                    "code": "CSE",
                    "duration_years": 4,
                    "seats": 100,
                    "eligibility": "10+2 with Physics, Chemistry and Mathematics.",
                },
            )

            # -------------------------
            # AI / Data Science
            # -------------------------

            ai_course, _ = Course.objects.update_or_create(
                college=college,
                name="B.Tech Artificial Intelligence and Data Science",
                defaults={
                    "degree": "B.Tech",
                    "duration_years": 4,
                    "description": "Undergraduate program focused on AI, machine learning and data science.",
                    "eligibility": "10+2 with Physics, Chemistry and Mathematics.",
                    "annual_fees": college.annual_fees,
                },
            )

            Branch.objects.update_or_create(
                course=ai_course,
                name="Artificial Intelligence and Data Science",
                defaults={
                    "code": "AI-DS",
                    "duration_years": 4,
                    "seats": 60,
                    "eligibility": "10+2 with Physics, Chemistry and Mathematics.",
                },
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully processed {len(colleges_data)} colleges."
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"New colleges created: {created_colleges}"
            )
        )