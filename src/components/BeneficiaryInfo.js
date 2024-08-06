import React from 'react';

const mockBeneficiary = {
  id: 'B12345', name: 'John Doe', dateOfBirth: '1985-03-15', gender: 'Male', age: 39, nationality: 'Ukrainian',
  familyMembers: [
    { id: 'B12346', name: 'Jane Doe', relation: 'Spouse' },
    { id: 'B12347', name: 'Alice Doe', relation: 'Child' },
  ],
  lastActivity: { type: 'Food Distribution', date: '2024-08-06', location: 'Bucharest' },
};

const BeneficiaryInfo = () => (
  <div className="p-4 bg-gray-100">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiary Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p><strong>ID:</strong> {mockBeneficiary.id}</p>
          <p><strong>Name:</strong> {mockBeneficiary.name}</p>
          <p><strong>Date of Birth:</strong> {mockBeneficiary.dateOfBirth}</p>
        </div>
        <div>
          <p><strong>Gender:</strong> {mockBeneficiary.gender}</p>
          <p><strong>Age:</strong> {mockBeneficiary.age}</p>
          <p><strong>Nationality:</strong> {mockBeneficiary.nationality}</p>
        </div>
      </div>
      <h3 className="text-xl font-semibold mt-6 mb-2">Family Members</h3>
      <ul>
        {mockBeneficiary.familyMembers.map(member => (
          <li key={member.id}>{member.name} - {member.relation}</li>
        ))}
      </ul>
      <h3 className="text-xl font-semibold mt-6 mb-2">Last Activity</h3>
      <p><strong>Type:</strong> {mockBeneficiary.lastActivity.type}</p>
      <p><strong>Date:</strong> {mockBeneficiary.lastActivity.date}</p>
      <p><strong>Location:</strong> {mockBeneficiary.lastActivity.location}</p>
    </div>
  </div>
);

export default BeneficiaryInfo;