"use client";

import { useSession } from "next-auth/react";
import QuizForm from "@/components/forms/QuizForm";
import { useRouter } from "next/navigation";

export default function CreateQuizPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p className="text-center py-10">Loading...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-6">
      {/* Header Section */}
      <header className="mb-10 space-y-6">
        <div 
          className="flex items-center gap-2 text-primary font-semibold mb-2 cursor-pointer hover:opacity-80 transition-opacity w-fit" 
          onClick={() => router.push("/dashboard")}
        >
          <span className="material-icons text-sm">arrow_back</span>
          <span className="text-sm uppercase tracking-wider">Back to Dashboard</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Create New Quiz</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Set up your assessment details and add your questions below.</p>
      </header>

      <QuizForm />

      {/* Background Decoration */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-primary/5 blur-[160px] rounded-full -translate-x-1/4 translate-y-1/4"></div>
    </main>
  );
}
