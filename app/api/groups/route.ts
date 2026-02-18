import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Group from "@/lib/models/Group";
import User from "@/lib/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    const userId = (session.user as { id: string }).id;

    await connectToDatabase();
    
    let groups;
    if (userRole === 'admin') {
      groups = await Group.find({}).populate("trainer", "name email").populate("members", "name email");
    } else if (userRole === 'trainer') {
      groups = await Group.find({ trainer: userId }).populate("members", "name email");
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(groups);
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ message: "Only admins can create groups" }, { status: 401 });
    }

    const { name, description, trainerId, memberIds } = await req.json();

    if (!name || !trainerId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();
    
    const newGroup = await Group.create({
      name,
      description,
      trainer: trainerId,
      members: memberIds || []
    });

    // Update users to include this group
    if (memberIds && memberIds.length > 0) {
        await User.updateMany(
            { _id: { $in: memberIds } },
            { $addToSet: { groups: newGroup._id } }
        );
    }

    return NextResponse.json(newGroup);
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  
      const { groupId, name, description, trainerId, memberIds } = await req.json();
      const userRole = (session.user as { role?: string }).role;
      const userId = (session.user as { id: string }).id;
  
      await connectToDatabase();
      
      const group = await Group.findById(groupId);
      if (!group) return NextResponse.json({ message: "Group not found" }, { status: 404 });
  
      // Permission check
      if (userRole !== 'admin' && group.trainer.toString() !== userId) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
  
      const update: { name?: string; description?: string; trainer?: string; members?: string[] } = {};
      if (name) update.name = name;
      if (description) update.description = description;
      if (trainerId && userRole === 'admin') update.trainer = trainerId;
      if (memberIds) update.members = memberIds;
  
      const updatedGroup = await Group.findByIdAndUpdate(groupId, update, { new: true });

      // Sync user memberships if members changed
      if (memberIds) {
          // Remove from old members
          await User.updateMany(
              { groups: groupId },
              { $pull: { groups: groupId } }
          );
          // Add to new members
          await User.updateMany(
              { _id: { $in: memberIds } },
              { $addToSet: { groups: groupId } }
          );
      }
  
      return NextResponse.json(updatedGroup);
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}
