import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { user_id1, user_id2 } = await req.json();

    if (!user_id1 || !user_id2) {
      return NextResponse.json(
        { error: "Both user_id1 and user_id2 are required" },
        { status: 400 }
      );
    }

    const updatedFriendshipStatus = await prisma.friends.updateMany({
      where: {
        OR: [
          { user_id1, user_id2 },
          { user_id1: user_id2, user_id2: user_id1 },
        ],
      },
      data: {
        status: "declined", 
      },
    });

    if (updatedFriendshipStatus.count === 0) {
      return NextResponse.json(
        { error: "No friendship record found to update" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Friendship marked as removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking friendship as removed:", error);
    return NextResponse.json(
      { error: "Failed to mark friendship as removed" },
      { status: 500 }
    );
  }
}
