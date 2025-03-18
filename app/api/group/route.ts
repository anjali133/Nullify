import { NextResponse } from "next/server";
import prisma from "@/client";
import { GroupMemberDetails } from "@/type";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const groupId = searchParams.get("groupId");

//   if (!groupId) {
//     return NextResponse.json(
//       { error: "Group ID is required" },
//       { status: 400 }
//     );
//   }

//   try {
//     const group = await prisma.groups.findUnique({
//       where: { group_id: groupId },
//     });

//     if (!group) {
//       return NextResponse.json({ error: "Group not found" }, { status: 404 });
//     }

//     return NextResponse.json(group, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching group by group_id:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch group" },
//       { status: 500 }
//     );
//   }
// }

// Api for creating group
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { group_name, selected_friends, simplify_debt } = body;
    const memberDetails = {} as GroupMemberDetails;
    console.log(selected_friends);
    selected_friends.map((friendInfo: { id: string }) => {
      memberDetails[friendInfo.id] = {
        amount: 0,
        name: friendInfo.name,
      };
    });
    if (!group_name || !selected_friends || !simplify_debt) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }
    const newGroup = await prisma.groups.create({
      data: {
        name: group_name,
        member_details: memberDetails,
        simplify_debt: simplify_debt,
        users: {
          connect: selected_friends.map((friendInfo: { id: string }) => ({
            user_id: friendInfo.id,
          })),
        },
      },
    });

    return NextResponse.json(newGroup, { status: 200 });
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}
