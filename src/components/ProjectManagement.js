import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const activityTypes = [
  'Health consultations',
  'Food Distribution',
  'Shelter Support',
  'WASH Activities',
  'Protection Services',
  'Education Support',
  'Livelihoods Assistance',
  'Cash Assistance',
  'Psychosocial Support',
];

const locations = [
  'Bucharest Branch',
  'Cluj-Napoca Branch',
  'Iasi Branch',
  'Timisoara Branch',
  'Constanta Branch',
  'Mobile Clinic',
  'Refugee Camp A',
  'Refugee Camp B',
];

const beneficiaryTypes = [
  'Refugees',
  'Internally Displaced Persons',
  'Host Community Members',
  'Children',
  'Women',
  'Elderly',
  'Persons with Disabilities',
];

const ProjectManagement = () => {
  const [projects, setProjects] = useState({});
  const [selectedProject, setSelectedProject] = useState('');
  const [newProject, setNewProject] = useState({
    name: '',
    startDate: '',
    endDate: '',
    projectManager: '',
    donor: '',
    budget: '',
    accountingCode: '',
    objectives: '',
    indicators: [],
  });
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    if (selectedProject) {
      generateReport();
    }
  }, [selectedProject]);

  const generateReport = () => {
    const newReportData = projects[selectedProject].indicators.map(indicator => ({
      name: indicator.name,
      target: indicator.target.value,
      progress: Math.floor(Math.random() * indicator.target.value),
    }));
    setReportData(newReportData);
  };

  const handleAddNewProject = () => {
    if (newProject.name) {
      setProjects(prevProjects => ({
        ...prevProjects,
        [newProject.name]: newProject,
      }));
      setSelectedProject(newProject.name);
      setShowNewProjectForm(false);
      setNewProject({
        name: '',
        startDate: '',
        endDate: '',
        projectManager: '',
        donor: '',
        budget: '',
        accountingCode: '',
        objectives: '',
        indicators: [],
      });
    }
  };

  const handleAddIndicator = () => {
    setNewProject(prevProject => ({
      ...prevProject,
      indicators: [
        ...prevProject.indicators,
        {
          name: '',
          description: '',
          target: { value: 0, description: '' },
          linkedActivities: [],
          locations: [],
          beneficiaryTypes: [],
          calculationMethod: '',
        },
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

  const renderCheckboxGroup = (options, selectedValues, onChange, title) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{title}</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map(option => (
          <label key={option} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={() => {
                const newValues = selectedValues.includes(option)
                  ? selectedValues.filter(v => v !== option)
                  : [...selectedValues, option];
                onChange(newValues);
              }}
              className="mr-2"
            />
            <span className="text-sm">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Project and Indicator Management</h2>
        <button
          onClick={() => setShowNewProjectForm(!showNewProjectForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          {showNewProjectForm ? 'Cancel' : 'Create New Project'}
        </button>
        
        {showNewProjectForm ? (
          <div className="mb-4">
            {/* Project details form */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                className="p-2 border rounded w-full"
                title="Enter the official name of the project as it appears in the project proposal"
              />
            </div>
            {/* Add other project fields (startDate, endDate, projectManager, etc.) here */}
            
            <h3 className="text-lg font-semibold mb-2">Indicators</h3>
            <button
              onClick={handleAddIndicator}
              className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            >
              Add New Indicator
            </button>
            {newProject.indicators.map((indicator, index) => (
              <div key={index} className="mb-6 p-4 border rounded bg-gray-50">
                <h4 className="text-md font-semibold mb-2">Indicator {index + 1}</h4>
                {/* Indicator fields */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Indicator Name</label>
                  <input
                    type="text"
                    value={indicator.name}
                    onChange={(e) => handleIndicatorChange(index, 'name', e.target.value)}
                    className="p-2 border rounded w-full"
                    title="Short, descriptive name for the indicator"
                  />
                </div>
                {/* Add other indicator fields here */}
                {renderCheckboxGroup(
                  activityTypes,
                  indicator.linkedActivities,
                  (newValues) => handleIndicatorChange(index, 'linkedActivities', newValues),
                  "Linked Activities"
                )}
                {renderCheckboxGroup(
                  locations,
                  indicator.locations,
                  (newValues) => handleIndicatorChange(index, 'locations', newValues),
                  "Applicable Locations"
                )}
                {renderCheckboxGroup(
                  beneficiaryTypes,
                  indicator.beneficiaryTypes,
                  (newValues) => handleIndicatorChange(index, 'beneficiaryTypes', newValues),
                  "Beneficiary Types"
                )}
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
            <div className="grid grid-cols-2 gap-4 mb-4">
              <select 
                value={selectedProject} 
                onChange={(e) => setSelectedProject(e.target.value)} 
                className="p-2 border rounded"
              >
                <option value="">Select a Project</option>
                {Object.keys(projects).map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
              <button
                onClick={generateReport}
                className="bg-green-500 text-white px-4 py-2 rounded"
                disabled={!selectedProject}
              >
                Generate Report
              </button>
            </div>
            {selectedProject && (
              <>
                <h3 className="text-xl font-semibold mb-2">Project Details</h3>
                {/* Display project details */}
                <h3 className="text-xl font-semibold mt-4 mb-2">Indicators Progress</h3>
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
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;