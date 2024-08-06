import React from 'react';

const ActivitiesTable = () => {
  const [activities, setActivities] = useState(mockActivities);
  const [newActivity, setNewActivity] = useState({});

  const handleAddActivity = () => {
    setActivities([...activities, { id: activities.length + 1, ...newActivity }]);
    setNewActivity({});
  };

  return (
    <div className="p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Activities Monitoring</h2>
        <div className="mb-4 grid grid-cols-3 gap-4">
          <input type="text" placeholder="Beneficiary ID" value={newActivity.beneficiaryId || ''} onChange={(e) => setNewActivity({...newActivity, beneficiaryId: e.target.value})} className="p-2 border rounded" />
          <input type="text" placeholder="Name" value={newActivity.name || ''} onChange={(e) => setNewActivity({...newActivity, name: e.target.value})} className="p-2 border rounded" />
          <input type="text" placeholder="Activity Type" value={newActivity.activityType || ''} onChange={(e) => setNewActivity({...newActivity, activityType: e.target.value})} className="p-2 border rounded" />
          <input type="date" value={newActivity.date || ''} onChange={(e) => setNewActivity({...newActivity, date: e.target.value})} className="p-2 border rounded" />
          <input type="text" placeholder="Location" value={newActivity.location || ''} onChange={(e) => setNewActivity({...newActivity, location: e.target.value})} className="p-2 border rounded" />
          <input type="text" placeholder="Source" value={newActivity.source || ''} onChange={(e) => setNewActivity({...newActivity, source: e.target.value})} className="p-2 border rounded" />
        </div>
        <button onClick={handleAddActivity} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Add Activity</button>
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
