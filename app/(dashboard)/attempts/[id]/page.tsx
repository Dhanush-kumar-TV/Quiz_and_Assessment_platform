"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ScoreDisplay from "@/components/attempt/ScoreDisplay";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AttemptDetailPage({ params }: { params: { id: string } }) {
  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchAttempt() {
      try {
        const res = await fetch(`/api/attempts/${params.id}`);
        if (!res.ok) throw new Error("Attempt not found");
        const data = await res.json();
        setAttempt(data);
      } catch (err) {
        console.error(err);
        router.push("/attempts");
      } finally {
        setLoading(false);
      }
    }
    fetchAttempt();
  }, [params.id, router]);

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-slate-400">Loading attempt details...</p>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/attempts" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to History
      </Link>

      <ScoreDisplay 
        result={attempt} 
        quiz={attempt.quizId} 
        rawAnswers={attempt.answers} 
      />
    </div>
  );
}
