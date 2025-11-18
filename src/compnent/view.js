import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './view.css';

const View = ({ site, isOpen, onClose }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!site) return null;

  // Map period to description
  const getPeriodDescription = (period) => {
    const descriptions = {
      'Ancient': 'Ancient (Nabataean)',
      'Islamic': 'Islamic Period',
      'Modern': 'Modern Era',
      'Geological': 'Geological Formation'
    };
    return descriptions[period] || period;
  };

  // Get site description based on name
  const getSiteDescription = (site) => {
    const descriptions = {
      'Al-Ula Heritage Site': 'Al-Ula is a living museum of preserved tombs, sandstone outcrops, historic dwellings and monuments. The site includes Hegra (Madain Saleh), Saudi Arabia\'s first UNESCO World Heritage Site.',
      'Rijal Almaa Heritage Village': 'Rijal Almaa is a stunning heritage village featuring traditional stone buildings with colorful facades, showcasing the rich cultural heritage of the Asir region.',
      'Ushaiger Heritage Village': 'Ushaiger is one of the oldest heritage villages in Saudi Arabia, featuring traditional Najdi architecture with mud-brick houses and narrow alleyways.',
      'Farasan Islands': 'The Farasan Islands are a coral archipelago in the Red Sea, known for their pristine beaches, diverse marine life, and historical Ottoman fortifications.',
      'Edge of the World': 'Edge of the World (Jebel Fihrayn) offers dramatic cliff views overlooking an ancient ocean bed, providing breathtaking panoramic vistas of the desert landscape.',
      'Jabal Al-Lawz': 'Jabal Al-Lawz is a mountain in the Tabuk region, known for its unique rock formations and occasional snowfall during winter months.',
      'Diriyah At-Turaif': 'Diriyah At-Turaif is a UNESCO World Heritage Site and the birthplace of the first Saudi state, featuring remarkable Najdi architecture.',
      'Al-Ahsa Oasis': 'Al-Ahsa is one of the world\'s largest natural oases, recognized by UNESCO for its unique irrigation system and date palm groves.'
    };
    return descriptions[site.name] || `${site.name} is a significant ${site.type.toLowerCase()} located in ${site.city}, ${site.state}.`;
  };

  // Use React Portal to render at document body level
  return ReactDOM.createPortal(
    <>
      <div className={`view-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div ref={panelRef} className={`view-panel ${isOpen ? 'open' : ''}`}>
        <div className="view-header">
          <div className="view-header-content">
            <h1 className="view-title">{site.name}</h1>
            <div className="view-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="10" r="3"/>
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
              </svg>
              <span>{site.city}, {site.state}</span>
            </div>
          </div>
          <button className="view-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="view-content">
          <div className="view-section">
            <label className="view-label">TYPE</label>
            <span className="view-type-badge">{site.type}</span>
          </div>

          <div className="view-section">
            <label className="view-label">COORDINATES</label>
            <p className="view-text">{site.coordinates.lat}°, {site.coordinates.lng}°</p>
          </div>

          <div className="view-section">
            <label className="view-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              PERIOD
            </label>
            <p className="view-text">{getPeriodDescription(site.period)}</p>
          </div>

          <div className="view-section">
            <label className="view-label">DESCRIPTION</label>
            <p className="view-description">{getSiteDescription(site)}</p>
          </div>

          <div className="view-section">
            <label className="view-label">MEDIA</label>
            <div className="view-media-placeholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <circle cx="12" cy="10" r="3"/>
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
              </svg>
            </div>
          </div>

          <div className="view-section">
            <label className="view-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              REFERENCES
            </label>
            <a href="https://whc.unesco.org/en/list/" target="_blank" rel="noopener noreferrer" className="view-reference-link">
              UNESCO World Heritage
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default View;
