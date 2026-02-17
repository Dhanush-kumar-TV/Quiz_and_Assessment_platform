import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quiz from "@/lib/models/Quiz";

export async function GET(
  req: Request,
  { params }: { params: { nanoid: string } }
) {
  try {
    await connectToDatabase();
    
    // Find quiz by the nanoid portion of the publicUrl
    const quiz = await Quiz.findOne({ 
      publicUrl: `/q/${params.nanoid}` 
    }).lean();

    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    // Return only necessary non-sensitive info for the landing gate
    const safeQuiz = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      accessType: quiz.accessType,
      registrationFields: quiz.registrationFields,
      timeLimit: quiz.timeLimit,
      questionsCount: quiz.questions?.length || 0,
    };

    return NextResponse.json(safeQuiz);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
