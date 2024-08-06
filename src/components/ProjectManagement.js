import React, { useState } from 'react';
import { ResponsiveContainer, Tooltip } from 'recharts';
import { TreeMap } from 'recharts/lib/chart/TreeMap';

const ProjectManagement = ({ projects, setProjects }) => {
  const [selectedProject, setSelectedProject] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', indicators: [] });

  const handleAddProject = () => {
    if (newProject.name && newProject.indicators.length > 0) {
      setProjects(prev => ({ ...prev, [newProject.name]: newProject.indicators }));
      setNewProject({ name: '', indicators: [] });
      setEditMode(false);
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
    }
  };

  const renderProjectStructure = () => {
    if (!selectedProject) return null;

    const projectData = {
      name: selectedProject,
      children: projects[selectedProject].map(indicator => ({
        name: indicator.name,
        size: indicator.target.value,
        children: [
          ...indicator.linkedActivities.map(activity => ({ name: activity, size: 1 })),
          ...indicator.beneficiaryTypes.map(type => ({ name: type, size: 1 }))
        ]
      }))
    };

    return (
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Project Structure</h3>
        <ResponsiveContainer width="100%" height={400}>
          <TreeMap
            data={[projectData]}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
          >
            <Tooltip content={<CustomTooltip />} />
          </TreeMap>
        </ResponsiveContainer>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border p-2 shadow-md">
          <p className="font-semibold">{data.name}</p>
          {data.target && <p>Target: {data.target.value} {data.target.description}</p>}
        </div>
      );
    }
    return null;
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
        {/* Add form fields for indicators, linked activities, etc. */}
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

      {renderProjectStructure()}
    </div>
  );
};

export default ProjectManagement;