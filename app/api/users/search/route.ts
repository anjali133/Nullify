import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("email"); 

  if (!search) {
    return NextResponse.json(
      { error: "Search parameter is required" },
      { status: 400 }
    );
  }

  try {
    const users = await prisma.users.findMany({
      where: {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { name: { contains: search, mode: "insensitive" } },
        ],
      },
      select: {
        user_id: true,
        name: true,
        email: true,
        // avatarColor: true,
      },
    });

  //  console.log(users);

    if (users.length === 0) {
      return NextResponse.json({ message: "No users found" }, { status: 404 });
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in API:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }
  }
}
