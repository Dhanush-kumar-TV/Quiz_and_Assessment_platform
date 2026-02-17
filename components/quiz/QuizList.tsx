import QuizCard from "./QuizCard";

export default function QuizList({ quizzes }: { quizzes: any[] }) {
  if (quizzes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">No quizzes found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz._id} quiz={quiz} />
      ))}
    </div>
  );
}
