import { BookOpen, User } from "lucide-react";

// Notice the "export default" right here!
export default function Navbar() {
  return (
    <nav className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <BookOpen className="text-blue-500" size={28} />
        <span className="text-xl font-bold tracking-tight text-white">
          Education <span className="text-blue-500">AI</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-slate-800 p-2 rounded-full cursor-pointer hover:bg-slate-700 transition text-white">
          <User size={20} />
        </div>
      </div>
    </nav>
  );
}
