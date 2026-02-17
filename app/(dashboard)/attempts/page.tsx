"use client";

import { useEffect, useState } from "react";
import AttemptList from "@/components/attempt/AttemptList";
import { History, Loader2, Calendar } from "lucide-react";

export default function AttemptsHistoryPage() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttempts() {
      try {
        const res = await fetch("/api/attempts");
        const data = await res.json();
        setAttempts(data);
      } catch (err) {
        console.error("Failed to fetch attempts", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAttempts();
  }, []);

  return (
    <div className="space-y-10 pt-10 px-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground">Attempt History</h1>
          <p className="text-muted-foreground font-medium">Review your performance across all sessions</p>
        </div>
        <div className="bg-card p-4 rounded-2xl shadow-sm border border-border flex items-center gap-3 self-start">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <History className="w-5 h-5" />
            </div>
            <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Attempts</p>
                <p className="text-lg font-black text-foreground">{attempts.length}</p>
            </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading your history...</p>
        </div>
      ) : (
        <AttemptList attempts={attempts} />
      )}
    </div>
  );
}
