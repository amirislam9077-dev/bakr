import React from 'react';
import './location.css';

const Info = ({
  startPeriod = '',
  endPeriod = '',
  onStartPeriodChange = () => {},
  onEndPeriodChange = () => {}
}) => {
  return (
    <div className="location-section">
      <h2 className="section-title">Period Information</h2>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Period Name <span className="required">*</span>
          </label>
          <input
            type="text"
            value={startPeriod}
            onChange={(e) => onStartPeriodChange(e.target.value)}
            className="form-input"
            placeholder="e.g., Modern, Ancient"
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            Sub-period (optional)
          </label>
          <input
            type="text"
            value={endPeriod}
            onChange={(e) => onEndPeriodChange(e.target.value)}
            className="form-input"
            placeholder="e.g., Contemporary, Nabatean"
          />
        </div>
      </div>
    </div>
  );
};

export default Info;