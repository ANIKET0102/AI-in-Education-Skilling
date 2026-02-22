import { BrowserRouter, Routes, Route } from 'react-router-dom';

// These paths now perfectly match your image_025842.png structure
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import StudyLab from './pages/StudyLab';
import Planner from './pages/Planner';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
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