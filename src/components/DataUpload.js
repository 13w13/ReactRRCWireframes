import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const DataUpload = ({ onDataUploaded, templateFields, dataType }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      onDataUploaded(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const generateTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([templateFields.reduce((obj, field) => ({ ...obj, [field]: '' }), {})]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, `${dataType}_template.xlsx`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload {dataType} Data</h2>
      <div className="mb-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload Data
        </button>
        <button
          onClick={generateTemplate}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Download Template
        </button>
      </div>
    </div>
  );
};

export default DataUpload;