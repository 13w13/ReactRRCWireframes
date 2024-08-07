import React, { useState } from 'react';
import DataUpload from './DataUpload';

const BeneficiaryInfo = ({ beneficiaries, setBeneficiaries }) => {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [uploadLogs, setUploadLogs] = useState([]);

  const handleRowClick = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
  };

  const handleDataUploaded = (uploadedData) => {
    const newBeneficiaries = uploadedData.map(beneficiary => ({
      ...beneficiary,
      familyMembers: beneficiary.familyMembers ? JSON.parse(beneficiary.familyMembers) : [],
      lastActivity: beneficiary.lastActivity ? JSON.parse(beneficiary.lastActivity) : null
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
        templateFields={[
          'id', 'name', 'dateOfBirth', 'gender', 'nationality', 'beneficiaryType', 
          'temporaryProtectionNumber', 'familyMembers', 'lastActivity', 'registrationDate', 
          'branch', 'educationLevel', 'occupation', 'vulnerability', 'householdSize', 'incomeLevel'
        ]}
        dataType="Beneficiaries"
      />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiaries List</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Nationality</th>
              <th className="py-2 px-4 border-b">Beneficiary Type</th>
              <th className="py-2 px-4 border-b">Education Level</th>
              <th className="py-2 px-4 border-b">Occupation</th>
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
                <td className="py-2 px-4 border-b">{beneficiary.nationality}</td>
                <td className="py-2 px-4 border-b">{beneficiary.beneficiaryType}</td>
                <td className="py-2 px-4 border-b">{beneficiary.educationLevel}</td>
                <td className="py-2 px-4 border-b">{beneficiary.occupation}</td>
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
              <p><strong>Nationality:</strong> {selectedBeneficiary.nationality}</p>
              <p><strong>Beneficiary Type:</strong> {selectedBeneficiary.beneficiaryType}</p>
              <p><strong>Education Level:</strong> {selectedBeneficiary.educationLevel}</p>
            </div>
            <div>
              <p><strong>Occupation:</strong> {selectedBeneficiary.occupation}</p>
              <p><strong>Vulnerability:</strong> {selectedBeneficiary.vulnerability}</p>
              <p><strong>Household Size:</strong> {selectedBeneficiary.householdSize}</p>
              <p><strong>Income Level:</strong> {selectedBeneficiary.incomeLevel}</p>
              <p><strong>Temporary Protection Number:</strong> {selectedBeneficiary.temporaryProtectionNumber || 'N/A'}</p>
              <p><strong>Registration Date:</strong> {selectedBeneficiary.registrationDate}</p>
              <p><strong>Branch:</strong> {selectedBeneficiary.branch}</p>
            </div>
          </div>
          <h3 className="text-xl font-semibold mt-4 mb-2">Family Members</h3>
          <ul className="list-disc pl-5 mb-4">
            {selectedBeneficiary.familyMembers.map(member => (
              <li key={member.id}>{member.name} - {member.relation}</li>
            ))}
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2">Last Activity</h3>
          <p><strong>Type:</strong> {selectedBeneficiary.lastActivity?.type}</p>
          <p><strong>Date:</strong> {selectedBeneficiary.lastActivity?.date}</p>
          <p><strong>Location:</strong> {selectedBeneficiary.lastActivity?.location}</p>
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