import { useNavigate } from "react-router-dom";
import { Book, Clock, ArrowRight } from "lucide-react";

export default function SubjectGrid({ subjects, onAddClick }) {
  const navigate = useNavigate();

  const handleCardClick = (subject) => {
    // This sends the user to the Study Lab and passes the subject data along with them!
    navigate("/lab", { state: { subject } });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white transition-colors duration-300">
        Your Subjects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub) => (
          <div
            key={sub._id}
            onClick={() => handleCardClick(sub)}
            className="bg-white/80 backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl hover:border-brand-accent dark:hover:border-brand-accent shadow-lg shadow-blue-900/5 dark:shadow-none hover:shadow-xl hover:shadow-brand-accent/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full"
          >
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2 text-slate-900 dark:text-white group-hover:text-brand-accent dark:group-hover:text-brand-accent transition-colors">
                {sub.name}
              </h3>

              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-4 transition-colors duration-300">
                <div className="flex items-center gap-1.5">
                  <Book size={16} />
                  <span>{sub.pdfPath ? "PDF Uploaded" : "No PDF"}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm text-slate-400 dark:text-slate-500 group-hover:text-brand-accent dark:group-hover:text-brand-accent transition-colors duration-300">
              <span>Enter Study Lab</span>
              <ArrowRight
                size={16}
                className="transform group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        ))}

        {/* Add New Subject Card */}
        <div
          onClick={onAddClick}
          className="border-2 border-dashed border-gray-300 dark:border-slate-700 p-5 rounded-xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:border-gray-400 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-transparent transition-all duration-300 cursor-pointer min-h-[160px]"
        >
          <span className="text-3xl mb-1">+</span>
          <span className="text-sm font-medium">Add New Subject</span>
        </div>
      </div>
    </div>
  );
}
