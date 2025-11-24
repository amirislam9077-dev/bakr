import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import './filter.css';

const FilterComponent = ({ onFilterChange, filteredCount, totalCount, isOpen, onToggle }) => {
  const [filters, setFilters] = useState({
    siteType: [],
    city: '',
    state: '',
    period: []
  });

  const siteTypes = ['Mountain', 'Heritage Site', 'Other', 'Valley'];
  const periods = ['Ancient', 'Geological', 'Islamic', 'Modern'];

  const handleTypeToggle = (type) => {
    const newTypes = filters.siteType.includes(type)
      ? filters.siteType.filter(t => t !== type)
      : [...filters.siteType, type];

    const newFilters = { ...filters, siteType: newTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePeriodToggle = (period) => {
    const newPeriods = filters.period.includes(period)
      ? filters.period.filter(p => p !== period)
      : [...filters.period, period];

    const newFilters = { ...filters, period: newPeriods };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSelectChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      siteType: [],
      city: '',
      state: '',
      period: []
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.siteType.length > 0 ||
    filters.city !== '' ||
    filters.state !== '' ||
    filters.period.length > 0;

  return (
    <div className="filter-wrapper" onClick={(e) => e.stopPropagation()}>
      <button
        className={`filters-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <Filter size={16} />
        <span>Filters</span>
        {filteredCount !== undefined && (
          <span className="filter-count-badge">
            {filteredCount}/{totalCount}
          </span>
        )}
        <svg
          className={`chevron ${isOpen ? 'open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="filters-panel" onClick={(e) => e.stopPropagation()}>
          <div className="filters-section">
            <label className="filters-label">SITE TYPE</label>
            <div className="filters-buttons-group">
              {siteTypes.map(type => (
                <button
                  key={type}
                  className={`filter-type-btn ${filters.siteType.includes(type) ? 'active' : ''}`}
                  onClick={() => handleTypeToggle(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="filters-section">
            <label className="filters-label">CITY</label>
            <select
              className="filters-select"
              value={filters.city}
              onChange={(e) => handleSelectChange('city', e.target.value)}
            >
              <option value="">Select Cities</option>
              <option value="Rijal Almaa">Rijal Almaa</option>
              <option value="Shaqra">Shaqra</option>
              <option value="Jazan">Jazan</option>
              <option value="Riyadh">Riyadh</option>
              <option value="Tabuk">Tabuk</option>
              <option value="Al-Ula">Al-Ula</option>
              <option value="Diriyah">Diriyah</option>
              <option value="Al-Ahsa">Al-Ahsa</option>
            </select>
          </div>

          <div className="filters-section">
            <label className="filters-label">STATE</label>
            <select
              className="filters-select"
              value={filters.state}
              onChange={(e) => handleSelectChange('state', e.target.value)}
            >
              <option value="">Select States</option>
              <option value="Asir">Asir</option>
              <option value="Riyadh">Riyadh</option>
              <option value="Jazan">Jazan</option>
              <option value="Tabuk">Tabuk</option>
              <option value="Al Madinah">Al Madinah</option>
              <option value="Eastern Province">Eastern Province</option>
            </select>
          </div>

          <div className="filters-section">
            <label className="filters-label">PERIOD</label>
            <div className="filters-buttons-group">
              {periods.map(period => (
                <button
                  key={period}
                  className={`filter-type-btn ${filters.period.includes(period) ? 'active' : ''}`}
                  onClick={() => handlePeriodToggle(period)}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="filters-section clear-section">
              <button className="clear-all-btn" onClick={handleClearAll}>
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterComponent;