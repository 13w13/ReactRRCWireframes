import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import SimpleMap from '../components/SimpleMap';

const Overview = ({ beneficiaries, activities, projects, locations }) => {  const totalBeneficiaries = beneficiaries.length;
  const totalActivities = activities.length;
  const totalProjects = Object.values(projects).flat().length;

  // Prepare data for the activities and beneficiaries chart
  const chartData = activities.reduce((acc, activity) => {
    const date = activity.date.slice(0, 7); // Get YYYY-MM
    const existingEntry = acc.find(entry => entry.month === date);
    if (existingEntry) {
      existingEntry.activities++;
      if (!existingEntry.beneficiaries.includes(activity.beneficiaryId)) {
        existingEntry.beneficiaries.push(activity.beneficiaryId);
      }
    } else {
      acc.push({ month: date, activities: 1, beneficiaries: [activity.beneficiaryId] });
    }
    return acc;
  }, []).map(entry => ({
    ...entry,
    beneficiaries: entry.beneficiaries.length,
  })).sort((a, b) => a.month.localeCompare(b.month));

  // Prepare data for beneficiary type distribution
  const beneficiaryTypeData = beneficiaries.reduce((acc, beneficiary) => {
    acc[beneficiary.beneficiaryType] = (acc[beneficiary.beneficiaryType] || 0) + 1;
    return acc;
  }, {});

  const beneficiaryTypePieData = Object.entries(beneficiaryTypeData).map(([name, value]) => ({ name, value }));

  // Prepare data for project progress
  const projectProgressData = Object.entries(projects).map(([projectName, projectDetails]) => ({
    name: projectName,
    target: projectDetails.reduce((sum, project) => sum + project.target.value, 0),
    achieved: projectDetails.reduce((sum, project) => 
      sum + project.monthlyProgress.reduce((total, month) => total + month.count, 0), 0)
  }));

  // Prepare data for location-based distribution
  const locationDistribution = activities.reduce((acc, activity) => {
    const location = locations.find(l => l.name === activity.location);
    if (location) {
      if (!acc[location.name]) {
        acc[location.name] = {
          count: 0,
          latitude: location.latitude,
          longitude: location.longitude
        };
      }
      acc[location.name].count++;
    }
    return acc;
  }, {});

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Unified Beneficiary System Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">Total Beneficiaries</h2>
          <p className="text-3xl font-bold text-blue-600">{totalBeneficiaries}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">Total Activities</h2>
          <p className="text-3xl font-bold text-green-600">{totalActivities}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">Active Projects</h2>
          <p className="text-3xl font-bold text-purple-600">{totalProjects}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Cumulative Reach and Services</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="activities" stroke="#8884d8" name="Activities" />
            <Line yAxisId="right" type="monotone" dataKey="beneficiaries" stroke="#82ca9d" name="Unique Beneficiaries" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiary Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={beneficiaryTypePieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {beneficiaryTypePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectProgressData}>
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
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Geographic Distribution of Beneficiaries</h2>
        <div style={{ height: '400px', width: '100%' }}>
          <SimpleMap locationDistribution={locationDistribution} />
        </div>
      </div>
    </div>
  );
};

export default Overview;