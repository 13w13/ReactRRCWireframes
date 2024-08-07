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
    
    // Use the monthlyProgress data from the project
    const timeSeriesData = projectData.flatMap(indicator => 
      indicator.monthlyProgress.map(progress => ({
        x: progress.month,
        y: progress.count,
        indicator: indicator.name
      }))
    );

    // Generate indicator progress data
    const indicatorProgress = projectData.map(indicator => ({
      indicator: indicator.name,
      target: indicator.target.value,
      achieved: indicator.monthlyProgress.reduce((sum, month) => sum + month.count, 0)
    }));

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
      timeSeriesData,
      indicatorProgress,
      beneficiaryTypeDistribution: Object.entries(beneficiaryTypeDistribution).map(([type, value]) => ({ id: type, value }))
    });
  };

  const exportToExcel = () => {
    if (!reportData) return;

    const workbook = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(reportData.timeSeriesData);
    XLSX.utils.book_append_sheet(workbook, ws, "Activity Data");
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Activity Timeline</h2>
            <div style={{ height: '400px' }}>
              <ResponsiveLine
                data={[
                  {
                    id: "Activities",
                    data: reportData.timeSeriesData
                  }
                ]}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
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
                  legend: 'Activities',
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
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Indicator Progress</h2>
            <div style={{ height: '400px' }}>
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
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiary Type Distribution</h2>
            <div style={{ height: '400px' }}>
              <ResponsivePie
                data={reportData.beneficiaryTypeDistribution}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: 'nivo' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                radialLabelsSkipAngle={10}
                radialLabelsTextColor="#333333"
                radialLabelsLinkColor={{ from: 'color' }}
                sliceLabelsSkipAngle={10}
                sliceLabelsTextColor="#333333"
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
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Summary</h2>
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-semibold">Total Activities:</td>
                  <td className="py-2 text-right">{reportData.timeSeriesData.reduce((sum, data) => sum + data.y, 0)}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-semibold">Total Beneficiaries:</td>
                  <td className="py-2 text-right">{reportData.beneficiaryTypeDistribution.reduce((sum, data) => sum + data.value, 0)}</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">Project Progress:</td>
                  <td className="py-2 text-right">
                    {(reportData.indicatorProgress.reduce((sum, indicator) => sum + (indicator.achieved / indicator.target), 0) / reportData.indicatorProgress.length * 100).toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;