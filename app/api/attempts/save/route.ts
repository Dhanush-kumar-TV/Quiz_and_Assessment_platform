import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Attempt from "@/lib/models/Attempt";
import Quiz from "@/lib/models/Quiz";
import { checkQuizPermission, Permission } from "@/lib/permissions";
import bcrypt from "bcryptjs";

async function isPasscodeValid(stored: any, provided: string) {
  const pass = (provided || "").trim();
  if (!pass) return false;
  const storedPass = typeof stored === "string" ? stored : "";
  if (!storedPass) return false;
  if (storedPass.startsWith("$2")) {
    return await bcrypt.compare(pass, storedPass);
  }
  return storedPass === pass;
}

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

    // Enforce access rules (prevents direct save bypass)
    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }
    const isCreator = quiz.createdBy.toString() === userId;
    const hasRoleToTake = isCreator || await checkQuizPermission(userId, quizId, Permission.TAKE_QUIZ);
    const providedPasscode = req.headers.get("x-quiz-passcode") || "";
    const passOk = quiz.accessType === "password"
      ? await isPasscodeValid(quiz.password, providedPasscode)
      : true;
    const canTakeByAccessType =
      Boolean(quiz.isPublished) &&
      quiz.accessType !== "approval" &&
      (quiz.accessType !== "password" || passOk);
    if (!hasRoleToTake && !canTakeByAccessType) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

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
