import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Attempt from "@/lib/models/Attempt";
import User from "@/lib/models/User";

export async function GET() {
    try {
        await connectToDatabase();
        
        // Aggregate to find active users based on attempts
        // We'll calculate total score, average percentage, and attempt count
        const leaderData = await Attempt.aggregate([
            {
                $group: {
                    _id: "$userId",
                    totalScore: { $sum: "$score" },
                    avgPercentage: { $avg: "$percentage" },
                    attemptCount: { $sum: 1 }
                }
            },
            { $sort: { totalScore: -1 } },
            { $limit: 10 }
        ]);

        // Fetch user names and images for these IDs
        const userIds = leaderData.map(d => d._id);
        const users = await User.find({ _id: { $in: userIds } }, 'name image email').lean();

        const leaderboard = leaderData.map(stat => {
            const user = users.find(u => u._id.toString() === stat._id.toString());
            return {
                ...stat,
                name: user?.name || "Unknown User",
                image: user?.image || "",
                email: user?.email || ""
            };
        });

        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error("Leaderboard API Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
