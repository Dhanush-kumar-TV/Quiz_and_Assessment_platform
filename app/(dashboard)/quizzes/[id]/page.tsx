"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Clock, HelpCircle, Trophy, Play, Edit, Trash2, Loader2, ArrowLeft, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";

interface Quiz {
    _id: string;
    title: string;
    description: string;
    questions: { questionText: string; options: { text: string; isCorrect: boolean }[]; points?: number; category?: string }[];
    totalPoints: number;
    timeLimit: number;
    isPublished: boolean;
    createdBy: { _id: string; name: string } | string;
    accessType?: "public" | "private" | "password" | "approval" | "registration";
    registrationFields?: string[];
}

export default function QuizDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status: authStatus } = useSession();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAccessDenied, setIsAccessDenied] = useState(false);
  const [debugAccessType, setDebugAccessType] = useState<string | null>(null);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [requestStatus, setRequestStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    async function fetchQuiz() {
      try {
        // Wait until auth state is resolved; avoids a one-time 401 rendering "not found"
        if (authStatus === "loading") return;
        if (authStatus === "unauthenticated") {
          signIn(undefined, { callbackUrl: `/quizzes/${params.id}` });
          return;
        }

        const res = await fetch(`/api/quizzes/${params.id}`);
        if (!res.ok) {
           if (res.status === 403) {
             const errorData = await res.json();
             if (errorData.accessType === 'password') {
                setPasswordRequired(true);
             } else {
                setIsAccessDenied(true);
                setDebugAccessType(errorData.accessType || "unknown");
             }
             throw new Error("Access Denied");
           }
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Error: ${res.status}`);
        }
        const data = await res.json();
        setQuiz(data as Quiz);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Failed to fetch quiz:", message);
        if (message !== "Access Denied") {
            setError(message);
        }
        if (message.includes("404")) {
           router.push("/quizzes");
        }
      } finally {
        // If auth is still loading, don't finalize loading state yet
        if (authStatus !== "loading") setLoading(false);
      }
    }
    fetchQuiz();
  }, [params.id, router, authStatus]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      const res = await fetch(`/api/quizzes/${params.id}`, { method: "DELETE" });
      if (res.ok) router.push("/dashboard");
    } catch {
      alert("Failed to delete quiz");
    }
  };

  const handleRequestAccess = async () => {
    setRequestStatus("loading");
    try {
        const res = await fetch(`/api/quizzes/${params.id}/access-requests`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}) 
        });

        if (res.ok) {
            setRequestStatus("sent");
        } else {
            const data = await res.json();
            alert(data.message || "Failed to send request");
            setRequestStatus("error");
        }
    } catch (error) {
        console.error("Request access failed", error);
        setRequestStatus("error");
    }
  };

  const handleStartAttempt = () => {
    if (quiz?.accessType === 'registration' && quiz.registrationFields && quiz.registrationFields.length > 0) {
        setShowRegistration(true);
    } else {
        router.push(`/quizzes/${params.id}/attempt`);
    }
  };

  const submitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem(`reg_${params.id}`, JSON.stringify(registrationData));
    router.push(`/quizzes/${params.id}/attempt`);
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    // Try to fetch quiz again with password header
    try {
        const res = await fetch(`/api/quizzes/${params.id}`, {
            headers: { 'x-quiz-passcode': password }
        });
        if (res.ok) {
            // Password correct - store it for the attempt
            sessionStorage.setItem(`pass_${params.id}`, password);
            router.push(`/quizzes/${params.id}/attempt`);
        } else {
            alert("Incorrect password");
        }
    } catch {
        alert("Verification failed");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground">Loading quiz details...</p>
      </div>
    );
  }



  if (passwordRequired) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-6 max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2">
                <Shield className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Password Required</h2>
            <p className="text-muted-foreground text-lg">
                This quiz is protected. Please enter the passcode to continue.
            </p>
            
            <form onSubmit={submitPassword} className="w-full max-w-sm flex flex-col gap-4">
                <input 
                    type="password" 
                    required
                    placeholder="Enter passcode"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-lg focus:border-indigo-500 focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                    type="submit"
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/20"
                >
                    Unlock Quiz
                </button>
            </form>

            <Link href="/quizzes" className="text-muted-foreground hover:text-foreground font-bold mt-4">
                Return to Explorer
            </Link>
        </div>
      );
  }

  if (isAccessDenied) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-6 max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-500 mb-2">
                <HelpCircle className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Approval Required</h2>
            <p className="text-muted-foreground text-lg">
                This quiz is private and requires approval from the creator to participate.
                {debugAccessType && <span className="block text-xs mt-2 opacity-50 font-mono">Debug: Type detected as &quot;{debugAccessType}&quot;</span>}
            </p>
            
            {requestStatus === "sent" ? (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-6 py-4 rounded-2xl font-bold flex items-center gap-3">
                    <Trophy className="w-5 h-5" />
                    Request Sent! Waiting for approval.
                </div>
            ) : (
                <button 
                    onClick={handleRequestAccess}
                    disabled={requestStatus === "loading"}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 flex items-center gap-2"
                >
                    {requestStatus === "loading" ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending Request...
                        </>
                    ) : (
                        "Request Access"
                    )}
                </button>
            )}

            <Link href="/quizzes" className="text-muted-foreground hover:text-foreground font-bold mt-4">
                Return to Explorer
            </Link>
        </div>
      );
  }

  if (showRegistration && quiz) {
      return (
        <div className="max-w-md mx-auto py-10">
            <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Edit className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black">Registration Required</h2>
                    <p className="text-muted-foreground">Please fill in your details to start the quiz.</p>
                </div>

                <form onSubmit={submitRegistration} className="space-y-4">
                    {quiz.registrationFields?.map((field) => (
                        <div key={field} className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                {field}
                            </label>
                            <input 
                                required
                                type={field === 'email' ? 'email' : 'text'}
                                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder={`Enter your ${field}`}
                                value={registrationData[field] || ''}
                                onChange={(e) => setRegistrationData({...registrationData, [field]: e.target.value})}
                            />
                        </div>
                    ))}
                    <div className="pt-4 flex gap-3">
                         <button 
                            type="button"
                            onClick={() => setShowRegistration(false)}
                            className="flex-1 py-3 rounded-xl font-bold text-muted-foreground hover:bg-secondary transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all"
                        >
                            Start Quiz
                        </button>
                    </div>
                </form>
            </div>
        </div>
      );
  }

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">{error || "Quiz not found or inaccessible."}</p>
        <Link href="/quizzes" className="text-primary font-bold hover:underline">Return to Explorer</Link>
      </div>
    );
  }

  const isCreator = session && (session.user as { id: string }).id === (typeof quiz?.createdBy === 'object' ? quiz.createdBy._id : quiz?.createdBy);

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/quizzes" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-bold mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Explorer
      </Link>

      <div className="bg-card rounded-[3rem] shadow-xl shadow-indigo-100/50 dark:shadow-none border border-border overflow-hidden">
        <div className="bg-foreground p-12 text-background relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10">
                <div className="flex flex-wrap gap-3 mb-6">
                    <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                        Assessment
                    </span>
                    {!quiz?.isPublished && (
                         <span className="bg-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                            Draft
                        </span>
                    )}
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4">{quiz?.title}</h1>
                <p className="opacity-70 text-lg max-w-2xl leading-relaxed">{quiz?.description}</p>
            </div>
        </div>

        <div className="p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <HelpCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Questions</p>
                        <p className="text-xl font-black text-foreground">{quiz?.questions?.length || 0}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Points</p>
                        <p className="text-xl font-black text-foreground">{quiz?.totalPoints || 0}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Time Limit</p>
                        <p className="text-xl font-black text-foreground">{quiz?.timeLimit > 0 ? `${quiz.timeLimit} mins` : "No limit"}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                {isCreator ? (
                    <button 
                        disabled
                        className="flex-grow md:flex-none flex items-center justify-center gap-2 bg-muted text-muted-foreground px-10 py-5 rounded-2xl font-bold text-lg cursor-not-allowed opacity-50"
                        title="You cannot attempt your own quiz"
                    >
                        <Play className="w-6 h-6 fill-current" />
                        Start Attempt (Creator)
                    </button>
                ) : (
                    <button 
                        onClick={handleStartAttempt}
                        className="flex-grow md:flex-none flex items-center justify-center gap-2 bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl shadow-indigo-100 dark:shadow-none hover:-translate-y-1"
                    >
                        <Play className="w-6 h-6 fill-current" />
                        Start Attempt
                    </button>
                )}
                
                {isCreator && (
                    <>
                        <Link 
                            href={`/quizzes/${params.id}/reports`}
                            className="flex items-center justify-center gap-2 bg-indigo-500/10 text-indigo-600 px-8 py-5 rounded-2xl font-bold hover:bg-indigo-500/20 transition-all border border-indigo-100"
                        >
                            <TrendingUp className="w-5 h-5" />
                            View Reports
                        </Link>
                        <Link 
                            href={`/quizzes/${params.id}/edit`}
                            className="flex items-center justify-center gap-2 bg-secondary text-foreground px-8 py-5 rounded-2xl font-bold hover:bg-secondary/80 transition-all"
                        >
                            <Edit className="w-5 h-5" />
                            Edit Quiz
                        </Link>
                        <button 
                            onClick={handleDelete}
                            className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 px-6 py-5 rounded-2xl font-bold hover:bg-red-500/20 transition-all"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>
        </div>
      </div>

    </div>
  );
}
