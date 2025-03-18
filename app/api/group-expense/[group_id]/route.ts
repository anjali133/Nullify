import { NextResponse } from "next/server";
import prisma from "@/client";
import { PaymentDetails, Settlement } from "@/type";
import { Prisma } from "@prisma/client";

export async function GET(
    req: Request,
    { params }: { params: { group_id?: number } }
  ) {
    const { group_id } = params;
    if (!group_id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    try {
      const groupExpenses = await prisma.expenses.findMany({
        where: {
            group_id: Number(group_id),
        },
        orderBy: {
          created_at: "desc",
        }
      });
      return NextResponse.json(groupExpenses, { status: 200 });
    } catch (error) {
      console.error("Error fetching group of the userF:", error);
      return NextResponse.json(
        { error: "Failed to fetch groups" },
        { status: 500 }
      );
    }
  }
  