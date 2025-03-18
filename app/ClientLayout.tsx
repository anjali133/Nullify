// app/ClientLayout.tsx
"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import BottomNavigation from "../components/BottomNavigation";
import { Provider } from "react-redux";
import { store } from "@/provider/redux/store";
import { AuthProvider } from "./lib/AuthProvider";
import { UserProvider } from "@auth0/nextjs-auth0/client";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#111418]">
        <Provider store={store}>
          <UserProvider>
          {/* <AuthProvider> */}
            <div className="flex min-h-screen">
              {/* Main content wrapper */}
              <div className="flex-1 flex flex-col md:ml-20">
                <main className="flex-1 overflow-y-auto pb-[70px] md:pb-0">
                  <AntdRegistry>
                    <ConfigProvider
                      theme={{
                        token: {
                          colorText: "#FFFFFF",
                          colorPrimary: "#B57EDC",
                        },
                      }}
                    >
                      {children}
                    </ConfigProvider>
                  </AntdRegistry>
                </main>
              </div>

              <BottomNavigation />
            </div>
          {/* </AuthProvider> */}
          </UserProvider>
        </Provider>
      </body>
    </html>
  );
}
