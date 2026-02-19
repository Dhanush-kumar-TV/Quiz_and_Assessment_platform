import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Quiz from "@/lib/models/Quiz";
import QuizAccessRequest from "@/lib/models/QuizAccessRequest";
import { checkQuizPermission, Permission } from "@/lib/permissions";
import Notification from "@/lib/models/Notification";

export async function POST(
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

    if (!quiz.isPublished) {
      return NextResponse.json({ message: "Quiz is not published" }, { status: 403 });
    }

    if (quiz.accessType !== "approval") {
      return NextResponse.json(
        { message: "This quiz does not require approval" },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const nameFromBody = typeof body?.name === "string" ? body.name.trim() : "";
    const fallbackName =
      (session.user as { name?: string; email?: string }).name || (session.user as { name?: string; email?: string }).email || "Participant";
    const name = nameFromBody || fallbackName;

    const userId = (session.user as { id: string }).id;

    const requestDoc = await QuizAccessRequest.findOneAndUpdate(
      { quizId: quiz._id, userId },
      {
        name,
        status: "pending",
        decidedBy: null,
        decidedAt: null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Create Notification for the Quiz Creator
    if (quiz.createdBy.toString() !== userId) {
        await Notification.create({
            recipient: quiz.createdBy,
            type: "access_request",
            title: "New Access Request",
            message: `${name} has requested access to "${quiz.title}"`,
            link: `/quizzes/${quiz._id}/access`,
            read: false,
        });
    }

    return NextResponse.json(requestDoc, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}

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

    const userId = (session.user as { id: string }).id;
    const isCreator = quiz.createdBy.toString() === userId;
    const canManage =
      isCreator || (await checkQuizPermission(userId, params.id, Permission.MANAGE_ROLES));

    if (!canManage) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const requests = await QuizAccessRequest.find({
      quizId: quiz._id,
      status: "pending",
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(requests);
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}

