import React from 'react';
const Reports = () => {
  const [selectedProject, setSelectedProject] = useState('SEM');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const newReportData = projects[selectedProject].map(indicator => ({
      name: indicator.name,
      target: indicator.target,
      progress: Math.floor(Math.random() * indicator.target),
    }));
    setReportData(newReportData);
  }, [selectedProject, startDate, endDate]);

  return (
    <div className="p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reports and Indicators</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="p-2 border rounded">
            <option value="SEM">SEM</option>
            <option value="Ukraine">Ukraine</option>
          </select>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded" />
        </div>
        <table className="w-full mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Indicator</th>
              <th className="p-2 text-left">Target</th>
              <th className="p-2 text-left">Progress</th>
              <th className="p-2 text-left">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((indicator) => (
              <tr key={indicator.name} className="border-b">
                <td className="p-2">{indicator.name}</td>
                <td className="p-2">{indicator.target}</td>
                <td className="p-2">{indicator.progress}</td>
                <td className="p-2">{Math.round((indicator.progress / indicator.target) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reportData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="progress" fill="#8884d8" name="Progress" />
            <Bar dataKey="target" fill="#82ca9d" name="Target" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Reports;