"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import QuestionDisplay from "@/components/quiz/QuestionDisplay";
import ScoreDisplay from "@/components/attempt/ScoreDisplay";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";

interface Option {
    text: string;
    image?: string;
    isCorrect: boolean;
}

interface Question {
    questionText: string;
    timeLimit?: number;
    required?: boolean;
    originalIndex: number;
    options: Option[];
}

interface Quiz {
    showScore?: boolean;
    questions: Question[];
    title: string;
    timeLimit?: number;
    maxAttempts?: number;
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
}

interface AttemptResult {
    percentage: number;
    score: number;
    totalPoints: number;
    timeTaken: number;
    categoryScores?: Record<string, number>;
    answers: { questionIndex: number; selectedOptionIndex: number }[];
    quizId?: { _id: string; title: string; questions: { questionText: string }[] };
}

export default function QuizAttemptPage({ params }: { params: { id: string } }) {
  const { status: authStatus } = useSession();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<({ selectedOptionIndex: number } | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number | null>(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [attemptResult, setAttemptResult] = useState<AttemptResult | null>(null);
  const router = useRouter();

  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const submitQuiz = async (isAuto = false) => {
    if (!isAuto) {
      // Check required questions before submitting
      if (!quiz) return;
      const missingRequired = quiz.questions.some((q, i) => q.required && answers[i] === null);
      if (missingRequired) {
        alert("Please answer all required questions before submitting.");
        return;
      }

      const unansweredCount = answers.filter(a => a === null).length;
      if (unansweredCount > 0) {
        if (!confirm(`You have ${unansweredCount} unanswered questions. Submit anyway?`)) return;
      }
    }

    setSubmitting(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    try {
      const passcode = sessionStorage.getItem(`pass_${params.id}`) || "";
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: passcode
          ? { "Content-Type": "application/json", "x-quiz-passcode": passcode }
          : { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: params.id,
          answers: answers.filter(a => a !== null).map((a, i) => ({
            ...a,
            questionIndex: quiz?.questions[i]?.originalIndex // Crucial for shuffled scoring
          })),
          timeTaken,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAttemptResult(data);
      } else {
        alert(data.message || "Failed to submit attempt");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };



  useEffect(() => {
    async function fetchQuiz() {
      try {
        if (authStatus === "loading") return;
        if (authStatus === "unauthenticated") {
          signIn(undefined, { callbackUrl: `/quizzes/${params.id}/attempt` });
          return;
        }

        const passcode = sessionStorage.getItem(`pass_${params.id}`) || "";
        const [quizRes, userAttemptsRes] = await Promise.all([
          fetch(`/api/quizzes/${params.id}`, {
            headers: passcode ? { "x-quiz-passcode": passcode } : undefined,
          }),
          fetch(`/api/attempts?quizId=${params.id}`)
        ]);

        const rawQuiz = await quizRes.json();
        const userAttempts = await userAttemptsRes.json();
        
        // Check attempt limits
        const completedAttempts = userAttempts.filter((a: { quizId: { _id: string } | string }) => (typeof a.quizId === 'object' ? a.quizId._id : a.quizId) === params.id).length;
            if (rawQuiz.maxAttempts > 0 && completedAttempts >= rawQuiz.maxAttempts) {
                alert(`You have reached the maximum of ${rawQuiz.maxAttempts} attempts for this quiz.`);
                router.push(`/quizzes/${params.id}`);
                return;
            }
        
        // Prepare questions with original indices for scoring
        let processedQuestions = rawQuiz.questions.map((q: { questionText: string; timeLimit?: number; options: { text: string; image?: string; isCorrect: boolean }[] }, i: number) => ({ ...q, originalIndex: i }));
        
        // Global Shuffle
        if (rawQuiz.shuffleQuestions) {
            processedQuestions = shuffleArray(processedQuestions);
        }

        // Option Shuffling
        if (rawQuiz.shuffleOptions) {
            processedQuestions = processedQuestions.map((q: { options: { text: string; image?: string; isCorrect: boolean }[] }) => ({
                ...q,
                options: shuffleArray(q.options)
            }));
        }

        const preparedQuiz = { ...rawQuiz, questions: processedQuestions };
        setQuiz(preparedQuiz);
        
        // Initialize answers array
        setAnswers(new Array(preparedQuiz.questions.length).fill(null));
        
        // Initialize timer if limit exists
        const limit = Number(preparedQuiz.timeLimit);
        if (limit > 0) {
          setTimeLeft(limit * 60);
        }
        
        // Question Timer Initialization for First Question
        if (preparedQuiz.questions[0]?.timeLimit > 0) {
            setQuestionTimeLeft(preparedQuiz.questions[0].timeLimit);
        }

        setStartTime(Date.now());
      } catch (err) {
        console.error(err);
      } finally {
        if (authStatus !== "loading") setLoading(false);
      }
    }
    fetchQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, authStatus]);

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      selectedOptionIndex: optionIndex
    };
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (!quiz) return;
    // Check if required
    if (quiz.questions[currentQuestionIndex].required && answers[currentQuestionIndex] === null) {
        alert("This question is required. Please select an answer to continue.");
        return;
    }

    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      // Reset question timer for the next one
      const nextLimit = quiz.questions[nextIdx]?.timeLimit || 0;
      setQuestionTimeLeft(nextLimit > 0 ? nextLimit : null);
    }
  };

  // Global Quiz Timer
  useEffect(() => {
    if (timeLeft === null || attemptResult) return;
    if (timeLeft <= 0) { 
      alert("Time is up! Submitting your quiz automatically.");
      submitQuiz(true); 
      return; 
    }
    const timer = setInterval(() => setTimeLeft(prev => (prev !== null ? prev - 1 : null)), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, !!attemptResult]);

  // Per-Question Timer
  useEffect(() => {
    if (questionTimeLeft === null || attemptResult) return;
    if (questionTimeLeft <= 0) { 
        if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
            nextQuestion();
        } else {
            submitQuiz(true);
        }
        return; 
    }
    const timer = setInterval(() => setQuestionTimeLeft(prev => (prev !== null ? prev - 1 : null)), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionTimeLeft, !!attemptResult, currentQuestionIndex]);



  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!attemptResult) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [attemptResult]);

  useEffect(() => {
    const handlePopState = () => {
      // When the user clicks back, they are already navigating away.
      // If we want it to "quit automatically", we don't need to do much 
      // other than ensure we don't block it.
      // However, the user might expect a confirmation only if they CLICK back.
      // But they said "it should quit automatically".
      // So we just let it happen.
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleQuit = () => {
    if (confirm("Are you sure you want to quit the quiz? Your progress will be lost.")) {
      router.push("/dashboard");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground">Preparing your quiz session...</p>
        </div>
    );
  }

  if (attemptResult) {
    const reviewQuiz = (attemptResult.quizId && typeof attemptResult.quizId === 'object') ? attemptResult.quizId as unknown as Quiz : quiz as Quiz;
    return <ScoreDisplay result={attemptResult} quiz={reviewQuiz} />;
  }

  if (!quiz) return null;

  // const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Top Bar */}
      <div className="fixed top-0 left-0 right-0 p-4 z-50 flex items-center justify-between bg-background/80 backdrop-blur-sm">
        <button 
          onClick={handleQuit}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Quit Quiz"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="flex-1 max-w-md mx-4">
             <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                    className="h-full bg-primary transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>

        <div className={`text-sm font-bold ${timeLeft !== null && timeLeft < 60 ? "text-red-500 animate-pulse" : "text-muted-foreground"}`}>
             {timeLeft !== null ? formatTime(timeLeft) : <span className="text-xs opacity-50">NO LIMIT</span>}
        </div>
      </div>

      {/* Main Content Area - Centered */}
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full px-6 py-20">
        <QuestionDisplay 
            question={quiz.questions[currentQuestionIndex]} 
            selectedOption={answers[currentQuestionIndex]?.selectedOptionIndex ?? null}
            onSelect={(optionIndex) => handleSelectOption(optionIndex)}
        />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t border-border md:border-none md:bg-transparent">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
           <button 
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-4 rounded-xl font-bold text-muted-foreground hover:bg-secondary disabled:opacity-0 transition-all"
           >
                <ChevronLeft className="w-6 h-6" />
           </button>

            {quiz && currentQuestionIndex < quiz.questions.length - 1 ? (
                <button 
                    onClick={nextQuestion}
                    className="flex-1 bg-primary text-primary-foreground h-14 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                    Next <ChevronRight className="w-5 h-5" />
                </button>
            ) : (
                <button 
                    onClick={() => submitQuiz()}
                    disabled={submitting}
                    className="flex-1 bg-emerald-600 text-white h-14 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit"}
                </button>
            )}
        </div>
      </div>
    </div>
  );
}
