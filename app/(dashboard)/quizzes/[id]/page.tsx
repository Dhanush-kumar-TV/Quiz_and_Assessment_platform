"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Clock, HelpCircle, Trophy, Play, Edit, Trash2, Loader2, ArrowLeft, TrendingUp } from "lucide-react";
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
}

export default function QuizDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status: authStatus } = useSession();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Error: ${res.status}`);
        }
        const data = await res.json();
        setQuiz(data as Quiz);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Failed to fetch quiz:", message);
        setError(message);
        if (message.includes("404") || message.includes("403")) {
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground">Loading quiz details...</p>
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
                    <Link 
                        href={`/quizzes/${params.id}/attempt`}
                        className="flex-grow md:flex-none flex items-center justify-center gap-2 bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl shadow-indigo-100 dark:shadow-none hover:-translate-y-1"
                    >
                        <Play className="w-6 h-6 fill-current" />
                        Start Attempt
                    </Link>
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
