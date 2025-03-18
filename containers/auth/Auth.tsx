"use client";

import { Button } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoogleOutlined } from "@ant-design/icons";
import { useUser } from "@auth0/nextjs-auth0/client";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;

  prompt(): Promise<void>;
}

const AuthPage = () => {
  const {user, error, isLoading} = useUser();
  console.log(user);
  const router = useRouter();

  if(!user){
    // return <a href="/api/auth/logout">logout</a>
    return router.push('/friends');
  }
  const [prompt, setPrompt] = useState<Event | null>(null);
  // const { data: session, status } = useSession();
  // console.log(status);

  const installApp = () => {
    if (!prompt) return;
    (prompt as BeforeInstallPromptEvent)?.prompt();
  };

  useEffect(() => {
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);


  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen bg-custom mx-6">
        {/* <div>
          <Image
            src="/image.jpeg"
            alt="App Logo"
            width={250}
            height={200}
            className="mb-18 mr-3"
          />
        </div> */}

        {/* <Button type="primary" onClick={installApp}>
          Download the App
        </Button> */}
          <div>
            <Button
          size="large"
          className="mt-4 !bg-[#B57EDC] !border-[#283039] w-full"
          onClick={() => router.push('/api/auth/login')}
        >
          Login with Auth0
        </Button>
          </div>
        {/* {status === "unauthenticated" && ( */}
          <div className="mt-[10rem]">
          <Button
          size="large"
          className="mt-4 !bg-[#B57EDC] !border-[#283039] w-full"
          onClick={() => router.push('/signup')}
        >
          Sign Up
        </Button>
        <Button
        size="large"
        className="mt-4 !bg-[#283039] !border-[#283039] w-full"
        onClick={() => router.push('/login')}
      >
        Log in
      </Button>
          <Button
          size="large"
            className="mt-4 !bg-[#283039] !border-[#283039] w-full"
            onClick={() => signIn("google")}
          >
            <GoogleOutlined />
            Continue with Google
          </Button> 
          </div>
         
        {/* )} */}
      </div>
    </>
  );
};

export default AuthPage;
