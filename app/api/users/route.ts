import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;

export async function GET() {
  try {
    const tokenResponse = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `https://${AUTH0_DOMAIN}/api/v2/`,
        grant_type: "client_credentials",
        nonce: Date.now().toString(),
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error("Error fetching Auth0 access token:", error);
      throw new Error("Failed to fetch Auth0 access token.");
    }

    const { access_token } = await tokenResponse.json();

    const usersResponse = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });
    if (!usersResponse.ok) {
      const error = await usersResponse.json();
      console.error("Error fetching users from Auth0:", error);
      throw new Error("Failed to fetch users from Auth0.");
    }

    const auth0Users = await usersResponse.json();

    const createdOrUpdatedUsers = await Promise.all(
      auth0Users.map(async (user: any) => {
        const userId = user.user_id.split("|")[1];
        const userUuid = `${userId}_${user.nickname}`;

        const existingUser = await prisma.users.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          return prisma.users.update({
            where: { email: user.email },
            data: {
              name: user.nickname,
              uuid: userUuid,
              email_verified: user.email_verified,
            },
          });
        } else {
          return prisma.users.create({
            data: {
              user_id: userId,
              name: user.nickname,
              email: user.email,
              uuid: userUuid,
              email_verified: user.email_verified,
            },
          });
        }
      })
    );
   // console.log(createdOrUpdatedUsers)

    return NextResponse.json({ users: createdOrUpdatedUsers }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in API:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch or store users" },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}
