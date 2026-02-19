"use client";

import { CheckCircle2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

type QuestionOption = {
  text: string;
  isCorrect: boolean;
  image?: string;
};

type Question = {
  type?: string;
  questionText: string;
  options: QuestionOption[];
  points?: number;
  required?: boolean;
  timeLimit?: number;
  category?: string;
  image?: string;
};

export default function QuestionDisplay({ 
  question, 
  selectedOption, 
  onSelect,
}: { 
  question: Question, 
  selectedOption: number | null,
  onSelect: (index: number) => void,
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="w-full text-center space-y-6 md:space-y-10 mb-8 md:mb-12">
          {question.image && (
             <div className="relative w-full max-w-lg mx-auto aspect-video rounded-2xl overflow-hidden shadow-lg mb-6">
                <Image src={question.image} alt={question.questionText} fill className="object-cover" />
             </div>
          )}

        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight tracking-tight">
          {question.questionText}
        </h2>
        
        {question.required && (
            <span className="inline-block px-3 py-1 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-widest">
                Required
            </span>
        )}
      </div>

      <div className={`w-full grid gap-3 md:gap-4 ${question.type === 'picture-choice' ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {question.options.map((option: QuestionOption, index: number) => {
          const isSelected = selectedOption === index;
          const isPictureChoice = question.type === 'picture-choice';

          return (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={`group relative w-full transition-all duration-200 ${
                isPictureChoice 
                ? "aspect-square rounded-3xl p-4 border-4" 
                : "min-h-[4rem] px-6 py-4 rounded-xl md:rounded-2xl flex items-center text-left border-2"
              } ${
                isSelected
                  ? "bg-primary border-primary text-white shadow-lg scale-[1.02]"
                  : "bg-card border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              {/* Image for Picture Choice */}
              {isPictureChoice && (
                <div className="absolute inset-0 z-0 opacity-100">
                   {option.image ? (
                      <Image src={option.image} alt={option.text} fill className="object-cover rounded-[1.2rem]" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary">
                          <ImageIcon className="w-8 h-8 opacity-20" />
                      </div>
                   )}
                   {isSelected && <div className="absolute inset-0 bg-primary/20 z-10 rounded-[1.2rem]" />}
                </div>
              )}

              <div className={`relative z-20 flex w-full items-center ${isPictureChoice ? "justify-center h-full" : "justify-between gap-4"}`}>
                  <div className="flex items-center gap-4 min-w-0">
                      {!isPictureChoice && (
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 transition-colors ${
                            isSelected ? "bg-white text-primary" : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        }`}>
                            {String.fromCharCode(65 + index)}
                        </div>
                      )}
                      
                      <span className={`text-base md:text-xl font-bold truncate ${
                          isSelected ? "text-white" : "text-foreground"
                      } ${isPictureChoice ? "bg-black/50 text-white px-2 py-1 rounded backdrop-blur-sm self-end mb-2" : ""}`}>
                        {option.text}
                      </span>
                  </div>

                  {!isPictureChoice && isSelected && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0 animate-in zoom-in spin-in-90 duration-300">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                  )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
