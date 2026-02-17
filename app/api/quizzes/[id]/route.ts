import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Quiz from "@/lib/models/Quiz";
import { checkQuizPermission, Permission } from "@/lib/permissions";

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
    } catch (e) {
      return NextResponse.json({ message: "Invalid Quiz ID" }, { status: 400 });
    }
    
    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as any).id : null;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission to view full quiz (Teacher/Creator) or just take it (Student)
    const isCreator = quiz.createdBy.toString() === userId;
    const canViewResults = isCreator || await checkQuizPermission(userId, params.id, Permission.VIEW_RESULTS);
    const canTakeQuiz = isCreator || await checkQuizPermission(userId, params.id, Permission.TAKE_QUIZ);

    if (!canViewResults && !canTakeQuiz) {
      // If it's a public quiz, they might have TAKE_QUIZ implicitly, but for now we follow the roles
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // If not creator/teacher, hide correct answers from questions
    if (!canViewResults && quiz.questions) {
      quiz.questions = quiz.questions.map((q: any) => ({
        ...q,
        options: q.options ? q.options.map((opt: any) => {
          const { isCorrect, ...rest } = opt;
          return rest;
        }) : [],
      }));
    }

    return NextResponse.json(quiz);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
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

    const userId = (session.user as any).id;
    const isCreator = quiz.createdBy.toString() === userId;
    const hasPermission = isCreator || await checkQuizPermission(userId, params.id, Permission.EDIT_QUIZ);

    if (!hasPermission) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    
    // Remove immutable fields from body
    const { _id, createdAt, updatedAt, createdBy, ...updateData } = body;

    if (updateData.questions) {
      updateData.totalPoints = updateData.questions.reduce((acc: number, q: any) => acc + Number(q.points || 1), 0);
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(params.id, updateData, { new: true });

    return NextResponse.json(updatedQuiz);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
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

    const userId = (session.user as any).id;
    const isCreator = quiz.createdBy.toString() === userId;
    const hasPermission = isCreator || await checkQuizPermission(userId, params.id, Permission.DELETE_QUIZ);

    if (!hasPermission) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Quiz.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Quiz deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
