import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const mockData = [
    { month: 'Jan', beneficiaries: 1000, services: 1500 },
    { month: 'Feb', beneficiaries: 2200, services: 3300 },
    { month: 'Mar', beneficiaries: 3500, services: 5200 },
    { month: 'Apr', beneficiaries: 5000, services: 7500 },
    { month: 'May', beneficiaries: 6800, services: 10200 },
    { month: 'Jun', beneficiaries: 9000, services: 13500 },
  ];

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Unified Beneficiary System Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">Total Beneficiaries</h2>
          <p className="text-3xl font-bold text-blue-600">9,000</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">Total Services Provided</h2>
          <p className="text-3xl font-bold text-green-600">13,500</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Cumulative Reach and Services</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="beneficiaries" stroke="#8884d8" name="Beneficiaries" />
            <Line type="monotone" dataKey="services" stroke="#82ca9d" name="Services" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Integration Status</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Source System</th>
              <th className="p-2 text-left">Last Sync</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">EspoCRM</td>
              <td className="p-2">2024-08-06 10:30 AM</td>
              <td className="p-2"><span className="px-2 py-1 bg-green-500 text-white rounded">Synced</span></td>
            </tr>
            <tr className="border-b">
              <td className="p-2">Easy Medical</td>
              <td className="p-2">2024-08-06 09:45 AM</td>
              <td className="p-2"><span className="px-2 py-1 bg-green-500 text-white rounded">Synced</span></td>
            </tr>
            <tr>
              <td className="p-2">Humanity Concept Store</td>
              <td className="p-2">2024-08-05 11:15 PM</td>
              <td className="p-2"><span className="px-2 py-1 bg-yellow-500 text-white rounded">Pending</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;