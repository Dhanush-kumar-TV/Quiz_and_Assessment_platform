import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Quiz from "@/lib/models/Quiz";
import { checkQuizPermission, Permission } from "@/lib/permissions";
import bcrypt from "bcryptjs";

async function isPasscodeValid(stored: string | undefined | null, provided: string) {
  const pass = (provided || "").trim();
  if (!pass) return false;
  const storedPass = (typeof stored === "string") ? stored : "";
  if (!storedPass) return false;
  // Backward compatible: support legacy plaintext + bcrypt hashes
  if (storedPass.startsWith("$2")) {
    return await bcrypt.compare(pass, storedPass);
  }
  return storedPass === pass;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    // Robustly find the quiz, handling invalid IDs
    let quiz;
    try {
      quiz = await Quiz.findById(params.id).lean();
    } catch {
      return NextResponse.json({ message: "Invalid Quiz ID" }, { status: 400 });
    }
    
    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as { id: string }).id : null;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission to view full quiz (Teacher/Creator) or just take it (Student)
    const isCreator = quiz.createdBy.toString() === userId;
    const canViewResults = isCreator || await checkQuizPermission(userId, params.id, Permission.VIEW_RESULTS);
    const hasRoleToTake = isCreator || await checkQuizPermission(userId, params.id, Permission.TAKE_QUIZ);

    // Access rules:
    // - approval: only users with TAKE_QUIZ role (or creator/teacher) can take
    // - public/registration: any logged-in user can take if published
    // - password: requires correct passcode
    const providedPasscode = req.headers.get("x-quiz-passcode") || "";
    const passOk = quiz.accessType === "password"
      ? await isPasscodeValid(quiz.password, providedPasscode)
      : true;

    const canTakeByAccessType =
      Boolean(quiz.isPublished) &&
      quiz.accessType !== "approval" &&
      (quiz.accessType !== "password" || passOk);
    const canTakeQuiz = hasRoleToTake || canTakeByAccessType;

    if (!canViewResults && !canTakeQuiz) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // If not creator/teacher, hide correct answers from questions
    if (!canViewResults && quiz.questions) {
      quiz.questions = quiz.questions.map((q: { options?: { isCorrect: boolean }[] }) => ({
        ...q,
        options: q.options ? q.options.map((opt: { isCorrect: boolean }) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { isCorrect, ...rest } = opt;
          return rest;
        }) : [],
      }));
    }

    return NextResponse.json(quiz);
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const userId = (session.user as { id: string }).id;
    const isCreator = quiz.createdBy.toString() === userId;
    const hasPermission = isCreator || await checkQuizPermission(userId, params.id, Permission.EDIT_QUIZ);

    if (!hasPermission) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    
    // Remove immutable fields from body
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, createdAt, updatedAt, createdBy, ...updateData } = body;

    if (updateData.questions) {
      updateData.totalPoints = (updateData.questions as { points?: number }[]).reduce((acc: number, q) => acc + Number(q.points || 1), 0);
    }

    // Handle password hashing updates safely
    if (updateData.accessType === "password") {
      // If user didn't enter a new password, keep existing stored password
      if (typeof updateData.password === "string") {
        const next = updateData.password.trim();
        if (next) {
          updateData.password = await bcrypt.hash(next, 10);
        } else {
             // If attempting to set/keep password access without a new password,
             // ensure there is an OLD password.
             if (!quiz.password) {
                 return NextResponse.json({ message: "Password is required when enabling password access" }, { status: 400 });
             }
          delete updateData.password;
        }
      }
    } else if (updateData.accessType) {
      // If switching away from password access, clear stored password
      updateData.password = "";
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(params.id, updateData, { new: true });

    return NextResponse.json(updatedQuiz);
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const userId = (session.user as { id: string }).id;
    const isCreator = quiz.createdBy.toString() === userId;
    const hasPermission = isCreator || await checkQuizPermission(userId, params.id, Permission.DELETE_QUIZ);

    if (!hasPermission) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Quiz.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Quiz deleted" });
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}
