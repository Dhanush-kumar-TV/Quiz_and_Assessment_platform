"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Brain, LogOut, User, PlusCircle, History, LayoutDashboard, Settings, Moon, Sun, Monitor, ChevronDown, BarChart3, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import NotificationBell from "@/components/NotificationBell";

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Hide Navbar on quiz attempt pages for immersive experience
  if (pathname.includes('/attempt')) return null;

  return (
    <nav className="bg-background/80 backdrop-blur-md shadow-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-slate-200/50 dark:shadow-none transition-transform group-hover:rotate-12 duration-300">
            <Brain className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="font-black text-xl md:text-2xl text-foreground tracking-tight">QuizMaster</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme Toggle - Desktop (Segmented) */}
          <div className="hidden md:flex bg-secondary p-1.5 rounded-2xl gap-1">
            <button 
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-xl transition-all ${theme === 'light' ? 'bg-background text-amber-500 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-xl transition-all ${theme === 'dark' ? 'bg-slate-800 text-indigo-400 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Moon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setTheme('system')}
              className={`p-1.5 rounded-xl transition-all ${theme === 'system' ? 'bg-background text-indigo-500 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Toggle - Mobile (Compact Cycle) */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="md:hidden p-2 rounded-xl bg-secondary/50 text-foreground hover:bg-secondary transition-colors"
          >
             {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <div className="h-6 w-px bg-border mx-1 md:h-8 md:mx-2"></div>
          
          {session && <NotificationBell />}
          
          <div className="flex items-center gap-2 md:gap-6">
            {session ? (
              <>
                  <div className="hidden md:flex items-center gap-4">
                    <Link 
                      href="/dashboard" 
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all border-2 ${
                        pathname === '/dashboard' 
                          ? "bg-primary/5 border-primary text-primary shadow-sm" 
                          : "bg-secondary/40 border-secondary text-muted-foreground hover:border-primary/50 hover:text-primary"
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link 
                      href="/quizzes" 
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all border-2 ${
                        pathname.startsWith('/quizzes') && pathname !== '/quizzes/create'
                          ? "bg-primary/5 border-primary text-primary shadow-sm" 
                          : "bg-secondary/40 border-secondary text-muted-foreground hover:border-primary/50 hover:text-primary"
                      }`}
                    >
                      <Brain className="w-4 h-4" />
                      Quizzes
                    </Link>
                    <Link 
                      href="/analysis" 
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all border-2 ${
                        pathname === '/analysis' 
                          ? "bg-primary/5 border-primary text-primary shadow-sm" 
                          : "bg-secondary/40 border-secondary text-muted-foreground hover:border-primary/50 hover:text-primary"
                      }`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      Analysis
                    </Link>

                    {/* Admin/Trainer specific links */}
                    <Link 
                      href="/groups" 
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all border-2 ${
                        pathname === '/groups' 
                          ? "bg-primary/5 border-primary text-primary shadow-sm" 
                          : "bg-secondary/40 border-secondary text-muted-foreground hover:border-primary/50 hover:text-primary"
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Groups
                    </Link>

                    {(session.user as { role?: string }).role === 'admin' && (
                      <Link 
                        href="/admin/users" 
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all border-2 ${
                          pathname === '/admin/users' 
                            ? "bg-primary/5 border-primary text-primary shadow-sm" 
                            : "bg-secondary/40 border-secondary text-muted-foreground hover:border-primary/50 hover:text-primary"
                        }`}
                      >
                        <Shield className="w-4 h-4" />
                        Users
                      </Link>
                    )}
                  </div>

                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 p-1 rounded-2xl hover:bg-secondary transition-all group"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary overflow-hidden border-2 border-background shadow-sm relative">
                      {(session.user as { image?: string })?.image ? (
                        <Image src={(session.user as { image: string }).image} alt="User" fill className="object-cover" />
                      ) : (
                        <User className="w-5 h-5 md:w-6 md:h-6" />
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-card rounded-3xl shadow-2xl shadow-slate-100/50 dark:shadow-none border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                      <div className="p-5 border-b border-border">
                        <p className="text-sm font-black text-foreground truncate">{session.user?.name}</p>
                        <p className="text-xs font-semibold text-muted-foreground truncate">{session.user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link 
                          href="/analysis" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-secondary rounded-2xl transition-colors"
                        >
                          <BarChart3 className="w-4 h-4" />
                          Analysis
                        </Link>
                        <Link 
                          href="/settings" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-secondary rounded-2xl transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Account Settings
                        </Link>
                         <Link 
                          href="/attempts" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-secondary rounded-2xl transition-colors"
                        >
                          <History className="w-4 h-4" />
                          My Attempts
                        </Link>
                        {(session.user as { role?: string }).role === 'admin' && (
                          <Link 
                            href="/admin/users" 
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-colors"
                          >
                            <Shield className="w-4 h-4" />
                            User Management
                          </Link>
                        )}
                        {((session.user as { role?: string }).role === 'admin' || (session.user as { role?: string }).role === 'trainer') && (
                          <Link 
                            href="/groups" 
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-secondary rounded-2xl transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Groups
                          </Link>
                        )}
                        <Link 
                          href="/quizzes/create" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center md:hidden gap-3 px-4 py-3 text-sm font-bold text-primary hover:bg-primary/10 rounded-2xl transition-colors"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Create Quiz
                        </Link>
                      </div>
                      <div className="p-2 bg-secondary/50">
                        <button 
                          onClick={() => signOut()}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {pathname !== '/' && (
                  <Link href="/quizzes/create" className="hidden md:flex bg-primary text-primary-foreground px-6 py-3 rounded-2xl text-sm font-black hover:opacity-90 transition-all flex items-center gap-2 shadow-xl shadow-slate-100/50 dark:shadow-none active:scale-95">
                    <PlusCircle className="w-4 h-4" />
                    Create Quiz
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/login" className="text-foreground hover:text-primary text-sm font-bold transition-colors">
                  Login
                </Link>
                <Link href="/register" className="hidden md:flex bg-primary text-primary-foreground px-8 py-3 rounded-2xl text-sm font-black hover:opacity-90 transition-all shadow-xl shadow-slate-100/50 dark:shadow-none">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
