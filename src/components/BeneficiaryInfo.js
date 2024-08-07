import React, { useState } from 'react';
import DataUpload from './DataUpload';



const initialBeneficiaries = [
  {
    id: 'B12345',
    name: 'John Doe',
    dateOfBirth: '1980-01-01',
    gender: 'Male',
    nationality: 'Ukrainian',
    beneficiaryType: 'Refugee',
    familyMembers: [
      { id: 'B12346', name: 'Jane Doe', relation: 'Spouse' },
      { id: 'B12347', name: 'Alice Doe', relation: 'Child' },
    ],
    lastActivity: { type: 'Food Distribution', date: '2024-08-06', location: 'Bucharest' },
  },
  // ... other beneficiaries
];

const beneficiaryTemplateFields = [
  'id', 'name', 'dateOfBirth', 'gender', 'nationality', 'beneficiaryType',
  'familyMember1Name', 'familyMember1Relation',
  'familyMember2Name', 'familyMember2Relation',
  'lastActivityType', 'lastActivityDate', 'lastActivityLocation'
];

const BeneficiaryInfo = ({ beneficiaries, setBeneficiaries }) => {  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [uploadLogs, setUploadLogs] = useState([]);

  const handleRowClick = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
  };

  const handleDataUploaded = (uploadedData) => {
    const newBeneficiaries = uploadedData.map(beneficiary => ({
      ...beneficiary,
      familyMembers: [
        { id: `${beneficiary.id}-1`, name: beneficiary.familyMember1Name, relation: beneficiary.familyMember1Relation },
        { id: `${beneficiary.id}-2`, name: beneficiary.familyMember2Name, relation: beneficiary.familyMember2Relation },
      ].filter(member => member.name && member.relation),
      lastActivity: {
        type: beneficiary.lastActivityType,
        date: beneficiary.lastActivityDate,
        location: beneficiary.lastActivityLocation
      }
    }));
    setBeneficiaries(prev => [...prev, ...newBeneficiaries]);
    setUploadLogs(prev => [...prev, {
      timestamp: new Date().toISOString(),
      count: uploadedData.length,
      status: 'Success'
    }]);
  };

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Beneficiary Information</h1>

      <DataUpload 
        onDataUploaded={handleDataUploaded}
        templateFields={beneficiaryTemplateFields}
        dataType="Beneficiaries"
      />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiaries List</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Date of Birth</th>
              <th className="py-2 px-4 border-b">Gender</th>
              <th className="py-2 px-4 border-b">Nationality</th>
              <th className="py-2 px-4 border-b">Beneficiary Type</th>
              <th className="py-2 px-4 border-b">Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {beneficiaries.map((beneficiary) => (
              <tr
                key={beneficiary.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleRowClick(beneficiary)}
              >
                <td className="py-2 px-4 border-b">{beneficiary.id}</td>
                <td className="py-2 px-4 border-b">{beneficiary.name}</td>
                <td className="py-2 px-4 border-b">{beneficiary.dateOfBirth}</td>
                <td className="py-2 px-4 border-b">{beneficiary.gender}</td>
                <td className="py-2 px-4 border-b">{beneficiary.nationality}</td>
                <td className="py-2 px-4 border-b">{beneficiary.beneficiaryType}</td>
                <td className="py-2 px-4 border-b">{beneficiary.lastActivity.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBeneficiary && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiary Details</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p><strong>ID:</strong> {selectedBeneficiary.id}</p>
              <p><strong>Name:</strong> {selectedBeneficiary.name}</p>
              <p><strong>Date of Birth:</strong> {selectedBeneficiary.dateOfBirth}</p>
              <p><strong>Gender:</strong> {selectedBeneficiary.gender}</p>
            </div>
            <div>
              <p><strong>Nationality:</strong> {selectedBeneficiary.nationality}</p>
              <p><strong>Beneficiary Type:</strong> {selectedBeneficiary.beneficiaryType}</p>
            </div>
          </div>
          <h3 className="text-xl font-semibold mt-4 mb-2">Family Members</h3>
          <ul className="list-disc pl-5 mb-4">
            {selectedBeneficiary.familyMembers.map(member => (
              <li key={member.id}>{member.name} - {member.relation}</li>
            ))}
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2">Last Activity</h3>
          <p><strong>Type:</strong> {selectedBeneficiary.lastActivity.type}</p>
          <p><strong>Date:</strong> {selectedBeneficiary.lastActivity.date}</p>
          <p><strong>Location:</strong> {selectedBeneficiary.lastActivity.location}</p>
        </div>
      )}

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
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

export default BeneficiaryInfo;