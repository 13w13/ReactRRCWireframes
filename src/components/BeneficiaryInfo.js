import React, { useState } from 'react';

const mockBeneficiaries = [
  {
    id: 'B12345',
    name: 'John Doe',
    dateOfBirth: '1980-01-01',
    gender: 'Male',
    nationality: 'Ukrainian',
    familyMembers: [
      { id: 'B12346', name: 'Jane Doe', relation: 'Spouse' },
      { id: 'B12347', name: 'Alice Doe', relation: 'Child' },
    ],
    lastActivity: { type: 'Food Distribution', date: '2024-08-06', location: 'Bucharest' },
  },
  {
    id: 'B67890',
    name: 'Maria Smith',
    dateOfBirth: '1990-05-15',
    gender: 'Female',
    nationality: 'Romanian',
    familyMembers: [
      { id: 'B67891', name: 'John Smith', relation: 'Spouse' },
    ],
    lastActivity: { type: 'Health Check', date: '2024-08-05', location: 'Mobile Clinic' },
  },
];

const BeneficiaryInfo = () => {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  const handleRowClick = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
  };

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Beneficiary Information (MOCKUP)</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiaries List</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Date of Birth</th>
              <th className="py-2 px-4 border-b">Gender</th>
              <th className="py-2 px-4 border-b">Nationality</th>
              <th className="py-2 px-4 border-b">Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {mockBeneficiaries.map((beneficiary) => (
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
                <td className="py-2 px-4 border-b">{beneficiary.lastActivity.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBeneficiary && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiary Details</h2>
          <p><strong>ID:</strong> {selectedBeneficiary.id}</p>
          <p><strong>Name:</strong> {selectedBeneficiary.name}</p>
          <p><strong>Date of Birth:</strong> {selectedBeneficiary.dateOfBirth}</p>
          <p><strong>Gender:</strong> {selectedBeneficiary.gender}</p>
          <p><strong>Nationality:</strong> {selectedBeneficiary.nationality}</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">Family Members</h3>
          <ul>
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
    </div>
  );
};

export default BeneficiaryInfo;