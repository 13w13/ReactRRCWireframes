import React, { useState } from 'react';
import DataUpload from './DataUpload';

const initialActivities = [
  { id: 1, beneficiaryId: 'B12345', name: 'John Doe', activityType: 'Food Distribution', date: '2024-08-06', location: 'Bucharest Branch', source: 'Concept Store' },
  { id: 2, beneficiaryId: 'B67890', name: 'Jane Smith', activityType: 'Health Check', date: '2024-08-06', location: 'Mobile Clinic', source: 'Easy Medical' },
  { id: 3, beneficiaryId: 'B54321', name: 'Maria Pop', activityType: 'Language Class', date: '2024-08-05', location: 'Constanta Branch', source: 'EspoCRM' },
];

const activityTemplateFields = [
  'beneficiaryId', 'name', 'activityType', 'date', 'location', 'source'
];

const ActivitiesTable = () => {
  const [activities, setActivities] = useState(initialActivities);
  const [newActivity, setNewActivity] = useState({
    beneficiaryId: '',
    name: '',
    activityType: '',
    date: '',
    location: '',
    source: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity(prev => ({ ...prev, [name]: value }));
  };

  const handleAddActivity = () => {
    if (newActivity.beneficiaryId && newActivity.activityType && newActivity.date) {
      setActivities(prev => [...prev, { id: Date.now(), ...newActivity }]);
      setNewActivity({
        beneficiaryId: '',
        name: '',
        activityType: '',
        date: '',
        location: '',
        source: ''
      });
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleDataUploaded = (uploadedData) => {
    const newActivities = uploadedData.map((activity, index) => ({
      id: Date.now() + index,
      ...activity
    }));
    setActivities(prev => [...prev, ...newActivities]);
  };

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Activities Monitoring</h1>
      
      <DataUpload 
        onDataUploaded={handleDataUploaded}
        templateFields={activityTemplateFields}
        dataType="Activities"
      />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Activity</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="beneficiaryId"
            placeholder="Beneficiary ID*"
            value={newActivity.beneficiaryId}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="name"
            placeholder="Beneficiary Name"
            value={newActivity.name}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="activityType"
            placeholder="Activity Type*"
            value={newActivity.activityType}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="date"
            name="date"
            value={newActivity.date}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={newActivity.location}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="source"
            placeholder="Source System"
            value={newActivity.source}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
        </div>
        <button onClick={handleAddActivity} className="bg-blue-500 text-white px-4 py-2 rounded">Add Activity</button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Activities List</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Beneficiary ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Activity Type</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Location</th>
              <th className="p-2 text-left">Source System</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(activity => (
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
};

export default ActivitiesTable;