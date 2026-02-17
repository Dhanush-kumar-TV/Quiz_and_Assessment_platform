"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    Users, 
    CheckCircle2, 
    Activity, 
    TrendingUp, 
    Search, 
    ArrowLeft,
    ChevronRight,
    Loader2,
    Calendar,
    Target
} from "lucide-react";
import Link from "next/link";

export default function QuizReportsPage() {
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchReports() {
            try {
                const res = await fetch(`/api/quizzes/${params.id}/reports`);
                const json = await res.json();
                if (res.ok) {
                    setData(json);
                } else {
                    console.error(json.message);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchReports();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-muted-foreground font-bold italic">Gathering insights...</p>
            </div>
        );
    }

    if (!data) return <div className="p-20 text-center font-black">Report not available.</div>;

    const { quiz, attempts, stats } = data;
    const filteredAttempts = attempts.filter((a: any) => 
        a.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Quiz
                    </button>
                    <h1 className="text-4xl font-black text-slate-900 leading-tight">Reports & Insights</h1>
                    <p className="text-lg text-muted-foreground font-medium mt-2">{quiz.title}</p>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-border/50 shadow-sm">
                    <Search className="w-5 h-5 text-muted-foreground ml-2" />
                    <input 
                        type="text"
                        placeholder="Search participants..."
                        className="bg-transparent border-none focus:ring-0 font-bold text-sm w-48 lg:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    label="Total Participants" 
                    value={stats.totalAttempts} 
                    sub="All-time attempts"
                    icon={<Users className="w-6 h-6" />}
                    color="blue"
                />
                <StatCard 
                    label="Completion Rate" 
                    value={`${((stats.completedAttempts / (stats.totalAttempts || 1)) * 100).toFixed(0)}%`} 
                    sub={`${stats.completedAttempts} finished`}
                    icon={<CheckCircle2 className="w-6 h-6" />}
                    color="emerald"
                />
                <StatCard 
                    label="Active Sessions" 
                    value={stats.activeAttempts} 
                    sub="Currently taking quiz"
                    icon={<Activity className="w-6 h-6" />}
                    color="amber"
                />
                <StatCard 
                    label="Avg. Proficiency" 
                    value={`${stats.averagePercentage.toFixed(0)}%`} 
                    sub="Across all topics"
                    icon={<TrendingUp className="w-6 h-6" />}
                    color="primary"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Category Breakdown */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                        <Target className="w-6 h-6 text-primary" />
                        Category Performance
                    </h2>
                    <div className="space-y-6">
                        {Object.entries(stats.categoryPerformance).length > 0 ? (
                            Object.entries(stats.categoryPerformance).map(([cat, s]: [string, any]) => {
                                // Calculate possible points for this category
                                const catMaxPoints = quiz.questions
                                    .filter((q: any) => (q.category || "General") === cat)
                                    .reduce((acc: number, q: any) => acc + (q.points || 1), 0);
                                const avgScoreForCat = s.score / s.count;
                                const percentage = (avgScoreForCat / catMaxPoints) * 100;

                                return (
                                    <div key={cat} className="space-y-2">
                                        <div className="flex justify-between text-sm font-bold capitalize">
                                            <span>{cat}</span>
                                            <span className="text-primary">{percentage.toFixed(0)}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-primary transition-all duration-1000"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-10 text-center text-muted-foreground text-sm font-bold italic">
                                No category data available.
                            </div>
                        )}
                    </div>
                </div>

                {/* Participant List */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] p-4 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 pb-0">
                        <h2 className="text-xl font-black flex items-center gap-3">
                            <Users className="w-6 h-6 text-primary" />
                            Recent Participants
                        </h2>
                    </div>
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border/50">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Participant</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Score</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {filteredAttempts.map((attempt: any) => (
                                    <tr key={attempt._id} className="group hover:bg-secondary/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black">
                                                    {attempt.userId?.name?.charAt(0) || "?"}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{attempt.userId?.name || "Deleted User"}</p>
                                                    <p className="text-xs text-muted-foreground">{attempt.userId?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                attempt.status === 'completed' 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                                {attempt.status || 'completed'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {attempt.status === 'completed' ? (
                                                <div>
                                                    <p className="font-black text-slate-900">{attempt.percentage?.toFixed(0)}%</p>
                                                    <p className="text-[10px] text-muted-foreground font-bold">{attempt.score} / {attempt.totalPoints}</p>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic text-xs">In progress</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(attempt.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredAttempts.length === 0 && (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto">
                                    <Users className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground font-bold italic">No participants found matching your search.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, sub, icon, color }: any) {
    const colorClasses: any = {
        primary: "bg-primary/5 text-primary",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        blue: "bg-blue-50 text-blue-600",
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-transparent ${colorClasses[color]}`}>
                {icon}
            </div>
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
            <h3 className="text-4xl font-black text-slate-900 mb-2">{value}</h3>
            <p className="text-xs text-muted-foreground font-medium">{sub}</p>
        </div>
    );
}
