import React from 'react';

const SimpleMap = ({ locationDistribution }) => {
  const minLat = 43.5;
  const maxLat = 48.5;
  const minLong = 20;
  const maxLong = 30;
  const width = 400;
  const height = 300;

  const convertToSVGCoords = (lat, long) => {
    const x = ((long - minLong) / (maxLong - minLong)) * width;
    const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
    return { x, y };
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '400px' }}>
      <path
        d="M50,150 L100,50 L300,50 L350,150 L300,250 L100,250 Z"
        fill="#f0f0f0"
        stroke="#000"
        strokeWidth="2"
      />
      {Object.entries(locationDistribution).map(([name, data]) => {
        const { x, y } = convertToSVGCoords(data.latitude, data.longitude);
        return (
          <g key={name}>
            <circle
              cx={x}
              cy={y}
              r={5 + Math.sqrt(data.count)}
              fill="red"
              opacity="0.7"
            />
            <text x={x} y={y - 10} fontSize="10" textAnchor="middle">{name}</text>
          </g>
        );
      })}
    </svg>
  );
};

export default SimpleMap;