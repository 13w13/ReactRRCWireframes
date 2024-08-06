import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import BeneficiaryInfo from './components/BeneficiaryInfo';
import ActivitiesTable from './components/ActivitiesTable';
import Reports from './components/Reports';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 text-white">
        {/* Navigation Code */}
      </div>
      <div className="flex-1 overflow-y-auto">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'beneficiaries' && <BeneficiaryInfo />}
        {currentView === 'activities' && <ActivitiesTable />}
        {currentView === 'reports' && <Reports />}
      </div>
    </div>
  );
}

export default App;
