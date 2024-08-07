import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';

const Overview = ({ beneficiaries, activities, projects }) => {
  const totalBeneficiaries = beneficiaries.length;
  const totalActivities = activities.length;
  const totalProjects = Object.values(projects).flat().length;

  const beneficiaryTypesData = beneficiaries.reduce((acc, b) => {
    acc[b.beneficiaryType] = (acc[b.beneficiaryType] || 0) + 1;
    return acc;
  }, {});

  const activityTypesData = activities.reduce((acc, a) => {
    acc[a.activityType] = (acc[a.activityType] || 0) + 1;
    return acc;
  }, {});

  const monthlyActivityData = activities.reduce((acc, a) => {
    const month = a.date.slice(0, 7);
    if (!acc[month]) acc[month] = { month, count: 0 };
    acc[month].count++;
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Overview</h1>
      
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Total Beneficiaries</h2>
          <p className="text-3xl font-bold text-blue-600">{totalBeneficiaries}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Total Activities</h2>
          <p className="text-3xl font-bold text-green-600">{totalActivities}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Total Projects</h2>
          <p className="text-3xl font-bold text-purple-600">{totalProjects}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Beneficiary Types</h2>
          <div style={{ height: '300px' }}>
            <ResponsivePie
              data={Object.entries(beneficiaryTypesData).map(([id, value]) => ({ id, value }))}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
            />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Activity Types</h2>
          <div style={{ height: '300px' }}>
            <ResponsiveBar
              data={Object.entries(activityTypesData).map(([activity, count]) => ({ activity, count }))}
              keys={['count']}
              indexBy="activity"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'nivo' }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Activity Type',
                legendPosition: 'middle',
                legendOffset: 45
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Count',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow col-span-2">
          <h2 className="text-xl font-semibold mb-4">Monthly Activity Trend</h2>
          <div style={{ height: '300px' }}>
            <ResponsiveLine
              data={[
                {
                  id: "Activities",
                  data: Object.values(monthlyActivityData)
                    .sort((a, b) => a.month.localeCompare(b.month))
                    .map(({ month, count }) => ({ x: month, y: count }))
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
                tickRotation: -45,
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
        </div>
      </div>
    </div>
  );
};

export default Overview;