import React from 'react';

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

interface MetricsCardsProps {
  data: EVData[];
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ data }) => {
  // Calculate metrics
  const totalVehicles = data.length;
  const uniqueMakes = new Set(data.map(item => item.make)).size;
  const uniqueModels = new Set(data.map(item => item.model)).size;
  const uniqueCounties = new Set(data.map(item => item.county)).size;
  
  // Calculate average electric range (excluding 0 values)
  const validRanges = data.filter(item => item.electricRange > 0);
  const avgElectricRange = validRanges.length > 0 
    ? Math.round(validRanges.reduce((sum, item) => sum + item.electricRange, 0) / validRanges.length)
    : 0;
  
  // Calculate BEV vs PHEV distribution
  const bevCount = data.filter(item => item.electricVehicleType.includes('Battery Electric Vehicle')).length;
  const phevCount = data.filter(item => item.electricVehicleType.includes('Plug-in Hybrid')).length;
  
  // Calculate CAFV eligible vehicles
  const cafvEligible = data.filter(item => item.cafvEligibility.includes('Clean Alternative Fuel Vehicle Eligible')).length;
  
  // Calculate year range
  const years = data.map(item => item.modelYear).filter(year => year > 0);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  
  // Calculate average MSRP (excluding 0 values)
  const validMSRPs = data.filter(item => item.baseMSRP > 0);
  const avgMSRP = validMSRPs.length > 0 
    ? Math.round(validMSRPs.reduce((sum, item) => sum + item.baseMSRP, 0) / validMSRPs.length)
    : 0;

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <h3>Total Vehicles</h3>
        <div className="value">{totalVehicles.toLocaleString()}</div>
        <div className="change">All electric vehicles</div>
      </div>
      
      <div className="metric-card">
        <h3>Unique Makes</h3>
        <div className="value">{uniqueMakes}</div>
        <div className="change">Different vehicle manufacturers</div>
      </div>
      
      <div className="metric-card">
        <h3>Unique Models</h3>
        <div className="value">{uniqueModels}</div>
        <div className="change">Different vehicle models</div>
      </div>
      
      <div className="metric-card">
        <h3>Counties Covered</h3>
        <div className="value">{uniqueCounties}</div>
        <div className="change">Geographic coverage</div>
      </div>
      
      <div className="metric-card">
        <h3>Avg Electric Range</h3>
        <div className="value">{avgElectricRange} mi</div>
        <div className="change">Miles per charge</div>
      </div>
      
      <div className="metric-card">
        <h3>BEV vs PHEV</h3>
        <div className="value">{bevCount} / {phevCount}</div>
        <div className="change">Battery vs Plug-in Hybrid</div>
      </div>
      
      <div className="metric-card">
        <h3>CAFV Eligible</h3>
        <div className="value">{cafvEligible.toLocaleString()}</div>
        <div className="change">{Math.round((cafvEligible / totalVehicles) * 100)}% of total</div>
      </div>
      
      <div className="metric-card">
        <h3>Year Range</h3>
        <div className="value">{minYear} - {maxYear}</div>
        <div className="change">Model years covered</div>
      </div>
      
      {avgMSRP > 0 && (
        <div className="metric-card">
          <h3>Avg MSRP</h3>
          <div className="value">${avgMSRP.toLocaleString()}</div>
          <div className="change">Base manufacturer price</div>
        </div>
      )}
    </div>
  );
};

export default MetricsCards;
