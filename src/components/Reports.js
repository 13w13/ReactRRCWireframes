import React, { useState, useEffect } from 'react';
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
import * as XLSX from 'xlsx';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Reports = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState('');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (selectedProject) {
      generateReportData();
    }
  }, [selectedProject, startDate, endDate]);

  const generateReportData = () => {
    if (!selectedProject || !projects[selectedProject]) return;

    const projectData = projects[selectedProject];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const beneficiaryData = months.map(month => {
      const services = Math.floor(Math.random() * 1500);
      const uniqueBeneficiaries = Math.floor(services * (0.6 + Math.random() * 0.3)); // 60-90% of services
      return {
        name: month,
        services,
        uniqueBeneficiaries
      };
    });

    const indicatorProgress = projectData.map(indicator => ({
      name: indicator.name,
      target: indicator.target.value,
      achieved: Math.floor(Math.random() * indicator.target.value)
    }));

    const beneficiaryTypes = projectData[0].beneficiaryTypes.map(type => ({
      name: type,
      value: Math.floor(Math.random() * 1000)
    }));

    setReportData({ beneficiaryData, indicatorProgress, beneficiaryTypes });
  };

  const exportToExcel = () => {
    if (!reportData) return;

    const workbook = XLSX.utils.book_new();

    // Create a sheet for each indicator
    projects[selectedProject].forEach(indicator => {
      const sheetData = [
        ['Indicator', indicator.name],
        ['Target', `${indicator.target.value} ${indicator.target.description}`],
        ['Achieved', reportData.indicatorProgress.find(i => i.name === indicator.name)?.achieved || 0],
        [''],
        ['Date', 'Services', 'Unique Beneficiaries', 'Male', 'Female', 'Children', 'Adults', 'Elderly', ...indicator.nationalities],
      ];

      // Add mock data for each month
      reportData.beneficiaryData.forEach(data => {
        const row = [
          data.name,
          data.services,
          data.uniqueBeneficiaries,
          Math.floor(data.uniqueBeneficiaries * 0.48), // Mock male count
          Math.floor(data.uniqueBeneficiaries * 0.52), // Mock female count
          Math.floor(data.uniqueBeneficiaries * 0.3),  // Mock children count
          Math.floor(data.uniqueBeneficiaries * 0.6),  // Mock adults count
          Math.floor(data.uniqueBeneficiaries * 0.1),  // Mock elderly count
          ...indicator.nationalities.map(() => Math.floor(Math.random() * data.uniqueBeneficiaries)), // Mock nationality counts
        ];
        sheetData.push(row);
      });

      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, ws, indicator.name);
    });

    XLSX.writeFile(workbook, `${selectedProject}_Report.xlsx`);
  };

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
        <button
          onClick={exportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={!reportData}
        >
          Export to Excel
        </button>
      </div>

      {reportData && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Services and Unique Beneficiaries</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData.beneficiaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="services" stroke="#8884d8" name="Services" />
                <Line type="monotone" dataKey="uniqueBeneficiaries" stroke="#82ca9d" name="Unique Beneficiaries" />
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

          <div className="grid grid-cols-2 gap-6 mb-6">
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
                    <td className="py-2 font-semibold">Total Services:</td>
                    <td className="py-2 text-right">{reportData.beneficiaryData.reduce((sum, data) => sum + data.services, 0)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold">Total Unique Beneficiaries:</td>
                    <td className="py-2 text-right">{reportData.beneficiaryData.reduce((sum, data) => sum + data.uniqueBeneficiaries, 0)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold">Average Services per Beneficiary:</td>
                    <td className="py-2 text-right">
                      {(reportData.beneficiaryData.reduce((sum, data) => sum + data.services, 0) / 
                        reportData.beneficiaryData.reduce((sum, data) => sum + data.uniqueBeneficiaries, 0)).toFixed(2)}
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

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Monthly Breakdown</h2>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Month</th>
                  <th className="p-2 text-left">Services</th>
                  <th className="p-2 text-left">Unique Beneficiaries</th>
                </tr>
              </thead>
              <tbody>
                {reportData.beneficiaryData.map((data, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{data.name}</td>
                    <td className="p-2">{data.services}</td>
                    <td className="p-2">{data.uniqueBeneficiaries}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;