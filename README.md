# 🚀 AI-in-Education-Skilling

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

An advanced, full-stack web application designed to bridge the gap between traditional learning and modern skill acquisition using Artificial Intelligence. This platform leverages a robust backend architecture and a highly optimized frontend to deliver personalized, AI-driven educational workflows.

## 📋 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [System Architecture & Tech Stack](#-system-architecture--tech-stack)
- [Folder Structure](#-folder-structure)
- [Getting Started (Local Development)](#-getting-started-local-development)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Future Scope](#-future-scope)
- [Contact](#-contact)

---

## 📖 About the Project

**AI-in-Education-Skilling** is built to address complex computational challenges in modern ed-tech. By integrating machine learning concepts with a scalable MERN-stack architecture, the platform automates study planning, personalizes curriculum recommendations, and streamlines the educational workflow for users. 

Great emphasis was placed on creating a premium UI/UX, ensuring that the digital consumer journey is intuitive, fast, and accessible.

---

## ✨ Key Features

* **🧠 AI-Powered Insights:** Dynamically generates learning modules and algorithmic recommendations based on user data inputs.
* **🔐 Secure Authentication:** Robust Role-Based Access Control (RBAC) utilizing JWT (JSON Web Tokens) and bcrypt for password hashing.
* **⚡ High-Performance Frontend:** Engineered with React (and Vite/Tailwind) for a lightning-fast, responsive user interface.
* **📊 Interactive Dashboards:** Dedicated views for tracking learning metrics, progress gaps, and overall skill extraction.
* **🌙 Premium UI/UX:** Data-driven design iterations implemented within a scalable design system, including complete dark-mode optimization.
* **☁️ Cloud-Ready:** Streamlined end-to-end integration designed for seamless deployment on cloud providers.

---

## 🛠 System Architecture & Tech Stack

### **Frontend**
* **Framework:** React.js 
* **Styling:** CSS3 / Tailwind CSS (Update if using a specific library)
* **State Management:** Context API / Redux (Update based on your code)
* **Routing:** React Router DOM

### **Backend**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (with Mongoose ORM)
* **Authentication:** JWT, bcrypt.js
* **AI Integration:** LLM APIs (Update with specific API like Gemini/OpenAI if used)

---

## 📂 Folder Structure

```text
AI-in-Education-Skilling/
├── client/                 # React Frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images, icons
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page views
│   │   ├── context/        # State management context
│   │   ├── services/       # API call logic
│   │   └── App.js          # Main application component
│   └── package.json
│
├── server/                 # Node.js/Express Backend
│   ├── config/             # DB connection and env config
│   ├── controllers/        # Request handling logic
│   ├── middleware/         # Custom middleware (Auth, Error handling)
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express API routes
│   ├── utils/              # Helper functions & AI processors
│   ├── server.js           # Entry point
│   └── package.json
│
└── README.md


🚀 Getting Started (Local Development)
Follow these instructions to set up the project locally.

Prerequisites
Ensure you have the following installed on your local machine:

Node.js (v16.x or higher)

Git

A running instance of MongoDB (Local or MongoDB Atlas)

Installation
Clone the repository:

Bash
git clone [https://github.com/ANIKET0102/AI-in-Education-Skilling.git](https://github.com/ANIKET0102/AI-in-Education-Skilling.git)
cd AI-in-Education-Skilling
Install Backend Dependencies:

Bash
cd server
npm install
Install Frontend Dependencies:

Bash
cd ../client
npm install
Environment Variables
Create a .env file in the server directory and add the following configuration:

Code snippet
# Server Config
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d

# AI API Keys (If applicable)
AI_API_KEY=your_llm_api_key_here
Running the Application
Open two terminal instances.

Terminal 1 (Backend):

Bash
cd server
npm run dev
Terminal 2 (Frontend):

Bash
cd client
npm start # or npm run dev if using Vite
The application will be running at http://localhost:3000 and the API at http://localhost:5000.

🔌 API Reference
Here is a brief overview of the core API endpoints. (Update these to match your exact routes)

Authentication
POST /api/auth/register - Register a new user

POST /api/auth/login - Authenticate user & get token

GET /api/auth/profile - Get current user profile (Protected)

AI Core
POST /api/ai/generate-plan - Generates a custom study plan based on user skills (Protected)

GET /api/ai/recommendations - Fetches algorithmic course recommendations (Protected)

🌐 Deployment
This application is fully optimized for cloud deployment. The current production instance utilizes a split deployment architecture:

Backend Application: Deployed on Render, running the Node/Express server.

Database: Hosted on MongoDB Atlas.

Frontend Application: Built and served via Render (or Vercel/Netlify depending on exact frontend configuration).

Environment variables must be configured in the Render dashboard prior to spinning up the web service.

🔮 Future Scope
Advanced Analytics: Implementing deeper data processing modules for comprehensive skill extraction and gap analysis.

Gamification: Expanding user retention features with enhanced learning metrics and achievement badges.

Multi-language Support: Scaling the platform to support native proficiency in multiple languages for broader accessibility.

📬 Contact
Aniket Pawar * Email: anipawar9028@gmail.com

LinkedIn: Aniket Pawar (Update with your actual URL)

GitHub: ANIKET0102
