import React from 'react';
import './location.css';

const Location = ({ 
  latitude = '24', 
  longitude = '45',
  onLatitudeChange = () => {},
  onLongitudeChange = () => {}
}) => {
  return (
    <div className="location-section">
      <h2 className="section-title">Location & Coordinates</h2>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Latitude <span className="required">*</span>
          </label>
          <input
            type="text"
            value={latitude}
            onChange={(e) => onLatitudeChange(e.target.value)}
            className="form-input"
            placeholder="e.g., 24.7136"
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            Longitude <span className="required">*</span>
          </label>
          <input
            type="text"
            value={longitude}
            onChange={(e) => onLongitudeChange(e.target.value)}
            className="form-input"
            placeholder="e.g., 46.6753"
          />
        </div>
      </div>
    </div>
  );
};

export default Location;