import React from 'react';
import { useHistory } from 'react-router-dom';

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

const BeneficiaryInfo = () => {
  const history = useHistory();

  const handleRowClick = (id) => {
    history.push(`/beneficiary/${id}`);
  };

  return (
    <div className="p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiaries List</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Date of Birth</th>
              <th className="py-2 px-4 border-b">Number of Family Members</th>
              <th className="py-2 px-4 border-b">Last Activity</th>
              <th className="py-2 px-4 border-b">Last Date</th>
              <th className="py-2 px-4 border-b">Last Location</th>
            </tr>
          </thead>
          <tbody>
            {mockBeneficiaries.map((beneficiary) => (
              <tr
                key={beneficiary.id}
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => handleRowClick(beneficiary.id)}
              >
                <td className="py-2 px-4 border-b">{beneficiary.id}</td>
                <td className="py-2 px-4 border-b">{beneficiary.name}</td>
                <td className="py-2 px-4 border-b">{beneficiary.dateOfBirth}</td>
                <td className="py-2 px-4 border-b">{beneficiary.familyMembers.length}</td>
                <td className="py-2 px-4 border-b">{beneficiary.lastActivity.type}</td>
                <td className="py-2 px-4 border-b">{beneficiary.lastActivity.date}</td>
                <td className="py-2 px-4 border-b">{beneficiary.lastActivity.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BeneficiaryInfo;