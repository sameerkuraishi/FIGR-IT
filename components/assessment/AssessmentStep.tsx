import {
  Check,
  ChevronRight,
  Sparkles,
  AlertCircle,
  X,
  Trophy,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StudentProfile, Question } from "@/lib/figr-product";
interface AssessmentStepProps {
  profile: StudentProfile;
  questions: Question[];
  questionIndex: number;
  setQuestionIndex: (idx: number | ((prev: number) => number)) => void;
  answeredCount: number;
  answers: Record<string, number>;
  setAnswers: (
    answers:
      | Record<string, number>
      | ((prev: Record<string, number>) => Record<string, number>)
  ) => void;
  finishAssessment: () => void;
}
export function AssessmentStep({
  profile,
  questions,
  questionIndex,
  setQuestionIndex,
  answeredCount,
  answers,
  setAnswers,
  finishAssessment,
}: AssessmentStepProps) {
  const currentQuestion = questions[questionIndex];
  if (!currentQuestion) {
    return (
      <div className="premium-card p-8 text-center">
        <AlertCircle className="w-10 h-10 mx-auto mb-4 text-red-500" />
        <h2 className="text-xl font-bold">Assessment questions unavailable</h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-2">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }
  const selectedAnswer = answers[currentQuestion.id];
  const hasAnswered = selectedAnswer !== undefined;
  const isCorrect = hasAnswered && selectedAnswer === currentQuestion.answer;
  const correctCount = questions.filter(
    (question) =>
      answers[question.id] !== undefined &&
      answers[question.id] === question.answer
  ).length;
  const wrongCount = questions.filter(
    (question) =>
      answers[question.id] !== undefined &&
      answers[question.id] !== question.answer
  ).length;
  const score =
    answeredCount > 0
      ? Math.round((correctCount / answeredCount) * 100)
      : 0;
  function selectAnswer(index: number) {
    setAnswers((current: Record<string, number>) => ({
      ...current,
      [currentQuestion.id]: index,
    }));
  }
  function nextQuestion() {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1);
    }
  }
  function previousQuestion() {
    if (questionIndex > 0) {
      setQuestionIndex((index) => index - 1);
    }
  }
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="text-center mb-2">
        <p className="text-[10px] uppercase font-bold text-[var(--winter-primary)] tracking-widest mb-2">
          Step 2 · Career Assessment
        </p>
        <h1 className="text-3xl md:text-4xl font-heading font-semibold text-[var(--winter-dark)]">
          Let's understand your skills
        </h1>
        <p className="text-[var(--muted-foreground)] mt-2 max-w-2xl mx-auto">
          Answer all {questions.length} questions. Each answer provides evidence
          about your current strengths and areas that need improvement.
        </p>
      </div>
      {/* ASSESSMENT SUMMARY */}
      <div className="premium-card p-4 md:p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5">

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="w-11 h-11 rounded-full bg-[var(--winter-light)] text-[var(--winter-primary)] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs text-[var(--muted-foreground)] uppercase font-bold tracking-wider">
                Active assessment
              </span>
              <strong className="block text-lg text-[var(--winter-dark)] leading-tight">
                {profile.track}
              </strong>
              <small className="block text-xs text-[var(--muted-foreground)] mt-0.5">
                {profile.level} · {questions.length} questions
              </small>
            </div>
          </div>
          {/* SCORE */}
          <div className="grid grid-cols-3 gap-2 w-full lg:w-auto">
            <div className="rounded-xl bg-[var(--secondary)] px-4 py-3 text-center min-w-[90px]">
              <strong className="block text-lg text-[var(--winter-dark)]">
                {answeredCount}
              </strong>
              <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)]">
                Answered
              </span>
            </div>
            <div className="rounded-xl bg-green-50 px-4 py-3 text-center min-w-[90px]">
              <strong className="block text-lg text-green-600">
                {correctCount}
              </strong>
              <span className="text-[10px] uppercase font-bold text-green-700">
                Correct
              </span>
            </div>
            <div className="rounded-xl bg-red-50 px-4 py-3 text-center min-w-[90px]">
              <strong className="block text-lg text-red-600">
                {wrongCount}
              </strong>
              <span className="text-[10px] uppercase font-bold text-red-700">
                Wrong
              </span>
            </div>
          </div>
        </div>
        {/* PROGRESS */}
        <div className="mt-5">
          <div className="flex justify-between text-xs font-bold text-[var(--winter-dark)] mb-2">
            <span>
              Question {questionIndex + 1} of {questions.length}
            </span>
            <span className="text-[var(--winter-primary)]">
              {Math.round((answeredCount / questions.length) * 100)}%
            </span>
          </div>
          <div className="h-2.5 w-full bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--winter-success)] transition-all duration-300 ease-out"
              style={{
                width: `${(answeredCount / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
      {/* QUESTION */}
      <section className="premium-card overflow-hidden">
        {/* QUESTION HEADER */}
        <div className="bg-[var(--secondary)] px-6 md:px-8 py-4 border-b border-[var(--border)] flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[var(--winter-primary)]" />
            <span className="font-bold text-[var(--winter-dark)]">
              {currentQuestion.skill}
            </span>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-[var(--winter-primary)] shadow-sm">
            {currentQuestion.difficulty}
          </span>
        </div>
        <div className="p-6 md:p-8">
          {/* QUESTION NUMBER */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--winter-primary)] text-white text-sm font-bold">
              {questionIndex + 1}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Question
            </span>
          </div>
          {/* QUESTION TEXT */}
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--winter-dark)] leading-snug mb-8">
            {currentQuestion.prompt}
          </h2>
          {/* OPTIONS */}
          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === currentQuestion.answer;
              let optionClass =
                "border-[var(--border)] bg-white hover:border-[var(--winter-primary)] hover:bg-[var(--secondary)]";
              let badgeClass =
                "bg-[var(--muted)] text-[var(--muted-foreground)]";
              if (hasAnswered && isCorrectOption) {
                optionClass =
                  "border-green-500 bg-green-50";
                badgeClass =
                  "bg-green-500 text-white";
              } else if (hasAnswered && isSelected && !isCorrect) {
                optionClass =
                  "border-red-500 bg-red-50";
                badgeClass =
                  "bg-red-500 text-white";
              } else if (isSelected) {
                optionClass =
                  "border-[var(--winter-primary)] bg-[var(--winter-bg)] shadow-sm";
                badgeClass =
                  "bg-[var(--winter-primary)] text-white";
              }

              return (
                <button
                  key={`${currentQuestion.id}-${index}`}
                  type="button"
                  onClick={() => selectAnswer(index)}
                  className={`flex items-center text-left gap-4 p-4 rounded-xl border-2 transition-all ${optionClass}`}
                >
                  <span
                    className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${badgeClass}`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <strong
                    className={`flex-1 font-medium ${
                      hasAnswered && isCorrectOption
                        ? "text-green-800"
                        : hasAnswered && isSelected && !isCorrect
                        ? "text-red-800"
                        : isSelected
                        ? "text-[var(--winter-dark)]"
                        : "text-[var(--muted-foreground)]"
                    }`}
                  >
                    {option}
                  </strong>

                  {hasAnswered && isCorrectOption && (
                    <Check className="w-5 h-5 text-green-600 shrink-0" />
                  )}

                  {hasAnswered && isSelected && !isCorrect && (
                    <X className="w-5 h-5 text-red-600 shrink-0" />
                  )}

                  {!hasAnswered && isSelected && (
                    <Check className="w-5 h-5 text-[var(--winter-primary)] shrink-0" />
                  )}

                </button>
              );
            })}
          </div>
          {/* RESULT FEEDBACK */}
          {hasAnswered && (
            <div
              className={`mt-8 rounded-2xl border-2 p-5 ${
                isCorrect
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isCorrect
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {isCorrect ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-bold text-lg ${
                      isCorrect ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {isCorrect ? "Correct Answer!" : "Wrong Answer"}
                  </h3>

                  <p
                    className={`text-sm mt-1 ${
                      isCorrect ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    <strong>Correct answer:</strong>{" "}
                    {String.fromCharCode(65 + currentQuestion.answer)}.{" "}
                    {currentQuestion.options[currentQuestion.answer]}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-red-700 mt-1">
                      <strong>Your answer:</strong>{" "}
                      {String.fromCharCode(65 + selectedAnswer)}.{" "}
                      {currentQuestion.options[selectedAnswer]}
                    </p>
                  )}
                </div>
              </div>
              {/* EXPLANATION */}
              <div className="mt-5 pt-4 border-t border-current/10">
                <p className="text-xs uppercase tracking-wider font-bold mb-1 opacity-70">
                  Explanation
                </p>
                <p
                  className={`text-sm leading-relaxed ${
                    isCorrect ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          )}
          {/* WHY QUESTION */}
          <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-start gap-3 text-sm text-[var(--muted-foreground)]">
            <AlertCircle className="w-5 h-5 text-[var(--winter-muted)] shrink-0" />
            <div>
              <strong className="block text-[var(--winter-dark)] mb-1">
                Why are we asking this?
              </strong>
              <p>
                This question gathers evidence about{" "}
                {currentQuestion.skill.toLowerCase()}. Your result is combined
                with your self-rating and other evidence; one question does not
                decide your career.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* LIVE SCORE */}
      {answeredCount > 0 && (
        <div className="premium-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--winter-light)] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[var(--winter-primary)]" />
            </div>

            <div>
              <strong className="block text-[var(--winter-dark)]">
                Current assessment performance
              </strong>

              <span className="text-xs text-[var(--muted-foreground)]">
                Based on {answeredCount} answered question
                {answeredCount === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <strong className="text-3xl text-[var(--winter-primary)]">
              {score}%
            </strong>

            <span className="block text-xs text-[var(--muted-foreground)]">
              {correctCount} correct · {wrongCount} wrong
            </span>
          </div>

        </div>
      )}

      {/* NAVIGATION */}
      <div className="flex flex-col gap-5">

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Button
            variant="outline"
            disabled={questionIndex === 0}
            onClick={previousQuestion}
            className="btn-secondary w-full md:w-auto h-12"
          >
            Previous
          </Button>
          <div className="flex flex-wrap justify-center gap-2 max-w-xl">

            {questions.map((question, index) => {

              const isCurrent = index === questionIndex;
              const isAnswered =
                answers[question.id] !== undefined;

              const answeredCorrectly =
                isAnswered &&
                answers[question.id] === question.answer;

              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setQuestionIndex(index)}
                  title={`Question ${index + 1}`}
                  className={`w-9 h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                    isCurrent
                      ? "bg-[var(--winter-primary)] text-white shadow-md ring-2 ring-offset-2 ring-[var(--winter-primary)]"
                      : isAnswered && answeredCorrectly
                      ? "bg-green-500 text-white"
                      : isAnswered
                      ? "bg-red-500 text-white"
                      : "bg-white border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--winter-primary)]"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          {questionIndex < questions.length - 1 ? (
            <Button
              onClick={nextQuestion}
              className="btn-primary w-full md:w-auto h-12 px-6"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={finishAssessment}
              disabled={answeredCount !== questions.length}
              className="btn-primary w-full md:w-auto h-12 px-6 shadow-md shadow-[var(--winter-primary)]/30"
            >
              Analyze Assessment
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
        {/* FINAL WARNING */}
        {questionIndex === questions.length - 1 &&
          answeredCount !== questions.length && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 text-center">
              Please answer all{" "}
              <strong>{questions.length - answeredCount}</strong> remaining
              question
              {questions.length - answeredCount === 1 ? "" : "s"} before
              analysing your assessment.
            </div>
          )}

      </div>
    </div>
  );
}