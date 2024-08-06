import React, { useState } from 'react';

const ProjectManagement = ({ projects, setProjects }) => {
  const [selectedProject, setSelectedProject] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', indicators: [] });
  const [newIndicator, setNewIndicator] = useState({
    name: '',
    target: { value: 0, description: '' },
    linkedActivities: [],
    locations: [],
    beneficiaryTypes: [],
    calculationMethod: ''
  });

  const handleAddProject = () => {
    if (newProject.name && newProject.indicators.length > 0) {
      setProjects(prev => ({ ...prev, [newProject.name]: newProject.indicators }));
      setNewProject({ name: '', indicators: [] });
      setEditMode(false);
    } else {
      alert('Please add a project name and at least one indicator.');
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
      setProjects(prev => {
        const updatedProjects = { ...prev };
        if (newProject.name !== selectedProject) {
          delete updatedProjects[selectedProject];
        }
        updatedProjects[newProject.name] = newProject.indicators;
        return updatedProjects;
      });
      setSelectedProject(newProject.name);
      setNewProject({ name: '', indicators: [] });
      setEditMode(false);
    } else {
      alert('Please ensure the project has a name and at least one indicator.');
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
    } else {
      alert('Please fill in at least the indicator name and target value.');
    }
  };

  const handleIndicatorInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'targetValue' || name === 'targetDescription') {
      setNewIndicator(prev => ({
        ...prev,
        target: {
          ...prev.target,
          [name === 'targetValue' ? 'value' : 'description']: value
        }
      }));
    } else {
      setNewIndicator(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelect = (e, field) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setNewIndicator(prev => ({ ...prev, [field]: selectedValues }));
  };

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Project Management</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
            <div key={index} className="mb-2 p-2 border rounded">
              <p><strong>{indicator.name}</strong> - Target: {indicator.target.value} {indicator.target.description}</p>
            </div>
          ))}
        </div>
        <div className="mb-4 p-4 border rounded">
          <input
            type="text"
            placeholder="Indicator Name"
            name="name"
            value={newIndicator.name}
            onChange={handleIndicatorInputChange}
            className="p-2 border rounded mb-2 w-full"
          />
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="number"
              placeholder="Target Value"
              name="targetValue"
              value={newIndicator.target.value}
              onChange={handleIndicatorInputChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Target Description"
              name="targetDescription"
              value={newIndicator.target.description}
              onChange={handleIndicatorInputChange}
              className="p-2 border rounded"
            />
          </div>
          <select
            multiple
            name="linkedActivities"
            value={newIndicator.linkedActivities}
            onChange={(e) => handleMultiSelect(e, 'linkedActivities')}
            className="p-2 border rounded mb-2 w-full"
          >
            <option value="Food Distribution">Food Distribution</option>
            <option value="Health Check">Health Check</option>
            <option value="Language Class">Language Class</option>
            <option value="Job Training">Job Training</option>
          </select>
          <select
            multiple
            name="beneficiaryTypes"
            value={newIndicator.beneficiaryTypes}
            onChange={(e) => handleMultiSelect(e, 'beneficiaryTypes')}
            className="p-2 border rounded mb-2 w-full"
          >
            <option value="Refugees">Refugees</option>
            <option value="Children">Children</option>
            <option value="Women">Women</option>
            <option value="Elderly">Elderly</option>
          </select>
          <input
            type="text"
            placeholder="Calculation Method"
            name="calculationMethod"
            value={newIndicator.calculationMethod}
            onChange={handleIndicatorInputChange}
            className="p-2 border rounded mb-2 w-full"
          />
          <button onClick={handleAddIndicator} className="bg-green-500 text-white px-4 py-2 rounded">
            Add Indicator
          </button>
        </div>
        <button
          onClick={editMode ? handleUpdateProject : handleAddProject}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editMode ? 'Update Project' : 'Add Project'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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