import React, { useState } from 'react';

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

const ProjectManagement = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState('');
  const [newProject, setNewProject] = useState({ name: '', indicators: [] });
  const [newIndicator, setNewIndicator] = useState({ name: '', target: 0 });

  const handleAddProject = () => {
    if (newProject.name && newProject.indicators.length > 0) {
      setProjects({
        ...projects,
        [newProject.name]: newProject.indicators
      });
      setNewProject({ name: '', indicators: [] });
    }
  };

  const handleAddIndicator = () => {
    if (newIndicator.name && newIndicator.target) {
      setNewProject({
        ...newProject,
        indicators: [...newProject.indicators, { ...newIndicator, id: Date.now().toString() }]
      });
      setNewIndicator({ name: '', target: 0 });
    }
  };

  return (
    <div className="p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Management</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Add New Project</h3>
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            className="p-2 border rounded mb-2 w-full"
          />
          <div className="mb-2">
            <input
              type="text"
              placeholder="Indicator Name"
              value={newIndicator.name}
              onChange={(e) => setNewIndicator({ ...newIndicator, name: e.target.value })}
              className="p-2 border rounded mr-2"
            />
            <input
              type="number"
              placeholder="Target"
              value={newIndicator.target}
              onChange={(e) => setNewIndicator({ ...newIndicator, target: parseInt(e.target.value) })}
              className="p-2 border rounded mr-2"
            />
            <button onClick={handleAddIndicator} className="bg-green-500 text-white px-4 py-2 rounded">Add Indicator</button>
          </div>
          <ul className="list-disc pl-5 mb-2">
            {newProject.indicators.map((indicator, index) => (
              <li key={index}>{indicator.name} - Target: {indicator.target}</li>
            ))}
          </ul>
          <button onClick={handleAddProject} className="bg-blue-500 text-white px-4 py-2 rounded">Add Project</button>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2">Existing Projects</h3>
          <select 
            value={selectedProject} 
            onChange={(e) => setSelectedProject(e.target.value)}
            className="p-2 border rounded mb-2 w-full"
          >
            <option value="">Select a Project</option>
            {Object.keys(projects).map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
          {selectedProject && (
            <ul className="list-disc pl-5">
              {projects[selectedProject].map((indicator) => (
                <li key={indicator.id}>{indicator.name} - Target: {indicator.target}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;