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
// 🚀 Ensure these functions are exported in your services/api.js
import { 
  fetchSubjects, 
  generatePlanner, 
  fetchSavedPlanner, 
  savePlannerAPI 
} from "../services/api";
import Button from "../components/shared/Button";

export default function Planner() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [schedule, setSchedule] = useState([]);

  // 1. Load data on mount: Fetch existing plan AND user subjects
  useEffect(() => {
    const initializePlanner = async () => {
      try {
        // Run both fetches at once for speed
        const [subjectsRes, plannerRes] = await Promise.all([
          fetchSubjects(),
          fetchSavedPlanner()
        ]);

        // Load subjects for the AI to use
        setSubjects(subjectsRes.data.map((sub) => sub.name));

        // Load existing schedule if it exists in DB
        if (plannerRes.data?.schedule?.length > 0) {
          setSchedule(plannerRes.data.schedule);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    initializePlanner();
  }, []);

  // 2. Handle AI Generation
  const handleGenerateSchedule = async () => {
    if (subjects.length === 0) {
      return toast.error("Please upload some subjects first!");
    }

    setIsGenerating(true);
    const loadingToast = toast.loading("AI is crafting your study plan...");

    try {
      const response = await generatePlanner(subjects);
      const newSchedule = response.data.schedule;

      setSchedule(newSchedule);
      
      // 🚀 Persistence: Save the new AI plan to your MongoDB profile
      await savePlannerAPI(newSchedule);

      toast.success("Schedule saved to your profile!", { id: loadingToast });
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

  // 3. Toggle Task and Sync with DB
  const toggleTask = async (id) => {
    const updatedSchedule = schedule.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    
    // Update UI immediately for a snappy feel
    setSchedule(updatedSchedule);

    // 💾 Sync progress with Backend so it stays on refresh
    try {
      await savePlannerAPI(updatedSchedule);
    } catch (err) {
      toast.error("Cloud sync failed. Progress may not save.");
    }

    // Celebration logic
    const total = updatedSchedule.length;
    const completed = updatedSchedule.filter((t) => t.completed).length;
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
  const progressPercentage = schedule.length > 0
      ? Math.round((completedCount / schedule.length) * 100)
      : 0;

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {/* Header Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3 transition-colors">
            <Calendar className="text-brand-accent" size={32} />
            Your Study Planner
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Automated schedules for your subjects like <strong>AICampus</strong> and <strong>EduAI</strong>.
          </p>
        </div>

        <Button onClick={handleGenerateSchedule} disabled={isGenerating}>
          {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {isGenerating ? "Building..." : "Auto-Generate with AI"}
        </Button>
      </header>

      {/* 🚀 Progress Bar with Explicit Transitions */}
      {schedule.length > 0 && (
        <div className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 p-6 rounded-2xl mb-8 shadow-sm transition-colors">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Weekly Progress</span>
            <span className="text-brand-accent font-bold">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-900 rounded-full h-5 overflow-hidden relative border border-gray-300 dark:border-slate-700">
            <div
              className="bg-brand-accent h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%`, minWidth: progressPercentage > 0 ? "20px" : "0%" }}
            >
              <div className="h-full w-full bg-white/20 blur-[1px]"></div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedule.length === 0 && !isGenerating ? (
          <div className="col-span-full py-12 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-3xl flex flex-col items-center opacity-50">
            <Calendar size={48} className="mb-4" />
            <p>Your AI plan will appear here.</p>
          </div>
        ) : (
          schedule.map((task) => (
            <div
              key={task.id}
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                task.completed
                  ? "bg-gray-50 dark:bg-slate-900/50 border-green-500/30 opacity-75"
                  : "bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 hover:border-brand-accent shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full">
                  {task.day}
                </span>
                <button onClick={() => toggleTask(task.id)} className="text-slate-400 hover:text-brand-accent transition">
                  {task.completed ? <CheckCircle className="text-green-500" size={24} /> : <Circle size={24} />}
                </button>
              </div>
              <h3 className={`text-xl font-bold mb-1 ${task.completed ? "line-through text-slate-400" : "text-slate-900 dark:text-white"}`}>
                {task.subject}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{task.topic}</p>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-gray-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg w-fit">
                <Clock size={14} /> {task.time}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}