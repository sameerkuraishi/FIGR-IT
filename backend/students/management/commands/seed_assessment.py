from django.core.management.base import BaseCommand
from students.models import Assessment, AssessmentQuestion


QUESTIONS = [
    {
        "question": "How much do you enjoy solving programming problems?",
        "category": "PROGRAMMING",
    },
    {
        "question": "How interested are you in learning Python, C++, or Java?",
        "category": "PROGRAMMING",
    },
    {
        "question": "How much do you enjoy building websites or applications?",
        "category": "PROGRAMMING",
    },
    {
        "question": "How comfortable are you with debugging code?",
        "category": "PROGRAMMING",
    },
    {
        "question": "How interested are you in software development?",
        "category": "PROGRAMMING",
    },

    {
        "question": "How much do you enjoy mathematics?",
        "category": "MATHEMATICS",
    },
    {
        "question": "How comfortable are you with algebra and equations?",
        "category": "MATHEMATICS",
    },
    {
        "question": "How much do you enjoy working with numbers?",
        "category": "MATHEMATICS",
    },
    {
        "question": "How interested are you in statistics and probability?",
        "category": "MATHEMATICS",
    },
    {
        "question": "How comfortable are you solving mathematical problems?",
        "category": "MATHEMATICS",
    },

    {
        "question": "How much do you enjoy logical puzzles?",
        "category": "LOGICAL_REASONING",
    },
    {
        "question": "How good are you at identifying patterns?",
        "category": "LOGICAL_REASONING",
    },
    {
        "question": "How much do you enjoy finding solutions to difficult problems?",
        "category": "LOGICAL_REASONING",
    },
    {
        "question": "How comfortable are you breaking a large problem into smaller problems?",
        "category": "LOGICAL_REASONING",
    },
    {
        "question": "How much do you enjoy analytical thinking?",
        "category": "LOGICAL_REASONING",
    },

    {
        "question": "How interested are you in Artificial Intelligence?",
        "category": "AI_ML",
    },
    {
        "question": "How interested are you in Machine Learning?",
        "category": "AI_ML",
    },
    {
        "question": "How interested are you in working with large datasets?",
        "category": "AI_ML",
    },
    {
        "question": "How interested are you in building intelligent systems?",
        "category": "AI_ML",
    },
    {
        "question": "How interested are you in learning neural networks?",
        "category": "AI_ML",
    },

    {
        "question": "How much do you enjoy designing new ideas?",
        "category": "CREATIVITY",
    },
    {
        "question": "How much do you enjoy creating something from scratch?",
        "category": "CREATIVITY",
    },
    {
        "question": "How interested are you in UI/UX and visual design?",
        "category": "CREATIVITY",
    },
    {
        "question": "How often do you think of alternative solutions?",
        "category": "CREATIVITY",
    },
    {
        "question": "How much do you enjoy creative projects?",
        "category": "CREATIVITY",
    },

    {
        "question": "How comfortable are you explaining your ideas to others?",
        "category": "COMMUNICATION",
    },
    {
        "question": "How comfortable are you speaking in front of a group?",
        "category": "COMMUNICATION",
    },
    {
        "question": "How good are you at listening to others?",
        "category": "COMMUNICATION",
    },
    {
        "question": "How comfortable are you writing professional messages?",
        "category": "COMMUNICATION",
    },
    {
        "question": "How easily can you explain a technical topic to a beginner?",
        "category": "COMMUNICATION",
    },
]


class Command(BaseCommand):
    help = "Create career assessment questions"

    def handle(self, *args, **options):

        assessment = Assessment.objects.first()

        if not assessment:
            self.stdout.write(
                self.style.ERROR(
                    "No assessment found. Create an assessment first."
                )
            )
            return

        created_count = 0

        for index, item in enumerate(QUESTIONS, start=1):

            question, created = AssessmentQuestion.objects.get_or_create(
                assessment=assessment,
                question=item["question"],
                defaults={
                    "category": item["category"],
                    "question_order": index,
                },
            )

            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"{created_count} questions created successfully."
            )
        )