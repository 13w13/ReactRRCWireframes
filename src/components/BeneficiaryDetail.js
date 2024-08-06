import React from 'react';
import { useParams } from 'react-router-dom';

const mockBeneficiaries = [
  {
    id: '1',
    name: 'John Doe',
    dateOfBirth: '1980-01-01',
    gender: 'Male',
    age: 42,
    nationality: 'American',
    familyMembers: [
      { id: '1', name: 'Jane Doe', relation: 'Wife' },
      { id: '2', name: 'Jack Doe', relation: 'Son' },
    ],
    lastActivity: { type: 'Food Distribution', date: '2024-08-06', location: 'Bucharest' },
  },
  {
    id: '2',
    name: 'Maria Smith',
    dateOfBirth: '1990-05-15',
    gender: 'Female',
    age: 34,
    nationality: 'British',
    familyMembers: [
      { id: '3', name: 'John Smith', relation: 'Husband' },
    ],
    lastActivity: { type: 'Medical Aid', date: '2024-07-20', location: 'London' },
  },
  // Add more beneficiaries as needed
];

const BeneficiaryDetail = () => {
  const { id } = useParams();
  const beneficiary = mockBeneficiaries.find((b) => b.id === id);

  if (!beneficiary) {
    return <div>Beneficiary not found</div>;
  }

  return (
    <div className="p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiary Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>ID:</strong> {beneficiary.id}</p>
            <p><strong>Name:</strong> {beneficiary.name}</p>
            <p><strong>Date of Birth:</strong> {beneficiary.dateOfBirth}</p>
          </div>
          <div>
            <p><strong>Gender:</strong> {beneficiary.gender}</p>
            <p><strong>Age:</strong> {beneficiary.age}</p>
            <p><strong>Nationality:</strong> {beneficiary.nationality}</p>
          </div>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-2">Family Members</h3>
        <ul>
          {beneficiary.familyMembers.map((member) => (
            <li key={member.id}>{member.name} - {member.relation}</li>
          ))}
        </ul>
        <h3 className="text-xl font-semibold mt-6 mb-2">Last Activity</h3>
        <p><strong>Type:</strong> {beneficiary.lastActivity.type}</p>
        <p><strong>Date:</strong> {beneficiary.lastActivity.date}</p>
        <p><strong>Location:</strong> {beneficiary.lastActivity.location}</p>
      </div>
    </div>
  );
};

export default BeneficiaryDetail;