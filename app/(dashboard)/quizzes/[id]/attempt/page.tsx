"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import QuestionDisplay from "@/components/quiz/QuestionDisplay";
import ScoreDisplay from "@/components/attempt/ScoreDisplay";
import { Loader2, Timer, ChevronRight, ChevronLeft, Send, AlertTriangle } from "lucide-react";

export default function QuizAttemptPage({ params }: { params: { id: string } }) {
  const { data: session, status: authStatus } = useSession();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number | null>(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [attemptResult, setAttemptResult] = useState<any>(null);
  const [originalQuiz, setOriginalQuiz] = useState<any>(null);
  const router = useRouter();

  const shuffleArray = (array: any[]) => {
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
      const missingRequired = quiz.questions.some((q: any, i: number) => q.required && answers[i] === null);
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
            questionIndex: quiz.questions[i].originalIndex // Crucial for shuffled scoring
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

  const handleAutoSubmit = () => {
    alert("Time is up! Submitting your quiz automatically.");
    submitQuiz(true);
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
        const completedAttempts = userAttempts.filter((a: any) => a.quizId?._id === params.id || a.quizId === params.id).length;
        if (rawQuiz.maxAttempts > 0 && completedAttempts >= rawQuiz.maxAttempts) {
            alert(`You have reached the maximum of ${rawQuiz.maxAttempts} attempts for this quiz.`);
            router.push(`/quizzes/${params.id}`);
            return;
        }

        setOriginalQuiz(rawQuiz);
        
        // Prepare questions with original indices for scoring
        let processedQuestions = rawQuiz.questions.map((q: any, i: number) => ({ ...q, originalIndex: i }));
        
        // Global Shuffle
        if (rawQuiz.shuffleQuestions) {
            processedQuestions = shuffleArray(processedQuestions);
        }

        // Option Shuffling
        if (rawQuiz.shuffleOptions) {
            processedQuestions = processedQuestions.map((q: any) => ({
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
  }, [params.id, authStatus]);

  // Global Quiz Timer
  useEffect(() => {
    if (timeLeft === null || attemptResult) return;
    if (timeLeft <= 0) { handleAutoSubmit(); return; }
    const timer = setInterval(() => setTimeLeft(prev => (prev !== null ? prev - 1 : null)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, attemptResult]);

  // Per-Question Timer
  useEffect(() => {
    if (questionTimeLeft === null || attemptResult) return;
    if (questionTimeLeft <= 0) { 
        if (currentQuestionIndex < quiz.questions.length - 1) {
            nextQuestion();
        } else {
            submitQuiz(true);
        }
        return; 
    }
    const timer = setInterval(() => setQuestionTimeLeft(prev => (prev !== null ? prev - 1 : null)), 1000);
    return () => clearInterval(timer);
  }, [questionTimeLeft, attemptResult]);

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      selectedOptionIndex: optionIndex
    };
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    // Check if required
    if (quiz.questions[currentQuestionIndex].required && answers[currentQuestionIndex] === null) {
        alert("This question is required. Please select an answer to continue.");
        return;
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      // Reset question timer for the next one
      const nextLimit = quiz.questions[nextIdx]?.timeLimit || 0;
      setQuestionTimeLeft(nextLimit > 0 ? nextLimit : null);
    }
  };

  const saveProgress = async () => {
    setSubmitting(true);
    try {
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        const passcode = sessionStorage.getItem(`pass_${params.id}`) || "";
        await fetch("/api/attempts/save", {
            method: "POST",
            headers: passcode
              ? { "Content-Type": "application/json", "x-quiz-passcode": passcode }
              : { "Content-Type": "application/json" },
            body: JSON.stringify({
                quizId: params.id,
                answers: answers.filter(a => a !== null).map((a, i) => ({
                    ...a,
                    questionIndex: quiz.questions[i].originalIndex
                })),
                timeTaken,
                currentQuestionIndex
            }),
        });
        alert("Progress saved! You can return later.");
        router.push("/dashboard");
    } catch (err) {
        console.error(err);
    } finally {
        setSubmitting(false);
    }
  };

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
    const reviewQuiz = (attemptResult.quizId && typeof attemptResult.quizId === 'object') ? attemptResult.quizId : quiz;
    return <ScoreDisplay result={attemptResult} quiz={reviewQuiz} rawAnswers={answers} />;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleQuit}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border border-border text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-100 transition-all shadow-sm font-bold group"
          >
            <AlertTriangle className="w-5 h-5 group-hover:animate-bounce" />
            <span>Quit</span>
          </button>
          <div>
             <h1 className="text-2xl font-black text-slate-900 line-clamp-1">{quiz.title}</h1>
             <div className="flex items-center gap-4 text-sm font-bold text-slate-400 mt-1">
                  <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                   <span className={`flex items-center gap-1 ${timeLeft !== null && timeLeft < 60 ? "text-red-500 animate-pulse" : ""}`}>
                    <Timer className="w-4 h-4" /> 
                    {timeLeft !== null ? formatTime(timeLeft) : "No Time Limit"}
                  </span>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
             <button 
                onClick={saveProgress}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border border-border text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all shadow-sm font-bold group"
              >
                <span className="material-icons text-xl group-hover:rotate-12 transition-transform">save</span>
                <span>Save Later</span>
              </button>
            <div className="h-2 w-full md:w-64 bg-secondary rounded-full overflow-hidden">
                <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
      </div>

        <QuestionDisplay 
            question={quiz.questions[currentQuestionIndex]} 
            currentIndex={currentQuestionIndex}
            totalQuestions={quiz.questions.length}
            selectedOption={answers[currentQuestionIndex]?.selectedOptionIndex ?? null}
            onSelect={(optionIndex) => handleSelectOption(optionIndex)}
            questionTimeLeft={questionTimeLeft}
        />

      {/* Navigation Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border p-6 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
           <button 
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-4 font-bold text-muted-foreground hover:text-foreground disabled:opacity-0 transition-all"
           >
                <ChevronLeft className="w-5 h-5" />
                Previous
           </button>

           <div className="flex items-center gap-4">
                {currentQuestionIndex < quiz.questions.length - 1 ? (
                    <button 
                        onClick={nextQuestion}
                        className="bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-slate-100/50 dark:shadow-none"
                    >
                        Next Question
                        <ChevronRight className="w-5 h-5" />
                    </button>
                ) : (
                    <button 
                        onClick={() => submitQuiz()}
                        disabled={submitting}
                        className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-emerald-100/50 dark:shadow-none disabled:opacity-50"
                    >
                        {submitting ? "Submitting..." : (
                            <>
                                <Send className="w-5 h-5" />
                                Submit Quiz
                            </>
                        )}
                    </button>
                )}
           </div>
        </div>
      </div>
    </div>
  );
}
