import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Overview from './pages/Overview';
import BeneficiaryInfo from './pages/BeneficiaryInfo';
import ActivitiesTable from './pages/ActivitiesTable';
import ProjectManagement from './pages/ProjectManagement';
import Reports from './pages/Reports';
import { beneficiaries as mockBeneficiaries, activities as mockActivities, projects as mockProjects } from './data/mockData';

const App = () => {
  const [beneficiaries, setBeneficiaries] = useState(mockBeneficiaries);
  const [activities, setActivities] = useState(mockActivities);
  const [projects, setProjects] = useState(mockProjects);

  useEffect(() => {
    // You can fetch real data here if needed
    // For now, we're using mock data
  }, []);

  return (
    <Router>
      <div className="flex h-screen">
        <div className="w-64 bg-gray-800 text-white">
          <div className="bg-red-600 p-4">
            <h1 className="text-xl font-bold">Romanian Red Cross</h1>
            <h2 className="text-sm">Unified Beneficiary System</h2>
          </div>
          <nav className="mt-6">
            <Link to="/" className="block w-full text-left px-4 py-2 hover:bg-gray-700">Overview</Link>
            <Link to="/beneficiaries" className="block w-full text-left px-4 py-2 hover:bg-gray-700">Beneficiaries</Link>
            <Link to="/activities" className="block w-full text-left px-4 py-2 hover:bg-gray-700">Activities</Link>
            <Link to="/projects" className="block w-full text-left px-4 py-2 hover:bg-gray-700">Project Management</Link>
            <Link to="/reports" className="block w-full text-left px-4 py-2 hover:bg-gray-700">Reports</Link>
          </nav>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Overview beneficiaries={beneficiaries} activities={activities} projects={projects} />} />
            <Route path="/beneficiaries" element={<BeneficiaryInfo beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} />} />
            <Route path="/activities" element={<ActivitiesTable activities={activities} setActivities={setActivities} />} />
            <Route path="/projects" element={<ProjectManagement projects={projects} setProjects={setProjects} />} />
            <Route path="/reports" element={<Reports projects={projects} activities={activities} beneficiaries={beneficiaries} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;