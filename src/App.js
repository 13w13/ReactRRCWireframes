import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Overview from './components/Overview';
import BeneficiaryInfo from './components/BeneficiaryInfo';
import ActivitiesTable from './components/ActivitiesTable';
import ProjectManagement from './components/ProjectManagement';
import Reports from './components/Reports';
import DataIntegrationStatus from './components/DataIntegrationStatus';

// Import mock data
import { beneficiaries as mockBeneficiaries, activities as mockActivities, projects as mockProjects } from './data/mockData';
const App = () => {
  const [beneficiaries, setBeneficiaries] = useState(mockBeneficiaries);
  const [activities, setActivities] = useState(mockActivities);
  const [projects, setProjects] = useState(mockProjects);

  return (
    <Router>
      <div className="flex h-screen">
        <div className="w-64 bg-gray-800 text-white">
          {/* Sidebar content remains unchanged */}
        </div>
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Overview beneficiaries={beneficiaries} activities={activities} projects={projects} />} />
            <Route path="/beneficiaries" element={<BeneficiaryInfo beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} />} />
            <Route path="/activities" element={<ActivitiesTable activities={activities} setActivities={setActivities} />} />
            <Route path="/reports" element={<Reports projects={projects} activities={activities} beneficiaries={beneficiaries} />} />
            <Route path="/project-management" element={<ProjectManagement projects={projects} setProjects={setProjects} />} />
            <Route path="/data-integration" element={<DataIntegrationStatus />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;