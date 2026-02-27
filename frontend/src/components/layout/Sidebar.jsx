import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  GraduationCap,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import Button from "../shared/Button";

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // 🚀 Safe Local Storage Initialization
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Apply classes and save to storage
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove('dark');
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Study Lab", path: "/lab", icon: BookOpen },
    { name: "Planner", path: "/planner", icon: Calendar },
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <Button
        variant="primary"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Dark Overlay with subtle blur */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        
        {/* MasteryPath Logo */}
        <div className="flex items-center gap-3 text-brand-accent mb-8 mt-14 md:mt-0 px-6">
          <GraduationCap size={32} />
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
            MasteryPath
          </span>
        </div>

        {/* Links section */}
        <div className="space-y-2 flex-1 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 transform ${
                  isActive
                    ? "bg-blue-50 text-brand-accent dark:bg-slate-800 dark:text-white font-medium"
                    : "text-slate-900 hover:bg-gray-100 hover:text-slate-900 dark:text-white dark:hover:bg-slate-800 dark:hover:text-white hover:scale-105"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* THEME TOGGLE BUTTON AT BOTTOM */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800">
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
    </>
  );
}