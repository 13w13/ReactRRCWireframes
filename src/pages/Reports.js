import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const Reports = ({ projects, activities, beneficiaries }) => {
  const [selectedProject, setSelectedProject] = useState('');
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

    setReportData({
      reachAndServicesData: reachAndServicesChartData,
      indicatorProgress,
      beneficiaryTypeDistribution: Object.entries(beneficiaryTypeDistribution).map(([id, value]) => ({ id, value }))
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
            <div className="h-64">
              <svg width="100%" height="100%" viewBox="0 0 600 240">
                {reportData.reachAndServicesData.map((data, index) => (
                  <g key={index}>
                    <rect
                      x={index * 40}
                      y={240 - data.beneficiaries / 2}
                      width="20"
                      height={data.beneficiaries / 2}
                      fill="#8884d8"
                    />
                    <rect
                      x={index * 40 + 20}
                      y={240 - data.services / 5}
                      width="20"
                      height={data.services / 5}
                      fill="#82ca9d"
                    />
                    <text x={index * 40 + 10} y="235" textAnchor="middle" fontSize="10">
                      {data.month}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex items-center mr-4">
                <div className="w-4 h-4 bg-[#8884d8] mr-2"></div>
                <span>Beneficiaries</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#82ca9d] mr-2"></div>
                <span>Services</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Indicator Progress</h2>
            <div className="h-64">
              <svg width="100%" height="100%" viewBox="0 0 600 240">
                {reportData.indicatorProgress.map((indicator, index) => (
                  <g key={index} transform={`translate(0, ${index * 40})`}>
                    <text x="0" y="15" fontSize="12">{indicator.indicator}</text>
                    <rect x="200" y="0" width="300" height="20" fill="#e0e0e0" />
                    <rect
                      x="200"
                      y="0"
                      width={(indicator.achieved / indicator.target) * 300}
                      height="20"
                      fill="#82ca9d"
                    />
                    <text x="510" y="15" fontSize="12">{`${indicator.achieved}/${indicator.target}`}</text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiary Type Distribution</h2>
            <div className="h-64">
              <svg width="100%" height="100%" viewBox="0 0 300 300">
                {reportData.beneficiaryTypeDistribution.map((data, index, array) => {
                  const total = array.reduce((sum, item) => sum + item.value, 0);
                  const startAngle = index === 0 ? 0 : array
                    .slice(0, index)
                    .reduce((sum, item) => sum + (item.value / total) * 360, 0);
                  const endAngle = startAngle + (data.value / total) * 360;

                  const startRadians = (startAngle * Math.PI) / 180;
                  const endRadians = (endAngle * Math.PI) / 180;

                  const x1 = 150 + 100 * Math.cos(startRadians);
                  const y1 = 150 + 100 * Math.sin(startRadians);
                  const x2 = 150 + 100 * Math.cos(endRadians);
                  const y2 = 150 + 100 * Math.sin(endRadians);

                  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

                  const pathData = [
                    `M 150 150`,
                    `L ${x1} ${y1}`,
                    `A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    `Z`
                  ].join(" ");

                  return (
                    <g key={data.id}>
                      <path d={pathData} fill={`hsl(${index * 60}, 70%, 50%)`} />
                      <text
                        x={150 + 120 * Math.cos((startAngle + endAngle) / 2 * Math.PI / 180)}
                        y={150 + 120 * Math.sin((startAngle + endAngle) / 2 * Math.PI / 180)}
                        textAnchor="middle"
                        fontSize="12"
                      >
                        {data.id}: {((data.value / total) * 100).toFixed(1)}%
                      </text>
                    </g>
                  );
                })}
              </svg>
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

          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Disaggregated Data</h2>
            {reportData.indicatorProgress.map((indicator, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{indicator.indicator}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">By Sex</h4>
                    <p>Male: {indicator.disaggregatedData.bySex.male}</p>
                    <p>Female: {indicator.disaggregatedData.bySex.female}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">By Age</h4>
                    <p>Children: {indicator.disaggregatedData.byAge.children}</p>
                    <p>Adults: {indicator.disaggregatedData.byAge.adults}</p>
                    <p>Elderly: {indicator.disaggregatedData.byAge.elderly}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">By Nationality</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(indicator.disaggregatedData.byNationality).map(([nationality, count], i) => (
                      <p key={i}>{nationality}: {count}</p>
                    ))}
                  </div>
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