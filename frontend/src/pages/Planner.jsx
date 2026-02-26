import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, Sparkles, Circle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { fetchSubjects, generatePlanner } from "../services/api";

export default function Planner() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [subjects, setSubjects] = useState([]);
  
  // Start with an empty schedule instead of the hardcoded one
  const [schedule, setSchedule] = useState([]);

  // Load the user's subjects when the page opens
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await fetchSubjects();
        // Extract just the names of the subjects to send to the AI
        setSubjects(res.data.map(sub => sub.name));
      } catch (error) {
        console.error("Failed to load subjects for planner", error);
      }
    };
    loadSubjects();
  }, []);

  // 🚀 THE AI MAGIC TRIGGER
  const handleGenerateSchedule = async () => {
    setIsGenerating(true);
    const loadingToast = toast.loading("AI is analyzing your subjects and building your schedule...");

    try {
      const response = await generatePlanner(subjects);
      setSchedule(response.data.schedule);
      
      toast.success("Schedule generated successfully!", { id: loadingToast });
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981']
      });

    } catch (error) {
      console.error("Failed to generate planner", error);
      toast.error("Failed to generate schedule. Check terminal.", { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTask = (id) => {
    setSchedule(schedule.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedCount = schedule.filter(t => t.completed).length;
  // Prevent dividing by zero if schedule is empty
  const progressPercentage = schedule.length > 0 ? Math.round((completedCount / schedule.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {/* Header Area */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Calendar className="text-brand-accent" size={32} />
            Your Study Planner
          </h1>
          <p className="text-slate-400">Track your weekly goals and master your subjects.</p>
        </div>
        
        <button 
          onClick={handleGenerateSchedule}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-brand-accent text-white px-5 py-2.5 rounded-lg hover:bg-blue-600 transition shadow-lg shadow-brand-accent/20 font-medium disabled:opacity-50"
        >
          {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {isGenerating ? "Building..." : "Auto-Generate with AI"}
        </button>
      </header>

      {/* Progress Bar (Only show if we have a schedule) */}
      {schedule.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-slate-200">Weekly Progress</span>
            <span className="text-brand-accent font-bold">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-700 overflow-hidden">
            <div 
              className="bg-brand-accent h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {schedule.length === 0 && !isGenerating && (
        <div className="flex flex-col items-center justify-center p-12 border border-slate-700 border-dashed rounded-2xl bg-slate-800/20 text-center">
          <Calendar className="text-slate-500 mb-4 opacity-50" size={48} />
          <h3 className="text-xl font-bold text-slate-300 mb-2">No Schedule Yet</h3>
          <p className="text-slate-500 max-w-md">Click the Auto-Generate button above to have AI instantly build a custom 5-day study plan based on your currently uploaded subjects.</p>
        </div>
      )}

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedule.map((task) => (
          <div 
            key={task.id} 
            className={`p-6 rounded-2xl border transition-all duration-300 ${
              task.completed 
                ? "bg-slate-900/50 border-green-500/30 opacity-75" 
                : "bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:shadow-lg"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full">
                {task.day}
              </span>
              <button onClick={() => toggleTask(task.id)} className="text-slate-400 hover:text-green-400 transition">
                {task.completed ? <CheckCircle className="text-green-500" size={24} /> : <Circle size={24} />}
              </button>
            </div>
            
            <h3 className={`text-xl font-bold mb-1 ${task.completed ? "text-slate-400 line-through" : "text-slate-100"}`}>
              {task.subject}
            </h3>
            <p className={`text-sm mb-4 ${task.completed ? "text-slate-500" : "text-slate-400"}`}>
              {task.topic}
            </p>
            
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-900/50 w-fit px-3 py-1.5 rounded-lg border border-slate-700">
              <Clock size={14} />
              {task.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}