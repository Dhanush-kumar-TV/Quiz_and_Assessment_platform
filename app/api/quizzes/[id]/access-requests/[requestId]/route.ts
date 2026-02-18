import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Quiz from "@/lib/models/Quiz";
import QuizAccessRequest from "@/lib/models/QuizAccessRequest";
import QuizRole from "@/lib/models/QuizRole";
import { checkQuizPermission, Permission } from "@/lib/permissions";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; requestId: string } }
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

    const body = await req.json().catch(() => ({}));
    const action = body?.action;
    if (action !== "approve" && action !== "deny") {
      return NextResponse.json(
        { message: "Invalid action. Use 'approve' or 'deny'." },
        { status: 400 }
      );
    }

    const requestDoc = await QuizAccessRequest.findById(params.requestId);
    if (!requestDoc) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    if (requestDoc.quizId.toString() !== quiz._id.toString()) {
      return NextResponse.json({ message: "Request does not match quiz" }, { status: 400 });
    }

    const now = new Date();
    requestDoc.status = action === "approve" ? "approved" : "denied";
    requestDoc.decidedBy = userId;
    requestDoc.decidedAt = now;
    await requestDoc.save();

    if (action === "approve") {
      // Grant TAKE_QUIZ by assigning 'student' role (do not override higher roles)
      await QuizRole.findOneAndUpdate(
        { quizId: quiz._id, userId: requestDoc.userId },
        {
          $setOnInsert: {
            quizId: quiz._id,
            userId: requestDoc.userId,
            role: "student",
            assignedBy: userId,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } else {
      // Deny: remove student role if it exists (keeps teacher/creator roles intact)
      await QuizRole.deleteOne({ quizId: quiz._id, userId: requestDoc.userId, role: "student" });
    }

    return NextResponse.json(requestDoc);
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}

