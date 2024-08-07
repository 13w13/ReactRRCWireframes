import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import SimpleMap from '../components/SimpleMap';


const Reports = ({ projects, activities, beneficiaries, locations }) => {  const [selectedProject, setSelectedProject] = useState('');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-12-31');
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (selectedProject) {
      generateReportData();
    }
  }, [selectedProject, startDate, endDate]);

  const generateReportData = () => {
    if (!selectedProject || !projects[selectedProject]) return;

    const projectData = projects[selectedProject];
    
    // Generate beneficiary reach and services data
    const reachAndServicesData = projectData.reduce((acc, indicator) => {
      const indicatorActivities = activities.filter(activity => 
        indicator.linkedActivities.includes(activity.activityType) &&
        new Date(activity.date) >= new Date(startDate) &&
        new Date(activity.date) <= new Date(endDate)
      );

      indicatorActivities.forEach(activity => {
        const month = activity.date.slice(0, 7); // YYYY-MM
        if (!acc[month]) {
          acc[month] = { month, beneficiaries: new Set(), services: 0 };
        }
        acc[month].beneficiaries.add(activity.beneficiaryId);
        acc[month].services++;
      });

      return acc;
    }, {});

    const reachAndServicesChartData = Object.values(reachAndServicesData).map(data => ({
      month: data.month,
      beneficiaries: data.beneficiaries.size,
      services: data.services
    })).sort((a, b) => a.month.localeCompare(b.month));

    // Generate indicator progress data
    const indicatorProgress = projectData.map(indicator => {
      const indicatorActivities = activities.filter(activity => 
        indicator.linkedActivities.includes(activity.activityType) &&
        new Date(activity.date) >= new Date(startDate) &&
        new Date(activity.date) <= new Date(endDate)
      );

      const uniqueBeneficiaries = new Set(indicatorActivities.map(a => a.beneficiaryId));
      const uniqueBeneficiaryDetails = Array.from(uniqueBeneficiaries).map(id => 
        beneficiaries.find(b => b.id === id)
      );

      return {
        indicator: indicator.name,
        target: indicator.target.value,
        achieved: indicatorActivities.length,
        progress: ((indicatorActivities.length / indicator.target.value) * 100).toFixed(2),
        uniquePeopleReached: uniqueBeneficiaries.size,
        serviceCount: indicatorActivities.length,
        disaggregatedData: {
          bySex: {
            male: uniqueBeneficiaryDetails.filter(b => b && b.gender === 'Male').length,
            female: uniqueBeneficiaryDetails.filter(b => b && b.gender === 'Female').length
          },
          byAge: {
            children: uniqueBeneficiaryDetails.filter(b => b && calculateAge(b.dateOfBirth) < 18).length,
            adults: uniqueBeneficiaryDetails.filter(b => b && calculateAge(b.dateOfBirth) >= 18 && calculateAge(b.dateOfBirth) < 60).length,
            elderly: uniqueBeneficiaryDetails.filter(b => b && calculateAge(b.dateOfBirth) >= 60).length
          },
          byNationality: uniqueBeneficiaryDetails.reduce((acc, b) => {
            if (b && b.nationality) {
              acc[b.nationality] = (acc[b.nationality] || 0) + 1;
            }
            return acc;
          }, {})
        }
      };
    });

    // Generate beneficiary type distribution
    const beneficiaryTypeDistribution = activities
      .filter(activity => 
        activity.date >= startDate && 
        activity.date <= endDate &&
        projectData[0].linkedActivities.includes(activity.activityType)
      )
      .reduce((acc, activity) => {
        const beneficiary = beneficiaries.find(b => b.id === activity.beneficiaryId);
        if (beneficiary) {
          acc[beneficiary.beneficiaryType] = (acc[beneficiary.beneficiaryType] || 0) + 1;
        }
        return acc;
      }, {});

    // Generate location-based distribution
    const locationDistribution = activities
      .filter(activity => 
        activity.date >= startDate && 
        activity.date <= endDate &&
        projectData[0].linkedActivities.includes(activity.activityType)
      )
      .reduce((acc, activity) => {
        const location = locations.find(l => l.name === activity.location);
        if (location) {
          if (!acc[location.name]) {
            acc[location.name] = {
              count: 0,
              latitude: location.latitude,
              longitude: location.longitude
            };
          }
          acc[location.name].count++;
        }
        return acc;
      }, {});

    setReportData({
      reachAndServicesData: reachAndServicesChartData,
      indicatorProgress,
      beneficiaryTypeDistribution: Object.entries(beneficiaryTypeDistribution).map(([id, value]) => ({ id, value })),
      locationDistribution
    });
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const exportToExcel = () => {
    if (!reportData) return;

    const workbook = XLSX.utils.book_new();
    
    // Add reach and services data
    const wsReachAndServices = XLSX.utils.json_to_sheet(reportData.reachAndServicesData);
    XLSX.utils.book_append_sheet(workbook, wsReachAndServices, "Reach and Services");

    // Add indicator progress data
    const indicatorData = reportData.indicatorProgress.map(indicator => ({
      Indicator: indicator.indicator,
      Target: indicator.target,
      Achieved: indicator.achieved,
      Progress: `${indicator.progress}%`,
      'Unique People Reached': indicator.uniquePeopleReached,
      'Service Count': indicator.serviceCount,
      'Male': indicator.disaggregatedData.bySex.male,
      'Female': indicator.disaggregatedData.bySex.female,
      'Children': indicator.disaggregatedData.byAge.children,
      'Adults': indicator.disaggregatedData.byAge.adults,
      'Elderly': indicator.disaggregatedData.byAge.elderly,
      ...Object.entries(indicator.disaggregatedData.byNationality).reduce((acc, [nationality, count]) => {
        acc[`Nationality: ${nationality}`] = count;
        return acc;
      }, {})
    }));
    const wsIndicators = XLSX.utils.json_to_sheet(indicatorData);
    XLSX.utils.book_append_sheet(workbook, wsIndicators, "Indicator Progress");

    // Add beneficiary type distribution data
    const wsBeneficiaryTypes = XLSX.utils.json_to_sheet(reportData.beneficiaryTypeDistribution);
    XLSX.utils.book_append_sheet(workbook, wsBeneficiaryTypes, "Beneficiary Types");

    // Add location distribution data
    const locationData = Object.entries(reportData.locationDistribution).map(([name, data]) => ({
      Location: name,
      'People Reached': data.count,
      Latitude: data.latitude,
      Longitude: data.longitude
    }));
    const wsLocationDistribution = XLSX.utils.json_to_sheet(locationData);
    XLSX.utils.book_append_sheet(workbook, wsLocationDistribution, "Location Distribution");

    XLSX.writeFile(workbook, `${selectedProject}_Report.xlsx`);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Project Reports</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <select 
            value={selectedProject} 
            onChange={(e) => setSelectedProject(e.target.value)} 
            className="p-2 border rounded"
          >
            <option value="">Select a Project</option>
            {Object.keys(projects).map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="p-2 border rounded" 
          />
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="p-2 border rounded" 
          />
        </div>
        <button
          onClick={exportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={!reportData}
        >
          Export to Excel
        </button>
      </div>

      {reportData && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiary Reach and Services</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData.reachAndServicesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="beneficiaries" stroke="#8884d8" name="Unique Beneficiaries" />
                <Line yAxisId="right" type="monotone" dataKey="services" stroke="#82ca9d" name="Services Provided" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Indicator Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.indicatorProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="indicator" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="achieved" fill="#82ca9d" name="Achieved" />
                <Bar dataKey="target" fill="#8884d8" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiary Type Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.beneficiaryTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {reportData.beneficiaryTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Geographic Distribution of Beneficiaries</h2>
        <div style={{ height: '400px', width: '100%' }}>
          {reportData && <SimpleMap locationDistribution={reportData.locationDistribution} />}
        </div>
      </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Indicator Tracking Table</h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border-b">Indicator</th>
                  <th className="py-2 px-4 border-b">Target</th>
                  <th className="py-2 px-4 border-b">Achieved</th>
                  <th className="py-2 px-4 border-b">Progress</th>
                  <th className="py-2 px-4 border-b">Unique People Reached</th>
                  <th className="py-2 px-4 border-b">Services Provided</th>
                </tr>
              </thead>
              <tbody>
                {reportData.indicatorProgress.map((indicator, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{indicator.indicator}</td>
                    <td className="py-2 px-4">{indicator.target}</td>
                    <td className="py-2 px-4">{indicator.achieved}</td>
                    <td className="py-2 px-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${indicator.progress}%` }}></div>
                      </div>
                      <span className="text-sm">{indicator.progress}%</span>
                    </td>
                    <td className="py-2 px-4">{indicator.uniquePeopleReached}</td>
                    <td className="py-2 px-4">{indicator.serviceCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Disaggregated Data</h2>
            {reportData.indicatorProgress.map((indicator, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{indicator.indicator}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">By Sex</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Male', value: indicator.disaggregatedData.bySex.male },
                            { name: 'Female', value: indicator.disaggregatedData.bySex.female }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#0088FE" />
                          <Cell fill="#00C49F" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">By Age</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Children', value: indicator.disaggregatedData.byAge.children },
                            { name: 'Adults', value: indicator.disaggregatedData.byAge.adults },
                            { name: 'Elderly', value: indicator.disaggregatedData.byAge.elderly }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#FFBB28" />
                          <Cell fill="#FF8042" />
                          <Cell fill="#8884d8" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">By Nationality</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={Object.entries(indicator.disaggregatedData.byNationality).map(([name, value]) => ({ name, value }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;