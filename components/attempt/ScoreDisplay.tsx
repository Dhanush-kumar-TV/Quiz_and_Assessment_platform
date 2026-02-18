"use client";

import Link from "next/link";
import { Trophy, Target, Clock, Home, ArrowRight, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

interface QuizOption {
    text: string;
    isCorrect: boolean;
    image?: string;
}

interface QuizQuestion {
    questionText: string;
    options: QuizOption[];
    category?: string;
    points?: number;
}

interface Quiz {
    showScore?: boolean;
    questions: QuizQuestion[];
    title: string;
}

interface AnswerRecord {
    questionIndex: number;
    selectedOptionIndex: number;
}

interface AttemptResult {
    percentage: number;
    score: number;
    totalPoints: number;
    timeTaken: number;
    categoryScores?: Record<string, number>;
    answers: AnswerRecord[];
}

export default function ScoreDisplay({ result, quiz }: { result: AttemptResult, quiz: Quiz }) {

  if (quiz.showScore === false) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-black text-foreground">Quiz Submitted!</h1>
        <p className="text-xl text-muted-foreground">
          Thank you for completing the quiz. Your responses have been recorded.
        </p>
        <div className="pt-8">
            <Link 
                href="/dashboard"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all inline-flex items-center gap-2 shadow-lg hover:-translate-y-1"
            >
                <Home className="w-5 h-5" />
                Return to Dashboard
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-card rounded-[3rem] border border-border p-10 md:p-16 text-center shadow-2xl shadow-slate-100/50 dark:shadow-none relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-bounce">
                <Trophy className="w-12 h-12 text-primary" />
            </div>

            <h1 className="text-5xl font-black text-foreground mb-2">
                {result.percentage >= 60 ? "Great Job!" : "Keep Practicing!"}
            </h1>
            <p className="text-muted-foreground text-lg font-medium mb-12">
                You scored <span className="text-foreground font-black">{result.score}</span> out of <span className="text-foreground font-black">{result.totalPoints}</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-secondary/50 p-8 rounded-[2.5rem] border border-border">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <Target className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground tracking-wider uppercase mb-1">Percentage</span>
                    <span className="text-3xl font-black text-foreground">{result.percentage.toFixed(1)}%</span>
                </div>
                <div className="bg-secondary/50 p-8 rounded-[2.5rem] border border-border">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <Clock className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground tracking-wider uppercase mb-1">Time Taken</span>
                    <span className="text-3xl font-black text-foreground">{Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s</span>
                </div>
            </div>

            {/* Category Breakdown */}
            {result.categoryScores && Object.keys(result.categoryScores).length > 0 && (
                <div className="mt-12 max-w-2xl mx-auto space-y-4">
                    <h3 className="text-lg font-black uppercase tracking-widest text-muted-foreground text-left pl-4">Category Analysis</h3>
                    <div className="grid gap-4">
                        {Object.entries(result.categoryScores).map(([category, score]) => {
                            // Calculate total points for this category from quiz
                            const catTotal = quiz.questions
                                .filter((q) => (q.category || "General") === category)
                                .reduce((acc: number, q) => acc + (q.points || 1), 0);
                            const catPercentage = (score / catTotal) * 100;

                            return (
                                <div key={category} className="bg-secondary/30 p-5 rounded-2xl border border-border/50">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-bold text-foreground capitalize">{category}</span>
                                        <span className="text-sm font-black text-primary">{score} / {catTotal}</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary transition-all duration-1000" 
                                            style={{ width: `${catPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">
                <Link 
                    href="/dashboard"
                    className="bg-primary text-primary-foreground px-10 py-5 rounded-3xl font-black text-lg hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-100/50 dark:shadow-none"
                >
                    <ArrowLeft className="w-6 h-6" />
                    Back to Dashboard
                </Link>
                <Link 
                    href="/quizzes"
                    className="bg-secondary text-foreground px-10 py-5 rounded-3xl font-bold text-lg hover:bg-secondary/80 transition-all flex items-center justify-center gap-3"
                >
                    Try Other Quizzes
                    <ArrowRight className="w-6 h-6" />
                </Link>
            </div>
        </div>

        <div className="space-y-8">
            <h2 className="text-3xl font-black text-foreground pl-4">Answer Review</h2>
            <div className="grid grid-cols-1 gap-6">
                {quiz.questions.map((q, i) => {
                    const userAnswer = result.answers.find((a) => a.questionIndex === i);
                    const selected = userAnswer?.selectedOptionIndex ?? null;
                    const correctOptionIndex = q.options.findIndex((opt) => opt.isCorrect);
                    const isCorrect = selected === correctOptionIndex;
                    
                    return (
                        <div key={i} className={`bg-card rounded-[2.5rem] border-2 p-8 transition-all ${isCorrect ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="space-y-4 flex-grow">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                            {i + 1}
                                        </div>
                                        <h4 className="text-xl font-bold text-foreground leading-tight">{q.questionText}</h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className={`p-5 rounded-2xl border ${isCorrect ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10' : 'bg-red-50 border-red-100 dark:bg-red-500/10'}`}>
                                            <span className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Your Answer</span>
                                            <p className={`font-bold ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                                                {selected !== null && selected !== undefined && q.options[selected] ? q.options[selected].text : "No answer"}
                                            </p>
                                        </div>
                                        {!isCorrect && (
                                            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20">
                                                <span className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Correct Answer</span>
                                                <p className="font-bold text-emerald-700 dark:text-emerald-400">
                                                    {q.options[correctOptionIndex]?.text || "Unknown"}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest ${isCorrect ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                                    {isCorrect ? (
                                        <><CheckCircle2 className="w-4 h-4" /> Correct</>
                                    ) : (
                                        <><XCircle className="w-4 h-4" /> Incorrect</>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
}
