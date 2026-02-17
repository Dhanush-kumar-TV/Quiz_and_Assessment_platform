"use client";

import { GraduationCap, Briefcase, Users } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <GraduationCap className="w-16 h-16 text-foreground" strokeWidth={1.5} />,
    title: "Teachers",
    description: [
      "Quickly create courses or online tests for your students. You can make your test public or just publish it for your class or school with our private test options.",
      "The premium account will allow you to upload media and have unlimited questions.",
      "The auto-grading function will save you time and allow you to concentrate on what's important."
    ]
  },
  {
    icon: <Briefcase className="w-16 h-16 text-foreground" strokeWidth={1.5} />,
    title: "Businesses",
    description: [
      "Create online training and assessments to ensure your staff are always up to date with the right skills.",
      "The powerful reporting allows you to track your staff participation and progress.",
      "QuizMaster implements SSL encryption and offers public and private options so you can be sure your assessments are always secure."
    ]
  },
  {
    icon: <Users className="w-16 h-16 text-foreground" strokeWidth={1.5} />,
    title: "Individuals",
    description: [
      "Create fun social quizzes that you can post on your website, blog or other social media site.",
      "If you prefer privacy the advanced email options allow you to quickly send private quizzes to your friends.",
      "The review feature allows your friends to review their answers after they have completed the quiz."
    ]
  }
];

export default function WhoUsesSection() {
  return (
    <section className="py-24 bg-[#FFF9F5] dark:bg-slate-950/50 transition-colors overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-20 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Who uses <span className="text-primary">QuizMaster</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="mb-8 transform transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-8 text-foreground">{feature.title}</h3>
              
              <div className="space-y-6 text-muted-foreground leading-relaxed text-sm md:text-base">
                {feature.description.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
