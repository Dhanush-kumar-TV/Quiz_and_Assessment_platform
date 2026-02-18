import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Attempt from "@/lib/models/Attempt";
import Quiz from "@/lib/models/Quiz";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Authorization: Only the quiz creator can see all attempts for their quiz
    const quiz = await Quiz.findById(params.id);
    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    if (quiz.createdBy.toString() !== (session.user as { id: string }).id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const attempts = await Attempt.find({ quizId: params.id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(attempts);
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}
