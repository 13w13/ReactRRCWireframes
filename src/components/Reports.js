import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Reports = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState('');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [reportData, setReportData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [ageData, setAgeData] = useState([]);

  useEffect(() => {
    if (selectedProject) {
      generateReport();
    }
  }, [selectedProject, startDate, endDate]);

  const generateReport = () => {
    // Check if the selected project exists
    if (!projects[selectedProject]) {
      console.error('Selected project not found');
      return;
    }

    // In a real application, this would fetch data from an API
    const newReportData = projects[selectedProject].map(indicator => ({
      name: indicator.name,
      target: indicator.target.value,
      progress: Math.min(Math.floor(Math.random() * indicator.target.value), indicator.target.value),
    }));
    setReportData(newReportData);

    // Generate mock gender and age data
    setGenderData([
      { name: 'Male', value: Math.floor(Math.random() * 1000) },
      { name: 'Female', value: Math.floor(Math.random() * 1000) },
    ]);
    setAgeData([
      { name: '0-18', value: Math.floor(Math.random() * 500) },
      { name: '19-30', value: Math.floor(Math.random() * 500) },
      { name: '31-50', value: Math.floor(Math.random() * 500) },
      { name: '51+', value: Math.floor(Math.random() * 500) },
    ]);
  };

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports (MOCKUP)</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
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
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="p-2 border rounded" 
          />
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="p-2 border rounded" 
          />
        </div>
        <button
          onClick={generateReport}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          disabled={!selectedProject}
        >
          Generate Report
        </button>
        
        {reportData.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Indicators</h2>
            <table className="w-full mb-6">
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

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Indicator Progress</h3>
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
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Gender Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Age Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;