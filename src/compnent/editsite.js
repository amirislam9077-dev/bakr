import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './createsite.css';
import Location from './location';
import MapFro from './mapfro';
import Info from './info';
import Description from './descrip';
import References from './ref';
import Media from './media';
import SaveButtons from './save';

const EditSite = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // Fetch site data on component mount
  useEffect(() => {
    const fetchSite = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/sites/${id}`);
        const result = await response.json();

        if (result.success && result.data) {
          const site = result.data;
          setFormData({
            nameEnglish: site.name || '',
            nameArabic: site.nameArabic || '',
            siteType: site.type || 'Mountain',
            pinColor: site.color || '#8B4513',
            city: site.city || '',
            state: site.state || '',
            latitude: site.coordinates?.lat?.toString() || '24.7136',
            longitude: site.coordinates?.lng?.toString() || '46.6753',
            periodName: site.period || '',
            subPeriod: site.subPeriod || '',
            descriptionEnglish: site.descriptionEnglish || '',
            descriptionArabic: site.descriptionArabic || ''
          });
        } else {
          setError('Site not found');
        }
      } catch (err) {
        console.error('Error fetching site:', err);
        setError('Failed to load site data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSite();
    }
  }, [id]);

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
    window.history.back();
  };

  const handleCancel = () => {
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
      descriptionArabic: formData.descriptionArabic
    };

    try {
      // Update in database using PUT
      const response = await fetch(`http://localhost:5000/api/sites/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(siteData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Site updated successfully!');
        console.log('Updated site data:', result);
        navigate('/admin/sites');
      } else {
        const error = await response.json();
        alert(`Error updating site: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating site:', error);
      alert('Error updating site. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="create-site-container">
        <div className="loading-message">Loading site data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="create-site-container">
        <button className="back-button" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Sites
        </button>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="create-site-container">
      <button className="back-button" onClick={handleBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Sites
      </button>

      <h1 className="create-site-title">Edit Site</h1>
      <p className="create-site-subtitle">Update the information below to edit this site</p>

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
              <option value="Heritage Site">Heritage Site</option>
              <option value="Other">Other</option>
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

export default EditSite;
