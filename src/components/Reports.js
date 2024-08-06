import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Reports = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState('');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');

  const generateReportData = () => {
    if (!selectedProject || !projects[selectedProject]) return null;

    const projectData = projects[selectedProject];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const beneficiaryData = months.map(month => ({
      name: month,
      beneficiaries: Math.floor(Math.random() * 1000),
      services: Math.floor(Math.random() * 1500)
    }));

    const indicatorProgress = projectData.map(indicator => ({
      name: indicator.name,
      target: indicator.target.value,
      achieved: Math.floor(Math.random() * indicator.target.value)
    }));

    const beneficiaryTypes = projectData[0].beneficiaryTypes.map(type => ({
      name: type,
      value: Math.floor(Math.random() * 1000)
    }));

    return { beneficiaryData, indicatorProgress, beneficiaryTypes };
  };

  const reportData = generateReportData();

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Project Reports</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
      </div>

      {reportData && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiary Reach and Services</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData.beneficiaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="beneficiaries" stroke="#8884d8" name="Beneficiaries" />
                <Line yAxisId="right" type="monotone" dataKey="services" stroke="#82ca9d" name="Services" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Indicator Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.indicatorProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="achieved" fill="#8884d8" name="Achieved" />
                <Bar dataKey="target" fill="#82ca9d" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiary Types</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData.beneficiaryTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {reportData.beneficiaryTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Summary</h2>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-semibold">Total Beneficiaries:</td>
                    <td className="py-2 text-right">{reportData.beneficiaryData.reduce((sum, data) => sum + data.beneficiaries, 0)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold">Total Services:</td>
                    <td className="py-2 text-right">{reportData.beneficiaryData.reduce((sum, data) => sum + data.services, 0)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold">Average Services per Beneficiary:</td>
                    <td className="py-2 text-right">
                      {(reportData.beneficiaryData.reduce((sum, data) => sum + data.services, 0) / 
                        reportData.beneficiaryData.reduce((sum, data) => sum + data.beneficiaries, 0)).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Project Progress:</td>
                    <td className="py-2 text-right">
                      {(reportData.indicatorProgress.reduce((sum, indicator) => sum + indicator.achieved, 0) / 
                        reportData.indicatorProgress.reduce((sum, indicator) => sum + indicator.target, 0) * 100).toFixed(1)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;