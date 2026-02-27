import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  Calendar,
  Sun,
  Moon,
  GraduationCap,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Button from "../shared/Button";

export default function Layout() {
  const location = useLocation();

  // 🚀 Initialize from localStorage, default to light mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // This effect listens for changes and adds/removes the 'dark' class on the HTML body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const navLinks = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Study Lab", path: "/lab", icon: BookOpen },
    { name: "Planner", path: "/planner", icon: Calendar },
  ];

  return (
    // Notice the updated classes here! We set light defaults, and use dark: for the dark mode colors
    <div className="min-h-screen bg-gray-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
