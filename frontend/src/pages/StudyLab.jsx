import confetti from "canvas-confetti";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Send, Sparkles, BookOpen, ChevronLeft, Loader2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/shared/Button";
import {
  sendChatMessage,
  generateQuiz,
  incrementConcepts,
  saveChatHistory,
  addStudyTime,
} from "../services/api";

export default function StudyLab() {
  const location = useLocation();
  const subject = location.state?.subject;
  const navigate = useNavigate();
  const [startTime] = useState(Date.now());
  const [elapsedMs, setElapsedMs] = useState(0); // keep track of elapsed time

  // 1. Load history if it exists, otherwise show the default greeting
  const [messages, setMessages] = useState(() => {
    if (subject?.messages && subject.messages.length > 0) {
      return subject.messages;
    }
    return [
      {
        role: "ai",
        text: `Hello Aniket! Let's master ${subject?.name || "this subject"} together. What concept should we focus on?`,
      },
    ];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const pdfUrl = subject?.pdfPath
    ? `http://localhost:5000/${subject.pdfPath.replace(/\\/g, "/")}`
    : null;

  // update elapsed time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}h ${m
      .toString()
      .padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  };

  // 2. Helper function to save messages to the database silently
  const updateHistory = async (newMessagesArray) => {
    if (subject?._id) {
      try {
        await saveChatHistory(subject._id, newMessagesArray);
      } catch (err) {
        console.error("Failed to save chat history:", err);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    const newMessages = [...messages, { role: "user", text: userText }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    updateHistory(newMessages);

    try {
      const response = await sendChatMessage(userText, subject?.pdfPath);

      const finalMessages = [
        ...newMessages,
        { role: "ai", text: response.data.text },
      ];
      setMessages(finalMessages);

      updateHistory(finalMessages);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, my brain is disconnected right now." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsTyping(true);

    const newMessages = [
      ...messages,
      { role: "user", text: "Generate a quiz for me!" },
    ];
    setMessages(newMessages);
    updateHistory(newMessages);

    try {
      const response = await generateQuiz(subject?.pdfPath);

      const finalMessages = [
        ...newMessages,
        { role: "ai", type: "quiz", data: response.data.quiz },
      ];
      setMessages(finalMessages);
      updateHistory(finalMessages);

      await incrementConcepts();

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#10b981", "#f59e0b"],
      });

      toast.success("Achievement Unlocked: +1 Concept Mastered!", {
        icon: "🌟",
        duration: 4000,
      });
    } catch (err) {
      console.error("Quiz Error:", err);
      toast.error("Failed to generate the quiz. Check the console.");
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Failed to generate the quiz." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLeaveLab = async () => {
    const timeSpentMs = elapsedMs || (Date.now() - startTime);
    const hoursSpent = timeSpentMs / (1000 * 60 * 60);

    try {
      // Assuming addStudyTime is imported or defined elsewhere
      if (typeof addStudyTime === 'function') {
        await addStudyTime(hoursSpent);
      }
    } catch (err) {
      console.error("Failed to save study time:", err);
    }

    navigate("/");
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleLeaveLab}
            className="p-2"
          >
            <ChevronLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
            Study Lab:{" "}
            <span className="text-brand-accent">
              {subject?.name || "General"}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Time: {formatTime(elapsedMs)}
          </span>
          <Button
            onClick={handleGenerateQuiz}
            disabled={isTyping || !pdfUrl}
            className="flex items-center gap-2"
          >
            <Sparkles size={16} />
            Generate Quiz
          </Button>
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left Side: Content Viewer */}
        <div className="hidden lg:flex flex-1 bg-gray-50 dark:bg-slate-800/30 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden flex-col transition-colors duration-300">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0 bg-white"
              title="PDF Viewer"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 transition-colors duration-300">
              <BookOpen size={48} className="mb-4 opacity-20" />
              <p>No document uploaded for {subject?.name || "this subject"}</p>
            </div>
          )}
        </div>

        {/* Right Side: AI Coach Chat */}
        <div className="w-full lg:w-[450px] flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg dark:shadow-2xl transition-colors duration-300">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 flex items-center gap-2 transition-colors duration-300">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300">
              AI Concept Coach
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-slate-900 transition-colors duration-300">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm transition-colors duration-300 ${
                    msg.role === "user"
                      ? "bg-brand-accent text-white rounded-tr-none shadow-sm"
                      : "bg-gray-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-gray-200 dark:border-slate-700"
                  }`}
                >
                  {!msg.type && msg.text}

                  {msg.type === "quiz" && (
                    <div className="space-y-4">
                      <p className="font-bold text-brand-accent border-b border-gray-300 dark:border-slate-700 pb-2 mb-3 transition-colors duration-300">
                        🎯 Knowledge Check
                      </p>
                      {msg.data.map((q, qIdx) => (
                        <div
                          key={qIdx}
                          className="bg-white dark:bg-slate-900/50 p-3 rounded-xl border border-gray-200 dark:border-slate-700/50 shadow-sm dark:shadow-none transition-colors duration-300"
                        >
                          <p className="font-medium text-slate-800 dark:text-slate-200 mb-2 transition-colors duration-300">
                            {qIdx + 1}. {q.question}
                          </p>
                          <div className="space-y-2">
                            {q.options.map((opt, oIdx) => (
                              <Button
                                key={oIdx}
                                variant="secondary"
                                className="w-full text-left p-2 text-xs"
                              >
                                {opt}
                              </Button>
                            ))}
                          </div>
                          <details className="mt-3 text-xs">
                            <summary className="cursor-pointer text-brand-accent font-medium hover:text-blue-500 transition-colors">
                              View Answer
                            </summary>
                            <div className="mt-2 p-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg text-green-700 dark:text-green-400 transition-colors duration-300">
                              <span className="font-bold">Answer:</span>{" "}
                              {q.answer}
                              <p className="mt-1 text-green-600/80 dark:text-slate-400 transition-colors duration-300">
                                {q.explanation}
                              </p>
                            </div>
                          </details>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-3 rounded-2xl rounded-tl-none border border-gray-200 dark:border-slate-700 flex items-center gap-2 transition-colors duration-300">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask for a hint or explanation..."
                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-brand-accent transition-colors duration-300"
                disabled={isTyping}
              />
              <Button
                variant="primary"
                onClick={handleSendMessage}
                disabled={isTyping}
                className="absolute right-2 top-1.5 p-2 !h-auto !w-auto"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}