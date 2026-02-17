import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Attempt from "@/lib/models/Attempt";
import Quiz from "@/lib/models/Quiz";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const quiz = await Quiz.findById(params.id);
    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    // Ensure only the creator can see the reports
    if ((session.user as any).id !== quiz.createdBy.toString()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const attempts = await Attempt.find({ quizId: params.id }).populate("userId", "name email image");

    // Aggregate stats
    const stats = {
        totalAttempts: attempts.length,
        completedAttempts: attempts.filter(a => a.status === 'completed').length,
        activeAttempts: attempts.filter(a => a.status === 'active').length,
        averagePercentage: attempts.length > 0 
            ? attempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / attempts.length 
            : 0,
        categoryPerformance: {} as Record<string, { total: number, score: number, count: number }>
    };

    attempts.forEach(attempt => {
        if (attempt.categoryScores) {
            for (const [cat, score] of attempt.categoryScores.entries()) {
                if (!stats.categoryPerformance[cat]) {
                    stats.categoryPerformance[cat] = { total: 0, score: 0, count: 0 };
                }
                stats.categoryPerformance[cat].score += score;
                stats.categoryPerformance[cat].count += 1;
            }
        }
    });

    return NextResponse.json({ quiz, attempts, stats });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
