import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface EVData {
  vin: string;
  county: string;
  city: string;
  state: string;
  postalCode: string;
  modelYear: number;
  make: string;
  model: string;
  electricVehicleType: string;
  cafvEligibility: string;
  electricRange: number;
  baseMSRP: number;
  legislativeDistrict: number;
  dolVehicleId: string;
  vehicleLocation: string;
  electricUtility: string;
  censusTract: string;
}

interface ChartsSectionProps {
  data: EVData[];
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ data }) => {
  // Prepare data for charts

  // Top 10 makes by count
  const makeCounts = data.reduce((acc, item) => {
    acc[item.make] = (acc[item.make] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topMakes = Object.entries(makeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([make, count]) => ({ make, count }));

  // Vehicle type distribution
  const vehicleTypeCounts = data.reduce((acc, item) => {
    const type = item.electricVehicleType.includes('Battery Electric Vehicle') ? 'BEV' : 'PHEV';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const vehicleTypeData = Object.entries(vehicleTypeCounts).map(([type, count]) => ({
    name: type,
    value: count,
    percentage: Math.round((count / data.length) * 100)
  }));

  // Year distribution (last 10 years)
  const currentYear = new Date().getFullYear();
  const yearCounts = data.reduce((acc, item) => {
    if (item.modelYear >= currentYear - 10 && item.modelYear <= currentYear) {
      acc[item.modelYear] = (acc[item.modelYear] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);

  const yearData = Object.entries(yearCounts)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([year, count]) => ({ year: parseInt(year), count }));

  // Top 10 counties by count
  const countyCounts = data.reduce((acc, item) => {
    acc[item.county] = (acc[item.county] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCounties = Object.entries(countyCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([county, count]) => ({ county, count }));

  // Electric range distribution
  const rangeRanges = [
    { range: '0-50', min: 0, max: 50 },
    { range: '51-100', min: 51, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    { range: '300+', min: 301, max: 1000 }
  ];

  const rangeData = rangeRanges.map(({ range, min, max }) => ({
    range,
    count: data.filter(item => item.electricRange >= min && item.electricRange <= max).length
  }));

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];

  return (
    <div className="charts-section">
      <div className="charts-grid">
        {/* Top Makes Chart */}
        <div className="chart-container">
          <h3 className="chart-title">Top 10 Vehicle Makes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topMakes} margin={{ top: 20, right: 30, left: 60, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="make"
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
                label={{ value: 'Vehicle Make', position: 'insideBottom', offset: -25 }}
              />
              <YAxis
                label={{ value: 'Number of Vehicles', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Bar dataKey="count" fill="#764ba2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle Type Distribution */}
        <div className="chart-container">
          <h3 className="chart-title">Vehicle Type Distribution</h3>
          <div style={{fontSize: '12px', fontWeight: '600', color: 'var(--dark-color)' ,paddingLeft: '20px'}}>
          <span>BEV-Battery Electric Vehicle </span><br/>
          <span>PHEV-Plug-in Hybrid Electric Vehicle</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vehicleTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {vehicleTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Year Trend */}
        <div className="chart-container">
          <h3 className="chart-title">Vehicle Registration by Year (Last 10 Years)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yearData} margin={{ top: 20, right: 30, left: 60, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                label={{ value: 'Model Year', position: 'insideBottom', offset: -25 }}
              />
              <YAxis
                label={{ value: 'Number of Vehicles', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#667eea" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Counties */}
        <div className="chart-container">
          <h3 className="chart-title">Top 10 Counties by Vehicle Count</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCounties} margin={{ top: 20, right: 30, left: 60, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="county"
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
                label={{ value: 'County', position: 'insideBottom', offset: -25 }}
              />
              <YAxis
                label={{ value: 'Number of Vehicles', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Bar dataKey="count" fill="#764ba2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Electric Range Distribution */}
        <div className="chart-container">
          <h3 className="chart-title">Electric Range Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rangeData} margin={{ top: 20, right: 30, left: 60, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="range"
                label={{ value: 'Electric Range (miles)', position: 'insideBottom', offset: -15 }}
              />
              <YAxis
                label={{ value: 'Number of Vehicles', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Bar dataKey="count" fill="#764ba2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;