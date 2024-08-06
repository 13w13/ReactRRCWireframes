import React, { useState } from 'react';

const mockSyncStatus = [
  { source: 'EspoCRM', lastSync: '2024-08-05 14:30:00', status: 'success' },
  { source: 'Easy Medical', lastSync: '2024-08-06 09:15:00', status: 'success' },
  { source: 'Humanity Concept Store', lastSync: '2024-08-04 18:45:00', status: 'failed' },
];

const mockSyncLogs = [
  { id: 1, timestamp: '2024-08-06 09:15:00', source: 'Easy Medical', action: 'Sync', status: 'Success', details: 'Synced 150 records' },
  { id: 2, timestamp: '2024-08-05 14:30:00', source: 'EspoCRM', action: 'Sync', status: 'Success', details: 'Synced 200 records' },
  { id: 3, timestamp: '2024-08-04 18:45:00', source: 'Humanity Concept Store', action: 'Sync', status: 'Failed', details: 'Connection timeout' },
];

const DataIntegrationStatus = () => {
  const [activeTab, setActiveTab] = useState('status');

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Data Integration Status</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex mb-4">
          <button
            className={`mr-2 px-4 py-2 rounded ${activeTab === 'status' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('status')}
          >
            System Sync Status
          </button>
          <button
            className={`mr-2 px-4 py-2 rounded ${activeTab === 'syncLogs' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('syncLogs')}
          >
            Sync Logs
          </button>
        </div>
        
        {activeTab === 'status' && (
          <div>
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
        )}

        {activeTab === 'syncLogs' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sync Logs</h2>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Timestamp</th>
                  <th className="p-2 text-left">Source</th>
                  <th className="p-2 text-left">Action</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {mockSyncLogs.map((log) => (
                  <tr key={log.id} className="border-b">
                    <td className="p-2">{log.timestamp}</td>
                    <td className="p-2">{log.source}</td>
                    <td className="p-2">{log.action}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded ${log.status === 'Success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="p-2">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataIntegrationStatus;