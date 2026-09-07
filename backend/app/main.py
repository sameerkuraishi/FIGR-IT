"""Beginner-readable FastAPI reference backend for the FIGR NXT prototype."""

from typing import Dict, List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="FIGR NXT API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000", "http://localhost:5173"], allow_methods=["*"], allow_headers=["*"])

DEMO_STUDENT = {
    "name": "", "level": "Class 12", "goal": "Help me choose",
    "interests": [], "learning_style": "Project-based", "hours_per_week": 5,
    "skills": {"python": 50, "programming": 50, "mathematics": 50, "statistics": 50, "sql": 50, "ml": 50, "web": 50, "security": 50, "cloud": 50, "design": 50},
}
CAREERS = {
    "Machine Learning Engineer": {"python": .25, "programming": .18, "mathematics": .18, "statistics": .18, "sql": .06, "ml": .15},
    "Data Scientist": {"python": .20, "programming": .10, "mathematics": .18, "statistics": .25, "sql": .12, "ml": .15},
    "Backend Developer": {"python": .25, "programming": .32, "mathematics": .08, "statistics": .03, "sql": .24, "ml": .08},
    "Data Analyst": {"python": .15, "programming": .08, "mathematics": .12, "statistics": .25, "sql": .32, "ml": .08},
    "AI Engineer": {"python": .22, "programming": .22, "mathematics": .15, "statistics": .13, "sql": .06, "ml": .22},
}
REQUIRED = {"python": 80, "programming": 75, "mathematics": 70, "statistics": 75, "sql": 55, "ml": 70}

class Profile(BaseModel):
    name: str = Field(min_length=1)
    level: str
    goal: str
    interests: List[str] = []
    learning_style: str = "Project-based"
    hours_per_week: int = 5
    skills: Dict[str, int]

class Assessment(BaseModel):
    profile: Profile
    answers: List[int]
    correct_answers: List[int]

class QuizResult(BaseModel):
    topic: str = "Statistics"
    correct: int
    total: int

class TutorRequest(BaseModel):
    question: str
    goal: str = "Machine Learning Engineer"
    weakness: str = "Probability"
    level: str = "Beginner"

def recommend(skills: Dict[str, int], goal: str = ""):
    results = []
    for career, weights in CAREERS.items():
        contributions = {skill: round(skills.get(skill, 0) * weight) for skill, weight in weights.items()}
        goal_bonus = 10 if career == goal else 0
        contributions["goal_alignment"] = goal_bonus
        results.append({"career": career, "score": min(99, sum(contributions.values())), "contributions": contributions})
    return sorted(results, key=lambda item: item["score"], reverse=True)

def gaps(skills: Dict[str, int]):
    rows = [{"skill": skill, "current": skills.get(skill, 0), "required": required, "deficit": max(0, required - skills.get(skill, 0))} for skill, required in REQUIRED.items()]
    return sorted(rows, key=lambda row: row["deficit"], reverse=True)

@app.get("/api/health")
def health(): return {"status": "ready", "mode": "deterministic-demo"}

@app.get("/api/demo/student")
def demo_student(): return DEMO_STUDENT

@app.post("/api/profile")
def save_profile(profile: Profile): return {"stored": True, "profile": profile}

@app.post("/api/assessment")
def assessment(data: Assessment):
    score = round(sum(answer == data.correct_answers[index] for index, answer in enumerate(data.answers)) / len(data.correct_answers) * 100)
    return {"assessment_score": score, "evidence_points": len(data.answers)}

@app.post("/api/analyze")
def analyze(profile: Profile): return {"student": profile.name, "recommendations": recommend(profile.skills, profile.goal), "priority_gaps": gaps(profile.skills)[:3]}

@app.post("/api/career/recommend")
def career_recommend(profile: Profile): return {"recommendations": recommend(profile.skills, profile.goal)}

@app.post("/api/roadmap/generate")
def roadmap_generate(profile: Profile):
    weak = [item["skill"] for item in gaps(profile.skills)[:3]]
    return {"target": profile.goal, "nodes": [{"topic": topic, "reason": "priority skill deficit"} for topic in weak] + [{"topic": "Guided project", "reason": "evidence-building"}]}

@app.post("/api/tutor/chat")
def tutor_chat(data: TutorRequest):
    text = "Statistics helps an ML engineer separate meaningful patterns from noise. Start with probability because it explains uncertainty in model predictions."
    return {"answer": text, "retrieved_from": ["statistics.json", "machine_learning.json"], "fallback_used": True, "context": data.model_dump()}

@app.post("/api/quiz/submit")
def quiz_submit(result: QuizResult):
    percent = round(result.correct / result.total * 100)
    return {"topic": result.topic, "score": percent, "status": "weak" if percent < 60 else "mastered"}

@app.post("/api/roadmap/adapt")
def roadmap_adapt(result: QuizResult):
    percent = round(result.correct / result.total * 100)
    if percent >= 60:
        return {"updated": False, "score": percent, "message": "Continue with the current roadmap."}
    return {"updated": True, "score": percent, "detected_gap": "Probability fundamentals", "inserted_nodes": ["Statistics revision", "Probability fundamentals", "Targeted practice", "Reassessment"]}
