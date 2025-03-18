"use client";

import { Button } from "antd";
import { useEffect, useState } from "react";
import { AndroidOutlined } from "@ant-design/icons";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const InstallButton = () => {
  const [prompt, setPrompt] = useState<Event | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // Check if app is installed using multiple methods
    const checkInstallation = () => {
      // Method 1: Check if launched from home screen
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes("android-app://");

      // Method 2: Check if installed via manifest
      const isPWAInstalled =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window as any).navigator.standalone === true;

      setIsAppInstalled(isStandalone || isPWAInstalled);
    };

    // Initial check
    checkInstallation();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsAppInstalled(e.matches);
    };

    mediaQuery.addEventListener("change", handleDisplayModeChange);

    // Handle install prompt
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleDisplayModeChange);
      window.removeEventListener("beforeinstallprompt", handlePrompt);
    };
  }, []);

  const installApp = async () => {
    if (!prompt) return;

    try {
      await (prompt as BeforeInstallPromptEvent).prompt();
      const result = await (prompt as BeforeInstallPromptEvent).userChoice;

      if (result.outcome === "accepted") {
        setIsAppInstalled(true);
        setPrompt(null);
      }
    } catch (error) {
      console.error("Error installing app:", error);
    }
  };

  // Don't render button if app is installed
  if (isAppInstalled) {
    return null;
  }

  return (
    <div>
      <p className="text-white text-lg font-semibold">
        There&apos;s more to love in the app
      </p>
      <Button
        className="h-10 p-4 mt-1 !bg-[#283039] !border-[#283039] !text-white text-sm font-bold leading-normal tracking-[0.015em]"
        onClick={installApp}
      >
        <AndroidOutlined />
        Get the App
      </Button>
    </div>
  );
};

export default InstallButton;
