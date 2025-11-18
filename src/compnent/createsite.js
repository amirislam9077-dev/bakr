import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './createsite.css';
import Location from './location';
import MapFro from './mapfro';
import Info from './info';
import Description from './descrip';
import References from './ref';
import Media from './media';
import SaveButtons from './save';

const CreateSite = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nameEnglish: '',
    nameArabic: '',
    siteType: 'Mountain',
    pinColor: '#8B4513',
    city: '',
    state: '',
    latitude: '24.7136',
    longitude: '46.6753',
    periodName: '',
    subPeriod: '',
    descriptionEnglish: '',
    descriptionArabic: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMapLocationSelect = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleBack = () => {
    // Navigate back to sites
    window.history.back();
  };

  const handleCancel = () => {
    // Navigate back to sites page
    navigate('/admin/sites');
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.nameEnglish || !formData.nameArabic || !formData.city || !formData.state) {
      alert('Please fill in all required fields (Name English, Name Arabic, City, State)');
      return;
    }

    // Prepare data to save
    const siteData = {
      name: formData.nameEnglish,
      nameArabic: formData.nameArabic,
      type: formData.siteType,
      color: formData.pinColor,
      city: formData.city,
      state: formData.state,
      coordinates: {
        lat: parseFloat(formData.latitude),
        lng: parseFloat(formData.longitude)
      },
      period: formData.periodName,
      subPeriod: formData.subPeriod,
      descriptionEnglish: formData.descriptionEnglish,
      descriptionArabic: formData.descriptionArabic,
      createdAt: new Date().toISOString()
    };

    try {
      // Save to database
      const response = await fetch('http://localhost:5000/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(siteData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Site saved successfully!');
        console.log('Saved site data:', result);

        // Navigate back to sites page
        navigate('/admin/sites');
      } else {
        const error = await response.json();
        alert(`Error saving site: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving site:', error);

      // For now, save to localStorage as fallback
      const existingSites = JSON.parse(localStorage.getItem('sites') || '[]');
      const newSite = {
        id: Date.now(),
        ...siteData
      };
      existingSites.push(newSite);
      localStorage.setItem('sites', JSON.stringify(existingSites));

      alert('Site saved to local storage! (Database connection pending)');
      console.log('Saved site data to localStorage:', newSite);

      // Navigate back to sites page
      navigate('/admin/sites');
    }
  };

  return (
    <div className="create-site-container">
      <button className="back-button" onClick={handleBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Sites
      </button>

      <h1 className="create-site-title">Create New Site</h1>
      <p className="create-site-subtitle">Fill in the information below to create a new site</p>

      <div className="form-section">
        <h2 className="section-title">Basic Information</h2>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Name (English) <span className="required">*</span>
            </label>
            <input
              type="text"
              name="nameEnglish"
              value={formData.nameEnglish}
              onChange={handleChange}
              placeholder="Enter site name in English"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Name (Arabic) <span className="required">*</span>
            </label>
            <input
              type="text"
              name="nameArabic"
              value={formData.nameArabic}
              onChange={handleChange}
              placeholder="أدخل اسم الموقع بالعربية"
              className="form-input rtl"
              dir="rtl"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Site Type <span className="required">*</span>
            </label>
            <select
              name="siteType"
              value={formData.siteType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Mountain">Mountain</option>
              <option value="Historical">Historical</option>
              <option value="Cultural">Cultural</option>
              <option value="Natural">Natural</option>
              <option value="Archaeological">Archaeological</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Pin Color</label>
            <div className="color-input-wrapper">
              <div
                className="color-preview"
                style={{ backgroundColor: formData.pinColor }}
              ></div>
              <input
                type="text"
                name="pinColor"
                value={formData.pinColor}
                onChange={handleChange}
                className="form-input color-text-input"
              />
              <input
                type="color"
                value={formData.pinColor}
                onChange={(e) => handleChange({ target: { name: 'pinColor', value: e.target.value }})}
                className="color-picker"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              City <span className="required">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g., Riyadh, Jeddah"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              State <span className="required">*</span>
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g., Riyadh Region, Makkah"
              className="form-input"
            />
          </div>
        </div>
      </div>

      <div className="location-section">
        <div className="location-inputs">
          <Location
            latitude={formData.latitude}
            longitude={formData.longitude}
            onLatitudeChange={(value) => handleLocationChange('latitude', value)}
            onLongitudeChange={(value) => handleLocationChange('longitude', value)}
          />
        </div>
        <div className="map-wrapper">
          <MapFro
            latitude={formData.latitude}
            longitude={formData.longitude}
            onLocationChange={handleMapLocationSelect}
          />
        </div>
      </div>

      <Info
        startPeriod={formData.periodName}
        endPeriod={formData.subPeriod}
        onStartPeriodChange={(value) => handleLocationChange('periodName', value)}
        onEndPeriodChange={(value) => handleLocationChange('subPeriod', value)}
      />

      <Description
        descriptionEnglish={formData.descriptionEnglish}
        descriptionArabic={formData.descriptionArabic}
        onDescriptionEnglishChange={(value) => handleLocationChange('descriptionEnglish', value)}
        onDescriptionArabicChange={(value) => handleLocationChange('descriptionArabic', value)}
      />

      <References />

      <Media />

      <SaveButtons onCancel={handleCancel} onSave={handleSave} />
    </div>
  );
};

export default CreateSite;
