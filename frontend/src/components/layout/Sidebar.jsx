import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  GraduationCap,
  Menu,
  X,
  LogOut,
  Moon,
  Sun
} from "lucide-react";
import Button from "../shared/Button";

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Theme State Logic
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Study Lab", path: "/lab", icon: BookOpen },
    { name: "Planner", path: "/planner", icon: Calendar },
  ];

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col h-screen transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        
        {/* 1. Branding */}
        <div className="flex items-center gap-3 text-brand-accent px-6 py-8 flex-shrink-0">
          <GraduationCap size={32} />
          <span className="text-xl font-bold text-slate-900 dark:text-white">MasteryPath</span>
        </div>

        {/* 2. Navigation Section */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive
                    ? "bg-brand-accent/10 text-brand-accent"
                    : "text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900"
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* 3. Footer Section (Theme + Profile + Logout) */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex-shrink-0 space-y-4">
          
          {/* Theme Toggle */}
          <Button
            variant="secondary"
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-2 text-sm"
          >
            <div className="flex items-center gap-2">
              {isDarkMode ? <Moon size={16} className="text-brand-accent" /> : <Sun size={16} className="text-orange-500" />}
              <span>{isDarkMode ? "Dark" : "Light"}</span>
            </div>
            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isDarkMode ? 'bg-brand-accent' : 'bg-gray-300'}`}>
              <div className={`bg-white w-3 h-3 rounded-full transition-transform ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </div>
          </Button>

          {/* Profile Info */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent font-bold uppercase">
              {user?.username?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {user?.username || "Scholar"}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">B.Tech CSE</p>
            </div>
          </div>
          
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-sm font-bold"
          >
            <LogOut size={18} />
            Logout Session
          </button>
        </div>
      </aside>
    </>
  );
}