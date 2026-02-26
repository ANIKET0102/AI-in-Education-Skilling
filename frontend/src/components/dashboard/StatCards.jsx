import { CheckCircle, Clock, BookOpen, Flame } from "lucide-react";

// 1. Accept the 'data' prop from the Dashboard
export default function StatCards({ data }) {
  
  // 2. Build the array using the real database numbers!
  const stats = [
    {
      label: "Concepts Mastered",
      value: data?.conceptsMastered || "0",
      icon: CheckCircle,
      color: "text-green-400",
    },
    { 
      label: "Study Hours", 
      value: `${data?.studyHours || "0"}h`, 
      icon: Clock, 
      color: "text-blue-400" 
    },
    {
      label: "Active Courses",
      value: data?.activeCourses || "0",
      icon: BookOpen,
      color: "text-purple-400",
    },
    { 
      label: "Day Streak", 
      value: data?.dayStreak || "0", 
      icon: Flame, 
      color: "text-orange-400" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <stat.icon className={stat.color} size={24} />
            <span className="text-2xl font-bold">{stat.value}</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}