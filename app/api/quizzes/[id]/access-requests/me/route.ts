import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Quiz from "@/lib/models/Quiz";
import QuizAccessRequest from "@/lib/models/QuizAccessRequest";
import QuizRole from "@/lib/models/QuizRole";

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
    const quiz = await Quiz.findById(params.id).lean();
    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    const userId = (session.user as any).id;
    const requestDoc = await QuizAccessRequest.findOne({ quizId: quiz._id, userId }).lean();
    const roleDoc = await QuizRole.findOne({ quizId: quiz._id, userId }).lean();

    return NextResponse.json({
      requestStatus: requestDoc?.status || "none",
      requestName: requestDoc?.name || null,
      role: roleDoc?.role || null,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

