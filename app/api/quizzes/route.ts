import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Quiz from "@/lib/models/Quiz";
import QuizRole from "@/lib/models/QuizRole";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const publicOnly = searchParams.get("publicOnly") === "true";
    
    let query: Record<string, unknown> = {};
    
    if (publicOnly || !userId) {
      // Public view: only show published quizzes
      query = { isPublished: true };
    } else if (userId) {
      // User-specific view: show quizzes where user has role OR created, but still filter published for public visibility
      const roles = await QuizRole.find({ userId });
      const quizIds = roles.map(r => r.quizId);
      query = { 
        $or: [
          { _id: { $in: quizIds } }, 
          { createdBy: userId }
        ]
      };
    }

    const quizzes = await Quiz.find(query).sort({ createdAt: -1 });
    return NextResponse.json(quizzes);
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      title, 
      description, 
      questions, 
      isPublished, 
      timeLimit, 
      showScore,
      shuffleQuestions,
      shuffleOptions,
      maxAttempts,
      emailResults,
      accessType,
      password,
      registrationFields
    } = body;

    if (!title || !description || !questions || questions.length === 0) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await connectToDatabase();

    const totalPoints = questions.reduce((acc: number, q: { points?: number }) => acc + (q.points || 1), 0);

    const publicUrl = `/q/${nanoid(10)}`;

    const quiz = await Quiz.create({
      title,
      description,
      questions,
      totalPoints,
      timeLimit: Number(timeLimit) || 0,
      isPublished: isPublished !== undefined ? isPublished : true, // Default to true for new quizzes
      showScore: showScore !== undefined ? showScore : true,
      shuffleQuestions: shuffleQuestions || false,
      shuffleOptions: shuffleOptions || false,
      maxAttempts: Number(maxAttempts) || 0,
      emailResults: emailResults || false,
      accessType: accessType || 'public',
      password:
        (accessType === "password" && typeof password === "string" && password.trim())
          ? await bcrypt.hash(password.trim(), 10)
          : "",
      registrationFields: registrationFields || [],
      createdBy: (session.user as { id: string }).id,
      publicUrl,
      embedCode: `<iframe src="${process.env.NEXTAUTH_URL}${publicUrl}" width="100%" height="600px" frameborder="0"></iframe>`
    });

    // 2. Automatically assign Creator role
    await QuizRole.create({
      quizId: quiz._id,
      userId: (session.user as { id: string }).id,
      role: 'creator',
      assignedBy: (session.user as { id: string }).id,
    });

    console.log("DEBUG: POST /api/quizzes - Created Quiz & Role");

    return NextResponse.json(quiz, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}
