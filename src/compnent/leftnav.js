import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { sites as defaultSites } from './sites';
import './leftnav.css';

const propTypes = {
  onLocationSelect: PropTypes.func.isRequired,
  onViewSite: PropTypes.func,
};

const LeftNav = ({ onLocationSelect, onViewSite }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sites from API on component mount
  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/sites');
        const result = await response.json();

        if (result.success && result.data.length > 0) {
          // Transform API data to location format
          const apiLocations = result.data.map(site => ({
            id: site.id,
            name: site.name,
            nameArabic: site.nameArabic,
            coordinates: site.coordinates ? `${site.coordinates.lat}, ${site.coordinates.lng}` : '',
            coordinatesObj: site.coordinates,
            type: site.type,
            color: site.color,
            city: site.city,
            state: site.state,
            region: site.state,
            period: site.period,
            subPeriod: site.subPeriod,
            descriptionEnglish: site.descriptionEnglish,
            descriptionArabic: site.descriptionArabic,
            references: site.references,
            media: site.media,
            statePeriod: site.period
          }));
          setLocations(apiLocations);
        } else {
          // Fallback to default sites if no API data
          const fallbackLocations = defaultSites.map(site => ({
            id: site.id,
            name: site.name,
            coordinates: `${site.coordinates.lat}, ${site.coordinates.lng}`,
            coordinatesObj: site.coordinates,
            type: site.type,
            color: site.color,
            city: site.city,
            state: site.state,
            region: site.state,
            period: site.period,
            statePeriod: site.period
          }));
          setLocations(fallbackLocations);
        }
      } catch (err) {
        console.error('Error fetching sites:', err);
        setError('Failed to load from database');
        // Fallback to default sites
        const fallbackLocations = defaultSites.map(site => ({
          id: site.id,
          name: site.name,
          coordinates: `${site.coordinates.lat}, ${site.coordinates.lng}`,
          coordinatesObj: site.coordinates,
          type: site.type,
          color: site.color,
          city: site.city,
          state: site.state,
          region: site.state,
          period: site.period,
          statePeriod: site.period
        }));
        setLocations(fallbackLocations);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  const filteredLocations = useMemo(() => {
    if (!searchTerm.trim()) return locations;

    const term = searchTerm.toLowerCase();
    return locations.filter(location =>
      location.name?.toLowerCase().includes(term) ||
      location.nameArabic?.toLowerCase().includes(term) ||
      location.city?.toLowerCase().includes(term) ||
      location.type?.toLowerCase().includes(term) ||
      location.region?.toLowerCase().includes(term) ||
      location.period?.toLowerCase().includes(term) ||
      location.descriptionEnglish?.toLowerCase().includes(term)
    );
  }, [searchTerm, locations]);

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
          {loading ? 'Loading...' : `${filteredLocations.length} ${filteredLocations.length === 1 ? 'place' : 'places'} found`}
          {error && <span className="error-indicator"> (offline)</span>}
        </div>
      </div>

      <div className="locations-list">
        {loading ? (
          <div className="loading-message">Loading places from database...</div>
        ) : filteredLocations.length > 0 ? (
          filteredLocations.map((location, index) => (
          <div
            key={location.id || index}
            className={`location-card ${selectedLocation === index ? 'selected' : ''}`}
            onClick={() => {
              setSelectedLocation(index);
              const coords = location.coordinates.split(',').map(coord => parseFloat(coord.trim()));
              onLocationSelect({
                name: location.name,
                coordinates: coords
              });
            }}
          >
            {/* Site Icon */}
            <div className="location-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 3v15M9 9h1M9 13h1M9 17h1M17 9h1M17 13h1"/>
              </svg>
            </div>

            <div className="location-details">
              <div className="location-name-row">
                <div className="location-name">
                  {location.name}
                  {location.type && <span className="location-type-inline"> • {location.type}</span>}
                </div>
              </div>

              {/* City, State with location icon */}
              <div className="location-info-row">
                <svg className="location-pin-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{location.city}{location.state && `, ${location.state}`}</span>
              </div>

              {/* Period badge */}
              <div className="location-badges">
                {location.period && <span className="highlight-text">{location.period}</span>}
              </div>
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
