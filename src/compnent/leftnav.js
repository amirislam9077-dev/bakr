import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { sites } from './sites';
import './leftnav.css';

const propTypes = {
  onLocationSelect: PropTypes.func.isRequired,
  onViewSite: PropTypes.func,
};

// Transform sites data to match the expected format
const locations = sites.map(site => ({
  name: site.name,
  coordinates: `${site.coordinates.lat}, ${site.coordinates.lng}`,
  type: site.type,
  city: site.city,
  region: site.state,
  category: site.period,
  statePeriod: site.period
}));

const LeftNav = ({ onLocationSelect, onViewSite }) => {
  const [selectedLocation, setSelectedLocation] = React.useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = useMemo(() => {
    if (!searchTerm.trim()) return locations;
    
    const term = searchTerm.toLowerCase();
    return locations.filter(location => 
      location.name.toLowerCase().includes(term) ||
      (location.city && location.city.toLowerCase().includes(term)) ||
      (location.type && location.type.toLowerCase().includes(term)) ||
      (location.region && location.region.toLowerCase().includes(term))
    );
  }, [searchTerm]);
  return (
    <aside className="left-nav">
      <div className="search-container">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
            <path d="M21 21L16.65 16.65"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="locations-count">
          {filteredLocations.length} {filteredLocations.length === 1 ? 'place' : 'places'} found
        </div>
      </div>

      <div className="locations-list">
        {filteredLocations.length > 0 ? (
          filteredLocations.map((location, index) => (
          <div
            key={index}
            className={`location-card ${selectedLocation === index ? 'selected' : ''}`}
            onClick={() => {
              setSelectedLocation(index);
              onLocationSelect({
                name: location.name,
                coordinates: location.coordinates.split(',').map(coord => parseFloat(coord.trim()))
              });
            }}
          >
            <div className="location-details">
              <div className="location-name-row">
                <div className="location-name">{location.name}</div>
                <svg
                  className="external-link-icon"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onViewSite) {
                      onViewSite(location.name);
                    }
                  }}
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </div>
              <div className="location-type">{location.type} • {location.city} • {location.statePeriod}</div>
            </div>
          </div>
          ))
        ) : (
          <div className="no-results">
            No locations found matching "{searchTerm}"
          </div>
        )}
      </div>
    </aside>
  );
};

LeftNav.propTypes = propTypes;

export default LeftNav;
