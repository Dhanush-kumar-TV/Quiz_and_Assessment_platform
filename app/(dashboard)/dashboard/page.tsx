"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DashboardStats from "@/components/DashboardStats";
import RecentActivity from "@/components/RecentActivity";
import Link from "next/link";
import { PlusCircle, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [quizzesRes, attemptsRes] = await Promise.all([
          fetch(`/api/quizzes?userId=${(session?.user as any).id}`),
          fetch(`/api/attempts`),
        ]);

        const quizzes = await quizzesRes.json();
        const attempts = await attemptsRes.json();

        const createdQuizzes = quizzes.filter((q: any) => q.createdBy === (session?.user as any).id);
        const collaborations = quizzes.filter((q: any) => q.createdBy !== (session?.user as any).id);

        const totalAttempts = attempts.length;
        const averageScore = attempts.length 
          ? (attempts.reduce((acc: number, a: any) => acc + a.percentage, 0) / attempts.length).toFixed(1)
          : 0;

        setStats({
          created: createdQuizzes.length,
          collaborations: collaborations.length,
          attempts: totalAttempts,
          avgScore: averageScore,
          recentQuizzes: createdQuizzes.slice(0, 5),
          recentCollaborations: collaborations.slice(0, 5),
          recentAttempts: attempts.slice(0, 5),
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pt-10 px-2">
      <header>
        <h1 className="text-3xl font-extrabold text-foreground">Welcome, {session?.user?.name || "User"}</h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your activity</p>
      </header>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentActivity 
          title="Your Creations" 
          items={stats.recentQuizzes} 
          type="quiz" 
        />
        <RecentActivity 
          title="Collaborations" 
          items={stats.recentCollaborations} 
          type="quiz" 
        />
        <RecentActivity 
          title="Recent Attempts" 
          items={stats.recentAttempts} 
          type="attempt" 
        />
      </div>
    </div>
  );
}
