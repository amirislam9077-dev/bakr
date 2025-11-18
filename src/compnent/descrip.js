import React from 'react';
import './location.css';

const Description = ({
  descriptionEnglish = '',
  descriptionArabic = '',
  onDescriptionEnglishChange = () => {},
  onDescriptionArabicChange = () => {}
}) => {
  return (
    <div className="location-section">
      <h2 className="section-title">Description</h2>
      <div className="form-group" style={{ marginBottom: '16px', marginTop: '-15px' }}>
        <label className="form-label">
          Description (English) <span className="required">*</span>
        </label>
        <textarea
          value={descriptionEnglish}
          onChange={(e) => onDescriptionEnglishChange(e.target.value)}
          className="form-input"
          placeholder="Describe the site in detail..."
          style={{ height: '100px', resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>
      <div className="form-group" style={{ marginTop: '-15px' }}>
        <label className="form-label">
          Description (Arabic) <span className="required">*</span>
        </label>
        <textarea
          value={descriptionArabic}
          onChange={(e) => onDescriptionArabicChange(e.target.value)}
          className="form-input"
          placeholder="وصف الموقع بالتفصيل..."
          dir="rtl"
          style={{ height: '100px', resize: 'vertical', textAlign: 'right', fontFamily: 'inherit' }}
        />
      </div>
    </div>
  );
};

export default Description;
