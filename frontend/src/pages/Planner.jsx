import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  Sparkles,
  Circle,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { fetchSubjects, generatePlanner } from "../services/api";
import Button from "../components/shared/Button";

export default function Planner() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [schedule, setSchedule] = useState([]);

  // Load subjects on mount
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await fetchSubjects();
        setSubjects(res.data.map((sub) => sub.name));
      } catch (error) {
        console.error("Failed to load subjects for planner", error);
      }
    };
    loadSubjects();
  }, []);

  const handleGenerateSchedule = async () => {
    setIsGenerating(true);
    const loadingToast = toast.loading("AI is analyzing your subjects...");

    try {
      const response = await generatePlanner(subjects);
      setSchedule(response.data.schedule);
      toast.success("Schedule generated!", { id: loadingToast });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#10b981"],
      });
    } catch (error) {
      toast.error("Failed to generate schedule.", { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTask = (id) => {
    const newSchedule = schedule.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    setSchedule(newSchedule);

    // 🚀 CELEBRATION TRIGGER: If everything is completed after this toggle
    const total = newSchedule.length;
    const completed = newSchedule.filter((t) => t.completed).length;
    if (total > 0 && completed === total) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#10b981", "#ffbb33"],
      });
      toast.success("Weekly Goal Achieved! 🏆", { icon: "🔥" });
    }
  };

  const completedCount = schedule.filter((t) => t.completed).length;
  const progressPercentage =
    schedule.length > 0
      ? Math.round((completedCount / schedule.length) * 100)
      : 0;

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3 transition-colors duration-300">
            <Calendar className="text-brand-accent" size={32} />
            Your Study Planner
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track your weekly goals and master your subjects.
          </p>
        </div>

        <Button onClick={handleGenerateSchedule} disabled={isGenerating}>
          {isGenerating ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Sparkles size={18} />
          )}
          {isGenerating ? "Building..." : "Auto-Generate with AI"}
        </Button>
      </header>

      {/* 🚀 FIXED PROGRESS BAR */}
      {schedule.length > 0 && (
        <div className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 p-6 rounded-2xl mb-8 shadow-sm transition-colors duration-300">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Weekly Progress
            </span>
            <span className="text-brand-accent font-bold">
              {progressPercentage}%
            </span>
          </div>

          {/* Outer Track */}
          <div className="w-full bg-gray-200 dark:bg-slate-900 rounded-full h-4 overflow-hidden">
            {/* Animated Fill */}
            <div
              className="bg-brand-accent h-full rounded-full transition-[width] duration-700 ease-in-out"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {schedule.length === 0 && !isGenerating && (
        <div className="flex flex-col items-center justify-center p-12 border border-gray-300 dark:border-slate-700 border-dashed rounded-2xl bg-gray-50 dark:bg-slate-800/20 text-center transition-colors">
          <Calendar
            className="text-slate-400 dark:text-slate-500 mb-4 opacity-50"
            size={48}
          />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-300 mb-2">
            No Schedule Yet
          </h3>
          <p className="text-slate-500 max-w-md">
            Click Auto-Generate to have AI build a 5-day study plan.
          </p>
        </div>
      )}

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedule.map((task) => (
          <div
            key={task.id}
            className={`p-6 rounded-2xl border transition-all duration-300 transform ${
              task.completed
                ? "bg-gray-50 dark:bg-slate-900/50 border-green-500/30 opacity-75"
                : "bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 shadow-sm dark:shadow-none hover:shadow-lg hover:scale-[1.02]"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full">
                {task.day}
              </span>
              <Button
                variant="ghost"
                onClick={() => toggleTask(task.id)}
                className="text-slate-400 hover:text-green-500 dark:hover:text-green-400 p-1"
              >
                {task.completed ? (
                  <CheckCircle className="text-green-500" size={24} />
                ) : (
                  <Circle size={24} />
                )}
              </Button>
            </div>

            <h3
              className={`text-xl font-bold mb-1 ${task.completed ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-900 dark:text-slate-100"}`}
            >
              {task.subject}
            </h3>
            <p
              className={`text-sm mb-4 ${task.completed ? "text-slate-500" : "text-slate-600 dark:text-slate-400"}`}
            >
              {task.topic}
            </p>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-500 bg-gray-100 dark:bg-slate-900/50 w-fit px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700">
              <Clock size={14} />
              {task.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
