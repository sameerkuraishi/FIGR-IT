import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      message,
      profile,
      activeCareer,
    } = body;

    if (!message) {
      return NextResponse.json(
        {
          error: "Message is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * JARVIS CONTEXT
     */

    const studentName =
      profile?.name || "Student";

    const career =
      activeCareer?.title ||
      "Not selected";

    const track =
      profile?.track ||
      "Not specified";

    const level =
      profile?.level ||
      "Not specified";

    const interests =
      Array.isArray(profile?.interests)
        ? profile.interests.join(", ")
        : "Not specified";

    const context = `
You are JARVIS, the AI Career Assistant
inside the FIGR.IT student platform.

Student:
Name: ${studentName}
Track: ${track}
Level: ${level}
Interests: ${interests}
Selected Career: ${career}

Your job is to help the student with:

- Career planning
- Career comparison
- Skill-gap analysis
- Learning roadmaps
- Competitive exams
- College selection
- Internships
- Placements
- Coding
- AI/ML
- Resume
- Interviews
- Professional development

Important rules:

1. Be practical and student-friendly.
2. Do not claim guaranteed admission or job outcomes.
3. For admission/cutoff information, tell the student
   to verify current official counselling data.
4. Do not invent personal data.
5. If information is missing, ask for it.
6. Give actionable steps.
7. Prefer structured answers with bullets.
8. Keep explanations understandable for students.
`;

    /*
     * --------------------------------------------------
     * REAL AI PROVIDER
     * --------------------------------------------------
     *
     * Put your AI provider API call here.
     *
     * The frontend should NEVER contain the API key.
     *
     * Example structure:
     *
     * const response = await fetch(AI_PROVIDER_URL, {
     *   method: "POST",
     *   headers: {
     *     "Authorization": `Bearer ${process.env.AI_API_KEY}`,
     *     "Content-Type": "application/json",
     *   },
     *   body: JSON.stringify({
     *      ...
     *   }),
     * });
     *
     * --------------------------------------------------
     */

    /*
     * Temporary intelligent fallback.
     *
     * This allows the application to run even before
     * the AI provider is connected.
     */

    const lower = message.toLowerCase();

    let reply = "";

    if (
      lower.includes("roadmap") ||
      lower.includes("road map")
    ) {
      reply = `
${studentName}, here is a practical roadmap for ${career}:

1. Build fundamentals
2. Learn the core technical skills
3. Practice problem solving
4. Build 2–4 real projects
5. Put projects on GitHub
6. Identify your skill gaps
7. Apply for internships
8. Prepare for interviews
9. Build your professional network
10. Target placements/jobs

Your roadmap should be adjusted according to your current skill level.
`;
    } else if (
      lower.includes("internship") ||
      lower.includes("intern")
    ) {
      reply = `
For internships, focus on these five areas:

• Strong fundamentals
• 2–4 practical projects
• Good GitHub profile
• One-page resume
• Consistent applications

For ${career}, your projects should demonstrate the actual skills required by the role.

Next target:
Build one project that you can confidently explain in an interview.
`;
    } else if (
      lower.includes("college") ||
      lower.includes("iit") ||
      lower.includes("nit") ||
      lower.includes("iiit")
    ) {
      reply = `
I can help you shortlist colleges.

Please provide:

• Exam
• Rank/score
• Category
• Home state
• Desired branch
• Preferred college type

Example:

"JEE Main rank 15000, General, Uttar Pradesh, CSE"

I can then help organize the options into ambitious, moderate and safer choices.

Always verify final admission decisions using current official counselling data.
`;
    } else if (
      lower.includes("ai engineer") ||
      lower.includes("machine learning") ||
      lower.includes("artificial intelligence")
    ) {
      reply = `
For an AI Engineer path, follow:

Python
↓
Data Structures
↓
Mathematics
↓
NumPy / Pandas
↓
Machine Learning
↓
Scikit-learn
↓
Deep Learning
↓
PyTorch
↓
NLP / Computer Vision
↓
LLMs
↓
RAG
↓
AI Agents
↓
Deployment
↓
Real-world Projects

Don't try to learn everything simultaneously.

Build one strong project after every major learning stage.
`;
    } else if (
      lower.includes("resume") ||
      lower.includes("cv")
    ) {
      reply = `
For a fresher resume:

1. Name + contact
2. Education
3. Technical skills
4. Projects
5. Internship/experience
6. Achievements
7. Certifications

Keep it concise.

For every project explain:

Problem → Technology → Your contribution → Result
`;
    } else {
      reply = `
I understand your question, ${studentName}.

Your current career context is:

Career: ${career}
Track: ${track}

I can help you with:

🎓 College selection
📚 Competitive exams
🧠 AI / ML
💻 Coding
📊 Skill gaps
🗺️ Roadmaps
💼 Internships
🏢 Placements
📄 Resume
🎤 Interviews

Ask me a specific question and I'll break it down step-by-step.
`;
    }

    return NextResponse.json({
      reply,
      context: {
        student: studentName,
        career,
        track,
      },
    });
  } catch (error) {
    console.error("JARVIS API error:", error);

    return NextResponse.json(
      {
        error: "JARVIS server error.",
      },
      {
        status: 500,
      }
    );
  }
}