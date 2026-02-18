import Link from "next/link";
import { ChevronRight, Calendar, Brain, CheckCircle } from "lucide-react";

export type DashboardActivityItem = {
  _id: string;
  title?: string;
  createdAt?: string;
  percentage?: number;
  quizId?: { title: string };
};

export default function RecentActivity({ title, items, type }: { title: string, items: DashboardActivityItem[], type: 'quiz' | 'attempt' }) {
  return (
    <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h3 className="font-bold text-lg text-foreground">{title}</h3>
        <Link 
          href={type === 'quiz' ? "/quizzes" : "/attempts"} 
          className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
        >
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {items.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-muted-foreground italic">No recent activity to show</p>
          </div>
        ) : (
          items.map((item, i) => (
            <Link 
              key={i} 
              href={type === 'quiz' ? `/quizzes/${item._id}` : `/attempts/${item._id}`}
              className="p-4 md:p-6 hover:bg-secondary/50 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 ${type === 'quiz' ? 'bg-primary/5 text-primary' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {type === 'quiz' ? <Brain className="w-4 h-4 md:w-5 md:h-5" /> : <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm md:text-base text-foreground group-hover:text-primary transition-colors truncate">
                    {type === 'quiz' ? item.title : item.quizId?.title}
                  </h4>
                  <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                    {type === 'attempt' && (
                        <span className="font-bold text-emerald-600 dark:text-[hsl(var(--mint))]">Score: {item.percentage}%</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all shrink-0 ml-2">
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
