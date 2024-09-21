"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  Search,
  Settings,
  Moon,
  Sun,
  Laptop,
  Menu,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import axios from "axios";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/logout",
        {},
        { withCredentials: true },
      );

      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="flex items-center justify-between border-b bg-gradient-to-b from-purple-100 to-pink-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6 dark:text-white" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-8"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2 dark:text-white">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {theme === "light" ? (
                <Sun className="h-5 w-5" />
              ) : theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Laptop className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Laptop className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </nav>
  );
}
