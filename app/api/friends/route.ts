import { NextResponse } from "next/server";
import prisma from "@/client";


// add new friend and send a friend request
export async function POST(req: Request) {
  try {
    const { user_id1, user_id2 } = await req.json();

    if (!user_id1 || !user_id2) {
      return NextResponse.json(
        { error: "Both user_id1 and user_id2 are required" },
        { status: 400 }
      );
    }

    if (user_id1 === user_id2) {
      return NextResponse.json(
        { error: "You cannot send a friend request to yourself" },
        { status: 400 }
      );
    }

    const existingFriendship = await prisma.friends.findFirst({
      where: {
        OR: [
          { user_id1, user_id2 },
          { user_id1: user_id2, user_id2: user_id1 },
        ],
      },
    });

    if (existingFriendship) {
      return NextResponse.json(
        { error: "Friendship already exists or pending" },
        { status: 400 }
      );
    }

    const newFriendship = await prisma.friends.create({
      data: {
        user_id1,
        user_id2,
        balances: 0,
        status: "pending",
      },
    });

    return NextResponse.json(
      {
        message: "Friend request sent successfully",
        friendship: newFriendship,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in API:", error.message);
      return NextResponse.json(
        { error: "Failed to create friendship" },
        { status: 500 }
      );
    }
  }
}

// get all friends of a user
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const friends = await prisma.friends.findMany({
      where: {
        OR: [{ user_id1: userId }, { user_id2: userId }],
      },
      include: {
        user1: true,
        user2: true,
      },
    });

    const friendList = friends.map((friend) => {
      const isUser1 = friend.user_id1 === userId;

      return {
        friendship_id: friend?.friendship_id,
        user_id2: friend?.user_id2,
        user_id1: friend?.user_id1,
        name: isUser1 ? friend.user2.name : friend.user1.name,
        email: isUser1 ? friend.user2.email : friend.user1.email,
        status: friend.status,
      };
    });

    return NextResponse.json(friendList, { status: 200 });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json(
      { error: "Failed to fetch friends" },
      { status: 500 }
    );
  }
}
