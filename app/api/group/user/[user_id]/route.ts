import { NextResponse } from "next/server";
import prisma from "@/client";

// api for getting all groups particular to user
export async function GET(
  req: Request,
  { params }: { params: { user_id: string } }
) {
  const { user_id } = params;
  console.log("user_id", user_id);
  if (!user_id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const userGroups = await prisma.groups.findMany({
      where: {
        users: {
          some: { user_id: user_id },
        },
        deleted_at: null,
      },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(userGroups, { status: 200 });
  } catch (error) {
    console.error("Error fetching group of the userF:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}
