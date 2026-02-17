"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import QuizForm from "@/components/forms/QuizForm";
import { Edit3, Loader2 } from "lucide-react";

export default function EditQuizPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`/api/quizzes/${params.id}`);
        const data = await res.json();
        
        // Security check handled on server, but double check here
        if (session && data.createdBy !== (session.user as any).id && data.createdBy?._id !== (session.user as any).id) {
           // router.push("/dashboard");
        }
        setQuiz(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchQuiz();
  }, [params.id, session, router]);

  if (status === "loading" || loading) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-slate-400">Loading editor...</p>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100 dark:shadow-none">
          <Edit3 className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">Edit Quiz</h1>
          <p className="text-slate-500 font-medium">Update your questions and settings</p>
        </div>
      </div>

      <QuizForm initialData={quiz} />
    </div>
  );
}
