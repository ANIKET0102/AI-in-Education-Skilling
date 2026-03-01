import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Automatically attach the Token to every request
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export const fetchSubjects = () => API.get("/subjects");
export const fetchSubjectById = (id) => API.get(`/subjects/${id}`);

// Updated for file uploads
export const createSubject = (formData) =>
  API.post("/subjects", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Chat API call to connect to your Gemini backend
export const sendChatMessage = (message, pdfPath) =>
  API.post("/chat", { message, pdfPath });

export const generateQuiz = (pdfPath) => API.post("/chat/quiz", { pdfPath });

export const fetchStats = () => API.get("/stats");
export const incrementConcepts = () => API.put("/stats/master-concept");
export const saveChatHistory = (subjectId, messages) =>
  API.put(`/subjects/${subjectId}/messages`, { messages });
export const addStudyTime = (hours) => API.put("/stats/add-time", { hours });
export const generatePlanner = (subjects) =>
  API.post("/chat/planner", { subjects });
export const loginAPI = (formData) => API.post("/auth/login", formData);
export const registerAPI = (formData) => API.post("/auth/register", formData);
// ... existing exports (fetchSubjects, loginAPI, etc.)

// 🚀 Fetch the saved planner for the logged-in user
export const fetchSavedPlanner = () => API.get("/auth/planner");

// 💾 Save the current planner state (including completion status)
export const savePlannerAPI = (schedule) => API.put("/auth/planner", { schedule });


