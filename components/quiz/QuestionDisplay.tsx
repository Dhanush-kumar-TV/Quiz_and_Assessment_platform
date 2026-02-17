"use client";

import { CheckCircle2, Circle, Image as ImageIcon } from "lucide-react";

export default function QuestionDisplay({ 
  question, 
  currentIndex, 
  totalQuestions, 
  selectedOption, 
  onSelect,
  questionTimeLeft = null
}: { 
  question: any, 
  currentIndex: number, 
  totalQuestions: number,
  selectedOption: number | null,
  onSelect: (index: number) => void,
  questionTimeLeft?: number | null
}) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card rounded-[2.5rem] border border-border p-10 md:p-16 shadow-2xl shadow-slate-100/50 dark:shadow-none animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex items-center justify-between mb-8">
            <span className="text-xs font-black text-primary uppercase tracking-[0.2em] block">
            Question {currentIndex + 1} of {totalQuestions}
            </span>
            <div className="flex items-center gap-4">
                {question.required && (
                    <span className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">
                        Required
                    </span>
                )}
                {questionTimeLeft !== null && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-xs border transition-colors ${
                        questionTimeLeft < 10 ? "bg-red-50 border-red-200 text-red-600 animate-pulse" : "bg-primary/5 border-primary/10 text-primary"
                    }`}>
                        <span className="material-icons text-xs">schedule</span>
                        {Math.floor(questionTimeLeft / 60)}:{(questionTimeLeft % 60).toString().padStart(2, "0")}
                    </div>
                )}
                <div className="px-3 py-1 bg-secondary/50 rounded-full text-[10px] font-black uppercase tracking-widest border border-border/50 text-muted-foreground">
                    {question.points} Points
                </div>
            </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-foreground mb-12 leading-tight">
          {question.questionText}
        </h2>

        <div className={`grid gap-4 ${question.type === 'picture-choice' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {question.options.map((option: any, index: number) => {
            const isSelected = selectedOption === index;
            const isPictureChoice = question.type === 'picture-choice';

            return (
              <button
                key={index}
                onClick={() => onSelect(index)}
                className={`group flex flex-col items-center gap-4 transition-all duration-300 text-center relative ${
                  isPictureChoice 
                  ? "p-4 rounded-[2rem] border-2" 
                  : "flex-row text-left p-6 rounded-3xl border-2"
                } ${
                  isSelected
                    ? "bg-primary border-primary shadow-xl shadow-primary/20 scale-[1.02] z-10"
                    : "bg-background border-border hover:border-primary/50 hover:bg-secondary/20"
                }`}
              >
                {/* Image for Picture Choice */}
                {isPictureChoice && (
                  <div className="w-full aspect-square rounded-2xl overflow-hidden border border-border/50 bg-secondary/30 relative">
                     {option.image ? (
                        <img src={option.image} alt={option.text} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20">
                            <ImageIcon className="w-12 h-12" />
                        </div>
                     )}
                     {isSelected && (
                        <div className="absolute top-2 right-2 w-8 h-8 bg-background rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                             <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                     )}
                  </div>
                )}

                {!isPictureChoice && (
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm transition-all ${
                    isSelected 
                        ? "bg-background text-primary" 
                        : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}>
                    {String.fromCharCode(65 + index)}
                    </div>
                )}

                <span className={`text-lg font-bold transition-colors ${isSelected ? "text-primary-foreground" : "text-foreground"}`}>
                  {option.text}
                </span>

                {!isPictureChoice && isSelected && (
                  <div className="ml-auto w-6 h-6 bg-background rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-muted-foreground text-sm font-medium italic">
        Click on an option to select it
      </p>
    </div>
  );
}
