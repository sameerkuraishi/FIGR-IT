from collections import defaultdict


CAREER_PROFILES = {
    "AI / Machine Learning Engineer": {
        "PROGRAMMING": 0.25,
        "MATHEMATICS": 0.20,
        "LOGICAL_REASONING": 0.20,
        "AI_ML": 0.30,
        "CREATIVITY": 0.05,
    },

    "Software Engineer": {
        "PROGRAMMING": 0.35,
        "LOGICAL_REASONING": 0.30,
        "MATHEMATICS": 0.15,
        "CREATIVITY": 0.15,
        "COMMUNICATION": 0.05,
    },

    "Data Scientist": {
        "PROGRAMMING": 0.20,
        "MATHEMATICS": 0.30,
        "LOGICAL_REASONING": 0.25,
        "AI_ML": 0.20,
        "COMMUNICATION": 0.05,
    },

    "Data Analyst": {
        "MATHEMATICS": 0.30,
        "LOGICAL_REASONING": 0.30,
        "PROGRAMMING": 0.15,
        "AI_ML": 0.15,
        "COMMUNICATION": 0.10,
    },

    "Web Developer": {
        "PROGRAMMING": 0.30,
        "CREATIVITY": 0.30,
        "LOGICAL_REASONING": 0.15,
        "COMMUNICATION": 0.10,
        "MATHEMATICS": 0.05,
    },

    "UI/UX Designer": {
        "CREATIVITY": 0.50,
        "COMMUNICATION": 0.20,
        "LOGICAL_REASONING": 0.15,
        "PROGRAMMING": 0.10,
        "MATHEMATICS": 0.05,
    },

    "IoT Engineer": {
        "PROGRAMMING": 0.25,
        "LOGICAL_REASONING": 0.25,
        "MATHEMATICS": 0.20,
        "AI_ML": 0.10,
        "CREATIVITY": 0.20,
    },

    "Cybersecurity Engineer": {
        "PROGRAMMING": 0.30,
        "LOGICAL_REASONING": 0.35,
        "MATHEMATICS": 0.15,
        "AI_ML": 0.10,
        "COMMUNICATION": 0.10,
    },

    "Product Manager": {
        "COMMUNICATION": 0.35,
        "CREATIVITY": 0.25,
        "LOGICAL_REASONING": 0.20,
        "PROGRAMMING": 0.10,
        "MATHEMATICS": 0.10,
    },
}


def calculate_category_scores(assessment):
    """
    Calculate average score for every assessment category.

    Each question has a score from 1 to 5.
    The final category score is converted to 0-100.
    """

    category_totals = defaultdict(float)
    category_counts = defaultdict(int)

    answers = assessment.answers.select_related("question")

    for answer in answers:
        category = answer.question.category

        category_totals[category] += answer.score
        category_counts[category] += 1

    category_scores = {}

    for category, total in category_totals.items():

        count = category_counts[category]

        if count == 0:
            continue

        average = total / count

        # Convert 1-5 score to 0-100
        percentage = ((average - 1) / 4) * 100

        category_scores[category] = round(
            percentage,
            2
        )

    return category_scores


def calculate_career_matches(category_scores):
    """
    Compare student's category scores against
    predefined career profiles.
    """

    career_scores = {}

    for career, profile in CAREER_PROFILES.items():

        score = 0
        total_weight = 0

        for category, weight in profile.items():

            category_score = category_scores.get(
                category,
                0
            )

            score += category_score * weight
            total_weight += weight

        if total_weight > 0:
            score = score / total_weight

        career_scores[career] = round(
            score,
            2
        )

    return dict(
        sorted(
            career_scores.items(),
            key=lambda item: item[1],
            reverse=True
        )
    )


def generate_career_recommendation(assessment):
    """
    Generate final career recommendation.
    """

    category_scores = calculate_category_scores(
        assessment
    )

    career_matches = calculate_career_matches(
        category_scores
    )

    if not career_matches:
        return {
            "career": "Undetermined",
            "confidence": 0,
            "category_scores": {},
            "career_matches": {},
            "explanation": (
                "Not enough assessment data "
                "to generate a recommendation."
            ),
        }

    top_career = next(
        iter(career_matches)
    )

    top_score = career_matches[top_career]

    confidence = round(
        min(max(top_score, 0), 100),
        2
    )

    explanation = (
        f"Based on your assessment, "
        f"your strongest career match is "
        f"{top_career}. "
        f"Your calculated career match score "
        f"is {top_score}%."
    )

    return {
        "career": top_career,
        "confidence": confidence,
        "category_scores": category_scores,
        "career_matches": career_matches,
        "explanation": explanation,
    }