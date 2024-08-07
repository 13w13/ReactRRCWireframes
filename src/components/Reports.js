import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import * as XLSX from 'xlsx';
import 'leaflet/dist/leaflet.css';

const Reports = ({ projects, activities, beneficiaries, locations }) => {
  const [selectedProject, setSelectedProject] = useState('');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-12-31');
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Projects:', projects);
    console.log('Activities:', activities);
    console.log('Beneficiaries:', beneficiaries);
    console.log('Locations:', locations);
  }, [projects, activities, beneficiaries, locations]);

  useEffect(() => {
    if (selectedProject) {
      try {
        generateReportData();
      } catch (err) {
        console.error('Error generating report data:', err);
        setError('An error occurred while generating the report. Please try again.');
      }
    }
  }, [selectedProject, startDate, endDate]);

  const generateReportData = () => {
    if (!selectedProject || !projects[selectedProject]) {
      setError('No project selected or project data not available.');
      return;
    }

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
        uniquePeopleReached: uniqueBeneficiaries.size,
        serviceCount: indicatorActivities.length,
        disaggregatedData: {
          bySex: {
            male: uniqueBeneficiaryDetails.filter(b => b.gender === 'Male').length,
            female: uniqueBeneficiaryDetails.filter(b => b.gender === 'Female').length
          },
          byAge: {
            children: uniqueBeneficiaryDetails.filter(b => calculateAge(b.dateOfBirth) < 18).length,
            adults: uniqueBeneficiaryDetails.filter(b => calculateAge(b.dateOfBirth) >= 18 && calculateAge(b.dateOfBirth) < 60).length,
            elderly: uniqueBeneficiaryDetails.filter(b => calculateAge(b.dateOfBirth) >= 60).length
          },
          byNationality: uniqueBeneficiaryDetails.reduce((acc, b) => {
            acc[b.nationality] = (acc[b.nationality] || 0) + 1;
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
        projectData.some(indicator => indicator.linkedActivities.includes(activity.activityType))
      )
      .reduce((acc, activity) => {
        const beneficiary = beneficiaries.find(b => b.id === activity.beneficiaryId);
        if (beneficiary) {
          acc[beneficiary.beneficiaryType] = (acc[beneficiary.beneficiaryType] || 0) + 1;
        }
        return acc;
      }, {});

    // Generate activity distribution by location
    const activityDistribution = activities
      .filter(activity => 
        activity.date >= startDate && 
        activity.date <= endDate &&
        projectData.some(indicator => indicator.linkedActivities.includes(activity.activityType))
      )
      .reduce((acc, activity) => {
        if (!acc[activity.location]) {
          const locationData = locations.find(l => l.name === activity.location);
          acc[activity.location] = {
            count: 0,
            latitude: locationData ? locationData.latitude : null,
            longitude: locationData ? locationData.longitude : null
          };
        }
        acc[activity.location].count += 1;
        return acc;
      }, {});

    setReportData({
      reachAndServicesData: reachAndServicesChartData,
      indicatorProgress,
      beneficiaryTypeDistribution: Object.entries(beneficiaryTypeDistribution).map(([id, value]) => ({ id, value })),
      activityDistribution
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

    // Add activity distribution by location
    const wsActivityDistribution = XLSX.utils.json_to_sheet(
      Object.entries(reportData.activityDistribution).map(([location, data]) => ({
        Location: location,
        Count: data.count,
        Latitude: data.latitude,
        Longitude: data.longitude
      }))
    );
    XLSX.utils.book_append_sheet(workbook, wsActivityDistribution, "Activity Distribution");

    XLSX.writeFile(workbook, `${selectedProject}_Report.xlsx`);
  };

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
            <div style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reportData.reachAndServicesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="beneficiaries" stroke="#8884d8" name="Beneficiaries" />
                  <Line yAxisId="right" type="monotone" dataKey="services" stroke="#82ca9d" name="Services" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Indicator Progress</h2>
            <div style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.indicatorProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="indicator" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="achieved" fill="#8884d8" name="Achieved" />
                  <Bar dataKey="target" fill="#82ca9d" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiary Type Distribution</h2>
            <div style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.beneficiaryTypeDistribution}
                    dataKey="value"
                    nameKey="id"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Activity Distribution Map</h2>
            <div style={{ height: '400px' }}>
              <MapContainer center={[45.9432, 24.9668]} zoom={7} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {Object.entries(reportData.activityDistribution).map(([locationName, data]) => (
                  <Marker 
                    key={locationName} 
                    position={[data.latitude, data.longitude]}
                    icon={customMarkerIcon}
                  >
                    <Popup>
                      <strong>{locationName}</strong><br />
                      Activities: {data.count}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
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
                      {((indicator.achieved / indicator.target) * 100).toFixed(2)}%
                    </td>
                    <td className="py-2 px-4">{indicator.uniquePeopleReached}</td>
                    <td className="py-2 px-4">{indicator.serviceCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;