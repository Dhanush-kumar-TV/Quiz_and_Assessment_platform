"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Brain, Lock, UserPlus, Play, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicQuizLanding() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Input states
  const [password, setPassword] = useState("");
  const [regData, setRegData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "verifying" | "authorized">("idle");
  const [requestStatus, setRequestStatus] = useState<"none" | "pending" | "approved" | "denied">("none");
  const [checkingRequest, setCheckingRequest] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [params.id]);

  useEffect(() => {
    // Prefill name for registration/approval forms
    if (session?.user && !regData.name) {
      const name = (session.user as any)?.name || (session.user as any)?.email || "";
      if (name) {
        setRegData((prev) => ({ ...prev, name }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (quiz?._id && session?.user && quiz.accessType === "approval") {
      fetchMyRequestStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz?._id, session, quiz?.accessType]);

  async function fetchQuiz() {
    try {
      const res = await fetch(`/api/quizzes/public/${params.id}`);
      if (!res.ok) throw new Error("Quiz not found or inaccessible");
      const data = await res.json();
      setQuiz(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMyRequestStatus() {
    if (!quiz?._id) return;
    if (!session?.user) return;
    try {
      setCheckingRequest(true);
      const res = await fetch(`/api/quizzes/${quiz._id}/access-requests/me`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setRequestStatus(data.requestStatus || "none");
    } finally {
      setCheckingRequest(false);
    }
  }

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("verifying");
    setError("");

    try {
      if (!session?.user) {
        setStatus("idle");
        signIn();
        return;
      }

      // Approval flow: user requests access, creator approves/denies
      if (quiz.accessType === "approval") {
        if (requestStatus !== "approved") {
          const name =
            regData.name ||
            (session.user as any)?.name ||
            (session.user as any)?.email ||
            "Participant";

          const res = await fetch(`/api/quizzes/${quiz._id}/access-requests`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
          });

          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.message || "Failed to submit access request");
          }

          setRequestStatus("pending");
          setStatus("idle");
          return;
        }
      }

      if (quiz.accessType === "password") {
        // Store passcode for subsequent authorized fetches/attempts
        sessionStorage.setItem(`pass_${quiz._id}`, password);
      }

      if (quiz.accessType === "registration") {
        sessionStorage.setItem(`reg_${quiz._id}`, JSON.stringify(regData));
      }

      setStatus("authorized");
      setTimeout(() => {
        router.push(`/quizzes/${quiz._id}`); // Redirect to actual quiz page
      }, 800);
    } catch (err: any) {
      setError(err.message);
      setStatus("idle");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="p-4 bg-red-100 text-red-600 rounded-full w-fit mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black">Hold on...</h1>
          <p className="text-muted-foreground font-medium">{error || "This quiz is no longer available."}</p>
          <button onClick={() => router.push("/")} className="text-primary font-bold hover:underline">Return to Home</button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

      <AnimatePresence mode="wait">
        {status === "authorized" ? (
          <motion.div 
            key="authorized"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
             <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <Play className="w-10 h-10 text-white fill-white" />
             </div>
             <h1 className="text-3xl font-black">Access Granted!</h1>
             <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">Redirecting to assessment...</p>
          </motion.div>
        ) : (
          <motion.div 
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-xl w-full"
          >
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 md:p-12">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
                  <Brain className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl font-black mb-3">{quiz.title}</h1>
                <p className="text-muted-foreground font-medium line-clamp-3">{quiz.description}</p>
                
                <div className="flex items-center gap-6 mt-6">
                   <div className="text-center">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Questions</p>
                      <p className="font-black text-lg">{quiz.questionsCount || 0}</p>
                   </div>
                   <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-700"></div>
                   <div className="text-center">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Time Limit</p>
                      <p className="font-black text-lg">{quiz.timeLimit ? `${quiz.timeLimit}m` : "No limit"}</p>
                   </div>
                </div>
              </div>

              <form onSubmit={handleAccess} className="space-y-6">
                {!session?.user && (
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center space-y-3">
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">Login required</p>
                    <p className="text-xs font-bold text-muted-foreground">
                      Please sign in to request access or start this assessment.
                    </p>
                    <button
                      type="button"
                      onClick={() => signIn()}
                      className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg"
                    >
                      Sign in to continue
                    </button>
                  </div>
                )}

                {session?.user && quiz.accessType === "approval" && (
                  <div className="space-y-4">
                    <div className="p-6 rounded-2xl bg-amber-50/60 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 text-center">
                      <p className="text-sm font-black text-amber-800 dark:text-amber-200">Approval required</p>
                      <p className="text-xs font-bold text-amber-800/70 dark:text-amber-200/70 mt-1">
                        Request access. The quiz creator will grant or deny.
                      </p>
                    </div>

                    {requestStatus === "approved" ? (
                      <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 text-center">
                        <p className="text-sm font-black text-emerald-700 dark:text-emerald-200">Approved</p>
                        <p className="text-xs font-bold text-emerald-700/80 dark:text-emerald-200/80 mt-1">
                          You can start the assessment now.
                        </p>
                      </div>
                    ) : requestStatus === "pending" ? (
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center space-y-3">
                        <p className="text-sm font-black text-slate-700 dark:text-slate-200">Pending approval</p>
                        <p className="text-xs font-bold text-muted-foreground">
                          Your request has been sent. Please wait for approval.
                        </p>
                        <button
                          type="button"
                          onClick={fetchMyRequestStatus}
                          disabled={checkingRequest}
                          className="w-full py-3 rounded-2xl bg-secondary font-black flex items-center justify-center gap-2"
                        >
                          <RefreshCw className={`w-4 h-4 ${checkingRequest ? "animate-spin" : ""}`} />
                          Check status
                        </button>
                      </div>
                    ) : requestStatus === "denied" ? (
                      <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-center space-y-3">
                        <p className="text-sm font-black text-red-700 dark:text-red-200">Denied</p>
                        <p className="text-xs font-bold text-red-700/80 dark:text-red-200/80">
                          Your request was denied. You may request again or contact the creator.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center justify-center gap-2">
                          <UserPlus className="w-3 h-3" /> Your Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter your name..."
                          className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:outline-none transition-all font-bold text-lg text-center"
                          value={regData.name || ""}
                          onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                )}

                {quiz.accessType === "password" && (
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <Lock className="w-3 h-3" /> Passcode Required
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Enter the access password..."
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:outline-none transition-all font-bold text-lg text-center"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                )}

                {quiz.accessType === "registration" && (
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <UserPlus className="w-3 h-3" /> Registration Required
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quiz.registrationFields?.map((field: string) => (
                        <div key={field} className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 capitalize px-2">{field}</label>
                          <input
                            type={field === 'email' ? 'email' : 'text'}
                            required
                            placeholder={`Your ${field}...`}
                            className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:outline-none font-bold text-sm"
                            value={regData[field] || ""}
                            onChange={(e) => setRegData({ ...regData, [field]: e.target.value })}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {quiz.accessType === "public" && (
                   <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 text-center">
                      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">This assessment is public. No registration is required to begin.</p>
                   </div>
                )}

                {error && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-3 border border-red-100 dark:border-red-900/30">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-xs font-bold">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    status === "verifying" ||
                    (!session?.user && authStatus !== "authenticated") ||
                    (session?.user && quiz.accessType === "approval" && requestStatus === "pending")
                  }
                  className="w-full py-5 bg-primary text-white rounded-[1.5rem] shadow-xl shadow-primary/30 hover:shadow-2xl hover:translate-y-[-2px] transition-all font-black text-xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {status === "verifying" ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      {quiz.accessType === "approval" && requestStatus !== "approved"
                        ? "Request Access"
                        : "Begin Assessment"}
                      <Play className="w-5 h-5 fill-white" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Powered by AntiGravity Assessment Platform
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
