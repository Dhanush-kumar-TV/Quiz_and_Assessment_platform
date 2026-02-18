"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, Layout, Palette, Settings2, Zap, Lock } from "lucide-react";

interface FeatureProps {
  title: string;
  tag: string;
  description: string;
  points: string[];
  mockup: React.ReactNode;
  reversed?: boolean;
}

export const FeatureSection = ({ title, tag, description, points, mockup, reversed }: FeatureProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24 py-20`}>
      {/* Text Content */}
      <motion.div 
        className="flex-1 space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="text-primary font-bold tracking-widest uppercase text-xs">
          {tag}
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-foreground leading-tight">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {description}
        </p>
        <ul className="space-y-4 pt-4">
          {points.map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground font-medium">{point}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Visual Mockup */}
      <motion.div 
        className="flex-1 w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
      >
        <div className="relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-violet-500/10 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
           <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
              {mockup}
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function FeatureShowcase() {
  return (
    <section className="container mx-auto px-6 space-y-20">
      
      {/* 1. Authoring Tool */}
      <FeatureSection 
        tag="Authoring Tool"
        title="Easily create amazing learning materials"
        description="Our intuitive editor helps you build comprehensive quizzes in minutes. Whether it's a simple test or a complex certification, QuizMaster has you covered."
        points={[
          "Support for images, audio and videos",
          "Multiple question types including matching and file upload",
          "Bulk import questions from documents"
        ]}
        mockup={<AuthoringMockup />}
      />

      {/* 2. Creative Tools */}
      <FeatureSection 
        tag="Creative Tools"
        reversed
        title="Make your quiz shine"
        description="Customize every aspect of your quiz to match your brand or personality. First impressions matter, even in education."
        points={[
          "Beautiful pre-designed themes",
          "Custom colors and white-labeling",
          "Rich media integration for immersive experiences"
        ]}
        mockup={<CreativeMockup />}
      />

      {/* 3. Configure */}
      <FeatureSection 
        tag="Configure"
        title="Make interactive quizzes"
        description="Our software offers all the flexible features you need to make powerful quizzes with minimal effort."
        points={[
          "Shuffle questions and options randomly",
          "Set timers and time limits per question",
          "Limit number of attempts and set access rules"
        ]}
        mockup={<ConfigureMockup />}
      />

      {/* 4. Automate */}
      <FeatureSection 
        tag="Automate"
        reversed
        title="Automation tools"
        description="Save time and leave the repetitive work behind so that you can focus on what's important."
        points={[
          "Real-time updates and notifications",
          "Automatic certificates and result sharing",
          "Integration with your favorite tools"
        ]}
        mockup={<AutomateMockup />}
      />

      {/* 5. Work Together */}
      <FeatureSection 
        tag="Work Together"
        title="Collaborate smartly across teams"
        description="QuizMaster allows you to work independently or share data so that you can easily team up with others. Create and manage additional team accounts and settings to ensure that everyone can securely access the right information."
        points={[
          "Admin, Trainer and Student accounts",
          "Customizable permissions for data safety",
          "Bulk user management and groups"
        ]}
        mockup={<CollaborateMockup />}
      />

      {/* 6. Reporting and Analytics */}
      <FeatureSection 
        tag="Reporting and Analytics"
        reversed
        title="Measure learners' performance"
        description="Get real-time access to all the data you need so that you can better understand your users and groups. View data at a quiz, individual, group or question level. Download your data in Excel or PDF files for further analysis."
        points={[
          "Real-time participation tracking",
          "Question-level performance analysis",
          "Detailed individual progress reports"
        ]}
        mockup={<AnalyticsMockup />}
      />

      {/* 7. Distribution */}
      <FeatureSection 
        tag="Distribution"
        title="Sharing your content"
        description="We offer a choice of ways to share your content so that it's easy for your students to access either publicly or privately. Students can view content on any device with the flexibility to start, pause and resume from anywhere."
        points={[
          "Public links and private access codes",
          "Embed quizzes into your own website",
          "Mobile-friendly and responsive design"
        ]}
        mockup={<SharingMockup />}
      />

      {/* 8. Integrations */}
      <FeatureSection 
        tag="Integrations"
        reversed
        title="Integrate QuizMaster with your platform"
        description="With our simple API and webhooks, you can access and manage features directly from your own software. We provide all the tools you need to create a seamless experience for your users."
        points={[
          "Simple REST API and real-time webhooks",
          "Custom SMTP for branded email delivery",
          "Single Sign-On (SSO) and Ecommerce support"
        ]}
        mockup={<IntegrationsMockup />}
      />

    </section>
  );
}

{/* CSS-based Mockup Components */}

export function AuthoringMockup() {
  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 aspect-video flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div className="flex gap-2">
           <div className="w-3 h-3 rounded-full bg-red-400" />
           <div className="w-3 h-3 rounded-full bg-yellow-400" />
           <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="h-6 w-32 bg-secondary rounded-md" />
      </div>
      <div className="flex gap-6 flex-1">
        <div className="w-1/3 space-y-3">
           <div className="h-8 w-full bg-primary/20 rounded-lg animate-pulse" />
           <div className="h-8 w-3/4 bg-secondary rounded-lg" />
           <div className="h-8 w-full bg-secondary rounded-lg" />
        </div>
        <div className="flex-1 bg-background rounded-xl p-4 border border-border shadow-inner">
           <div className="h-4 w-1/2 bg-secondary rounded mb-4" />
           <div className="h-32 w-full bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center">
              <Palette className="w-12 h-12 text-primary opacity-20" />
           </div>
        </div>
      </div>
    </div>
  );
}

export function CreativeMockup() {
  return (
    <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 aspect-video flex items-center justify-center">
      <div className="w-64 h-80 bg-background rounded-2xl shadow-2xl border border-white/20 p-6 flex flex-col gap-6 transform rotate-3">
          <div className="w-full h-32 bg-primary/10 rounded-xl flex items-center justify-center">
             <div className="w-20 h-20 bg-primary rounded-full animate-pulse" />
          </div>
          <div className="space-y-3 text-center">
             <div className="h-4 w-3/4 bg-foreground/10 rounded mx-auto" />
             <div className="h-4 w-1/2 bg-foreground/10 rounded mx-auto" />
          </div>
          <div className="mt-auto h-12 w-full bg-primary rounded-xl flex items-center justify-center text-white font-bold">
             Finish Quiz
          </div>
      </div>
    </div>
  );
}

export function ConfigureMockup() {
  return (
    <div className="p-8 bg-slate-950 aspect-video relative overflow-hidden">
      <div className="absolute top-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="relative space-y-6">
          <div className="flex items-center gap-4 text-white">
             <Settings2 className="w-6 h-6 text-primary" />
             <span className="font-bold">Configuration Panel</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {[1,2,3,4].map(i => (
               <div key={i} className="h-10 border border-white/10 bg-white/5 rounded-lg flex items-center px-3 gap-3">
                  <div className={`w-4 h-4 rounded-full ${i===2 ? 'bg-primary' : 'bg-white/10'}`} />
                  <div className="h-2 flex-1 bg-white/20 rounded" />
               </div>
             ))}
          </div>
          <div className="h-24 w-full bg-white/5 rounded-xl border border-white/10 p-4 flex flex-col gap-3">
             <div className="h-2 w-1/2 bg-primary/50 rounded" />
             <div className="flex gap-2">
                <div className="h-8 w-1/4 bg-white/10 rounded-lg" />
                <div className="h-8 w-1/4 bg-white/10 rounded-lg" />
             </div>
          </div>
      </div>
    </div>
  );
}

export function AutomateMockup() {
  return (
    <div className="p-6 bg-emerald-500/5 aspect-video flex gap-4">
      <div className="w-16 h-full bg-background/50 rounded-xl border border-border flex flex-col items-center gap-6 py-6">
          <Layout className="text-primary w-6 h-6" />
          <Settings2 className="text-muted-foreground w-6 h-6" />
          <Zap className="text-muted-foreground w-6 h-6" />
      </div>
      <div className="flex-1 space-y-4">
          <div className="h-12 w-full bg-background rounded-xl border border-border flex items-center px-4 justify-between">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                   <Zap className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-xs font-bold">Triggered Action</span>
             </div>
             <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center px-1">
                <div className="w-4 h-4 bg-white rounded-full ml-auto" />
             </div>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-black uppercase text-muted-foreground">Automation Active</span>
             </div>
             <div className="space-y-3">
                <div className="h-2 w-full bg-secondary rounded" />
                <div className="h-32 w-full bg-emerald-500/20 rounded-lg" />
             </div>
          </div>
      </div>
    </div>
  );
}

export function CollaborateMockup() {
    return (
      <div className="p-8 bg-indigo-900 aspect-video relative overflow-hidden flex items-center justify-center">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl w-72">
           <h4 className="text-white font-bold text-sm mb-6 border-b border-white/10 pb-4">Permissions</h4>
           <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Manage User", active: true },
                { label: "View results", active: false },
                { label: "Publish quiz", active: true },
                { label: "Edit content", active: true }
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                   <div className={`w-3 h-3 rounded-full ${p.active ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-white/20'}`} />
                   <span className="text-[10px] text-white/70 font-medium whitespace-nowrap">{p.label}</span>
                </div>
              ))}
           </div>
           <div className="mt-8 flex justify-center">
                <div className="px-6 py-2 bg-emerald-500 rounded-full text-white text-[10px] font-black shadow-lg">
                    Save Permissions
                </div>
           </div>
        </div>
      </div>
    );
}

export function AnalyticsMockup() {
    return (
      <div className="p-6 bg-slate-50 dark:bg-slate-900 aspect-video flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
            <div className="h-4 w-32 bg-primary/20 rounded" />
            <div className="flex gap-2">
                <div className="w-8 h-8 rounded bg-background border border-border" />
                <div className="w-8 h-8 rounded bg-background border border-border" />
            </div>
        </div>
        <div className="flex-1 bg-background rounded-xl border border-border shadow-sm overflow-hidden">
            <table className="w-full text-[10px]">
                <thead className="bg-secondary/50 border-b border-border">
                    <tr>
                        <th className="p-3 text-left font-bold opacity-50">Name</th>
                        <th className="p-3 text-left font-bold opacity-50">Score</th>
                        <th className="p-3 text-left font-bold opacity-50">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {[
                        { n: "Alex Johnson", s: "92%", c: "bg-emerald-500" },
                        { n: "Maria Garcia", s: "88%", c: "bg-emerald-500" },
                        { n: "Sam Wilson", s: "14%", c: "bg-red-500" }
                    ].map((r, i) => (
                        <tr key={i}>
                            <td className="p-3 font-medium">{r.n}</td>
                            <td className="p-3 font-bold text-primary">{r.s}</td>
                            <td className="p-3">
                                <div className={`w-12 h-1.5 rounded-full ${r.c} opacity-20`} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="h-12 w-full bg-primary/5 rounded-lg border border-primary/10 flex items-center px-4 gap-4">
            <div className="w-8 h-8 bg-primary rounded-full animate-pulse" />
            <div className="h-2 flex-1 bg-primary/10 rounded" />
        </div>
      </div>
    );
}

export function SharingMockup() {
    return (
      <div className="p-8 bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 aspect-video relative flex items-center justify-center overflow-hidden">
        {/* Globe Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-20">
           <svg viewBox="0 0 100 100" className="w-64 h-64 text-primary">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
              <ellipse cx="50" cy="50" rx="30" ry="48" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <ellipse cx="50" cy="50" rx="48" ry="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <line x1="2" y1="50" x2="98" y2="50" stroke="currentColor" strokeWidth="0.2" />
              <line x1="50" y1="2" x2="50" y2="98" stroke="currentColor" strokeWidth="0.2" />
           </svg>
        </div>

        {/* Floating User Nodes & Pins */}
        <div className="relative w-full h-full">
            {/* User 1 (Top) */}
            <div className="absolute top-[10%] left-[20%] group">
                <div className="w-12 h-12 rounded-full bg-pink-500 p-1 shadow-lg transform group-hover:scale-110 transition-transform">
                   <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center text-white">
                      <Zap className="w-6 h-6" />
                   </div>
                </div>
            </div>

            {/* User 2 (Left) */}
            <div className="absolute top-[40%] left-[5%] group">
                <div className="w-16 h-16 rounded-full bg-emerald-500 p-1 shadow-xl transform group-hover:scale-110 transition-transform">
                   <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center text-white">
                      <Layout className="w-8 h-8" />
                   </div>
                </div>
            </div>

            {/* User 3 (Right) */}
            <div className="absolute top-[50%] right-[10%] group">
                <div className="w-12 h-12 rounded-full bg-indigo-500 p-1 shadow-lg transform group-hover:scale-110 transition-transform">
                   <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center text-white">
                      <Settings2 className="w-6 h-6" />
                   </div>
                </div>
                <div className="absolute -bottom-4 right-0 w-4 h-4 rounded-sm bg-emerald-400 border-2 border-white shadow-sm flex items-center justify-center">
                    <CheckCircle2 className="w-2 h-2 text-white" />
                </div>
            </div>

            {/* Message Bubble Large */}
            <div className="absolute top-[20%] left-[50%] w-32 bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-2xl border border-border">
                <div className="space-y-2">
                    <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-10 w-full bg-slate-100 dark:bg-slate-900 rounded-lg" />
                </div>
                <div className="absolute -left-2 top-4 w-4 h-4 bg-white dark:bg-slate-800 border-l border-b border-border rotate-45" />
            </div>

            {/* Message Bubble Small */}
            <div className="absolute bottom-[10%] right-[20%] w-40 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl p-4 shadow-xl border border-emerald-500/20 flex items-center gap-3">
                 <div className="h-2 w-full bg-emerald-500/20 rounded" />
                 <div className="absolute -top-3 left-4 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-border flex items-center justify-center">
                    <span className="text-[8px] font-bold text-primary">!</span>
                 </div>
            </div>

            {/* Pins */}
            <div className="absolute top-[30%] left-[40%] w-4 h-6 bg-primary rounded-full opacity-50 blur-[2px]" />
            <div className="absolute bottom-[40%] left-[25%] w-4 h-6 bg-primary rounded-full opacity-30 blur-[1px]" />
        </div>
      </div>
    );
}

export function IntegrationsMockup() {
    return (
        <div className="p-8 bg-slate-100 dark:bg-slate-900 aspect-video flex items-center justify-center">
            <div className="w-full h-full bg-background rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col">
                {/* Browser Header */}
                <div className="h-10 bg-secondary/50 border-b border-border flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 max-w-xs h-6 bg-background rounded-md border border-border mx-auto flex items-center px-3 gap-2">
                        <div className="w-3 h-3 text-muted-foreground"><Settings2 className="w-full h-full" /></div>
                        <span className="text-[10px] text-muted-foreground opacity-50 truncate">https://yourwebsite.com</span>
                    </div>
                </div>
                
                {/* Website Content */}
                <div className="flex-1 p-6 relative">
                    <div className="flex gap-6 h-full">
                        <div className="w-1/4 space-y-3">
                            <div className="h-4 w-full bg-secondary rounded" />
                            <div className="h-4 w-3/4 bg-secondary rounded" />
                            <div className="space-y-2 pt-4">
                                <div className="h-2 w-full bg-secondary/50 rounded" />
                                <div className="h-2 w-full bg-secondary/50 rounded" />
                                <div className="h-2 w-full bg-secondary/50 rounded" />
                            </div>
                        </div>
                        <div className="flex-1 bg-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center text-white text-center gap-4 relative overflow-hidden">
                             <div className="absolute top-2 left-4 px-3 py-1 bg-white/20 rounded-full text-[8px] font-bold">Your Logo</div>
                             <h4 className="text-xl font-black">QuizMaster</h4>
                             <p className="text-sm font-medium opacity-90">Practice Tests</p>
                             
                             {/* Floating Padlock Overlay */}
                             <div className="absolute -bottom-4 right-10 w-24 h-32 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-border flex flex-col items-center justify-center gap-3 p-4 transform -rotate-3 group-hover:rotate-0 transition-transform">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <div className="h-2 w-full bg-secondary rounded" />
                                <div className="h-2 w-1/2 bg-secondary rounded" />
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


