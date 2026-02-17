"use client";

import { useEffect, useState } from "react";
import QuizList from "@/components/quiz/QuizList";
import { Search, Loader2 } from "lucide-react";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        // Explicitly request only published quizzes for public viewing
        const res = await fetch("/api/quizzes?publicOnly=true");
        const data = await res.json();
        setQuizzes(data);
      } catch (err) {
        console.error("Failed to fetch quizzes", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter((q: any) => 
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pt-10 px-2 text-foreground">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground">Explore Quizzes</h1>
          <p className="text-muted-foreground font-medium">Test your knowledge with community-created content</p>
        </div>
        <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
            <input 
                type="text" 
                placeholder="Search by title or topic..."
                className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl shadow-sm focus:shadow-lg focus:shadow-primary/10 focus:border-primary/50 outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground">Finding quizzes for you...</p>
        </div>
      ) : (
        <QuizList quizzes={filteredQuizzes} />
      )}
    </div>
  );
}
