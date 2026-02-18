import { Brain, History, Target } from "lucide-react";

interface DashboardStatsData { created: number; collaborations: number; attempts: number; avgScore: number; }

export default function DashboardStats({ stats }: { stats: DashboardStatsData }) {
  const cards = [
    {
      label: "Quizzes Created",
      value: stats.created,
      icon: <Brain className="w-6 h-6 text-indigo-600 dark:text-[hsl(var(--lavender))]" />,
      bg: "bg-[hsl(var(--lavender)/0.15)] dark:bg-[hsl(var(--lavender)/0.1)]"
    },
    {
      label: "Collaborations",
      value: stats.collaborations,
      icon: <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      bg: "bg-indigo-50 dark:bg-indigo-900/10"
    },
    {
      label: "Total Attempts",
      value: stats.attempts,
      icon: <History className="w-6 h-6 text-emerald-600 dark:text-[hsl(var(--mint))]" />,
      bg: "bg-[hsl(var(--mint)/0.15)] dark:bg-[hsl(var(--mint)/0.1)]"
    },
    {
      label: "Average Score",
      value: `${stats.avgScore}%`,
      icon: <Brain className="w-6 h-6 text-amber-600 dark:text-[hsl(var(--accent))]" />,
      bg: "bg-[hsl(var(--accent)/0.15)] dark:bg-[hsl(var(--accent)/0.1)]"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-card p-6 rounded-3xl shadow-sm border border-border flex items-center gap-5">
          <div className={`${card.bg} w-14 h-14 rounded-2xl flex items-center justify-center`}>
            {card.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
            <p className="text-2xl font-black text-foreground">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
