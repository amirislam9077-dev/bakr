import React, { useState } from 'react';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';

const FilterComponent = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'All',
    type: 'All',
    date: 'All',
    region: 'All',
  });

  const statusOptions = ['All', 'Active', 'Inactive', 'Maintenance'];
  const typeOptions = ['All', 'Type 1', 'Type 2', 'Type 3'];
  const dateOptions = ['All', 'Today', 'This Week', 'This Month'];
  const regionOptions = ['All', 'Region 1', 'Region 2', 'Region 3'];

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="filter-container">
      <button 
        className={`filter-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter size={16} />
        <span>Filter</span>
      </button>

      {isOpen && (
        <div className="filter-panel">
          <div className="filter-header">
            <h3>Filter</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <div className="filter-section">
            <div className="filter-option">
              <label>Status</label>
              <select 
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="filter-option">
              <label>Type</label>
              <select 
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                {typeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="filter-option">
              <label>Date</label>
              <select 
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
              >
                {dateOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="filter-option">
              <label>Region</label>
              <select 
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
              >
                {regionOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;