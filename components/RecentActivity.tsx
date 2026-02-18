import Link from "next/link";
import { ChevronRight, Calendar, Brain, CheckCircle } from "lucide-react";

export type ActivityItem = {
  _id: string;
  title?: string;
  createdAt?: string;
  percentage?: number;
  quizId?: { title: string };
};

export default function RecentActivity({ title, items, type }: { title: string, items: ActivityItem[], type: 'quiz' | 'attempt' }) {
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
              className="p-6 hover:bg-secondary/50 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type === 'quiz' ? 'bg-primary/5 text-primary' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {type === 'quiz' ? <Brain className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {type === 'quiz' ? item.title : item.quizId?.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
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
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
