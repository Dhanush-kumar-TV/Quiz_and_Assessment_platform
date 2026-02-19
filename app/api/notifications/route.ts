import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Notification from "@/lib/models/Notification";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const userId = (session.user as { id: string }).id;

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(50) // Limit to last 50 notifications
      .lean();

    const unreadCount = await Notification.countDocuments({ recipient: userId, read: false });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const userId = (session.user as { id: string }).id;
    const { notificationId, markAllRead } = await req.json();

    if (markAllRead) {
      await Notification.updateMany({ recipient: userId, read: false }, { read: true });
      return NextResponse.json({ message: "All marked as read" });
    }

    if (notificationId) {
      await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId }, // Ensure ownership
        { read: true }
      );
      return NextResponse.json({ message: "Marked as read" });
    }

    return NextResponse.json({ message: "No action taken" }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}
