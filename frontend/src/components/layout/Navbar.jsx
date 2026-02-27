import { BookOpen, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="h-16 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <BookOpen className="text-blue-500" size={28} />
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
          Education <span className="text-blue-500">AI</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-gray-100 dark:bg-slate-800 p-2 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors duration-300 text-slate-600 dark:text-white">
          <User size={20} />
        </div>
      </div>
    </nav>
  );
}