"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative w-full py-24 overflow-hidden bg-[#0A0A23] text-white">
      {/* Background Decorations */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        
        {/* Right Side Shapes */}
        <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/4">
          <div className="w-64 h-64 bg-[#2BCBBA] rounded-[3rem] transform rotate-12 opacity-90 shadow-2xl"></div>
        </div>
        <div className="absolute top-1/2 right-0 translate-x-1/2 translate-y-1/4">
           <div className="w-40 h-40 bg-[#FFD700] rounded-full opacity-90 shadow-lg"></div>
        </div>

        {/* Left Side Shapes */}
        <div className="absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/3">
           <div className="w-80 h-40 bg-[#7B61FF] rounded-full transform -rotate-12 opacity-90 shadow-2xl"></div>
        </div>
        <div className="absolute bottom-10 left-10">
           <div className="w-16 h-16 bg-[#2BCBBA] rounded-full opacity-90 shadow-md"></div>
        </div>
        
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
          QuizMaster is a powerful online test generator
        </h2>
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Build your own online tests and assessments with QuizMaster for free
        </p>
        
        <Link 
          href="/quizzes/create"
          className="inline-flex items-center gap-2 border border-white/30 text-white bg-white/5 hover:bg-white/10 px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 backdrop-blur-sm"
        >
          Get started for free
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
