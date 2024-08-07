import React, { useState } from 'react';
import DataUpload from './DataUpload';

const ActivitiesTable = ({ activities, setActivities }) => {  
  const [newActivity, setNewActivity] = useState({
    beneficiaryId: '',
    name: '',
    activityType: '',
    date: '',
    location: '',
    source: ''
  });
  const [uploadLogs, setUploadLogs] = useState([]);
  const [filter, setFilter] = useState({ activityType: '', location: '', source: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
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
    setUploadLogs(prev => [...prev, {
      timestamp: new Date().toISOString(),
      count: uploadedData.length,
      status: 'Success'
    }]);
  };

  const filteredActivities = activities.filter(activity => 
    (!filter.activityType || activity.activityType === filter.activityType) &&
    (!filter.location || activity.location === filter.location) &&
    (!filter.source || activity.source === filter.source)
  );

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Activities Monitoring</h1>
      
      <DataUpload 
        onDataUploaded={handleDataUploaded}
        templateFields={['beneficiaryId', 'name', 'activityType', 'date', 'location', 'source']}
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

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter Activities</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <select
            name="activityType"
            value={filter.activityType}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">All Activity Types</option>
            {[...new Set(activities.map(a => a.activityType))].map(type => (
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
            {[...new Set(activities.map(a => a.location))].map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          <select
            name="source"
            value={filter.source}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">All Sources</option>
            {[...new Set(activities.map(a => a.source))].map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
            {filteredActivities.map(activity => (
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