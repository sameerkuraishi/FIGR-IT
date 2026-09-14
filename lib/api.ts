const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    token,
  } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method,
      headers,
      body: body
        ? JSON.stringify(body)
        : undefined,
    }
  );

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      typeof data === "object" &&
      data !== null &&
      "error" in data
        ? String(
            (data as { error: unknown }).error
          )
        : `API request failed: ${response.status}`;

    throw new Error(errorMessage);
  }

  return data as T;
}


// ============================================================
// TYPES
// ============================================================

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface StudentProfile {
  id: number;
  user: number;
  date_of_birth: string | null;
  class_name: string;
  stream: string;
  school: string;
  city: string;
  interests: string;
  skills: string;
  created_at: string;
  updated_at: string;
}

export interface AssessmentQuestion {
  id: number;
  assessment: number;
  question: string;
  category: string;
  question_order: number;
}

export interface AssessmentAnswer {
  id: number;
  assessment: number;
  question: number;
  answer: string;
  score: number;
  answered_at: string;
}

export interface Assessment {
  id: number;
  student: number;
  title: string;
  started_at: string;
  completed_at: string | null;
  score: number;
  is_completed: boolean;
  questions: AssessmentQuestion[];
  answers: AssessmentAnswer[];
}

export interface CareerRecommendation {
  id: number;
  student: number;
  career: string;
  match_percentage: number;
  reason: string;
  required_skills: string;
  roadmap: string;
  created_at: string;
}

export interface CareerRoadmap {
  id: number;
  student: number;
  career: string;
  current_level: string;
  missing_skills: string;
  recommended_skills: string;
  projects: string;
  roadmap: string;
  duration_months: number;
  created_at: string;
  updated_at: string;
}


// ============================================================
// AUTHENTICATION
// ============================================================

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(
    "/accounts/login/",
    {
      method: "POST",
      body: {
        username,
        password,
      },
    }
  );
}


export async function register(
  username: string,
  email: string,
  password: string,
  firstName = "",
  lastName = ""
) {
  return apiRequest<User>(
    "/accounts/register/",
    {
      method: "POST",
      body: {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      },
    }
  );
}


export async function getMe(
  token: string
): Promise<User> {
  return apiRequest<User>(
    "/accounts/me/",
    {
      token,
    }
  );
}


// ============================================================
// STUDENT PROFILE
// ============================================================

export async function getStudentProfile(
  token: string
): Promise<StudentProfile> {
  return apiRequest<StudentProfile>(
    "/students/profile/",
    {
      token,
    }
  );
}


export async function updateStudentProfile(
  token: string,
  profile: Partial<StudentProfile>
): Promise<StudentProfile> {
  return apiRequest<StudentProfile>(
    "/students/profile/",
    {
      method: "PUT",
      token,
      body: profile,
    }
  );
}


// ============================================================
// ASSESSMENTS
// ============================================================

export async function getAssessments(
  token: string
): Promise<Assessment[]> {
  return apiRequest<Assessment[]>(
    "/students/assessments/",
    {
      token,
    }
  );
}


export async function createAssessment(
  token: string,
  title = "Career Assessment"
): Promise<Assessment> {
  return apiRequest<Assessment>(
    "/students/assessments/",
    {
      method: "POST",
      token,
      body: {
        title,
      },
    }
  );
}


export async function getAssessment(
  token: string,
  assessmentId: number
): Promise<Assessment> {
  return apiRequest<Assessment>(
    `/students/assessments/${assessmentId}/`,
    {
      token,
    }
  );
}


export async function submitAssessmentAnswer(
  token: string,
  assessmentId: number,
  question: number,
  answer: string,
  score: number
): Promise<AssessmentAnswer> {
  return apiRequest<AssessmentAnswer>(
    `/students/assessments/${assessmentId}/answers/`,
    {
      method: "POST",
      token,
      body: {
        question,
        answer,
        score,
      },
    }
  );
}


export async function completeAssessment(
  token: string,
  assessmentId: number
) {
  return apiRequest(
    `/students/assessments/${assessmentId}/complete/`,
    {
      method: "POST",
      token,
    }
  );
}


export async function getAssessmentResult(
  token: string,
  assessmentId: number
) {
  return apiRequest(
    `/students/assessments/${assessmentId}/result/`,
    {
      token,
    }
  );
}


// ============================================================
// CAREER RECOMMENDATIONS
// ============================================================

export async function getCareerRecommendations(
  token: string
): Promise<CareerRecommendation[]> {
  return apiRequest<CareerRecommendation[]>(
    "/students/recommendations/",
    {
      token,
    }
  );
}


export async function generateCareerRecommendations(
  token: string,
  assessmentId: number
) {
  return apiRequest(
    "/students/recommendations/",
    {
      method: "POST",
      token,
      body: {
        assessment_id: assessmentId,
      },
    }
  );
}


// ============================================================
// CAREER ROADMAP
// ============================================================

export async function getCareerRoadmaps(
  token: string
): Promise<CareerRoadmap[]> {
  return apiRequest<CareerRoadmap[]>(
    "/students/roadmaps/",
    {
      token,
    }
  );
}


export async function createCareerRoadmap(
  token: string,
  career: string
): Promise<CareerRoadmap> {
  return apiRequest<CareerRoadmap>(
    "/students/roadmaps/",
    {
      method: "POST",
      token,
      body: {
        career,
      },
    }
  );
}