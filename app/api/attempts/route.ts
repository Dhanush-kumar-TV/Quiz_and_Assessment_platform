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

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const attempts = await Attempt.find({ userId: (session.user as any).id })
      .populate("quizId", "title")
      .sort({ createdAt: -1 });

    return NextResponse.json(attempts);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { quizId, answers, timeTaken } = await req.json();

    if (!quizId || !answers) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await connectToDatabase();
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    const userId = (session.user as any).id;

    // Enforce access rules (prevents direct POST bypass)
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

    // Check attempt limits
    const existingAttemptCount = await Attempt.countDocuments({ quizId, userId, status: 'completed' });
    if (quiz.maxAttempts > 0 && existingAttemptCount >= quiz.maxAttempts) {
      return NextResponse.json({ message: "Maximum attempts reached for this quiz" }, { status: 403 });
    }

    // Scoring logic + Category scoring
    let score = 0;
    const totalPoints = quiz.totalPoints;
    const categoryScores: Record<string, number> = {};

    quiz.questions.forEach((question: any, index: number) => {
      const category = question.category || "General";
      if (!categoryScores[category]) categoryScores[category] = 0;

      const userAnswer = answers.find((a: any) => a.questionIndex === index);
      if (userAnswer) {
        const selectedOption = question.options[userAnswer.selectedOptionIndex];
        if (selectedOption && selectedOption.isCorrect) {
          const points = question.points || 1;
          score += points;
          categoryScores[category] += points;
        }
      }
    });

    const percentage = (score / totalPoints) * 100;

    const attempt = await Attempt.create({
      quizId,
      userId,
      answers,
      score,
      totalPoints,
      percentage,
      timeTaken,
      status: 'completed',
      completedAt: new Date(),
      categoryScores,
      attemptNumber: existingAttemptCount + 1,
    });

    const populatedAttempt = await Attempt.findById(attempt._id).populate("quizId");

    return NextResponse.json(populatedAttempt, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
