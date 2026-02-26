import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const fetchSubjects = () => API.get("/subjects");

// Updated for file uploads
export const createSubject = (formData) =>
  API.post("/subjects", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Chat API call to connect to your Gemini backend
export const sendChatMessage = (message, pdfPath) => API.post("/chat", { message, pdfPath });

export const generateQuiz = (pdfPath) => API.post("/chat/quiz", { pdfPath });

export const fetchStats = () => API.get("/stats");
export const incrementConcepts = () => API.put("/stats/master-concept");
export const saveChatHistory = (subjectId, messages) => API.put(`/subjects/${subjectId}/messages`, { messages });
export const addStudyTime = (hours) => API.put("/stats/add-time", { hours });
export const generatePlanner = (subjects) => API.post("/chat/planner", { subjects });