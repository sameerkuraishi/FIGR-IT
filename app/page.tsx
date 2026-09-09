"use client";

import { useEffect, useMemo, useState, type ComponentType, type CSSProperties } from "react";
import {
  Activity, ArrowLeft, ArrowRight, BarChart3, BookOpen, BrainCircuit, Calculator,
  CalendarDays, Check, ChefHat, ChevronRight, CircleAlert, ClipboardCheck, Code2,
  Compass, Download, FileText, Gauge, GraduationCap, Headphones, HeartHandshake,
  Landmark, Lightbulb, LockKeyhole, LogIn, MessageSquareText, Mic, MicOff, Network,
  NotebookPen, Palette, Play, RefreshCw, RotateCcw, Route, Search, Send, ShieldCheck,
  Sparkles, Stethoscope, Target, Trophy, UserRound, UsersRound, Video, VideoOff,
  WandSparkles, X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import {
  assessmentScore, blankProfile, calculateEffectiveSkills, careers, coreSkills,
  counsellors, demoProfile, interestChoices, questionBanks, rankCareers, tracks,
  verifiedResources, type Career, type CoreSkill, type Question, type StudentProfile,
  type Track, type StudentStep, type ChatMessage
} from "@/lib/figr-product";

import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/features/Hero";
import { FeaturesSection } from "@/components/features/Features";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProfileStep } from "@/components/assessment/ProfileStep";
import { AssessmentStep } from "@/components/assessment/AssessmentStep";
import { AnalysisStep } from "@/components/dashboard/AnalysisStep";
import { CareersStep } from "@/components/dashboard/CareersStep";
import { CounsellingStep } from "@/components/dashboard/CounsellingStep";
import { GapsStep } from "@/components/dashboard/GapsStep";
import { RoadmapStep } from "@/components/dashboard/RoadmapStep";
import { LearningStep } from "@/components/dashboard/LearningStep";
import { TutorStep } from "@/components/dashboard/TutorStep";
import { QuizStep } from "@/components/dashboard/QuizStep";
import { AdaptationStep } from "@/components/dashboard/AdaptationStep";
import { HandoffStep } from "@/components/dashboard/HandoffStep";

type Screen = "landing" | "student" | "counsellor";
type Icon = ComponentType<{ className?: string }>;

const navItems: { id: StudentStep; label: string; icon: Icon }[] = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "assessment", label: "Assessment", icon: ClipboardCheck },
  { id: "analysis", label: "Analysis", icon: BarChart3 },
  { id: "careers", label: "Careers", icon: Compass },
  { id: "counselling", label: "Counselling", icon: UsersRound },
  { id: "gaps", label: "Skill Gaps", icon: Target },
  { id: "roadmap", label: "Roadmap", icon: Route },
  { id: "learning", label: "Learning Hub", icon: BookOpen },
  { id: "tutor", label: "Companion", icon: MessageSquareText },
  { id: "quiz", label: "Quiz", icon: Gauge },
  { id: "adaptation", label: "Adaptation", icon: RefreshCw },
  { id: "handoff", label: "Handoff", icon: CalendarDays },
];

const categoryIcons: Record<Career["category"], Icon> = {
  "Technology & Engineering": Code2,
  "Commerce & Finance": Calculator,
  "Creative & Media": Palette,
  "Hospitality & Service": ChefHat,
  "Healthcare & People": Stethoscope,
  "Law & Public Service": Landmark,
};

const categoryShort: Record<Career["category"], string> = {
  "Technology & Engineering": "Technology",
  "Commerce & Finance": "Finance",
  "Creative & Media": "Creative",
  "Hospitality & Service": "Service",
  "Healthcare & People": "People",
  "Law & Public Service": "Public",
};

const defaultChat: ChatMessage[] = [{ from: "guide", text: "Hello — I use your selected career, current evidence gap and roadmap stage to explain what to try next. I am currently running in guided fallback mode, so the demo stays reliable without an API key." }];

function round1(value: number) { return Math.round(value * 10) / 10; }
function getConfidence(answered: number, total: number) {
  if (answered >= total) return "High";
  if (answered >= Math.ceil(total / 2)) return "Developing";
  return "Low";
}

function buildRoadmap(career: Career, weakest: CoreSkill, budget: string, weeklyHours: number) {
  const resource = budget === "Free resources only" ? "Verified free learning source" : "Free first · paid options separated";
  const hours = Math.max(2, Math.round(weeklyHours * 1.8));
  return [
    { title: `${weakest} foundations`, type: "Foundation", objective: `Build the transferable ${weakest.toLowerCase()} foundation required for ${career.title}.`, resource, weeks: "Weeks 1–2", duration: `${hours} hrs` },
    { title: career.focusSkills[0], type: "Core skill", objective: `Learn the beginner concepts behind ${career.focusSkills[0].toLowerCase()}.`, resource, weeks: "Weeks 3–4", duration: `${hours} hrs` },
    { title: career.focusSkills[1], type: "Guided practice", objective: career.trialTask, resource, weeks: "Weeks 5–6", duration: `${hours} hrs` },
    { title: career.focusSkills[2], type: "Checkpoint", objective: "Use evidence to explain what you understand and what still needs practice.", resource, weeks: "Weeks 7–8", duration: `${hours} hrs` },
    { title: career.project, type: "Portfolio proof", objective: "Create a small artifact that shows what the work actually feels like.", resource, weeks: "Weeks 9–10", duration: `${hours} hrs` },
    { title: "Reflection and counsellor review", type: "Decision review", objective: "Compare your experience, evidence and alternatives before committing to a stream or course.", resource: "Counsellor evidence packet", weeks: "Weeks 11–12", duration: "1 review" },
  ];
}

function buildQuiz(career: Career): Question[] {
  return [career.checkpoint,
    { id: `${career.id}-trial`, skill: "Practical", prompt: `What is the most reliable way for a student to test whether ${career.title} suits them?`, options: ["Trust one percentage", "Try a small realistic task and reflect on the evidence", "Choose the trendiest course", "Ignore difficult parts"], answer: 1, explanation: "A realistic trial produces stronger evidence than a label or first impression.", difficulty: "Applied" },
    { id: `${career.id}-resource`, skill: "Organization", prompt: "When a student's budget is free-only, what should change?", options: ["Their career potential", "Only the learning-resource delivery", "Their assessment answers", "Their demonstrated strengths"], answer: 1, explanation: "Constraints should change how learning is delivered, not what the student is considered capable of becoming.", difficulty: "Foundation" },
    { id: `${career.id}-evidence`, skill: "Communication", prompt: "What makes a counsellor handoff trustworthy?", options: ["Only the top career name", "Supporting, conflicting and missing evidence", "A hidden formula", "A guaranteed prediction"], answer: 1, explanation: "A human counsellor needs both positive and conflicting evidence plus the remaining uncertainty.", difficulty: "Applied" },
  ];
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="brand-lockup"><span className="brand-mark"><GraduationCap /></span><span><strong>FIGR IT</strong>{!compact && <small>Career Navigator + Learning Companion</small>}</span></div>;
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="section-heading"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>;
}

function Metric({ label, value, tone = "indigo" }: { label: string; value: string; tone?: string }) {
  return <div className={`metric ${tone}`}><strong>{value}</strong><span>{label}</span></div>;
}

function ScoreRing({ value, label = "match" }: { value: number; label?: string }) {
  return <div className="score-ring" style={{ "--score": `${value * 3.6}deg` } as CSSProperties} aria-label={`${value}% ${label}`}><div><strong>{value}%</strong><span>{label}</span></div></div>;
}

function EmptyState({ icon: EmptyIcon, title, text, action, onAction }: { icon: Icon; title: string; text: string; action: string; onAction: () => void }) {
  return <section className="empty-state panel"><span className="icon-tile"><EmptyIcon /></span><h2>{title}</h2><p>{text}</p><Button onClick={onAction} className="primary-button">{action}<ArrowRight /></Button></section>;
}

function Landing({ start, openCounsellor }: { start: () => void; openCounsellor: () => void }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--winter-bg)]">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--winter-light)] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse-soft" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#d7f2eb] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse-soft" style={{ animationDelay: '2s' }} />
      <Navigation onStart={start} onCounsellor={openCounsellor} />
      <div className="pt-24 pb-12">
        <HeroSection onStart={start} onWorks={() => document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" })} />
        <FeaturesSection />
      </div>
      <Footer />
      <Toaster richColors />
    </main>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [step, setStep] = useState<StudentStep>("profile");
  const [profile, setProfile] = useState<StudentProfile>(blankProfile);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [assessmentDone, setAssessmentDone] = useState(false);
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);
  const [careerSearch, setCareerSearch] = useState("");
  const [careerCategory, setCareerCategory] = useState("All");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [selectedCounsellorId, setSelectedCounsellorId] = useState(counsellors[0].id);
  const [selectedSlot, setSelectedSlot] = useState("Tomorrow · 10:00 AM");
  const [bookingStatus, setBookingStatus] = useState<"idle" | "reserved" | "live">("idle");
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [learningTab, setLearningTab] = useState<"notes" | "brief" | "cards" | "lectures" | "practice">("notes");
  const [studentNotes, setStudentNotes] = useState("");
  const [flashIndex, setFlashIndex] = useState(0);
  const [flashFlipped, setFlashFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<number[]>([]);
  const [chat, setChat] = useState<ChatMessage[]>(defaultChat);
  const [prompt, setPrompt] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [counsellorLoggedIn, setCounsellorLoggedIn] = useState(false);
  const [counsellorFeedback, setCounsellorFeedback] = useState("");
  const [feedbackDraft, setFeedbackDraft] = useState("Begin with the highest-impact foundation, then use one small realistic task before making a final career commitment.");
  const [technicalOpen, setTechnicalOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const questions = questionBanks[profile.track];
  const effectiveSkills = useMemo(() => calculateEffectiveSkills(profile, questions, answers), [profile, questions, answers]);
  const rankedCareers = useMemo(() => rankCareers(profile, effectiveSkills), [profile, effectiveSkills]);
  const activeCareer = careers.find((item) => item.id === selectedCareerId) ?? rankedCareers[0];
  const activeResult = rankedCareers.find((item) => item.id === activeCareer.id) ?? rankedCareers[0];
  const answeredCount = questions.filter((question) => answers[question.id] !== undefined).length;
  const currentAssessmentScore = assessmentScore(questions, answers);
  const evidenceConfidence = getConfidence(answeredCount, questions.length);
  const gaps = useMemo(() => coreSkills.map((skill) => ({ skill, current: effectiveSkills[skill], required: activeCareer.requirements[skill], gap: round1(Math.max(0, activeCareer.requirements[skill] - effectiveSkills[skill])) })).sort((a, b) => b.gap - a.gap), [effectiveSkills, activeCareer]);
  const weakest = gaps[0];
  const roadmap = useMemo(() => buildRoadmap(activeCareer, weakest.skill, profile.budget, profile.weeklyHours), [activeCareer, weakest.skill, profile.budget, profile.weeklyHours]);
  const quizQuestions = useMemo(() => buildQuiz(activeCareer), [activeCareer]);
  const selectedCounsellor = counsellors.find((item) => item.id === selectedCounsellorId) ?? counsellors[0];
  const currentStepIndex = navItems.findIndex((item) => item.id === step);
  const strongSkills = [...coreSkills].sort((a, b) => effectiveSkills[b] - effectiveSkills[a]).slice(0, 2);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("figr-nxt-active-demo-v3");
      if (raw) {
        const saved = JSON.parse(raw);
        setTimeout(() => {
          if (saved.profile) setProfile(saved.profile);
          if (saved.answers) setAnswers(saved.answers);
          if (saved.assessmentDone) setAssessmentDone(saved.assessmentDone);
          if (saved.selectedCareerId) setSelectedCareerId(saved.selectedCareerId);
          if (saved.completedModules) setCompletedModules(saved.completedModules);
          if (saved.studentNotes) setStudentNotes(saved.studentNotes);
          if (saved.chat) setChat(saved.chat);
          if (saved.quizAnswers) setQuizAnswers(saved.quizAnswers);
          if (saved.quizIndex !== undefined) setQuizIndex(saved.quizIndex);
          if (saved.prompt) setPrompt(saved.prompt);
          if (saved.counsellorFeedback) setCounsellorFeedback(saved.counsellorFeedback);
          if (saved.bookingStatus) setBookingStatus(saved.bookingStatus);
          if (saved.selectedSlot) setSelectedSlot(saved.selectedSlot);
          if (saved.selectedCounsellorId) setSelectedCounsellorId(saved.selectedCounsellorId);
        }, 0);
      }
    } catch { localStorage.removeItem("figr-nxt-active-demo-v3"); }
    setTimeout(() => setHydrated(true), 0);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("figr-nxt-active-demo-v3", JSON.stringify({ profile, answers, assessmentDone, selectedCareerId, completedModules, studentNotes, chat, quizAnswers, quizScore, bookingStatus, selectedCounsellorId, selectedSlot, counsellorFeedback }));
  }, [hydrated, profile, answers, assessmentDone, selectedCareerId, completedModules, studentNotes, chat, quizAnswers, quizScore, bookingStatus, selectedCounsellorId, selectedSlot, counsellorFeedback]);

  function updateProfile<K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) { setProfile((current) => ({ ...current, [key]: value })); }
  function changeTrack(track: Track) { updateProfile("track", track); setAnswers({}); setAssessmentDone(false); setSelectedCareerId(null); setQuizScore(null); setQuestionIndex(0); }
  function loadDemoStudent() {
    const demoQuestions = questionBanks[demoProfile.track];
    setProfile(demoProfile);
    setAnswers(Object.fromEntries(demoQuestions.slice(0, 4).map((question) => [question.id, question.answer])));
    setAssessmentDone(false); setSelectedCareerId(null); setCompletedModules([]); setQuizAnswers({}); setQuizScore(null); setBookingStatus("idle"); setCounsellorFeedback(""); setQuestionIndex(0); setQuizIndex(0);
    setChat([{ from: "guide", text: "Hi Aarav — I can use your profile, selected career and latest learning evidence to help you plan the next useful step." }]);
    setScreen("student"); setStep("profile");
    toast.success("Demo student loaded. Four assessment answers are ready; you choose the final two.");
  }
  function resetDemo() {
    localStorage.removeItem("figr-nxt-active-demo-v3");
    setProfile(blankProfile); setAnswers({}); setAssessmentDone(false); setSelectedCareerId(null); setCompletedModules([]); setQuizAnswers({}); setQuizScore(null); setBookingStatus("idle"); setCounsellorFeedback(""); setStudentNotes(""); setChat(defaultChat); setStep("profile"); setQuestionIndex(0); setQuizIndex(0);
    toast.success("The demo has been reset.");
  }
  function finishAssessment() {
    if (answeredCount !== questions.length) return toast.error(`Answer ${questions.length - answeredCount} remaining question${questions.length - answeredCount === 1 ? "" : "s"}.`);
    setAssessmentDone(true); setStep("analysis"); toast.success("Evidence analysed with the transparent 45/55 formula.");
  }
  function chooseCareer(id: string) { setSelectedCareerId(id); setCompletedModules([]); setQuizAnswers({}); setQuizScore(null); setQuizIndex(0); setBookingStatus("idle"); setStep("counselling"); }
  function toggleCompare(id: string) { setCompareIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 2 ? [...current, id] : [current[1], id]); }
  function completeModule(index: number) {
    if (index > 0 && !completedModules.includes(index - 1)) return toast.error("Complete the previous milestone first.");
    setCompletedModules((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  }
  function guidedTutorReply(message: string) {
    const lower = message.toLowerCase();
    if (lower.includes("10-minute") || lower.includes("practice")) return `${profile.name.split(" ")[0] || "Student"}, try this 10-minute ${activeCareer.title} trial: ${activeCareer.trialTask} When you finish, note what felt interesting, difficult and worth practising again.`;
    if (lower.includes("counsellor")) return `Ask your counsellor to compare ${activeCareer.title} with ${rankedCareers.find((item) => item.id !== activeCareer.id)?.title}. Bring the evidence packet so they can see both supporting and missing evidence.`;
    if (lower.includes("next")) return `Your next useful step is ${roadmap[0].title}. It targets the largest current gap: ${weakest.skill} (${weakest.current}/10 compared with ${weakest.required}/10).`;
    if (lower.includes("mistake") || lower.includes("quiz")) return quizScore === null ? `Take the ${activeCareer.title} checkpoint first. I will use the result to explain the weak concept and the roadmap change.` : quizScore < 60 ? `The ${quizScore}% result suggests one concept needs reinforcement. FIGR adds a short recovery task before the next milestone rather than treating the result as a final judgement.` : `The ${quizScore}% result meets the mastery rule, so the next milestone can unlock.`;
    return `${activeCareer.title} combines ${activeCareer.focusSkills.join(", ")}. Your strongest current evidence is ${strongSkills.join(" and ")}; ${weakest.skill} is the most useful area to test next. ${activeCareer.trialTask}`;
  }
  function sendMessage(text = prompt) { const clean = text.trim(); if (!clean) return; setChat((current) => [...current, { from: "student", text: clean }, { from: "guide", text: guidedTutorReply(clean) }]); setPrompt(""); }
  function submitQuiz() {
    const answered = quizQuestions.filter((question) => quizAnswers[question.id] !== undefined).length;
    if (answered !== quizQuestions.length) return toast.error("Answer all four checkpoint questions first.");
    const correct = quizQuestions.filter((question) => quizAnswers[question.id] === question.answer).length;
    const score = Math.round((correct / quizQuestions.length) * 100); setQuizScore(score);
    if (score >= 60) setCompletedModules((current) => Array.from(new Set([...current, 0, 1])));
    setStep("adaptation"); toast[score >= 60 ? "success" : "error"](score >= 60 ? "Mastery demonstrated. The next milestone is unlocked." : "A recovery branch has been inserted into the roadmap.");
  }
  function loadWeakQuiz() { setQuizAnswers(Object.fromEntries(quizQuestions.map((question) => [question.id, question.answer === 0 ? 1 : 0]))); toast.message("Judge-ready weak result loaded. Submit to demonstrate adaptation."); }
  function saveCounsellorFeedback() { if (!feedbackDraft.trim()) return; setCounsellorFeedback(feedbackDraft.trim()); toast.success("Guidance shared with the student view."); }

  if (screen === "landing") return <Landing start={() => { setScreen("student"); setStep("profile"); }} openCounsellor={() => setScreen("counsellor")} />;

  if (screen === "counsellor") {
    return <main className="portal-shell">
      <header className="portal-header"><Logo /><Button variant="outline" onClick={() => setScreen("landing")} className="secondary-button"><ArrowLeft /> Back to website</Button></header>
      {!counsellorLoggedIn ? <section className="demo-login panel glass-panel"><span className="icon-tile coral"><HeartHandshake /></span><p className="eyebrow coral-text">Human mentorship</p><h1>Counsellor Portal</h1><p>Review student evidence, roadmap progress and requests. This prototype uses a clearly labelled fictional demo account.</p><div className="demo-credentials"><span>Demo profile</span><strong>Dr. Priya Menon</strong><small>No real credentials or password required</small></div><Button onClick={() => setCounsellorLoggedIn(true)} className="primary-button"><LogIn /> Enter Demo Portal</Button></section> :
        <div className="counsellor-dashboard"><aside className="portal-sidebar glass-panel"><div className="counsellor-identity"><span>PM</span><div><strong>Dr. Priya Menon</strong><small>Demo counsellor profile</small></div></div>{["Overview", "Assigned students", "Requests", "Sessions", "Mentor notes", "Profile"].map((item, index) => <button key={item} className={index === 0 ? "active" : ""} onClick={() => toast.message(`${item} is represented in this connected demo dashboard.`)}>{item}</button>)}<Button variant="outline" onClick={() => setScreen("student")} className="secondary-button">Open student view</Button></aside>
          <section className="portal-workspace"><SectionHeading eyebrow="Counsellor dashboard" title="Student evidence at a glance" description="The human guide receives supporting, conflicting and missing evidence—not an unexplained prediction." /><div className="metric-grid four"><Metric label="Assigned students" value="12" /><Metric label="Pending requests" value={bookingStatus === "idle" ? "3" : "4"} tone="coral" /><Metric label="Upcoming sessions" value={bookingStatus === "idle" ? "2" : "3"} tone="teal" /><Metric label="Needs attention" value="2" tone="amber" /></div><div className="portal-columns"><section className="panel case-card"><div className="case-head"><span>A</span><div><h2>{profile.name || "Aarav Sharma"}</h2><p>{profile.level} · {activeCareer.title}</p></div><span className="status-chip">{evidenceConfidence} evidence</span></div><div className="case-metrics"><Metric label="Career match" value={`${activeResult.match}%`} /><Metric label="Readiness" value={`${activeResult.readiness}%`} tone="teal" /><Metric label="Highest gap" value={weakest.skill} tone="coral" /></div><h3>What the counsellor should notice</h3><ul><li>Strongest current evidence: {strongSkills.join(" and ")}.</li><li>Largest missing foundation: {weakest.skill}, gap {weakest.gap}/10.</li><li>Alternative path: {rankedCareers.find((item) => item.id !== activeCareer.id)?.title}.</li><li>Roadmap progress: {completedModules.length}/{roadmap.length} milestones.</li></ul></section><section className="panel mentor-note"><p className="eyebrow">Mentor guidance</p><h2>Send a recommendation</h2><Textarea value={feedbackDraft} onChange={(event) => setFeedbackDraft(event.target.value)} aria-label="Mentor recommendation" /><Button onClick={saveCounsellorFeedback} className="coral-button"><Send /> Share with student</Button>{counsellorFeedback && <div className="shared-note"><Check /><span><strong>Visible in student handoff</strong><small>{counsellorFeedback}</small></span></div>}</section></div></section></div>}
      <Toaster richColors />
    </main>;
  }

  const currentQuestion = questions[Math.min(questionIndex, questions.length - 1)];
  const filteredCareers = rankedCareers.filter((item) => (careerCategory === "All" || item.category === careerCategory) && `${item.title} ${item.category}`.toLowerCase().includes(careerSearch.toLowerCase()));
  const compared = compareIds.map((id) => rankedCareers.find((item) => item.id === id)).filter(Boolean) as typeof rankedCareers;
  const flashcards = [
    { front: "What is the biggest current evidence gap?", back: `${weakest.skill}: ${weakest.current}/10 now versus ${weakest.required}/10 for ${activeCareer.title}.` },
    { front: "What should budget affect?", back: "Resource delivery and format—not career potential or fit." },
    { front: "What makes a recommendation trustworthy?", back: "Visible supporting, conflicting and missing evidence plus an honest confidence level." },
  ];

  return <main className="min-h-screen bg-[var(--winter-bg)] flex">
    <Sidebar
      profile={profile}
      targetCareerTitle={selectedCareerId ? activeCareer.title : null}
      navItems={navItems}
      currentStepIndex={currentStepIndex}
      step={step}
      setStep={setStep}
      loadDemoStudent={loadDemoStudent}
      resetDemo={resetDemo}
      setTechnicalOpen={setTechnicalOpen}
      setScreen={setScreen}
    />

    <section className="student-workspace"><header className="workspace-header glass-panel"><div><h2>{navItems[currentStepIndex].label}</h2><p>Step {currentStepIndex + 1} of {navItems.length} · Career Horizons</p></div><div className="header-actions"><span className="save-status"><Check /> Saved on this device</span>{step !== "handoff" && <Button onClick={() => setStep(navItems[Math.min(navItems.length - 1, currentStepIndex + 1)].id)} className="primary-button">Continue <ChevronRight /></Button>}</div></header><div className="top-progress"><span style={{ width: `${((currentStepIndex + 1) / navItems.length) * 100}%` }} /></div>

      <div className="workspace-content">
        {step === "profile" && (
          <ProfileStep
            profile={profile}
            updateProfile={updateProfile}
            changeTrack={changeTrack}
            tracks={tracks}
            interestChoices={interestChoices}
            coreSkills={coreSkills}
            careersCount={careers.length}
            loadDemoStudent={loadDemoStudent}
            setStep={setStep}
          />
        )}

        {step === "assessment" && (
          <AssessmentStep
            profile={profile}
            questions={questions}
            questionIndex={questionIndex}
            setQuestionIndex={setQuestionIndex}
            answeredCount={answeredCount}
            answers={answers}
            setAnswers={setAnswers}
            finishAssessment={finishAssessment}
          />
        )}

        {step === "analysis" && (
          <AnalysisStep
            assessmentDone={assessmentDone}
            setStep={setStep}
            coreSkills={coreSkills}
            effectiveSkills={effectiveSkills}
            evidenceConfidence={evidenceConfidence}
            interestsCount={profile.interests.length}
            currentAssessmentScore={currentAssessmentScore}
            strongSkills={strongSkills}
            weakest={weakest}
            selfRatings={profile.selfRatings}
            answeredCount={answeredCount}
            questionsLength={questions.length}
            gaps={gaps}
          />
        )}

        {step === "careers" && (
          <CareersStep
            assessmentDone={assessmentDone}
            setStep={setStep}
            careersLength={careers.length}
            careerSearch={careerSearch}
            setCareerSearch={setCareerSearch}
            careerCategory={careerCategory}
            setCareerCategory={setCareerCategory}
            filteredCareers={filteredCareers}
            compareIds={compareIds}
            toggleCompare={toggleCompare}
            chooseCareer={chooseCareer}
            evidenceConfidence={evidenceConfidence}
            compared={compared}
            setCompareIds={setCompareIds}
            categories={["All", ...Array.from(new Set(careers.map((item) => item.category)))]}
          />
        )}

        {step === "counselling" && (
          <CounsellingStep
            selectedCareerId={selectedCareerId}
            setStep={setStep}
            activeCareer={activeCareer!}
            activeResult={activeResult}
            evidenceConfidence={evidenceConfidence}
            weakest={weakest!}
            gaps={gaps}
            rankedCareers={rankedCareers}
            profile={profile}
            strongSkills={strongSkills}
            counsellors={counsellors}
            selectedCounsellorId={selectedCounsellorId}
            setSelectedCounsellorId={setSelectedCounsellorId}
            bookingStatus={bookingStatus}
            setBookingStatus={setBookingStatus}
            setScreen={setScreen}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            selectedCounsellor={selectedCounsellor}
            micOn={micOn}
            setMicOn={setMicOn}
            videoOn={videoOn}
            setVideoOn={setVideoOn}
          />
        )}

        {step === "gaps" && (
          <GapsStep
            selectedCareerId={selectedCareerId}
            setStep={setStep}
            activeCareer={activeCareer!}
            coreSkills={coreSkills}
            effectiveSkills={effectiveSkills}
            weakest={weakest!}
            gaps={gaps}
            roadmap={roadmap}
            verifiedResources={verifiedResources}
            round1={round1}
          />
        )}

        {step === "roadmap" && (
          <RoadmapStep
            selectedCareerId={selectedCareerId}
            setStep={setStep}
            activeCareer={activeCareer!}
            weakest={weakest!}
            profile={profile}
            completedModules={completedModules}
            roadmap={roadmap}
            completeModule={completeModule}
          />
        )}

        {step === "learning" && (
          <LearningStep
            activeCareer={activeCareer!}
            roadmap={roadmap}
            flashcards={flashcards}
            verifiedResources={verifiedResources}
          />
        )}

        {step === "tutor" && (
          <TutorStep
            profile={profile}
            activeCareer={activeCareer!}
            weakest={weakest!}
            roadmap={roadmap}
            completedModules={completedModules}
            quizScore={quizScore}
            sendMessage={sendMessage}
            chat={chat}
            prompt={prompt}
            setPrompt={setPrompt}
          />
        )}

        {step === "quiz" && (
          <QuizStep
            selectedCareerId={selectedCareerId}
            setStep={setStep}
            activeCareer={activeCareer!}
            quizAnswers={quizAnswers}
            quizQuestions={quizQuestions}
            loadWeakQuiz={loadWeakQuiz}
            quizIndex={quizIndex}
            setQuizAnswers={setQuizAnswers}
            setQuizIndex={setQuizIndex}
            submitQuiz={submitQuiz}
          />
        )}

        {step === "adaptation" && (
          <AdaptationStep
            quizScore={quizScore}
            setStep={setStep}
            weakest={weakest!}
            roadmap={roadmap}
          />
        )}

        {step === "handoff" && (
          <HandoffStep
            selectedCareerId={selectedCareerId}
            setStep={setStep}
            activeCareer={activeCareer!}
            profile={profile}
            activeResult={activeResult}
            evidenceConfidence={evidenceConfidence}
            completedModules={completedModules}
            roadmap={roadmap}
            gaps={gaps}
            counsellorFeedback={counsellorFeedback}
            selectedCounsellor={selectedCounsellor}
            quizScore={quizScore}
            weakest={weakest!}
            setScreen={setScreen}
          />
        )}
      </div>
    </section>

    <Dialog open={technicalOpen} onOpenChange={setTechnicalOpen}><DialogContent className="technical-dialog"><DialogHeader><DialogTitle>How this prototype works</DialogTitle><DialogDescription>Honest technical flow for judges and the backend team.</DialogDescription></DialogHeader><div className="technical-flow">{["Student Profile", "Interest Route", "Assessment Evidence", "Transparent Career Fit", "Human Counselling", "Skill Gap Engine", "Roadmap Generator", "Learning Companion", "Quiz Evidence", "Adaptive Roadmap", "Counsellor Feedback"].map((item, index, items) => <div key={item}><span>{index + 1}</span><strong>{item}</strong>{index < items.length - 1 && <ArrowRight />}</div>)}</div><ul className="technical-notes"><li>Effective skill = 45% self-rating + 55% assessment performance.</li><li>Career fit = 45% skill evidence + 35% requirement fit + 20% interest alignment.</li><li>The tutor currently uses a deterministic, context-aware fallback—not a hidden claim of live AI.</li><li>Active demo state survives refreshes through a browser fallback. The backend can replace this adapter with FastAPI and MongoDB.</li><li>Weak quiz results insert a visible recovery route; passing results unlock the next milestone.</li><li>All counsellor identities and bookings are clearly labelled prototype data.</li></ul></DialogContent></Dialog>
    <Toaster richColors />
  </main>;
}
