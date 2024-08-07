import React, { useState } from 'react';
import DataUpload from '../components/DataUpload';

const beneficiaryTemplateFields = [
  'id', 'name', 'dateOfBirth', 'gender', 'nationality', 'beneficiaryType',
  'temporaryProtectionNumber', 'familyMembers', 'registrationDate', 'branch',
  'educationLevel', 'occupation', 'vulnerability', 'householdSize', 'incomeLevel',
  'lastActivityType', 'lastActivityDate', 'lastActivityLocation'
];

const BeneficiaryInfo = ({ beneficiaries, setBeneficiaries }) => {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [uploadLogs, setUploadLogs] = useState([]);
  const [filter, setFilter] = useState({ beneficiaryType: '', nationality: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleRowClick = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
  };

  const handleDataUploaded = (uploadedData) => {
    const newBeneficiaries = uploadedData.map(beneficiary => ({
      ...beneficiary,
      familyMembers: beneficiary.familyMembers ? JSON.parse(beneficiary.familyMembers) : [],
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const filteredBeneficiaries = beneficiaries.filter(beneficiary => 
    (!filter.beneficiaryType || beneficiary.beneficiaryType === filter.beneficiaryType) &&
    (!filter.nationality || beneficiary.nationality === filter.nationality)
  );

  const paginatedBeneficiaries = filteredBeneficiaries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBeneficiaries.length / itemsPerPage);

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Beneficiary Information</h1>

      <DataUpload 
        onDataUploaded={handleDataUploaded}
        templateFields={beneficiaryTemplateFields}
        dataType="Beneficiaries"
      />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter Beneficiaries</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            name="beneficiaryType"
            value={filter.beneficiaryType}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">All Beneficiary Types</option>
            {[...new Set(beneficiaries.map(b => b.beneficiaryType))].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            name="nationality"
            value={filter.nationality}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">All Nationalities</option>
            {[...new Set(beneficiaries.map(b => b.nationality))].map(nationality => (
              <option key={nationality} value={nationality}>{nationality}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiaries List</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Nationality</th>
              <th className="py-2 px-4 border-b">Beneficiary Type</th>
              <th className="py-2 px-4 border-b">Registration Date</th>
              <th className="py-2 px-4 border-b">Branch</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBeneficiaries.map((beneficiary) => (
              <tr
                key={beneficiary.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleRowClick(beneficiary)}
              >
                <td className="py-2 px-4 border-b">{beneficiary.id}</td>
                <td className="py-2 px-4 border-b">{beneficiary.name}</td>
                <td className="py-2 px-4 border-b">{beneficiary.nationality}</td>
                <td className="py-2 px-4 border-b">{beneficiary.beneficiaryType}</td>
                <td className="py-2 px-4 border-b">{beneficiary.registrationDate}</td>
                <td className="py-2 px-4 border-b">{beneficiary.branch}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span>{currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
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
              <p><strong>Temporary Protection Number:</strong> {selectedBeneficiary.temporaryProtectionNumber || 'N/A'}</p>
              <p><strong>Registration Date:</strong> {selectedBeneficiary.registrationDate}</p>
              <p><strong>Branch:</strong> {selectedBeneficiary.branch}</p>
            </div>
            <div>
              <p><strong>Education Level:</strong> {selectedBeneficiary.educationLevel}</p>
              <p><strong>Occupation:</strong> {selectedBeneficiary.occupation}</p>
              <p><strong>Vulnerability:</strong> {selectedBeneficiary.vulnerability}</p>
              <p><strong>Household Size:</strong> {selectedBeneficiary.householdSize}</p>
              <p><strong>Income Level:</strong> {selectedBeneficiary.incomeLevel}</p>
            </div>
          </div>
          <h3 className="text-xl font-semibold mt-4 mb-2">Family Members</h3>
          <ul className="list-disc pl-5 mb-4">
            {selectedBeneficiary.familyMembers.map((member, index) => (
              <li key={index}>{member.name} - {member.relation}</li>
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