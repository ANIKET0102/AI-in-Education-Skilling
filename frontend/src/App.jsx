import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// These paths now perfectly match your structure
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import StudyLab from './pages/StudyLab';
import Planner from './pages/Planner';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      
      {/* 🍞 The Global Toaster for our awesome pop-up notifications! */}
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          style: { 
            background: '#1e293b', // Matches your dark slate theme
            color: '#fff', 
            border: '1px solid #334155' 
          } 
        }} 
      />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="lab" element={<StudyLab />} />
          <Route path="planner" element={<Planner />} />
        </Route>
      </Routes>
      
    </BrowserRouter>
  );
}