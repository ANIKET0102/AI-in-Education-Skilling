import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 🚀 Initialize theme BEFORE React renders to prevent flash
const initializeTheme = () => {
  const isDarkMode = localStorage.getItem("theme") === "dark";
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

initializeTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);