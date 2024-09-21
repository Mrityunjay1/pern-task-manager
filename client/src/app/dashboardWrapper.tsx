"use client";
import React, { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const isAuthenticated = useAppSelector(
    (state) => state.global.isAuthenticated,
  );
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(
          process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/check-session",
          {
            withCredentials: true,
          },
        ); // Assuming this route checks for session
      } catch (err) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const path = usePathname();
  const isHomeRoute = path === "/";
  const isAuthRoute = path === "/login" || path === "/register";

  const hideHeader = isAuthRoute || isHomeRoute;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {isAuthenticated && !isAuthRoute && !isHomeRoute && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="flex flex-1 flex-col">
        {!hideHeader && <Navbar onMenuClick={toggleSidebar} />}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-purple-100 to-pink-100 dark:bg-black dark:from-gray-900 dark:to-gray-800">
          {children}
        </main>
      </div>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;
