import { CheckCircle, Clock, BookOpen, Flame } from "lucide-react";

// 1. Accept the 'data' prop from the Dashboard
export default function StatCards({ data }) {
  // Helper function to convert decimal hours to Hr:M:S format
  const formatStudyTime = (decimalHours) => {
    if (!decimalHours) return "0h 0m 0s";
    
    const totalSeconds = Math.round(decimalHours * 3600);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

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
      value: formatStudyTime(data?.studyHours),
      icon: Clock,
      color: "text-blue-400",
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
      color: "text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-none p-6 rounded-xl transition-colors duration-300"
        >
          <div className="flex items-center justify-between mb-2">
            <stat.icon className={stat.color} size={24} />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {stat.value}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
