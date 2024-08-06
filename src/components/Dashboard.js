import React from 'react';

const mockActivities = [
  { id: 1, beneficiaryId: 'B12345', name: 'John Doe', activityType: 'Food Distribution', date: '2024-08-06', location: 'Bucharest Branch', source: 'Humanity concept store App' },
  { id: 2, beneficiaryId: 'B67890', name: 'Jane Smith', activityType: 'Health Check', date: '2024-08-06', location: 'Bucharest Mobile Clinic', source: 'Easy Medical' },
  { id: 3, beneficiaryId: 'B54321', name: 'Maria Pop', activityType: 'Language Class', date: '2024-08-05', location: 'Constanta Branch', source: 'EspoCRM' },
];

const Dashboard = () => (
  <div className="p-4 bg-gray-100">
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Stats</h2>
      <div className="flex justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-600">Total Beneficiaries</p>
          <p className="text-3xl font-bold text-blue-600">1,234</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-600">Activities Today</p>
          <p className="text-3xl font-bold text-green-600">56</p>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activities</h2>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Beneficiary ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Activity Type</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Location</th>
            <th className="p-2 text-left">Source</th>
          </tr>
        </thead>
        <tbody>
          {mockActivities.map(activity => (
            <tr key={activity.id} className="border-b">
              <td className="p-2">{activity.beneficiaryId}</td>
              <td className="p-2">{activity.name}</td>
              <td className="p-2">{activity.activityType}</td>
              <td className="p-2">{activity.date}</td>
              <td className="p-2">{activity.location}</td>
              <td className="p-2">{activity.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Dashboard;