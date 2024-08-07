import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Overview from './pages/Overview';
import BeneficiaryInfo from './pages/BeneficiaryInfo';
import ActivitiesTable from './pages/ActivitiesTable';
import ProjectManagement from './pages/ProjectManagement';
import Reports from './pages/Reports';
import DataIntegrationStatus from './pages/DataIntegrationStatus';

// Import mock data
import { beneficiaries as mockBeneficiaries, activities as mockActivities, projects as mockProjects, locations as mockLocations } from './data/mockData';

const App = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [projects, setProjects] = useState({});
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Simulate async data loading
    const loadData = async () => {
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 100));
      setBeneficiaries(mockBeneficiaries);
      setActivities(mockActivities);
      setProjects(mockProjects);
      setLocations(mockLocations);
    };

    loadData();
  }, []);

  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar navigation */}
        <div className="w-64 bg-gray-800 text-white">
          {/* ... (navigation links) ... */}
        </div>
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Overview beneficiaries={beneficiaries} activities={activities} projects={projects} locations={locations} />} />
            <Route path="/beneficiaries" element={<BeneficiaryInfo beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} />} />
            <Route path="/activities" element={<ActivitiesTable activities={activities} setActivities={setActivities} />} />
            <Route path="/projects" element={<ProjectManagement projects={projects} setProjects={setProjects} />} />
            <Route path="/reports" element={<Reports projects={projects} activities={activities} beneficiaries={beneficiaries} locations={locations} />} />
            <Route path="/data-integration" element={<DataIntegrationStatus />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;