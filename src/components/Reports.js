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
    const filteredActivities = activities.filter(
      activity => 
        activity.date >= startDate && 
        activity.date <= endDate && 
        projectData[0].linkedActivities.includes(activity.activityType)
    );

    const indicatorData = projectData.map(indicator => {
      const relevantActivities = filteredActivities.filter(
        activity => indicator.linkedActivities.includes(activity.activityType)
      );

      const uniqueBeneficiaries = new Set(relevantActivities.map(a => a.beneficiaryId)).size;
      const totalServices = relevantActivities.length;

      // Mock SADD data (replace with actual data in a real scenario)
      const maleCount = Math.floor(uniqueBeneficiaries * 0.48);
      const femaleCount = uniqueBeneficiaries - maleCount;
      const childrenCount = Math.floor(uniqueBeneficiaries * 0.3);
      const adultCount = Math.floor(uniqueBeneficiaries * 0.6);
      const elderlyCount = uniqueBeneficiaries - childrenCount - adultCount;

      return {
        name: indicator.name,
        target: indicator.target.value,
        uniqueBeneficiaries,
        totalServices,
        male: maleCount,
        female: femaleCount,
        children: childrenCount,
        adult: adultCount,
        elderly: elderlyCount
      };
    });

    setReportData(indicatorData);
  };

  const exportToExcel = () => {
    if (!reportData) return;

    const workbook = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(reportData);
    XLSX.utils.book_append_sheet(workbook, ws, "Indicator Report");
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Indicator Report</h2>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Indicator</th>
                <th className="p-2 text-left">Target</th>
                <th className="p-2 text-left">People Reached</th>
                <th className="p-2 text-left">Services</th>
                <th className="p-2 text-left">Male</th>
                <th className="p-2 text-left">Female</th>
                <th className="p-2 text-left">Children</th>
                <th className="p-2 text-left">Adult</th>
                <th className="p-2 text-left">Elderly</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((indicator, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{indicator.name}</td>
                  <td className="p-2">{indicator.target}</td>
                  <td className="p-2">{indicator.uniqueBeneficiaries}</td>
                  <td className="p-2">{indicator.totalServices}</td>
                  <td className="p-2">{indicator.male}</td>
                  <td className="p-2">{indicator.female}</td>
                  <td className="p-2">{indicator.children}</td>
                  <td className="p-2">{indicator.adult}</td>
                  <td className="p-2">{indicator.elderly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ... (keep the existing charts for overall project visualization) */}
    </div>
  );
};

export default Reports;