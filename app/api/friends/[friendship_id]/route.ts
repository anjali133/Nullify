import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// get single friendship by using friendship_id
export async function GET(
  req: Request,
  { params }: { params: { friendship_id: string } }
) {
  const { friendship_id } = params;

  if (!friendship_id) {
    return NextResponse.json(
      { error: "Friendship ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch friendship data by friendship_id
    const friendship = await prisma.friends.findUnique({
      where: { friendship_id: parseInt(friendship_id) },
      include: {
        user1: true, // Include details of the first user
        user2: true, // Include details of the second user
      },
    });

    if (!friendship) {
      return NextResponse.json(
        { error: "Friendship not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        friendship_id: friendship.friendship_id,
        user1: {
          user_id: friendship.user1.user_id,
          name: friendship.user1.name,
          email: friendship.user1.email,
        },
        user2: {
          user_id: friendship.user2.user_id,
          name: friendship.user2.name,
          email: friendship.user2.email,
        },
        balances: friendship.balances,
        status: friendship.status,
        created_at: friendship.created_at,
        updated_at: friendship.updated_at,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching friendship by friendship_id:", error);
    return NextResponse.json(
      { error: "Failed to fetch friendship" },
      { status: 500 }
    );
  }
}
