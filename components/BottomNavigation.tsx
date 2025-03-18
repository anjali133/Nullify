"use client";
import React from "react";
import {
  UserAddOutlined,
  TeamOutlined,
  LineChartOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BottomNavigation = () => {
  const pathname = usePathname();
  const isAuthPage = pathname === "/auth";
  const isSignupPage = pathname === "/signup";
  const isLoginPage = pathname === "/login";
  const isForgotPasswordPage = pathname === "/forgot-password";
  const isVerifyEmailPage = pathname === "/verify-email";

  const tabs = [
    { key: "groups", label: "Groups", icon: <TeamOutlined />, href: "/groups" },
    {
      key: "friends",
      label: "Friends",
      icon: <UserAddOutlined />,
      href: "/friends",
    },
    {
      key: "activity",
      label: "Activity",
      icon: <LineChartOutlined />,
      href: "/activity",
    },
    {
      key: "account",
      label: "Account",
      icon: <WalletOutlined />,
      href: "/account",
    },
  ];

  if (isAuthPage || isSignupPage || isLoginPage || isForgotPasswordPage || isVerifyEmailPage) {
    return null;
  }

  const activeTab =
    tabs.find((tab) => pathname.startsWith(tab.href))?.key || "friends";

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#283039] border-t border-gray-800 md:fixed md:top-0 md:left-0 md:w-20 md:h-full md:border-t-0 md:border-r">
      <div className="flex justify-around md:flex-col md:h-full">
        {tabs.map((tab) => (
          <Link key={tab.key} href={tab.href} passHref>
            <div
              className={`text-center cursor-pointer text-sm py-4 md:py-6 relative ${
                activeTab === tab.key ? "text-[#B57EDC]" : "text-white"
              }`}
            >
              <div className="mb-1">{tab.icon}</div>
              <div>{tab.label}</div>
              {activeTab === tab.key && (
                <div className="absolute md:top-0 md:left-0 md:h-full md:w-1 bg-[#B57EDC]" />
              )}
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
