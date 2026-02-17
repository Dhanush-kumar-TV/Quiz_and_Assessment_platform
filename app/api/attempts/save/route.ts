import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Attempt from "@/lib/models/Attempt";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { quizId, answers, timeTaken } = await req.json();

    if (!quizId) {
      return NextResponse.json({ message: "Missing quizId" }, { status: 400 });
    }

    await connectToDatabase();
    const userId = (session.user as any).id;

    // Find and update or create an 'active' attempt
    const attempt = await Attempt.findOneAndUpdate(
      { quizId, userId, status: 'active' },
      {
        answers,
        timeTaken,
        status: 'active',
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(attempt, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
