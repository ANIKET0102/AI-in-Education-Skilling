import { useState } from "react";
import { X, Upload, Plus, FileText } from "lucide-react";
import { createSubject } from "../../services/api";
import Button from "./Button";

export default function Modal({ isOpen, onClose, onSubjectAdded }) {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim()) return alert("Please enter a subject name");
    if (!file) return alert("Please upload a PDF study material");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("pdf", file);

    setLoading(true);
    try {
      await createSubject(formData);
      setName("");
      setFile(null);
      onSubjectAdded();
      onClose();
    } catch (err) {
      console.error("Error creating subject:", err);
      alert("Failed to upload. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300">

      {/* Modal Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl shadow-blue-900/10 dark:shadow-none overflow-hidden transition-colors duration-300">

        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 backdrop-blur-md dark:bg-slate-800/50 transition-colors duration-300">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Add New Subject</h3>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">

          {/* Subject Name Input */}
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1 transition-colors duration-300">
              Subject Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Operating Systems"
              className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent transition-colors duration-300"
            />
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1 transition-colors duration-300">
              Study Material (PDF)
            </label>
            <label className="border-2 border-dashed border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6 flex flex-col items-center justify-center group hover:border-brand-accent dark:hover:border-brand-accent transition-colors duration-300 cursor-pointer">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {file ? (
                <div className="flex items-center gap-2 text-brand-accent">
                  <FileText size={24} />
                  <span className="text-sm font-medium truncate max-w-[200px] text-slate-900 dark:text-white">
                    {file.name}
                  </span>
                </div>
              ) : (
                <>
                  <Upload
                    className="text-slate-400 dark:text-slate-500 group-hover:text-brand-accent dark:group-hover:text-brand-accent mb-2 transition-colors duration-300"
                    size={32}
                  />
                  <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">Click to upload PDF</p>
                </>
              )}
            </label>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              "Uploading..."
            ) : (
              <>
                <Plus size={18} /> Create Subject
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}