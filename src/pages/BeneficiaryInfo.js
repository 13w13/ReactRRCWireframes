import React, { useState } from 'react';
import DataUpload from '../components/DataUpload';

const beneficiaryTemplateFields = [
  'id', 'name', 'dateOfBirth', 'gender', 'nationality', 'beneficiaryType',
  'temporaryProtectionNumber', 'familyMembers', 'registrationDate', 'branch',
  'educationLevel', 'occupation', 'vulnerability', 'householdSize', 'incomeLevel',
  'lastActivityType', 'lastActivityDate', 'lastActivityLocation', 'source'
];

const BeneficiaryInfo = ({ beneficiaries, setBeneficiaries }) => {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [uploadLogs, setUploadLogs] = useState([]);
  const [filter, setFilter] = useState({ beneficiaryType: '', nationality: '', source: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);

  const handleRowClick = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setShowModal(true);
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
    (!filter.nationality || beneficiary.nationality === filter.nationality) &&
    (!filter.source || beneficiary.source === filter.source)
  );

  const totalPages = Math.ceil(filteredBeneficiaries.length / itemsPerPage);
  const paginatedBeneficiaries = filteredBeneficiaries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        <div className="grid grid-cols-3 gap-4 mb-4">
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
          <select
            name="source"
            value={filter.source}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">All Sources</option>
            {[...new Set(beneficiaries.map(b => b.source))].map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiaries List</h2>
        <div className="mb-4">
          <label className="mr-2">Items per page:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="p-2 border rounded"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Nationality</th>
              <th className="py-2 px-4 border-b">Beneficiary Type</th>
              <th className="py-2 px-4 border-b">Registration Date</th>
              <th className="py-2 px-4 border-b">Branch</th>
              <th className="py-2 px-4 border-b">Source</th>
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
                <td className="py-2 px-4 border-b">{beneficiary.source}</td>
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

      {showModal && selectedBeneficiary && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={() => setShowModal(false)}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedBeneficiary.name}</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  ID: {selectedBeneficiary.id}<br />
                  Nationality: {selectedBeneficiary.nationality}<br />
                  Beneficiary Type: {selectedBeneficiary.beneficiaryType}<br />
                  Registration Date: {selectedBeneficiary.registrationDate}<br />
                  Branch: {selectedBeneficiary.branch}<br />
                  Source: {selectedBeneficiary.source}<br />
                  Date of Birth: {selectedBeneficiary.dateOfBirth}<br />
                  Gender: {selectedBeneficiary.gender}<br />
                  Education Level: {selectedBeneficiary.educationLevel}<br />
                  Occupation: {selectedBeneficiary.occupation}<br />
                  Vulnerability: {selectedBeneficiary.vulnerability}<br />
                  Household Size: {selectedBeneficiary.householdSize}<br />
                  Income Level: {selectedBeneficiary.incomeLevel}<br />
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
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