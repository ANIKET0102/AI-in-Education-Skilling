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
