"use client";

import { motion } from "framer-motion";
import { 
  CheckSquare, 
  CircleDot, 
  Upload, 
  Type, 
  Layers, 
  Columns, 
  ImageIcon,
  MessageSquare,
  Timer,
  AlertCircle,
  Shuffle,
  Lock,
  FileText,
  BarChart3,
  Bookmark,
  Mail,
  GraduationCap,
  PauseCircle,
  Hash,
  Target,
  ListIcon,
  User,
  Clock,
  Link as LinkIcon,
  Users,
  Cloud,
  ShoppingCart,
  Key,
  Code,
  Monitor,
  ShieldCheck,
  ClipboardList,
  UserCheck,
  Smartphone
} from "lucide-react";

export const questionTypes = [
  { icon: <CheckSquare className="w-6 h-6" />, title: "Multiple-choice", desc: "Allows respondents to pick multiple responses from a list of options." },
  { icon: <CircleDot className="w-6 h-6" />, title: "Single-choice", desc: "Respondents can pick one answer from a list or drop-down menu." },
  { icon: <Upload className="w-6 h-6" />, title: "File upload", desc: "Allow respondents to upload a file such as an image, PDF or video." },
  { icon: <Type className="w-6 h-6" />, title: "Fill-in-the-blanks", desc: "Respondents enter their answers in the blank space provided." },
  { icon: <Layers className="w-6 h-6" />, title: "Free text", desc: "Respondents provide a written response, such as an essay or notes." },
  { icon: <Columns className="w-6 h-6" />, title: "Matching text", desc: "Respondents type a short answer into a box for auto-marking." },
  { icon: <Columns className="w-6 h-6" />, title: "Matching", desc: "Consists of two columns where respondents match pairs." },
  { icon: <ImageIcon className="w-6 h-6" />, title: "Picture choice", desc: "A multiple-choice question where options are images/icons." },
];

export const advancedFeatures = [
  { icon: <Timer className="w-6 h-6" />, title: "Timers", desc: "Set time limits for the whole quiz or individual questions." },
  { icon: <AlertCircle className="w-6 h-6" />, title: "Required questions", desc: "Prevent students from skipping critical content." },
  { icon: <Shuffle className="w-6 h-6" />, title: "Randomize", desc: "Shuffle the order of questions or set pages for variety." },
  { icon: <Lock className="w-6 h-6" />, title: "Limit attempts", desc: "Control the number of times respondents can access the test." },
  { icon: <FileText className="w-6 h-6" />, title: "Category scoring", desc: "Provide detailed feedback based on subject areas." },
  { icon: <Bookmark className="w-6 h-6" />, title: "Save & resume later", desc: "Allow users to save progress and return to their attempt." },
  { icon: <Mail className="w-6 h-6" />, title: "Email results", desc: "Automatically send custom results to users or admins." },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Real-time reporting", desc: "Monitor student participation and progress live." },
];

export const collaborationFeatures = [
  { icon: <Users className="w-6 h-6" />, title: "Admin accounts", desc: "Administrators can access all quizzes based on the permissions you set." },
  { icon: <GraduationCap className="w-6 h-6" />, title: "Trainer accounts", desc: "Trainers can access assigned quizzes and groups based on permissions." },
  { icon: <Users className="w-6 h-6" />, title: "Groups", desc: "Use groups to manage respondents, organize content and work with others." },
  { icon: <PauseCircle className="w-6 h-6" />, title: "Suspend users", desc: "Set users to inactive so they cannot access the system." },
  { icon: <Upload className="w-6 h-6" />, title: "Bulk upload", desc: "Import multiple users with our Excel spreadsheet template." },
  { icon: <Mail className="w-6 h-6" />, title: "Welcome email", desc: "Send a customizable welcome email to new users directly." },
];

export const reportingFeatures = [
  { icon: <Target className="w-6 h-6" />, title: "Tracking", desc: "View who has started and completed your quiz in real-time." },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Groups", desc: "A summary of results for all assigned respondents and quizzes." },
  { icon: <ListIcon className="w-6 h-6" />, title: "Question level", desc: "Check how many people have selected each response option." },
  { icon: <User className="w-6 h-6" />, title: "Individuals", desc: "A detailed view of a learner's performance, including all answers." },
  { icon: <Clock className="w-6 h-6" />, title: "Time per question", desc: "Track how much time users have spent on each individual question." },
  { icon: <Hash className="w-6 h-6" />, title: "Number of attempts", desc: "View how many times a respondent has submitted your quiz." },
];

export const distributionFeatures = [
  { icon: <Monitor className="w-6 h-6" />, title: "Respondent portals", desc: "Allow users to log in securely to access assigned quizzes and courses." },
  { icon: <LinkIcon className="w-6 h-6" />, title: "Quiz link", desc: "QuizMaster provides a unique URL which you can add to your emails or website." },
  { icon: <Mail className="w-6 h-6" />, title: "Email invitations", desc: "Send an email directly from your account to invite users to take your test." },
  { icon: <Users className="w-6 h-6" />, title: "Groups", desc: "Assign your quizzes to a group of users with Respondent portals." },
  { icon: <Code className="w-6 h-6" />, title: "Embed", desc: "Embed the quiz link on your site using simple HTML code." },
  { icon: <ShoppingCart className="w-6 h-6" />, title: "Sell", desc: "Prevent users from accessing your quiz content until payment is processed." },
  { icon: <ShieldCheck className="w-6 h-6" />, title: "Password protection", desc: "Ask users to share a passcode before they can access your content." },
  { icon: <ClipboardList className="w-6 h-6" />, title: "Registration", desc: "Ask users to provide information such as name, student ID or location." },
  { icon: <Key className="w-6 h-6" />, title: "Access codes", desc: "Allow users to access your live quiz with a secure access code." },
  { icon: <UserCheck className="w-6 h-6" />, title: "Self-registration", desc: "Allow users to self-register for a Respondent portal to access quizzes." },
  { icon: <Smartphone className="w-6 h-6" />, title: "Mobile friendly", desc: "Our quizzes work well and look great on any device, from laptop to phone." },
];

export const integrationFeatures = [
  { icon: <Mail className="w-6 h-6" />, title: "SMTP", desc: "Send emails using your organization's email address and branding." },
  { icon: <Cloud className="w-6 h-6" />, title: "API and webhooks", desc: "Access and manage features directly from your own software." },
  { icon: <ShoppingCart className="w-6 h-6" />, title: "Ecommerce", desc: "Add a payment page for a seamless buying experience." },
  { icon: <Key className="w-6 h-6" />, title: "Single sign-on", desc: "Identify respondents who have already logged into your website." },
  { icon: <Code className="w-6 h-6" />, title: "Embed", desc: "Embed a quiz or respondent portal using simple HTML code." },
];

export const GridSection = ({ title, items, colorClass }: { title: string, items: any[], colorClass: string }) => (
  <div className="py-20">
    <h3 className="text-2xl font-bold mb-12 text-center text-foreground uppercase tracking-widest opacity-50">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
      {items.map((item, i) => (
        <motion.div 
          key={i} 
          className="group flex flex-col gap-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4 }}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass} transition-transform group-hover:scale-110`}>
            {item.icon}
          </div>
          <h4 className="font-bold text-lg text-foreground">{item.title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed italic">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

export default function FeatureGrid() {
  return (
    <section className="container mx-auto px-6">
      <GridSection 
        title="Quizzing Tools" 
        items={questionTypes} 
        colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/20" 
      />
      <div className="h-px bg-border w-full" />
      <GridSection 
        title="Configuration Ops" 
        items={advancedFeatures} 
        colorClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20" 
      />
      <div className="h-px bg-border w-full" />
      <GridSection 
        title="Work Together" 
        items={collaborationFeatures} 
        colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20" 
      />
      <div className="h-px bg-border w-full" />
      <GridSection 
        title="Reporting and Analytics" 
        items={reportingFeatures} 
        colorClass="bg-rose-100 text-rose-600 dark:bg-rose-900/20" 
      />
      <div className="h-px bg-border w-full" />
      <GridSection 
        title="Distribution Tools" 
        items={distributionFeatures} 
        colorClass="bg-violet-100 text-violet-600 dark:bg-violet-900/20" 
      />
      <div className="h-px bg-border w-full" />
      <GridSection 
        title="Integrations" 
        items={integrationFeatures} 
        colorClass="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20" 
      />
    </section>
  );
}
