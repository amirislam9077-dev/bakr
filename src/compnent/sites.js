import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './sites.css';

export const sites = [
    {
      id: 1,
      name: 'Rijal Almaa Heritage Village',
      coordinates: { lat: 18.2044, lng: 42.2442 },
      type: 'Heritage Site',
      city: 'Rijal Almaa',
      state: 'Asir',
      period: 'Islamic',
      color: '#f97316'
    },
    {
      id: 2,
      name: 'Ushaiger Heritage Village',
      coordinates: { lat: 25.3333, lng: 45.2167 },
      type: 'Heritage Site',
      city: 'Shaqra',
      state: 'Riyadh',
      period: 'Islamic',
      color: '#10b981'
    },
    {
      id: 3,
      name: 'Farasan Islands',
      coordinates: { lat: 16.7020, lng: 41.9836 },
      type: 'Other',
      city: 'Jazan',
      state: 'Jazan',
      period: 'Modern',
      color: '#3b82f6'
    },
    {
      id: 4,
      name: 'Edge of the World',
      coordinates: { lat: 24.9174, lng: 46.1381 },
      type: 'Other',
      city: 'Riyadh',
      state: 'Riyadh',
      period: 'Geological',
      color: '#f97316'
    },
    {
      id: 5,
      name: 'Jabal Al-Lawz',
      coordinates: { lat: 28.6389, lng: 35.3147 },
      type: 'Mountain',
      city: 'Tabuk',
      state: 'Tabuk',
      period: 'Ancient',
      color: '#92400e'
    },
    {
      id: 6,
      name: 'Al-Ula Heritage Site',
      coordinates: { lat: 26.6144, lng: 37.9236 },
      type: 'Heritage Site',
      city: 'Al-Ula',
      state: 'Al Madinah',
      period: 'Ancient',
      color: '#10b981'
    },
    {
      id: 7,
      name: 'Diriyah At-Turaif',
      coordinates: { lat: 24.7375, lng: 46.5728 },
      type: 'Heritage Site',
      city: 'Diriyah',
      state: 'Riyadh',
      period: 'Islamic',
      color: '#3b82f6'
    },
    {
      id: 8,
      name: 'Al-Ahsa Oasis',
      coordinates: { lat: 25.4297, lng: 49.6206 },
      type: 'Other',
      city: 'Al-Ahsa',
      state: 'Eastern Province',
      period: 'Ancient',
      color: '#f97316'
    }
  ];

const Sites = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All Types' || site.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="sites-container">
      <div className="sites-header">
        <div className="sites-header-left">
          <h1 className="sites-title">Sites Management</h1>
          <p className="sites-count">{filteredSites.length} sites</p>
        </div>
        <button
          className="sites-create-btn"
          onClick={() => navigate('/admin/sites/create')}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Create New Site
        </button>
      </div>

      <div className="sites-filters">
        <div className="sites-search">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sites-search-input"
          />
        </div>
        <div className="sites-filter">
          <svg className="filter-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="sites-filter-select"
          >
            <option>All Types</option>
            <option>Heritage Site</option>
            <option>Mountain</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="sites-table-container">
        <table className="sites-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>TYPE</th>
              <th>CITY</th>
              <th>STATE</th>
              <th>PERIOD</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredSites.map(site => (
              <tr key={site.id}>
                <td>
                  <div className="site-name-cell">
                    <div className="site-color-indicator" style={{ backgroundColor: site.color }}></div>
                    <div>
                      <div className="site-name">{site.name}</div>
                      <div className="site-coordinates">({site.coordinates.lat}, {site.coordinates.lng})</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="site-type-badge">{site.type}</span>
                </td>
                <td>{site.city}</td>
                <td>{site.state}</td>
                <td>{site.period}</td>
                <td>
                  <div className="site-actions">
                    <button className="action-btn edit-btn">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="action-btn delete-btn">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sites;



