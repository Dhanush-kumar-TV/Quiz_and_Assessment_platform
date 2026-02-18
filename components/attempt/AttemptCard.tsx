import Link from "next/link";
import { History, Calendar, Target, Clock, ChevronRight } from "lucide-react";

interface Attempt {
  _id: string;
  quizId?: { title?: string };
  percentage: number;
  timeTaken: number;
  completedAt: string;
}

export default function AttemptCard({ attempt }: { attempt: Attempt }) {
  const isPassed = attempt.percentage >= 50;

  return (
    <div className="bg-card rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl dark:shadow-none hover:shadow-slate-100/50 transition-all p-8 flex flex-col group">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isPassed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-secondary text-muted-foreground'}`}>
            <History className="w-6 h-6" />
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isPassed ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-secondary text-muted-foreground'}`}>
            {isPassed ? 'Passed' : 'Completed'}
        </div>
      </div>

      <h3 className="text-xl font-black text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
        {attempt.quizId?.title || "Deleted Quiz"}
      </h3>
      
      <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold mb-8">
        <Calendar className="w-3.5 h-3.5" />
        {new Date(attempt.completedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-secondary/50 p-4 rounded-2xl border border-border">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mb-1">
                <Target className="w-3 h-3" />
                Score
            </div>
            <p className="text-lg font-black text-foreground">{attempt.percentage.toFixed(0)}%</p>
        </div>
        <div className="bg-secondary/50 p-4 rounded-2xl border border-border">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mb-1">
                <Clock className="w-3 h-3" />
                Time
            </div>
            <p className="text-lg font-black text-foreground">{Math.floor(attempt.timeTaken / 60)}m</p>
        </div>
      </div>

      <Link 
        href={`/attempts/${attempt._id}`}
        className="mt-auto w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all"
      >
        Review Attempt
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
