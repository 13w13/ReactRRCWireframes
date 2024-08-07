import React from 'react';

const Overview = ({ beneficiaries, activities, projects }) => {
  // Calculate statistics
  const totalBeneficiaries = beneficiaries.length;
  const totalActivities = activities.length;
  const totalProjects = Object.values(projects).flat().length;

  // Prepare data for the activities and beneficiaries chart
  const chartData = activities.reduce((acc, activity) => {
    const date = activity.date.slice(0, 7); // Get YYYY-MM
    const existingEntry = acc.find(entry => entry.month === date);
    if (existingEntry) {
      existingEntry.activities++;
      if (!existingEntry.beneficiaries.includes(activity.beneficiaryId)) {
        existingEntry.beneficiaries.push(activity.beneficiaryId);
      }
    } else {
      acc.push({ month: date, activities: 1, beneficiaries: [activity.beneficiaryId] });
    }
    return acc;
  }, []).map(entry => ({
    ...entry,
    beneficiaries: entry.beneficiaries.length,
  })).sort((a, b) => a.month.localeCompare(b.month));

  // Prepare data for beneficiary type distribution
  const beneficiaryTypeData = beneficiaries.reduce((acc, beneficiary) => {
    acc[beneficiary.beneficiaryType] = (acc[beneficiary.beneficiaryType] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for project progress
  const projectProgressData = Object.entries(projects).map(([projectName, projectDetails]) => ({
    name: projectName,
    target: projectDetails.reduce((sum, project) => sum + project.target.value, 0),
    achieved: projectDetails.reduce((sum, project) => 
      sum + (project.monthlyProgress ? project.monthlyProgress.reduce((total, month) => total + month.count, 0) : 0), 0)
  }));

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Unified Beneficiary System Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">Total Beneficiaries</h2>
          <p className="text-3xl font-bold text-blue-600">{totalBeneficiaries}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">Total Activities</h2>
          <p className="text-3xl font-bold text-green-600">{totalActivities}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">Active Projects</h2>
          <p className="text-3xl font-bold text-purple-600">{totalProjects}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Cumulative Reach and Services</h2>
        <div className="h-64">
          <svg width="100%" height="100%" viewBox="0 0 600 240">
            {chartData.map((data, index) => (
              <g key={index}>
                <rect
                  x={index * 40}
                  y={240 - data.activities / 5}
                  width="20"
                  height={data.activities / 5}
                  fill="#8884d8"
                />
                <rect
                  x={index * 40 + 20}
                  y={240 - data.beneficiaries / 2}
                  width="20"
                  height={data.beneficiaries / 2}
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
            <span>Activities</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#82ca9d] mr-2"></div>
            <span>Unique Beneficiaries</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Beneficiary Type Distribution</h2>
          <div className="h-64">
            <svg width="100%" height="100%" viewBox="0 0 300 300">
              {Object.entries(beneficiaryTypeData).map(([type, count], index) => {
                const total = Object.values(beneficiaryTypeData).reduce((sum, c) => sum + c, 0);
                const percentage = (count / total) * 100;
                const startAngle = index === 0 ? 0 : Object.entries(beneficiaryTypeData)
                  .slice(0, index)
                  .reduce((sum, [, c]) => sum + (c / total) * 360, 0);
                const endAngle = startAngle + (count / total) * 360;

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
                  <g key={type}>
                    <path d={pathData} fill={`hsl(${index * 60}, 70%, 50%)`} />
                    <text
                      x={150 + 120 * Math.cos((startAngle + endAngle) / 2 * Math.PI / 180)}
                      y={150 + 120 * Math.sin((startAngle + endAngle) / 2 * Math.PI / 180)}
                      textAnchor="middle"
                      fontSize="12"
                    >
                      {type}: {percentage.toFixed(1)}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Progress</h2>
          <div className="h-64">
            <svg width="100%" height="100%" viewBox="0 0 400 240">
              {projectProgressData.map((project, index) => (
                <g key={project.name} transform={`translate(0, ${index * 60})`}>
                  <text x="0" y="15" fontSize="12">{project.name}</text>
                  <rect x="100" y="0" width="200" height="20" fill="#e0e0e0" />
                  <rect
                    x="100"
                    y="0"
                    width={(project.achieved / project.target) * 200}
                    height="20"
                    fill="#82ca9d"
                  />
                  <text x="310" y="15" fontSize="12">{`${project.achieved}/${project.target}`}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;