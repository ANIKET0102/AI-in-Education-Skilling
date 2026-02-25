import { useState } from "react";
import { Send, Sparkles, BookOpen, ChevronLeft, Loader2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { sendChatMessage, generateQuiz } from "../services/api";

export default function StudyLab() {
  // 1. Grab the subject FIRST
  const location = useLocation();
  const subject = location.state?.subject;

  // 2. NOW you can use it in your state!
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: `Hello Aniket! Let's master ${subject?.name || "this subject"} together. What concept should we focus on?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Convert the file path to a URL
  const pdfUrl = subject?.pdfPath
    ? `http://localhost:5000/${subject.pdfPath.replace(/\\/g, "/")}`
    : null;

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await sendChatMessage(userText, subject?.pdfPath);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: response.data.text },
      ]);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, my brain is disconnected right now. Check your terminal!",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsTyping(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: "Generate a quiz for me!" },
    ]);

    try {
      const response = await generateQuiz(subject?.pdfPath);

      // Add a special "quiz" type message to our chat
      setMessages((prev) => [
        ...prev,
        { role: "ai", type: "quiz", data: response.data.quiz },
      ]);
    } catch (err) {
      console.error("Quiz Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Failed to generate the quiz. Check the console!" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold">
            Study Lab:{" "}
            <span className="text-brand-accent">
              {subject?.name || "General"}
            </span>
          </h1>
        </div>
        <button
          onClick={handleGenerateQuiz}
          disabled={isTyping || !pdfUrl}
          className="flex items-center gap-2 bg-brand-accent/10 text-brand-accent px-4 py-2 rounded-lg border border-brand-accent/20 hover:bg-brand-accent/20 transition text-sm disabled:opacity-50"
        >
          <Sparkles size={16} />
          Generate Quiz
        </button>
      </div>

      {/* Main Split View */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left Side: Content Viewer */}
        <div className="hidden lg:flex flex-1 bg-slate-800/30 border border-slate-800 rounded-2xl overflow-hidden flex-col">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0 bg-white"
              title="PDF Viewer"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <BookOpen size={48} className="mb-4 opacity-20" />
              <p>No document uploaded for {subject?.name || "this subject"}</p>
            </div>
          )}
        </div>

        {/* Right Side: AI Coach Chat */}
        <div className="w-full lg:w-[450px] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-300">
              AI Concept Coach
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* --- REPLACED MAP FUNCTION IS HERE --- */}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === "user" ? "bg-brand-accent text-white rounded-tr-none" : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                  }`}
                >
                  {/* Standard Text Message */}
                  {!msg.type && msg.text}

                  {/* Special Quiz Message */}
                  {msg.type === "quiz" && (
                    <div className="space-y-4">
                      <p className="font-bold text-brand-accent border-b border-slate-700 pb-2 mb-3">🎯 Knowledge Check</p>
                      {msg.data.map((q, qIdx) => (
                        <div key={qIdx} className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                          <p className="font-medium text-slate-200 mb-2">{qIdx + 1}. {q.question}</p>
                          <div className="space-y-2">
                            {q.options.map((opt, oIdx) => (
                              <button key={oIdx} className="w-full text-left p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs border border-slate-700">
                                {opt}
                              </button>
                            ))}
                          </div>
                          <details className="mt-3 text-xs">
                            <summary className="cursor-pointer text-brand-accent font-medium hover:text-blue-400">View Answer</summary>
                            <div className="mt-2 p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
                              <span className="font-bold">Answer:</span> {q.answer}
                              <p className="mt-1 text-slate-400">{q.explanation}</p>
                            </div>
                          </details>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* --- END OF REPLACED SECTION --- */}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-400 p-3 rounded-2xl rounded-tl-none border border-slate-700 flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-800/50 border-t border-slate-800">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask for a hint or explanation..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-brand-accent transition"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping}
                className="absolute right-2 top-1.5 p-1.5 bg-brand-accent text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-700 transition"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}