import Link from "next/link";
import { Brain, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                <Brain className="w-5 h-5" />
              </div>
              <span className="font-black text-xl text-foreground tracking-tight">QuizMaster</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering learners and educators with dynamic, engaging quizzes. Master any subject, anytime.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/quizzes" className="hover:text-primary transition-colors">Explore Quizzes</Link></li>
              <li><Link href="/create" className="hover:text-primary transition-colors">Create Quiz</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Connect</h4>
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} QuizMaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
