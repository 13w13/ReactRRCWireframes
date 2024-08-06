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

const Reports = ({ projects, activities }) => {
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
    
    const beneficiaryData = months.map(month => ({
      name: month,
      services: Math.floor(Math.random() * 1500),
      uniqueBeneficiaries: Math.floor(Math.random() * 1000)
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

    const totalServices = beneficiaryData.reduce((sum, data) => sum + data.services, 0);
    const totalUniqueBeneficiaries = beneficiaryData.reduce((sum, data) => sum + data.uniqueBeneficiaries, 0);
    const averageServicesPerBeneficiary = (totalServices / totalUniqueBeneficiaries).toFixed(2);
    const projectProgress = (indicatorProgress[0].achieved / indicatorProgress[0].target * 100).toFixed(1);

    setReportData({
      beneficiaryData,
      indicatorProgress,
      beneficiaryTypes,
      summary: {
        totalServices,
        totalUniqueBeneficiaries,
        averageServicesPerBeneficiary,
        projectProgress
      }
    });
  };

  const exportToExcel = () => {
    if (!reportData) return;

    const workbook = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(reportData.beneficiaryData);
    XLSX.utils.book_append_sheet(workbook, ws, "Monthly Data");
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
                    <td className="py-2 text-right">{reportData.summary.totalServices}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold">Total Unique Beneficiaries:</td>
                    <td className="py-2 text-right">{reportData.summary.totalUniqueBeneficiaries}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold">Average Services per Beneficiary:</td>
                    <td className="py-2 text-right">{reportData.summary.averageServicesPerBeneficiary}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Project Progress:</td>
                    <td className="py-2 text-right">{reportData.summary.projectProgress}%</td>
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