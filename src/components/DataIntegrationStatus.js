import React from 'react';

const mockSyncStatus = [
  { source: 'EspoCRM', lastSync: '2024-08-05 14:30:00', status: 'success' },
  { source: 'Easy Medical', lastSync: '2024-08-06 09:15:00', status: 'success' },
  { source: 'Humanity Concept Store', lastSync: '2024-08-04 18:45:00', status: 'failed' },
];

const DataIntegrationStatus = () => {
  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Data Integration Status (MOCKUP)</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">System Sync Status</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Data Source</th>
              <th className="p-2 text-left">Last Sync</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockSyncStatus.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{item.source}</td>
                <td className="p-2">{item.lastSync}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded ${item.status === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {item.status === 'success' ? 'Synced' : 'Failed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataIntegrationStatus;