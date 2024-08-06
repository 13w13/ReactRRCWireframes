import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const initialProjects = {
  SEM: [
    { id: 'sem1', name: 'Employability support', target: 1000 },
    { id: 'sem2', name: 'Education activities', target: 500 },
    { id: 'sem3', name: 'Language lessons', target: 750 },
  ],
  Ukraine: [
    { id: 'ukr1', name: 'Primary health services', target: 5000 },
    { id: 'ukr2', name: 'Mental Health support', target: 2000 },
    { id: 'ukr3', name: 'First Aid training', target: 1000 },
  ],
};

const activityTypes = [
  'Health consultations',
  'Food Distribution',
  'Language Class',
  'Job Training',
  'Mental Health Support',
];

const locations = [
  'Bucharest Branch',
  'Cluj-Napoca Branch',
  'Iasi Branch',
  'Timisoara Branch',
  'Constanta Branch',
];

const Reports = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState('SEM');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [reportData, setReportData] = useState([]);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    startDate: '',
    endDate: '',
    projectManager: '',
    indicators: [],
  });

  useEffect(() => {
    generateReport();
  }, [selectedProject, startDate, endDate]);

  const generateReport = () => {
    // This is a placeholder for the actual report generation logic
    const newReportData = projects[selectedProject].map(indicator => ({
      name: indicator.name,
      target: indicator.target,
      progress: Math.floor(Math.random() * indicator.target),
    }));
    setReportData(newReportData);
  };

  const handleAddNewProject = () => {
    setProjects(prevProjects => ({
      ...prevProjects,
      [newProject.name]: newProject.indicators,
    }));
    setShowNewProjectForm(false);
    setNewProject({
      name: '',
      startDate: '',
      endDate: '',
      projectManager: '',
      indicators: [],
    });
  };

  const handleAddIndicator = () => {
    setNewProject(prevProject => ({
      ...prevProject,
      indicators: [
        ...prevProject.indicators,
        { name: '', target: 0, linkedActivity: '', locations: [], nationality: '' },
      ],
    }));
  };

  const handleIndicatorChange = (index, field, value) => {
    setNewProject(prevProject => ({
      ...prevProject,
      indicators: prevProject.indicators.map((indicator, i) =>
        i === index ? { ...indicator, [field]: value } : indicator
      ),
    }));
  };

  return (
    <div className="p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reports and Indicators</h2>
        <button
          onClick={() => setShowNewProjectForm(!showNewProjectForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          {showNewProjectForm ? 'Cancel' : 'Add New Project Report'}
        </button>
        
        {showNewProjectForm ? (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              className="p-2 border rounded mb-2 w-full"
            />
            <input
              type="date"
              value={newProject.startDate}
              onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
              className="p-2 border rounded mb-2 w-full"
            />
            <input
              type="date"
              value={newProject.endDate}
              onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
              className="p-2 border rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Project Manager"
              value={newProject.projectManager}
              onChange={(e) => setNewProject({...newProject, projectManager: e.target.value})}
              className="p-2 border rounded mb-2 w-full"
            />
            <button
              onClick={handleAddIndicator}
              className="bg-green-500 text-white px-4 py-2 rounded mb-2"
            >
              Add Indicator
            </button>
            {newProject.indicators.map((indicator, index) => (
              <div key={index} className="mb-2 p-2 border rounded">
                <input
                  type="text"
                  placeholder="Indicator Name"
                  value={indicator.name}
                  onChange={(e) => handleIndicatorChange(index, 'name', e.target.value)}
                  className="p-2 border rounded mb-2 w-full"
                />
                <input
                  type="number"
                  placeholder="Target"
                  value={indicator.target}
                  onChange={(e) => handleIndicatorChange(index, 'target', parseInt(e.target.value))}
                  className="p-2 border rounded mb-2 w-full"
                />
                <select
                  value={indicator.linkedActivity}
                  onChange={(e) => handleIndicatorChange(index, 'linkedActivity', e.target.value)}
                  className="p-2 border rounded mb-2 w-full"
                >
                  <option value="">Select Linked Activity</option>
                  {activityTypes.map(activity => (
                    <option key={activity} value={activity}>{activity}</option>
                  ))}
                </select>
                <select
                  multiple
                  value={indicator.locations}
                  onChange={(e) => handleIndicatorChange(index, 'locations', Array.from(e.target.selectedOptions, option => option.value))}
                  className="p-2 border rounded mb-2 w-full"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Specific Nationality (optional)"
                  value={indicator.nationality}
                  onChange={(e) => handleIndicatorChange(index, 'nationality', e.target.value)}
                  className="p-2 border rounded mb-2 w-full"
                />
              </div>
            ))}
            <button
              onClick={handleAddNewProject}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save Project
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="p-2 border rounded">
                {Object.keys(projects).map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded" />
            </div>
            <table className="w-full mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Indicator</th>
                  <th className="p-2 text-left">Target</th>
                  <th className="p-2 text-left">Progress</th>
                  <th className="p-2 text-left">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((indicator) => (
                  <tr key={indicator.name} className="border-b">
                    <td className="p-2">{indicator.name}</td>
                    <td className="p-2">{indicator.target}</td>
                    <td className="p-2">{indicator.progress}</td>
                    <td className="p-2">{Math.round((indicator.progress / indicator.target) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="progress" fill="#8884d8" name="Progress" />
                <Bar dataKey="target" fill="#82ca9d" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;