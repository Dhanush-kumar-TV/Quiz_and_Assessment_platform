import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import QuizRole from "@/lib/models/QuizRole";
import Quiz from "@/lib/models/Quiz";
import { checkQuizPermission, Permission } from "@/lib/permissions";
import User from "@/lib/models/User";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    const userId = (session.user as { id: string }).id;
    const quiz = await Quiz.findById(params.id);
    if (!quiz) return NextResponse.json({ message: "Quiz not found" }, { status: 404 });

    const isCreator = quiz.createdBy.toString() === userId;
    const hasPermission = isCreator || await checkQuizPermission(userId, params.id, Permission.MANAGE_ROLES);

    if (!hasPermission) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    let roles = await QuizRole.find({ quizId: params.id }).populate('userId', 'name email');
    console.log(`[GET Roles] Found ${roles.length} roles in DB for quiz: ${params.id}`);
    
    roles = JSON.parse(JSON.stringify(roles));

    // Check if creator is already in roles
    const hasCreator = roles.some((r: { userId?: { _id?: string }; role?: string }) => r.userId?._id?.toString() === quiz.createdBy.toString() || r.role === 'creator');
    
    if (!hasCreator) {
      const creator = await User.findById(quiz.createdBy).select('name email');
      if (creator) {
        roles.unshift({
          _id: `creator-${quiz._id}`,
          quizId: quiz._id,
          userId: {
            _id: creator._id,
            name: creator.name,
            email: creator.email
          },
          role: 'creator',
          createdAt: quiz.createdAt
        });
        console.log(`[GET Roles] Injected creator manually for display.`);
      }
    }

    return NextResponse.json(roles);
  } catch (error: unknown) {
    console.error("[GET Roles Error]", error);
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { email, role } = body;

    console.log(`[POST Role] Attempting to add ${email} as ${role} for quiz ${params.id}`);

    if (!email || !role) return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    await connectToDatabase();

    const userId = (session.user as { id: string }).id;
    const quiz = await Quiz.findById(params.id);
    if (!quiz) return NextResponse.json({ message: "Quiz not found" }, { status: 404 });

    const isCreator = quiz.createdBy.toString() === userId;
    const hasPermission = isCreator || await checkQuizPermission(userId, params.id, Permission.MANAGE_ROLES);

    if (!hasPermission) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Find the user to assign - Use case-insensitive search for email
    const userToAssign = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (!userToAssign) {
        console.log(`[POST Role] User with email ${email} not found in database.`);
        return NextResponse.json({ message: "User not found. Please ensure the user has already registered on the platform." }, { status: 404 });
    }

    console.log(`[POST Role] Found user: ${userToAssign.name} (${userToAssign._id})`);

    // Create or update role
    const updatedRole = await QuizRole.findOneAndUpdate(
      { quizId: params.id, userId: userToAssign._id },
      { role, assignedBy: (session.user as { id: string }).id },
      { upsert: true, new: true }
    );

    console.log(`[POST Role] Successfully assigned role ${role} to ${userToAssign.email}`);

    return NextResponse.json(updatedRole);
  } catch (error: unknown) {
    console.error("[POST Role Error]", error);
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const userIdToRemove = searchParams.get("userId");

    if (!userIdToRemove) return NextResponse.json({ message: "Missing userId" }, { status: 400 });

    await connectToDatabase();

    const userId = (session.user as { id: string }).id;
    const quiz = await Quiz.findById(params.id);
    if (!quiz) return NextResponse.json({ message: "Quiz not found" }, { status: 404 });

    const isCreator = quiz.createdBy.toString() === userId;
    const hasPermission = isCreator || await checkQuizPermission(userId, params.id, Permission.MANAGE_ROLES);

    if (!hasPermission) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Prevent creator from removing themselves
    const roleToRemove = await QuizRole.findOne({ quizId: params.id, userId: userIdToRemove });
    if (roleToRemove && roleToRemove.role === 'creator') {
      return NextResponse.json({ message: "Cannot remove the creator" }, { status: 400 });
    }

    await QuizRole.deleteOne({ quizId: params.id, userId: userIdToRemove });
    console.log(`[DELETE Role] Removed collaborator ${userIdToRemove} from quiz ${params.id}`);
    
    return NextResponse.json({ message: "Role removed" });
  } catch (error: unknown) {
    console.error("[DELETE Role Error]", error);
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}
