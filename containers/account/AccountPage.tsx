"use client";
import { Button, Typography, Avatar, List } from "antd";
import { signOut } from "next-auth/react";
import {
  EditOutlined,
  MailOutlined,
  LockOutlined,
  BellOutlined,
  StarOutlined,
  QuestionCircleOutlined,
  AndroidOutlined,
} from "@ant-design/icons";
import InstallButton from "./InstallButton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

const { Title } = Typography;
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;

  prompt(): Promise<void>;
}

const AccountPage = () => {
  const router = useRouter();

  const accountOptions = [
    {
      icon: <MailOutlined />,
      label: "Email settings",
    },
    {
      icon: <BellOutlined />,
      label: "Device and push notification settings",
    },
    {
      icon: <LockOutlined />,
      label: "Security",
    },
    {
      icon: <StarOutlined />,
      label: "Edit Profile",
    },
    {
      icon: <QuestionCircleOutlined />,
      label: "Contact support",
    },
  ];

  // const installApp = () => {
  //   if (!prompt) return;
  //   (prompt as BeforeInstallPromptEvent)?.prompt();
  // };
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (!user) {
      // return <a href="/api/auth/logout">logout</a>
      return router.push("/auth");
    }
  }, []);

  return (
    <div className="bg-custom p-4 pt-0 flex-1 text-white">
      <h1 className="text-[22px] text-[#fff] font-bold leading-tight tracking-[-0.015em] mt-[3.5rem] mb-6">
        Account
      </h1>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center">
          <Avatar
            style={{
              backgroundColor: "#a6a6a6",
              verticalAlign: "middle",
            }}
          >
            {"A"}
          </Avatar>
          <div className="ml-4">
            <div className="p-4">
              <p className="text-white text-xl leading-normal">
                {user?.nickname}
              </p>
              <p className="text-gray text-sm leading-normal break-words">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <List
        className="mt-8"
        itemLayout="horizontal"
        dataSource={accountOptions}
        renderItem={(item) => (
          <List.Item className="!border-t !border-[#444]">
            <List.Item.Meta
              avatar={item.icon}
              title={<span className="text-white">{item.label}</span>}
            />
          </List.Item>
        )}
      />

      <div className="mt-8 text-center">
        <InstallButton />
        <div className="mt-8 mb-6 text-center">
          <Button
            type="primary"
            className="w-full"
            onClick={() => {
              window.location.href = "/api/auth/logout";
            }}
          >
            Log Out
          </Button>
        </div>
        <div className="mt-8 mb-6 text-center"></div>
      </div>
    </div>
  );
};

export default AccountPage;
