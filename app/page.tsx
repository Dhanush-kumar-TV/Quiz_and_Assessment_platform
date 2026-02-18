"use client";

import Link from "next/link";
import { ArrowRight, MousePointer2 } from "lucide-react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Footer from "@/components/Footer";
import CTASection from "@/components/landing/CTASection";
import WhoUsesSection from "@/components/landing/WhoUsesSection";
import QuizCharacters from "@/components/illustrations/QuizCharacters";
import { 
  GridSection, 
  questionTypes, 
  advancedFeatures, 
  collaborationFeatures,
  reportingFeatures,
  distributionFeatures,
  integrationFeatures 
} from "@/components/landing/FeatureGrid";
import { 
  FeatureSection,
  AuthoringMockup,
  ConfigureMockup,
  CollaborateMockup,
  AnalyticsMockup,
  SharingMockup,
  IntegrationsMockup
} from "@/components/landing/FeatureShowcase";

const BrainCanvas = dynamic(() => import("@/components/3d/BrainCanvas"), {
  ssr: false,
  loading: () => <div className="h-screen bg-slate-950" />
});

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-black transition-colors duration-500">
        <div className="absolute inset-0 z-0">
           <BrainCanvas />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 pt-12 md:pt-20 flex flex-col items-center text-center h-screen md:h-auto justify-center md:justify-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-sm font-bold mb-3 md:mb-6 tracking-wider uppercase">
              Next-Gen Assessment Platform
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-slate-900 dark:text-white mb-4 md:mb-8 tracking-tight leading-[1.1]">
              The smartest way to <span className="text-primary italic">evaluate</span>
            </h1>
            <p className="text-sm sm:text-base md:text-2xl text-slate-600 dark:text-slate-400 mb-6 md:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
              Create, manage, and analyze quizzes with cutting-edge AI and beautiful analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center w-full sm:w-auto px-4 sm:px-0">
              <Link href={session ? "/dashboard" : "/login"} className="w-full sm:w-auto">
                <button className="h-10 sm:h-14 px-6 sm:px-8 text-sm sm:text-lg font-bold rounded-xl sm:rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all hover:scale-105 flex items-center justify-center w-full sm:w-auto">
                  {session ? "Go to Dashboard" : "Start Creating"} <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>
              {!session && (
                <Link href="/register" className="w-full sm:w-auto">
                    <button className="h-10 sm:h-14 px-6 sm:px-8 text-sm sm:text-lg font-bold rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all w-full sm:w-auto">
                      Sign Up Free
                    </button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 animate-bounce">
          <MousePointer2 className="w-6 h-6" />
        </div>
      </section>

      {/* Feature Sections - Interleaved with Grids */}
      {/* Feature Sections - Interleaved with Grids */}
      <section className="w-full bg-background py-12 md:py-20">
        <div className="container mx-auto px-6">
          
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
          <GridSection 
            title="Quizzing Tools" 
            items={questionTypes} 
            colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/20" 
          />
          
          <div className="h-px bg-border w-full my-20" />

          {/* 2. Configure */}
          <FeatureSection 
            tag="Configure"
            reversed
            title="Make interactive quizzes"
            description="Our software offers all the flexible features you need to make powerful quizzes with minimal effort."
            points={[
              "Shuffle questions and options randomly",
              "Set timers and time limits per question",
              "Limit number of attempts and set access rules"
            ]}
            mockup={<ConfigureMockup />}
          />
          <GridSection 
            title="Configuration Ops" 
            items={advancedFeatures} 
            colorClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20" 
          />

          <div className="h-px bg-border w-full my-20" />

          {/* 3. Work Together */}
          <FeatureSection 
            tag="Work Together"
            title="Collaborate smartly across teams"
            description="QuizMaster allows you to work independently or share data so that you can easily team up with others. Create and manage additional team accounts."
            points={[
              "Admin, Trainer and Student accounts",
              "Customizable permissions for data safety",
              "Bulk user management and groups"
            ]}
            mockup={<CollaborateMockup />}
          />
          <GridSection 
            title="Work Together" 
            items={collaborationFeatures} 
            colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20" 
          />

          <div className="h-px bg-border w-full my-20" />

          {/* 4. Reporting */}
          <FeatureSection 
            tag="Reporting and Analytics"
            reversed
            title="Measure learners' performance"
            description="Get real-time access to all the data you need so that you can better understand your users and groups. View data at any level."
            points={[
              "Real-time participation tracking",
              "Question-level performance analysis",
              "Detailed individual progress reports"
            ]}
            mockup={<AnalyticsMockup />}
          />
          <GridSection 
            title="Reporting and Analytics" 
            items={reportingFeatures} 
            colorClass="bg-rose-100 text-rose-600 dark:bg-rose-900/20" 
          />

          <div className="h-px bg-border w-full my-20" />

          {/* Illustration Section */}
          <section className="text-center px-4 bg-secondary/30 py-24 -mx-6 rounded-[3rem] mb-20">
            <h2 className="text-4xl font-bold mb-4 text-foreground">See It In Action</h2>
            <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto">
              Join thousands of learners using our platform to test their knowledge and track their progress
            </p>
            <QuizCharacters />
          </section>

          {/* 5. Distribution */}
          <FeatureSection 
            tag="Distribution"
            title="Sharing your content"
            description="We offer a choice of ways to share your content so that it's easy for your students to access either publicly or privately."
            points={[
              "Public links and private access codes",
              "Embed quizzes into your own website",
              "Mobile-friendly and responsive design"
            ]}
            mockup={<SharingMockup />}
          />
          <GridSection 
            title="Distribution Tools" 
            items={distributionFeatures} 
            colorClass="bg-violet-100 text-violet-600 dark:bg-violet-900/20" 
          />

          <div className="h-px bg-border w-full my-20" />

          {/* 6. Integrations */}
          <FeatureSection 
            tag="Integrations"
            reversed
            title="Integrate QuizMaster with your platform"
            description="With our simple API and webhooks, you can access and manage features directly from your own software."
            points={[
              "Simple REST API and real-time webhooks",
              "Custom SMTP for branded email delivery",
              "Single Sign-On (SSO) and Ecommerce support"
            ]}
            mockup={<IntegrationsMockup />}
          />
          <GridSection 
            title="Integrations" 
            items={integrationFeatures} 
            colorClass="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20" 
          />

          <WhoUsesSection />
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </main>
  );
}
