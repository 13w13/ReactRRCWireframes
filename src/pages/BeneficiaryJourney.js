import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import SimpleMap from './SimpleMap';

const BeneficiaryJourney = ({ activities }) => {
  const chartData = activities.map(activity => ({
    date: activity.date,
    activityType: activity.activityType,
  }));

  const locationData = activities.reduce((acc, activity) => {
    if (!acc[activity.location]) {
      acc[activity.location] = { count: 0, latitude: 0, longitude: 0 }; // You'll need to add actual coordinates
    }
    acc[activity.location].count++;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h5 className="text-lg font-semibold mb-2">Activity Timeline</h5>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="stepAfter" dataKey="activityType" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h5 className="text-lg font-semibold mb-2">Service Locations</h5>
        <div style={{ height: '200px', width: '100%' }}>
          <SimpleMap locationDistribution={locationData} />
        </div>
      </div>

      <div>
        <h5 className="text-lg font-semibold mb-2">Activity List</h5>
        <ul className="space-y-2">
          {activities.map((activity, index) => (
            <li key={index} className="bg-gray-100 p-2 rounded">
              <span className="font-semibold">{activity.date}:</span> {activity.activityType} at {activity.location}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BeneficiaryJourney;