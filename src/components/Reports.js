import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
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
    const reachAndServicesData = projectData[0].monthlyProgress.map(progress => ({
      month: progress.month,
      beneficiaries: progress.uniqueBeneficiaries,
      services: progress.count
    }));

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
      reachAndServicesData,
      indicatorProgress,
      beneficiaryTypeDistribution: Object.entries(beneficiaryTypeDistribution).map(([type, value]) => ({ id: type, value }))
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
      
      {/* Project selection and date range inputs remain the same */}

      {reportData && (
        <>
          {/* Existing charts (Beneficiary Reach and Services, Indicator Progress, Beneficiary Type Distribution) remain the same */}

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Indicator Report</h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border-b">Indicator</th>
                  <th className="py-2 px-4 border-b">Target</th>
                  <th className="py-2 px-4 border-b">Achieved</th>
                  <th className="py-2 px-4 border-b">Unique People Reached</th>
                  <th className="py-2 px-4 border-b">Service Count</th>
                  <th className="py-2 px-4 border-b">Male</th>
                  <th className="py-2 px-4 border-b">Female</th>
                  <th className="py-2 px-4 border-b">Children</th>
                  <th className="py-2 px-4 border-b">Adults</th>
                  <th className="py-2 px-4 border-b">Elderly</th>
                </tr>
              </thead>
              <tbody>
                {reportData.indicatorProgress.map((indicator, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{indicator.indicator}</td>
                    <td className="py-2 px-4">{indicator.target}</td>
                    <td className="py-2 px-4">{indicator.achieved}</td>
                    <td className="py-2 px-4">{indicator.uniquePeopleReached}</td>
                    <td className="py-2 px-4">{indicator.serviceCount}</td>
                    <td className="py-2 px-4">{indicator.disaggregatedData.bySex.male}</td>
                    <td className="py-2 px-4">{indicator.disaggregatedData.bySex.female}</td>
                    <td className="py-2 px-4">{indicator.disaggregatedData.byAge.children}</td>
                    <td className="py-2 px-4">{indicator.disaggregatedData.byAge.adults}</td>
                    <td className="py-2 px-4">{indicator.disaggregatedData.byAge.elderly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Nationality Breakdown</h2>
            {reportData.indicatorProgress.map((indicator, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-xl font-semibold mb-2">{indicator.indicator}</h3>
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="py-2 px-4 border-b">Nationality</th>
                      <th className="py-2 px-4 border-b">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(indicator.disaggregatedData.byNationality).map(([nationality, count], idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2 px-4">{nationality}</td>
                        <td className="py-2 px-4">{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;