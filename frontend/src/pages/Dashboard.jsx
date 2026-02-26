import { useState, useEffect } from "react";
import StatCards from "../components/dashboard/StatCards";
import SubjectGrid from "../components/dashboard/SubjectGrid";
import Modal from "../components/shared/Modal";
import { fetchSubjects, fetchStats } from "../services/api";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const [stats, setStats] = useState({
    conceptsMastered: 0,
    studyHours: 0,
    activeCourses: 0,
    dayStreak: 0,
  });

  // 1. One function to load all dashboard data on the first render
  const loadData = async () => {
    try {
      const [subjectsRes, statsRes] = await Promise.all([
        fetchSubjects(),
        fetchStats(),
      ]);
      setSubjects(subjectsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  // 2. A separate function specifically for the Modal to refresh just the subjects
  const loadSubjects = async () => {
    try {
      const response = await fetchSubjects();
      setSubjects(response.data);
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  };

  // 3. Exactly ONE useEffect that runs when the dashboard opens
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Aniket!</h1>
          <p className="text-slate-400">
            Ready to master some new concepts today?
          </p>
        </div>
      </header>

      {/* We will pass the stats into here in the next step */}
      <StatCards data={stats} />

      {/* Pass subjects down to the grid */}
      <SubjectGrid
        subjects={subjects}
        onAddClick={() => setIsModalOpen(true)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubjectAdded={loadSubjects}
      />
    </div>
  );
}