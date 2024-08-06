import React, { useState } from 'react';

const activityTypes = [
  'Health consultations', 'Food Distribution', 'Shelter Support', 'WASH Activities',
  'Protection Services', 'Education Support', 'Livelihoods Assistance',
  'Cash Assistance', 'Psychosocial Support'
];

const locations = [
  'Bucharest Branch', 'Cluj-Napoca Branch', 'Iasi Branch', 'Timisoara Branch',
  'Constanta Branch', 'Mobile Clinic', 'Refugee Camp A', 'Refugee Camp B'
];

const beneficiaryTypes = [
  'Refugees', 'Internally Displaced Persons', 'Host Community Members',
  'Children', 'Women', 'Elderly', 'Persons with Disabilities'
];

const initialProjects = {
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
    // Add more indicators as needed
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
    // Add more indicators as needed
  ],
};

const ProjectManagement = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState('');
  const [newProject, setNewProject] = useState({ name: '', indicators: [] });
  const [newIndicator, setNewIndicator] = useState({
    name: '',
    target: { value: 0, description: '' },
    linkedActivities: [],
    locations: [],
    beneficiaryTypes: [],
    calculationMethod: ''
  });
  const [editMode, setEditMode] = useState(false);

  const handleAddProject = () => {
    if (newProject.name && newProject.indicators.length > 0) {
      setProjects(prev => ({ ...prev, [newProject.name]: newProject.indicators }));
      setNewProject({ name: '', indicators: [] });
    }
  };

  const handleAddIndicator = () => {
    if (newIndicator.name && newIndicator.target.value) {
      setNewProject(prev => ({
        ...prev,
        indicators: [...prev.indicators, { ...newIndicator, id: Date.now().toString() }]
      }));
      setNewIndicator({
        name: '',
        target: { value: 0, description: '' },
        linkedActivities: [],
        locations: [],
        beneficiaryTypes: [],
        calculationMethod: ''
      });
    }
  };

  const handleEditProject = () => {
    if (selectedProject) {
      setEditMode(true);
      setNewProject({
        name: selectedProject,
        indicators: projects[selectedProject]
      });
    }
  };

  const handleUpdateProject = () => {
    if (newProject.name && newProject.indicators.length > 0) {
      setProjects(prev => ({
        ...prev,
        [newProject.name]: newProject.indicators
      }));
      if (newProject.name !== selectedProject) {
        setProjects(prev => {
          const { [selectedProject]: _, ...rest } = prev;
          return rest;
        });
      }
      setSelectedProject(newProject.name);
      setNewProject({ name: '', indicators: [] });
      setEditMode(false);
    }
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Project Management (MOCKUP)</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {editMode ? 'Edit Project' : 'Add New Project'}
        </h2>
        <input
          type="text"
          placeholder="Project Name"
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          className="p-2 border rounded mb-4 w-full"
        />
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Indicators</h3>
          {newProject.indicators.map((indicator, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <p><strong>Name:</strong> {indicator.name}</p>
              <p><strong>Target:</strong> {indicator.target.value} {indicator.target.description}</p>
              <p><strong>Linked Activities:</strong> {indicator.linkedActivities.join(', ')}</p>
              <p><strong>Locations:</strong> {indicator.locations.join(', ')}</p>
              <p><strong>Beneficiary Types:</strong> {indicator.beneficiaryTypes.join(', ')}</p>
              <p><strong>Calculation Method:</strong> {indicator.calculationMethod}</p>
            </div>
          ))}
          <div className="mb-4 p-4 border rounded">
            <input
              type="text"
              placeholder="Indicator Name"
              value={newIndicator.name}
              onChange={(e) => setNewIndicator({ ...newIndicator, name: e.target.value })}
              className="p-2 border rounded mb-2 w-full"
            />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="number"
                placeholder="Target Value"
                value={newIndicator.target.value}
                onChange={(e) => setNewIndicator({ ...newIndicator, target: { ...newIndicator.target, value: parseInt(e.target.value) } })}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Target Description"
                value={newIndicator.target.description}
                onChange={(e) => setNewIndicator({ ...newIndicator, target: { ...newIndicator.target, description: e.target.value } })}
                className="p-2 border rounded"
              />
            </div>
            {renderCheckboxGroup(
              activityTypes,
              newIndicator.linkedActivities,
              (newValues) => setNewIndicator({ ...newIndicator, linkedActivities: newValues }),
              "Linked Activities"
            )}
            {renderCheckboxGroup(
              locations,
              newIndicator.locations,
              (newValues) => setNewIndicator({ ...newIndicator, locations: newValues }),
              "Locations"
            )}
            {renderCheckboxGroup(
              beneficiaryTypes,
              newIndicator.beneficiaryTypes,
              (newValues) => setNewIndicator({ ...newIndicator, beneficiaryTypes: newValues }),
              "Beneficiary Types"
            )}
            <textarea
              placeholder="Calculation Method"
              value={newIndicator.calculationMethod}
              onChange={(e) => setNewIndicator({ ...newIndicator, calculationMethod: e.target.value })}
              className="p-2 border rounded w-full mb-2"
            />
            <button onClick={handleAddIndicator} className="bg-green-500 text-white px-4 py-2 rounded">
              Add Indicator
            </button>
          </div>
        </div>
        <button
          onClick={editMode ? handleUpdateProject : handleAddProject}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editMode ? 'Update Project' : 'Add Project'}
        </button>
      </div>
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Existing Projects</h2>
        <select 
          value={selectedProject} 
          onChange={(e) => setSelectedProject(e.target.value)}
          className="p-2 border rounded mb-4 w-full"
        >
          <option value="">Select a Project</option>
          {Object.keys(projects).map(project => (
            <option key={project} value={project}>{project}</option>
          ))}
        </select>
        {selectedProject && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Project Indicators</h3>
            {projects[selectedProject].map((indicator) => (
              <div key={indicator.id} className="mb-4 p-4 border rounded">
                <p><strong>Name:</strong> {indicator.name}</p>
                <p><strong>Target:</strong> {indicator.target.value} {indicator.target.description}</p>
                <p><strong>Linked Activities:</strong> {indicator.linkedActivities.join(', ')}</p>
                <p><strong>Locations:</strong> {indicator.locations.join(', ')}</p>
                <p><strong>Beneficiary Types:</strong> {indicator.beneficiaryTypes.join(', ')}</p>
                <p><strong>Calculation Method:</strong> {indicator.calculationMethod}</p>
              </div>
            ))}
            <button onClick={handleEditProject} className="bg-yellow-500 text-white px-4 py-2 rounded">
              Edit Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;