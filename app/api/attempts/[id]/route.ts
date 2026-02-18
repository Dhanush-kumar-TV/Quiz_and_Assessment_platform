import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Attempt from "@/lib/models/Attempt";

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
    const attempt = await Attempt.findById(params.id).populate("quizId");
    
    if (!attempt) {
      return NextResponse.json({ message: "Attempt not found" }, { status: 404 });
    }

    // Check if user is the one who took the quiz or the creator of the quiz
    const isOwner = (session.user as { id: string }).id === attempt.userId.toString();
    const quiz = attempt.quizId as { createdBy: { toString: () => string } };
    const isCreator = (session.user as { id: string }).id === quiz.createdBy.toString();

    if (!isOwner && !isCreator) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(attempt);
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}
