import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { BookOpen, LayoutDashboard, Calendar, Sun, Moon, GraduationCap } from "lucide-react";
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
      document.documentElement.classList.add('dark');
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove('dark');
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
      {/* <Sidebar /> */}
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col transition-colors duration-300">
        <div className="flex items-center gap-3 text-brand-accent mb-10">
          <GraduationCap size={32} />
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">MasteryPath</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                  isActive
                    ? "bg-brand-accent text-black"
                    : "text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                <link.icon size={20} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* 🚀 THE THEME TOGGLE BUTTON */}
        <div className="pt-6 border-t border-gray-200 dark:border-slate-800">
          <Button
            variant="secondary"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center justify-between w-full px-4 py-3"
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon size={20} className="text-brand-accent" /> : <Sun size={20} className="text-orange-500" />}
              <span>{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
            </div>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-brand-accent' : 'bg-gray-300'}`}>
              <div className={`bg-white w-4 h-4 rounded-full transition-transform ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </div>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}