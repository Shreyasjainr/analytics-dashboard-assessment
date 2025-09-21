import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './App.css';
import Header from './components/Header';
import MetricsCards from './components/MetricsCards';
import ChartsSection from './components/ChartsSection';
import DataTable from './components/DataTable';
// import ColorPicker from './components/ColorPicker';

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

function App() {
  const [data, setData] = useState<EVData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/Electric_Vehicle_Population_Data.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const parsedData = results.data.map((row: any) => ({
              vin: row['VIN (1-10)'],
              county: row['County'],
              city: row['City'],
              state: row['State'],
              postalCode: row['Postal Code'],
              modelYear: parseInt(row['Model Year']) || 0,
              make: row['Make'],
              model: row['Model'],
              electricVehicleType: row['Electric Vehicle Type'],
              cafvEligibility: row['Clean Alternative Fuel Vehicle (CAFV) Eligibility'],
              electricRange: parseInt(row['Electric Range']) || 0,
              baseMSRP: parseInt(row['Base MSRP']) || 0,
              legislativeDistrict: parseInt(row['Legislative District']) || 0,
              dolVehicleId: row['DOL Vehicle ID'],
              vehicleLocation: row['Vehicle Location'],
              electricUtility: row['Electric Utility'],
              censusTract: row['2020 Census Tract']
            })).filter((item: EVData) => item.vin); // Filter out empty rows
            
            setData(parsedData);
            setLoading(false);
          },
          error: (error: any) => {
            setError('Error parsing CSV data');
            setLoading(false);
          }
        });
      } catch (err) {
        setError('Error loading data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading Electric Vehicle Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      {/* <ColorPicker /> */}
      <main className="main-content">
        <MetricsCards data={data} />
        <ChartsSection data={data} />
        <DataTable data={data} />
      </main>
    </div>
  );
}

export default App;
