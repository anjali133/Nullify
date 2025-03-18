import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function POST(req: Request) {
    try {
      const { user_id1, user_id2 } = await req.json();
  
     // console.log("Input data:", { user_id1, user_id2 });
  
      if (!user_id1 || !user_id2) {
        return NextResponse.json(
          { error: "Both user_id1 and user_id2 are required" },
          { status: 400 }
        );
      }
  
      const updatedFriendship = await prisma.friends.updateMany({
        where: {
          user_id1,
          user_id2,
          status: "pending",
        },
        data: {
          status: "accepted",
        },
      });
  
     // console.log("Update result:", updatedFriendship);
  
      if (updatedFriendship.count === 0) {
        return NextResponse.json(
          { error: "No pending friend request found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { message: "Friend request accepted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error accepting friend request:", error);
      return NextResponse.json(
        { error: "Failed to accept friend request" },
        { status: 500 }
      );
    }
  }
  
  