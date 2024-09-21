"use client";
import React, { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";

const PUBLIC_ROUTES = ["/registration", "/login"];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const isAuthenticated = useAppSelector(
    (state) => state.global.isAuthenticated,
  );
  const router = useRouter();

  const path = usePathname();
  const isHomeRoute = path === "/";
  const isAuthRoute = path === "/login" || path === "/registration";

  const hideHeader = isAuthRoute || isHomeRoute;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check if the current route is public
      if (PUBLIC_ROUTES.includes(path)) return;

      try {
        await axios.get(
          process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/check-session",
          {
            withCredentials: true,
          },
        );
      } catch (err) {
        throw new Error("Not authenticated", err);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

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
