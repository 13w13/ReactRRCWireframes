import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import BeneficiaryInfo from './components/BeneficiaryInfo';
import ActivitiesTable from './components/ActivitiesTable';
import Reports from './components/Reports';
import ProjectManagement from './components/ProjectManagement';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 text-white">
        <div className="bg-red-600 p-4">
          <h1 className="text-xl font-bold">Romanian Red Cross</h1>
          <h2 className="text-sm">Unified Beneficiary System</h2>
        </div>
        <nav className="mt-6">
          <button onClick={() => setCurrentView('dashboard')} className="block w-full text-left px-4 py-2 hover:bg-gray-700">Dashboard</button>
          <button onClick={() => setCurrentView('beneficiaries')} className="block w-full text-left px-4 py-2 hover:bg-gray-700">Beneficiaries</button>
          <button onClick={() => setCurrentView('activities')} className="block w-full text-left px-4 py-2 hover:bg-gray-700">Activities</button>
          <button onClick={() => setCurrentView('reports')} className="block w-full text-left px-4 py-2 hover:bg-gray-700">Reports</button>
          <button onClick={() => setCurrentView('projectManagement')} className="block w-full text-left px-4 py-2 hover:bg-gray-700">Project Management</button>
        </nav>
      </div>
      <div className="flex-1 overflow-y-auto">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'beneficiaries' && <BeneficiaryInfo />}
        {currentView === 'activities' && <ActivitiesTable />}
        {currentView === 'reports' && <Reports />}
        {currentView === 'projectManagement' && <ProjectManagement />}
      </div>
    </div>
  );
};

export default App;