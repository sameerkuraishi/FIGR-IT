from .models import Assessment


# Career profiles
CAREER_PROFILES = {
    "AI Engineer": {
        "weights": {
            "PROGRAMMING": 25,
            "MATHEMATICS": 20,
            "LOGICAL_REASONING": 15,
            "AI_ML": 30,
            "CREATIVITY": 5,
            "COMMUNICATION": 5,
        },
        "skills": [
            "Python",
            "Machine Learning",
            "Deep Learning",
            "Mathematics",
            "SQL",
            "LLM",
            "Docker",
        ],
        "roadmap": (
            "Python → DSA → Mathematics → Machine Learning → "
            "Deep Learning → LLM/RAG → FastAPI → Docker → Deployment"
        ),
    },

    "Software Engineer": {
        "weights": {
            "PROGRAMMING": 35,
            "MATHEMATICS": 10,
            "LOGICAL_REASONING": 25,
            "AI_ML": 5,
            "CREATIVITY": 15,
            "COMMUNICATION": 10,
        },
        "skills": [
            "Python/Java/C++",
            "DSA",
            "OOP",
            "DBMS",
            "SQL",
            "Git",
            "System Design",
        ],
        "roadmap": (
            "Programming → DSA → OOP → DBMS → SQL → "
            "Git/GitHub → Projects → System Design → Interviews"
        ),
    },

    "Data Scientist": {
        "weights": {
            "PROGRAMMING": 15,
            "MATHEMATICS": 30,
            "LOGICAL_REASONING": 20,
            "AI_ML": 25,
            "CREATIVITY": 5,
            "COMMUNICATION": 5,
        },
        "skills": [
            "Python",
            "Statistics",
            "Probability",
            "Pandas",
            "NumPy",
            "Machine Learning",
            "SQL",
            "Data Visualization",
        ],
        "roadmap": (
            "Python → Statistics → Probability → NumPy/Pandas → "
            "SQL → Data Visualization → Machine Learning → Projects"
        ),
    },

    "Cybersecurity Engineer": {
        "weights": {
            "PROGRAMMING": 20,
            "MATHEMATICS": 10,
            "LOGICAL_REASONING": 35,
            "AI_ML": 5,
            "CREATIVITY": 10,
            "COMMUNICATION": 20,
        },
        "skills": [
            "Networking",
            "Linux",
            "Python",
            "Cybersecurity",
            "Cryptography",
            "Ethical Hacking",
            "Web Security",
        ],
        "roadmap": (
            "Networking → Linux → Python → Security Fundamentals → "
            "Web Security → Cryptography → Ethical Hacking → Labs"
        ),
    },

    "Cloud Engineer": {
        "weights": {
            "PROGRAMMING": 20,
            "MATHEMATICS": 5,
            "LOGICAL_REASONING": 25,
            "AI_ML": 5,
            "CREATIVITY": 10,
            "COMMUNICATION": 35,
        },
        "skills": [
            "Linux",
            "AWS/Azure/GCP",
            "Networking",
            "Docker",
            "Kubernetes",
            "CI/CD",
            "Terraform",
        ],
        "roadmap": (
            "Linux → Networking → AWS/Azure/GCP → Docker → "
            "Kubernetes → CI/CD → Terraform → Cloud Projects"
        ),
    },

    "Web Developer": {
        "weights": {
            "PROGRAMMING": 30,
            "MATHEMATICS": 5,
            "LOGICAL_REASONING": 15,
            "AI_ML": 5,
            "CREATIVITY": 30,
            "COMMUNICATION": 15,
        },
        "skills": [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Node.js",
            "Databases",
            "Git",
        ],
        "roadmap": (
            "HTML → CSS → JavaScript → React → Backend → "
            "Database → APIs → Authentication → Full-Stack Projects"
        ),
    },
}


def calculate_category_scores(assessment):
    """
    Calculate average score for every assessment category.
    """

    category_scores = {}

    questions = assessment.questions.all()

    for question in questions:
        answers = question.answers.filter(
            assessment=assessment
        )

        if not answers.exists():
            continue

        answer = answers.order_by("-answered_at").first()

        category = question.category.upper()

        if category not in category_scores:
            category_scores[category] = []

        category_scores[category].append(answer.score)

    # Convert scores into averages
    for category in category_scores:
        scores = category_scores[category]

        if scores:
            category_scores[category] = (
                sum(scores) / len(scores)
            )

    return category_scores


def calculate_career_match(category_scores, career_weights):
    """
    Calculate career match percentage.
    """

    total_score = 0
    total_weight = 0

    for category, weight in career_weights.items():
        score = category_scores.get(category, 0)

        total_score += score * weight
        total_weight += weight

    if total_weight == 0:
        return 0

    # Assumes question scores are 0-10
    percentage = (
        total_score / (total_weight * 10)
    ) * 100

    return round(
        min(max(percentage, 0), 100),
        2
    )


def generate_recommendations(assessment):
    """
    Generate career recommendations for a completed assessment.
    """

    category_scores = calculate_category_scores(
        assessment
    )

    recommendations = []

    for career, profile in CAREER_PROFILES.items():

        match_percentage = calculate_career_match(
            category_scores,
            profile["weights"]
        )

        recommendations.append({
            "career": career,
            "match_percentage": match_percentage,
            "required_skills": ", ".join(
                profile["skills"]
            ),
            "roadmap": profile["roadmap"],
            "category_scores": category_scores,
        })

    recommendations.sort(
        key=lambda item: item["match_percentage"],
        reverse=True
    )

    return recommendations