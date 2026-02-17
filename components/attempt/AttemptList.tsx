import AttemptCard from "./AttemptCard";

export default function AttemptList({ attempts }: { attempts: any[] }) {
  if (attempts.length === 0) {
    return (
      <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
        <p className="text-muted-foreground">You haven&apos;t attempted any quizzes yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {attempts.map((attempt) => (
        <AttemptCard key={attempt._id} attempt={attempt} />
      ))}
    </div>
  );
}
