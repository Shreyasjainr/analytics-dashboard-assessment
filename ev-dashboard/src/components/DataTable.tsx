import React, { useState } from 'react';

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

interface DataTableProps {
  data: EVData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [sortField, setSortField] = useState<keyof EVData>('modelYear');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterMake, setFilterMake] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique makes and types for filters
  const uniqueMakes = Array.from(new Set(data.map(item => item.make))).sort();
  const uniqueTypes = Array.from(new Set(data.map(item => item.electricVehicleType))).sort();

  // Filter and sort data
  const filteredData = data.filter(item => {
    const makeMatch = !filterMake || item.make.toLowerCase().includes(filterMake.toLowerCase());
    const typeMatch = !filterType || item.electricVehicleType === filterType;
    
    // Search functionality - search across multiple fields
    const searchMatch = !searchTerm || 
      item.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.county.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.electricVehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cafvEligibility.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.electricUtility.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.modelYear.toString().includes(searchTerm) ||
      item.electricRange.toString().includes(searchTerm);
    
    return makeMatch && typeMatch && searchMatch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handleSort = (field: keyof EVData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatValue = (value: any, field: keyof EVData) => {
    if (field === 'baseMSRP' && value > 0) {
      return `$${value.toLocaleString()}`;
    }
    if (field === 'electricRange' && value > 0) {
      return `${value} mi`;
    }
    if (field === 'modelYear' && value > 0) {
      return value.toString();
    }
    return value || '-';
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Electric Vehicle Data</h2>
      
      {/* Search and Filters */}
      <div className="filter-section">
        {/* Search Bar */}
        <div className="search-section">
          <label htmlFor="searchInput" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--dark-color)' }}>
            🔍 Search Vehicles:
          </label>
          <input
            id="searchInput"
            type="text"
            className="search-input"
            placeholder="Search by make, model, county, city, year, range, etc..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchTerm && (
            <div className="search-results">
              Found {filteredData.length} result{filteredData.length !== 1 ? 's' : ''} for "{searchTerm}"
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="filters-row">
          <div>
            <label htmlFor="makeFilter" style={{ marginRight: '0.5rem', fontWeight: '600', color: 'var(--dark-color)' }}>Filter by Make:</label>
            <select
              id="makeFilter"
              value={filterMake}
              onChange={(e) => {
                setFilterMake(e.target.value);
                setCurrentPage(1);
              }}
              style={{ 
                padding: '0.5rem', 
                borderRadius: '5px', 
                border: '1px solid #ddd',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">All Makes</option>
              {uniqueMakes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="typeFilter" style={{ marginRight: '0.5rem', fontWeight: '600', color: 'var(--dark-color)' }}>Filter by Type:</label>
            <select
              id="typeFilter"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              style={{ 
                padding: '0.5rem', 
                borderRadius: '5px', 
                border: '1px solid #ddd',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || filterMake || filterType) && (
            <div>
              <button
                className="clear-filters-btn"
                onClick={() => {
                  setSearchTerm('');
                  setFilterMake('');
                  setFilterType('');
                  setCurrentPage(1);
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('make')} style={{width: '70px', cursor: 'pointer' }}>
              Make {sortField === 'make' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('model')} style={{ width: '92px',cursor: 'pointer' }}>
              Model {sortField === 'model' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('modelYear')} style={{width: '70px', cursor: 'pointer' }}>
              Year {sortField === 'modelYear' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('electricVehicleType')} style={{ cursor: 'pointer' }}>
              Type {sortField === 'electricVehicleType' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('electricRange')} style={{width: '80px', cursor: 'pointer' }}>
              Range {sortField === 'electricRange' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('county')} style={{width: '90px', cursor: 'pointer' }}>
              County {sortField === 'county' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('city')} style={{width: '70px', cursor: 'pointer' }}>
              City {sortField === 'city' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('cafvEligibility')} style={{ cursor: 'pointer' }}>
              CAFV Eligible {sortField === 'cafvEligibility' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={`${item.vin}-${index}`}>
              <td>{item.make}</td>
              <td>{item.model}</td>
              <td>{formatValue(item.modelYear, 'modelYear')}</td>
              <td>{item.electricVehicleType}</td>
              <td>{formatValue(item.electricRange, 'electricRange')}</td>
              <td>{item.county}</td>
              <td>{item.city}</td>
              <td>{item.cafvEligibility}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ 
        marginTop: '1rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} vehicles
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '5px',
              background: currentPage === 1 ? '#f5f5f5' : 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            First
          </button>
          
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '5px',
              background: currentPage === 1 ? '#f5f5f5' : 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          <span style={{ padding: '0.5rem 1rem' }}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '5px',
              background: currentPage === totalPages ? '#f5f5f5' : 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
          
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '5px',
              background: currentPage === totalPages ? '#f5f5f5' : 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
