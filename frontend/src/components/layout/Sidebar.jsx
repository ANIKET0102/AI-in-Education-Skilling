import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Study Lab", path: "/lab", icon: GraduationCap },
    { name: "Planner", path: "/planner", icon: Calendar },
  ];

  return (
    <>
      {/* Mobile Hamburger Button - Moved to Top Left */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-brand-accent text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Dark Overlay with subtle blur */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar with Frosted Glass Effect */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 border-r border-slate-700/50 bg-brand-dark/70 backdrop-blur-xl min-h-[calc(100vh-64px)] p-4 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Added top margin on mobile to push links below the top-left toggle button */}
        <div className="space-y-2 mt-14 md:mt-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-brand-accent/20 text-brand-accent border border-brand-accent/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
