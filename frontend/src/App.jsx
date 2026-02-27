import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Layout and Pages
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import StudyLab from './pages/StudyLab';
import Planner from './pages/Planner';
import Auth from './pages/Auth'; // 🚀 Import your new Auth page

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {/* 🍞 Global Notifications */}
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          style: { 
            background: '#1e293b', 
            color: '#fff', 
            border: '1px solid #334155' 
          } 
        }} 
      />

      <Routes>
        {/* 🚀 AUTH CHECK: If not logged in, every path leads to Auth page */}
        {!user ? (
          <Route path="*" element={<Auth />} />
        ) : (
          /* 🛡️ PROTECTED ROUTES: Only accessible when logged in */
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="lab" element={<StudyLab />} />
            <Route path="planner" element={<Planner />} />
            {/* Redirect any unknown paths to Dashboard if logged in */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}