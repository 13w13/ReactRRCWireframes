import React, { useState } from 'react';
import DataUpload from './DataUpload';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          {children}
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BeneficiaryInfo = ({ beneficiaries, setBeneficiaries }) => {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadLogs, setUploadLogs] = useState([]);
  const [filter, setFilter] = useState({ beneficiaryType: '', nationality: '' });

  const handleRowClick = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBeneficiary(null);
  };

  const handleDataUploaded = (uploadedData) => {
    const newBeneficiaries = uploadedData.map((beneficiary, index) => ({
      id: `B${String(beneficiaries.length + index + 1).padStart(5, '0')}`,
      ...beneficiary
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
  };

  const filteredBeneficiaries = beneficiaries.filter(beneficiary => 
    (!filter.beneficiaryType || beneficiary.beneficiaryType === filter.beneficiaryType) &&
    (!filter.nationality || beneficiary.nationality === filter.nationality)
  );

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Beneficiary Information</h1>

      <DataUpload 
        onDataUploaded={handleDataUploaded}
        templateFields={['name', 'dateOfBirth', 'gender', 'nationality', 'beneficiaryType', 'registrationDate', 'location']}
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
              <th className="py-2 px-4 border-b">Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredBeneficiaries.map((beneficiary) => (
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
                <td className="py-2 px-4 border-b">{beneficiary.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedBeneficiary && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiary Details</h2>
            <div className="text-left">
              <p><strong>ID:</strong> {selectedBeneficiary.id}</p>
              <p><strong>Name:</strong> {selectedBeneficiary.name}</p>
              <p><strong>Date of Birth:</strong> {selectedBeneficiary.dateOfBirth}</p>
              <p><strong>Gender:</strong> {selectedBeneficiary.gender}</p>
              <p><strong>Nationality:</strong> {selectedBeneficiary.nationality}</p>
              <p><strong>Beneficiary Type:</strong> {selectedBeneficiary.beneficiaryType}</p>
              <p><strong>Registration Date:</strong> {selectedBeneficiary.registrationDate}</p>
              <p><strong>Location:</strong> {selectedBeneficiary.location}</p>
            </div>
          </div>
        )}
      </Modal>

      <div className="bg-white rounded-lg shadow-md p-6">
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