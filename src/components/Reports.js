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
            <ResponsiveLine
              data={[
                {
                  id: "Beneficiaries",
                  data: reportData.reachAndServicesData.map(d => ({ x: d.month, y: d.beneficiaries }))
                },
                {
                  id: "Services",
                  data: reportData.reachAndServicesData.map(d => ({ x: d.month, y: d.services }))
                }
              ]}
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
              yFormat=" >-.2f"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Month',
                legendOffset: 36,
                legendPosition: 'middle'
              }}
              axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Count',
                legendOffset: -40,
                legendPosition: 'middle'
              }}
              pointSize={10}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-12}
              useMesh={true}
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemBackground: 'rgba(0, 0, 0, .03)',
                        itemOpacity: 1
                      }
                    }
                  ]
                }
              ]}
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Indicator Progress</h2>
            <ResponsiveBar
              data={reportData.indicatorProgress}
              keys={['achieved', 'target']}
              indexBy="indicator"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'nivo' }}
              defs={[
                {
                  id: 'dots',
                  type: 'patternDots',
                  background: 'inherit',
                  color: '#38bcb2',
                  size: 4,
                  padding: 1,
                  stagger: true
                },
                {
                  id: 'lines',
                  type: 'patternLines',
                  background: 'inherit',
                  color: '#eed312',
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10
                }
              ]}
              fill={[
                {
                  match: {
                    id: 'achieved'
                  },
                  id: 'dots'
                },
                {
                  match: {
                    id: 'target'
                  },
                  id: 'lines'
                }
              ]}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Indicator',
                legendPosition: 'middle',
                legendOffset: 32
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Value',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemOpacity: 1
                      }
                    }
                  ]
                }
              ]}
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiary Type Distribution</h2>
            <ResponsivePie
              data={reportData.beneficiaryTypeDistribution}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [ [ 'darker', 2 ] ] }}
              defs={[
                {
                  id: 'dots',
                  type: 'patternDots',
                  background: 'inherit',
                  color: 'rgba(255, 255, 255, 0.3)',
                  size: 4,
                  padding: 1,
                  stagger: true
                },
                {
                  id: 'lines',
                  type: 'patternLines',
                  background: 'inherit',
                  color: 'rgba(255, 255, 255, 0.3)',
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10
                }
              ]}
              fill={[
                {
                  match: {
                    id: 'ruby'
                  },
                  id: 'dots'
                },
                {
                  match: {
                    id: 'c'
                  },
                  id: 'dots'
                },
                {
                  match: {
                    id: 'go'
                  },
                  id: 'dots'
                },
                {
                  match: {
                    id: 'python'
                  },
                  id: 'dots'
                },
                {
                  match: {
                    id: 'scala'
                  },
                  id: 'lines'
                },
                {
                  match: {
                    id: 'lisp'
                  },
                  id: 'lines'
                },
                {
                  match: {
                    id: 'elixir'
                  },
                  id: 'lines'
                },
                {
                  match: {
                    id: 'javascript'
                  },
                  id: 'lines'
                }
              ]}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000'
                      }
                    }
                  ]
                }
              ]}
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Summary</h2>
            <table className="w-full">
              <tbody>
                {reportData.indicatorProgress.map((indicator, index) => (
                  <React.Fragment key={index}>
                    <tr className="border-b">
                      <td className="py-2 font-semibold" colSpan="2">{indicator.indicator}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Target:</td>
                      <td className="py-2 text-right">{indicator.target}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Achieved:</td>
                      <td className="py-2 text-right">{indicator.achieved}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Unique People Reached:</td>
                      <td className="py-2 text-right">{indicator.uniquePeopleReached}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Service Count:</td>
                      <td className="py-2 text-right">{indicator.serviceCount}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Male / Female:</td>
                      <td className="py-2 text-right">{indicator.disaggregatedData.bySex.male} / {indicator.disaggregatedData.bySex.female}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Children / Adults / Elderly:</td>
                      <td className="py-2 text-right">
                        {indicator.disaggregatedData.byAge.children} / {indicator.disaggregatedData.byAge.adults} / {indicator.disaggregatedData.byAge.elderly}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Nationalities:</td>
                      <td className="py-2 text-right">
                        {Object.entries(indicator.disaggregatedData.byNationality).map(([nationality, count], i) => (
                          <span key={i}>
                            {nationality}: {count}
                            {i < Object.entries(indicator.disaggregatedData.byNationality).length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </td>
                    </tr>
                  </React.Fragment>
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