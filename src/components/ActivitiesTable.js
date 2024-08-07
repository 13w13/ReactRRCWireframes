import React, { useState } from 'react';
import DataUpload from './DataUpload';

const ActivitiesTable = ({ activities, setActivities, beneficiaries, locations, activityTypes }) => {
  const [newActivity, setNewActivity] = useState({
    beneficiaryId: '',
    activityType: '',
    date: '',
    location: ''
  });
  const [uploadLogs, setUploadLogs] = useState([]);
  const [filter, setFilter] = useState({ activityType: '', location: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleAddActivity = () => {
    if (newActivity.beneficiaryId && newActivity.activityType && newActivity.date && newActivity.location) {
      const beneficiary = beneficiaries.find(b => b.id === newActivity.beneficiaryId);
      const location = locations.find(l => l.name === newActivity.location);
      setActivities(prev => [...prev, {
        id: `A${String(prev.length + 1).padStart(5, '0')}`,
        ...newActivity,
        beneficiaryName: beneficiary ? beneficiary.name : 'Unknown',
        latitude: location ? location.latitude : null,
        longitude: location ? location.longitude : null
      }]);
      setNewActivity({
        beneficiaryId: '',
        activityType: '',
        date: '',
        location: ''
      });
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleDataUploaded = (uploadedData) => {
    const newActivities = uploadedData.map((activity, index) => ({
      id: `A${String(activities.length + index + 1).padStart(5, '0')}`,
      ...activity,
      beneficiaryName: beneficiaries.find(b => b.id === activity.beneficiaryId)?.name || 'Unknown',
      latitude: locations.find(l => l.name === activity.location)?.latitude || null,
      longitude: locations.find(l => l.name === activity.location)?.longitude || null
    }));
    setActivities(prev => [...prev, ...newActivities]);
    setUploadLogs(prev => [...prev, {
      timestamp: new Date().toISOString(),
      count: uploadedData.length,
      status: 'Success'
    }]);
  };

  const filteredActivities = activities.filter(activity => 
    (!filter.activityType || activity.activityType === filter.activityType) &&
    (!filter.location || activity.location === filter.location)
  );

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Activities Monitoring</h1>
      
      <DataUpload 
        onDataUploaded={handleDataUploaded}
        templateFields={['beneficiaryId', 'activityType', 'date', 'location']}
        dataType="Activities"
      />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Activity</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            name="beneficiaryId"
            value={newActivity.beneficiaryId}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="">Select Beneficiary</option>
            {beneficiaries.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
            ))}
          </select>
          <select
            name="activityType"
            value={newActivity.activityType}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="">Select Activity Type</option>
            {activityTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input
            type="date"
            name="date"
            value={newActivity.date}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <select
            name="location"
            value={newActivity.location}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="">Select Location</option>
            {locations.map(l => (
              <option key={l.id} value={l.name}>{l.name}</option>
            ))}
          </select>
        </div>
        <button onClick={handleAddActivity} className="bg-blue-500 text-white px-4 py-2 rounded">Add Activity</button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter Activities</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            name="activityType"
            value={filter.activityType}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">All Activity Types</option>
            {activityTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            name="location"
            value={filter.location}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">All Locations</option>
            {locations.map(l => (
              <option key={l.id} value={l.name}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Activities List</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Beneficiary</th>
              <th className="p-2 text-left">Activity Type</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map(activity => (
              <tr key={activity.id} className="border-b">
                <td className="p-2">{activity.id}</td>
                <td className="p-2">{activity.beneficiaryName} ({activity.beneficiaryId})</td>
                <td className="p-2">{activity.activityType}</td>
                <td className="p-2">{activity.date}</td>
                <td className="p-2">{activity.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Logs</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Timestamp</th>
              <th className="p-2 text-left">Records Count</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {uploadLogs.map((log, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{log.timestamp}</td>
                <td className="p-2">{log.count}</td>
                <td className="p-2">{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivitiesTable;