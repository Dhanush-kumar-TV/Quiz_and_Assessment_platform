import Link from "next/link";
import { Brain, ArrowRight, Layout, Target, HelpCircle, User, ChevronRight } from "lucide-react";

export default function QuizCard({ quiz }: { quiz: any }) {
  return (
    <div className="bg-card rounded-[2rem] p-6 border border-border shadow-sm hover:shadow-xl hover:shadow-slate-100/50 dark:hover:shadow-none transition-all group relative">
      <div className="flex items-center justify-between mb-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Brain className="w-8 h-8 text-primary" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-black text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-1">{quiz.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2">{quiz.description}</p>
        
        <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-secondary/80 dark:bg-secondary px-3 py-1.5 rounded-full">
                <Layout className="w-3.5 h-3.5" />
                {quiz.questions.length} Questions
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-secondary/80 dark:bg-secondary px-3 py-1.5 rounded-full">
                <Target className="w-3.5 h-3.5" />
                {quiz.totalPoints} Points
            </div>
        </div>

        <Link 
            href={`/quizzes/${quiz._id}`}
            className="w-full py-3 px-6 bg-card border border-border text-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm"
        >
            View Details
            <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
