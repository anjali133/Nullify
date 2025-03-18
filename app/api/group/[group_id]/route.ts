import { NextResponse } from "next/server";
import prisma from "@/client";

// api for getting all/single groups particular to user
export async function GET(
  req: Request,
  { params }: { params: { group_id?: number } }
) {
  console.log("Calling ");
  const { group_id } = params;
  console.log("group_id", typeof group_id);
  if (!group_id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  try {
    console.log("group_id", group_id);
    const group = await prisma.groups.findUnique({
      where: {
        group_id: Number(group_id),
      },
    });
    return NextResponse.json(group, { status: 200 });
  } catch (error) {
    console.error("Error fetching group of the userF:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}
