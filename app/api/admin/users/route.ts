import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const users = await User.find({}).sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId, role, status } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    await connectToDatabase();
    
    const update: any = {};
    if (role) update.role = role;
    if (status) update.status = status;

    const user = await User.findByIdAndUpdate(userId, update, { new: true });

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
