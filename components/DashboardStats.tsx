import { Brain, History, Target } from "lucide-react";

interface DashboardStatsData { created: number; collaborations: number; attempts: number; avgScore: string | number; }

export default function DashboardStats({ stats }: { stats: DashboardStatsData | null }) {
  if (!stats) return null;
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-card p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-border flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-5">
          <div className={`${card.bg} w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0`}>
            {card.icon}
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">{card.label}</p>
            <p className="text-lg md:text-2xl font-black text-foreground">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
