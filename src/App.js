import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import BeneficiaryInfo from './components/BeneficiaryInfo';
import ActivitiesTable from './components/ActivitiesTable';
import ProjectManagement from './components/ProjectManagement';
import Reports from './components/Reports';
import DataIntegrationStatus from './components/DataIntegrationStatus';

const App = () => {
  const [projects, setProjects] = useState({
    SEM: [
      {
        id: 'sem1',
        name: 'Employability support',
        target: { value: 1000, description: 'People supported' },
        linkedActivities: ['Livelihoods Assistance', 'Education Support'],
        locations: ['Bucharest Branch', 'Cluj-Napoca Branch'],
        beneficiaryTypes: ['Refugees', 'Internally Displaced Persons'],
        calculationMethod: 'Count of unique beneficiaries receiving employability support'
      },
    ],
    Ukraine: [
      {
        id: 'ukr1',
        name: 'Primary health services',
        target: { value: 5000, description: 'Consultations provided' },
        linkedActivities: ['Health consultations'],
        locations: ['Mobile Clinic', 'Refugee Camp A', 'Refugee Camp B'],
        beneficiaryTypes: ['Refugees', 'Children', 'Women', 'Elderly'],
        calculationMethod: 'Sum of all health consultations provided'
      },
    ],
  });

  return (
    <Router>
      <div className="flex h-screen">
        <div className="w-64 bg-gray-800 text-white">
          <div className="bg-red-600 p-4">
            <h1 className="text-xl font-bold">Romanian Red Cross</h1>
            <h2 className="text-sm">Unified Beneficiary System</h2>
          </div>
          <nav className="mt-6">
            <Link to="/" className="block w-full text-left px-4 py-2 hover:bg-gray-700">Dashboard</Link>
            <Link to="/beneficiaries" className="block w-full text-left px-4 py-2 hover:bg-gray-700">Beneficiaries</Link>
            <Link to="/activities" className="block w-full text-left px-4 py-2 hover:bg-gray-700">Activities</Link>
            <Link to="/project-management" className="block w-full text-left px-4 py-2 hover:bg-gray-700">Project Management</Link>
            <Link to="/reports" className="block w-full text-left px-4 py-2 hover:bg-gray-700">Reports</Link>
            <Link to="/data-integration" className="block w-full text-left px-4 py-2 hover:bg-gray-700">Data Integration</Link>
          </nav>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/beneficiaries" element={<BeneficiaryInfo />} />
            <Route path="/activities" element={<ActivitiesTable />} />
            <Route path="/project-management" element={<ProjectManagement projects={projects} setProjects={setProjects} />} />
            <Route path="/reports" element={<Reports projects={projects} />} />
            <Route path="/data-integration" element={<DataIntegrationStatus />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;