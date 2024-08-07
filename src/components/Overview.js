import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Overview = ({ beneficiaries, activities, projects }) => {
  const totalBeneficiaries = beneficiaries.length;
  const totalActivities = activities.length;
  const totalProjects = Object.values(projects).flat().length;

  // Calculate beneficiary type distribution
  const beneficiaryTypesData = beneficiaries.reduce((acc, b) => {
    acc[b.beneficiaryType] = (acc[b.beneficiaryType] || 0) + 1;
    return acc;
  }, {});

  const beneficiaryTypeChartData = Object.entries(beneficiaryTypesData).map(([name, value]) => ({ name, value }));

  // Calculate activity type distribution
  const activityTypesData = activities.reduce((acc, a) => {
    acc[a.activityType] = (acc[a.activityType] || 0) + 1;
    return acc;
  }, {});

  const activityTypeChartData = Object.entries(activityTypesData).map(([activity, count]) => ({ activity, count }));

  // Calculate monthly activity trend
  const monthlyActivityData = activities.reduce((acc, a) => {
    const month = a.date.slice(0, 7); // Get YYYY-MM
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const monthlyActivityChartData = Object.entries(monthlyActivityData)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Overview</h1>
      
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Total Beneficiaries</h2>
          <p className="text-3xl font-bold text-blue-600">{totalBeneficiaries}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Total Activities</h2>
          <p className="text-3xl font-bold text-green-600">{totalActivities}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Total Projects</h2>
          <p className="text-3xl font-bold text-purple-600">{totalProjects}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Beneficiary Types</h2>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={beneficiaryTypeChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Activity Types</h2>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityTypeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="activity" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow col-span-2">
          <h2 className="text-xl font-semibold mb-4">Monthly Activity Trend</h2>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyActivityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" name="Activities" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;