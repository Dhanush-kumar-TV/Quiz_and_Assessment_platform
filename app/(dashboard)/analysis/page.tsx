"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { 
    BarChart3, 
    TrendingUp, 
    Target, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    ArrowUpRight, 
    Calendar,
    ChevronRight,
    Loader2,
    Trophy,
    Settings,
    ChevronDown,
    User as UserIcon
} from "lucide-react";
import Link from "next/link";

export default function AnalysisPage() {
    const { data: session } = useSession();
    const [attempts, setAttempts] = useState<any[]>([]);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [attemptsRes, leaderRes] = await Promise.all([
                    fetch("/api/attempts"),
                    fetch("/api/leaderboard")
                ]);
                const attemptsData = await attemptsRes.json();
                const leaderData = await leaderRes.json();
                setAttempts(attemptsData);
                setLeaderboard(leaderData);
            } catch (err) {
                console.error("Failed to fetch analytics data", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium">Analyzing global performance...</p>
            </div>
        );
    }

    // Analytics Calculations
    const totalAttempts = attempts.length;
    const avgScore = totalAttempts 
        ? (attempts.reduce((acc, a) => acc + a.percentage, 0) / totalAttempts).toFixed(1) 
        : 0;
    
    // Dynamic Trend Path Calculation
     const generateTrendPath = () => {
        if (attempts.length === 0) return "";
        if (attempts.length === 1) return `M0,${200 - (attempts[0].percentage / 100) * 180} L1000,${200 - (attempts[0].percentage / 100) * 180}`;
        const data = attempts.slice(0, 10).reverse();
        const points = data.map((a, i) => {
            const x = (i / (data.length - 1)) * 1000;
            const y = 200 - (a.percentage / 100) * 180;
            return `${x},${y}`;
        });
        return `M${points.join(" L")}`;
    };

    // Calendar Data
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const activeDays = new Set(attempts.map(a => new Date(a.createdAt).getDate()));

    const leaderList = Array.isArray(leaderboard) ? leaderboard : [];

    return (
        <div className="space-y-6 pb-10 pt-10 px-2">
            <header>
                <h1 className="text-2xl font-black text-foreground">Performance Analysis</h1>
                <p className="text-muted-foreground text-sm font-medium">Deep dive into your learning journey</p>
            </header>

            <div className="grid grid-cols-12 gap-6">
                
                {/* Left Column: Reviews Growth & Top points */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    
                    {/* Reviews Growth Widget */}
                    <div className="bg-primary rounded-3xl p-6 text-foreground dark:text-white relative h-[320px] overflow-hidden shadow-2xl shadow-slate-200/20 dark:shadow-none transition-transform hover:scale-[1.01] duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2 bg-foreground/10 dark:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Reviews growth</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md overflow-hidden flex items-center justify-center">
                                {session?.user?.image ? (
                                    <img src={session.user.image} className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-4 h-4 text-white/60" />
                                )}
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <h2 className="text-5xl font-black">+{totalAttempts * 12}</h2>
                            <p className="opacity-60 text-xs font-bold mt-1">Growth based on<br/>{totalAttempts} recent activities</p>
                        </div>

                        {/* Dynamic Circular Chart */}
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 flex items-center justify-center transform rotate-[-90deg]">
                            <svg className="w-full h-full p-4 overflow-visible">
                                {/* Background Circle */}
                                <circle 
                                    cx="128" cy="128" r="90" 
                                    className="fill-none stroke-white/10" 
                                    strokeWidth="24" 
                                />
                                {/* Glow Circle */}
                                <circle 
                                    cx="128" cy="128" r="90" 
                                    className="fill-none stroke-[hsl(var(--mint))]/20 blur-md" 
                                    strokeWidth="24"
                                    strokeDasharray="565.48"
                                    strokeDashoffset={565.48 - (Number(avgScore) / 100) * 565.48}
                                    strokeLinecap="round"
                                />
                                {/* Progress Circle */}
                                <circle 
                                    cx="128" cy="128" r="90" 
                                    className="fill-none stroke-foreground dark:stroke-white" 
                                    strokeWidth="24" 
                                    strokeDasharray="565.48"
                                    strokeDashoffset={565.48 - (Number(avgScore) / 100) * 565.48}
                                    strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                                />
                            </svg>
                        </div>

                        <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--mint))] animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Active Status</span>
                        </div>
                    </div>

                    {/* Profile Summary Widget */}
                    <div className="bg-card rounded-3xl border border-border p-6 text-center space-y-4 shadow-xl shadow-slate-100/50 dark:shadow-none hover:shadow-2xl transition-all duration-300">
                        <div className="relative inline-block">
                             <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center overflow-hidden mx-auto border border-border">
                                {session?.user?.image ? (
                                    <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-10 h-10 text-muted-foreground" />
                                )}
                             </div>
                             <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-card rounded-full" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-foreground">{session?.user?.name}</h3>
                            <p className="text-muted-foreground text-xs font-bold">Quiz Master | Top 5%</p>
                        </div>
                        <div className="flex justify-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                                <Trophy className="w-4 h-4" />
                            </div>
                            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                                <Target className="w-4 h-4" />
                            </div>
                            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                                <Settings className="w-4 h-4" />
                            </div>
                        </div>
                        <Link href="/settings" className="block w-full bg-primary/10 text-primary-foreground dark:text-indigo-600 py-3 rounded-xl font-black text-xs hover:bg-primary hover:text-white transition-all">
                            Account Settings
                        </Link>
                    </div>

                </div>

                {/* Right Column: Leaderboard & Activity List */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    
                    {/* Leaderboard Widget (Replacing Mastery) */}
                    <div className="bg-card rounded-3xl border border-border p-7 shadow-xl shadow-slate-100/50 dark:shadow-none h-full min-h-[320px]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h3 className="text-4xl font-black text-foreground flex items-center gap-3">
                                    Active Users
                                    <span className="text-primary text-2xl">{leaderList.length}</span>
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Trophy className="w-5 h-5" />
                                    </div>
                                </h3>
                                <p className="text-muted-foreground text-xs font-bold mt-1">Ranking by total points earned</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                    <span className="text-xs font-bold text-muted-foreground">Top Rank</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-foreground/20 dark:bg-slate-700" />
                                    <span className="text-xs font-bold text-muted-foreground">Rising</span>
                                </div>
                            </div>
                        </div>

                        {/* Leaderboard Bars (Competitive Visual) */}
                        <div className="flex items-end justify-between gap-3 h-40 bg-secondary/30 rounded-2xl p-6">
                            {leaderList.length === 0 ? (
                                <div className="w-full flex items-center justify-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                                    No data yet
                                </div>
                            ) : (
                                leaderList.slice(0, 10).map((user, i) => (
                                    <div key={i} className="flex-grow h-full flex flex-col-reverse gap-1.5 items-center group relative cursor-pointer">
                                        <div className="w-6 h-6 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                                            {user.image ? (
                                                <img src={user.image} className="w-full h-full object-cover" />
                                            ) : (
                                                <UserIcon className="w-3 h-3 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div 
                                            className={`w-full max-w-[24px] rounded-t-lg transition-all transform origin-bottom ${i === 0 ? 'bg-primary shadow-lg shadow-primary/20' : i === 1 ? 'bg-primary/70' : 'bg-foreground/10 dark:bg-slate-700'} `} 
                                            style={{ height: `${Math.min(Math.max((user.totalScore / (leaderList[0]?.totalScore || 1)) * 100, 5), 100)}%` }}
                                        />
                                        <div 
                                            className="w-full max-w-[24px] bg-slate-200 dark:bg-slate-800 rounded-t-lg transition-all group-hover:bg-primary/20 opacity-30" 
                                            style={{ height: `${Math.min(Math.max((user.attemptCount / 10) * 100, 5), 100)}%` }}
                                        />
                                        {/* Tooltip on hover */}
                                        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all bg-foreground text-background px-3 py-1 rounded-lg text-[10px] whitespace-nowrap z-10 font-bold">
                                            {user.name}: {user.totalScore} pts
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-6">
                            <div className="flex -space-x-2 overflow-hidden">
                                {leaderList.slice(0, 5).map((u, i) => (
                                    <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-card bg-secondary flex items-center justify-center overflow-hidden">
                                        {u.image ? (
                                            <img src={u.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <UserIcon className="w-3 h-3 text-muted-foreground" />
                                        )}
                                    </div>
                                ))}
                                {leaderList.length > 5 && (
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary ring-2 ring-card text-[10px] font-bold text-muted-foreground">
                                        +{leaderList.length - 5}
                                    </div>
                                )}
                            </div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-3">Global Competitive Field</p>
                            
                            {/* Detailed Top Performer List (Email & Score) */}
                            <div className="mt-8 space-y-3">
                                <div className="flex items-center justify-between px-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                    <span>Rank & User</span>
                                    <span>Total Score</span>
                                </div>
                                <div className="space-y-2">
                                    {leaderList.slice(0, 5).map((user, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/20 border border-border/50 hover:bg-secondary/40 transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${i === 0 ? 'bg-primary text-foreground' : i === 1 ? 'bg-primary/50 text-foreground' : 'bg-secondary text-muted-foreground'}`}>
                                                    #{i + 1}
                                                </div>
                                                <div className="w-8 h-8 rounded-full border border-border bg-secondary flex items-center justify-center overflow-hidden">
                                                    {user.image ? (
                                                        <img src={user.image} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <UserIcon className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-foreground group-hover:text-primary transition-colors">{user.name}</span>
                                                    <span className="text-[9px] font-bold text-muted-foreground truncate max-w-[150px]">{user.email}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-black text-foreground">{user.totalScore}</div>
                                                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">{user.attemptCount} Attempts</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Row: Top Points (Area Chart) & Widgets */}
                <div className="col-span-12 lg:col-span-8">
                     <div className="bg-card rounded-3xl border border-border p-7 h-full shadow-xl shadow-slate-100/50 dark:shadow-none min-h-[380px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-3xl font-black text-foreground">Learning Trends</h3>
                            <button className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-xl text-xs font-bold text-foreground hover:bg-secondary/80 transition-all border border-border/50">
                                Historical
                                <TrendingUp className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        
                         {/* Dynamic Area Chart (SVG) */}
                         <div className="relative h-56 mt-6">
                            {attempts.length === 0 ? (
                                <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl">
                                    <BarChart3 className="w-8 h-8 text-muted-foreground/30 mb-2" />
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No activity data yet</p>
                                </div>
                            ) : (
                                <>
                                    <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
                                        {/* Grid Lines */}
                                        {[60, 100, 140, 180].map(y => (
                                            <line key={y} x1="0" y1={y} x2="1000" y2={y} className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="1" />
                                        ))}
                                        
                                        {/* Dynamic User Curve */}
                                        <path 
                                            d={generateTrendPath()} 
                                            className="fill-none stroke-primary" 
                                            strokeWidth="4" 
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        
                                        {/* Markers for points */}
                                        {attempts.slice(0, 10).reverse().map((a, i) => {
                                            const totalDots = Math.min(attempts.length, 10);
                                            const x = totalDots > 1 ? (i / (totalDots - 1)) * 1000 : 500;
                                            const y = 200 - (a.percentage / 100) * 180;
                                            return (
                                                <circle 
                                                    key={i}
                                                    cx={x} 
                                                    cy={y} 
                                                    r="6" 
                                                    className="fill-card stroke-primary" 
                                                    strokeWidth="3" 
                                                />
                                            );
                                        })}
                                    </svg>
                                    
                                    <div className="flex justify-between mt-6">
                                        {attempts.slice(0, 10).reverse().map((a, i) => (
                                            <span key={i} className="text-[8px] font-black text-muted-foreground uppercase tracking-widest text-center" style={{ width: `${100 / Math.min(attempts.length, 10)}%` }}>
                                                {new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                     </div>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-6">
                    
                    {/* User Growth Stats */}
                    <div className="bg-card rounded-3xl border border-border p-6 shadow-xl shadow-slate-100/50 dark:shadow-none min-h-[180px]">
                         <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-foreground/10 dark:bg-slate-700 flex items-center justify-center">
                                    <Target className="w-3.5 h-3.5 text-primary dark:text-indigo-400" />
                                </div>
                                <span className="text-xs font-black text-foreground">Averages</span>
                            </div>
                         </div>
                         <h4 className="text-4xl font-black text-foreground">{avgScore}%</h4>
                         <p className="text-muted-foreground text-[10px] font-bold mt-1 uppercase tracking-wider">Average performance score</p>
                         
                         <div className="mt-6 space-y-2.5">
                             <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase mb-1">
                                 <span>Accuracy</span>
                                 <span>{avgScore}%</span>
                             </div>
                             <div className="h-4 w-full bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-[hsl(var(--mint))] rounded-full transition-all duration-1000" style={{ width: `${avgScore}%` }}></div>
                             </div>
                         </div>
                    </div>

                    {/* Dynamic Mini Calendar Widget */}
                    <div className="bg-slate-950 dark:bg-slate-900 rounded-3xl p-6 text-white min-h-[180px]">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-black text-base">Activity</h4>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/60">
                                {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1.5 text-center text-[9px] font-black uppercase tracking-widest text-white/40 mb-3">
                            {['S','M','T','W','T','F','S'].map(d => <span key={d}>{d}</span>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1.5 text-center">
                            {Array.from({length: daysInMonth}, (_, i) => i + 1).map(d => (
                                <div 
                                    key={d} 
                                    className={`aspect-square flex items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                                        activeDays.has(d) 
                                        ? 'bg-primary text-foreground shadow-lg shadow-primary/40 scale-110' 
                                        : 'text-white/60 hover:bg-white/10 cursor-pointer'
                                    }`}
                                >
                                    {d}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
