import React from 'react';
import PropTypes from 'prop-types';
import './popup.css';

const Popup = ({ show, data, onClose, onViewDetails }) => {
  if (!show || !data) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <div className="popup-header">
          <h3 className="popup-title">{data.name}</h3>
          <span className="popup-badge">{data.type}</span>
        </div>

        <div className="popup-body">
          <div className="popup-info-row">
            <svg className="popup-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="popup-text">{data.city}, {data.state}</span>
          </div>

          <div className="popup-info-row">
            <svg className="popup-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="popup-text">{data.period}</span>
          </div>
        </div>

        <button className="popup-view-btn" onClick={() => onViewDetails && onViewDetails(data.name)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          View Details
        </button>
      </div>
    </div>
  );
};

Popup.propTypes = {
  show: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    period: PropTypes.string,
  }),
  onClose: PropTypes.func,
  onViewDetails: PropTypes.func,
};

export default Popup;
