import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export const GET = handleAuth({
  login: handleLogin((req) => {
    //@ts-ignore
    const referer = req.headers.get("referer");
    return {
      returnTo: referer || "/",
    };
  }),
  onError() {
    return NextResponse.redirect(
      new URL(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`)
    );
  },
});
