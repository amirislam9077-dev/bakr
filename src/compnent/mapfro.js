import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './mapfro.css';

const MapFro = ({
  latitude = '24.7136',
  longitude = '46.6753',
  onLocationChange = () => {}
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [currentStyle, setCurrentStyle] = useState('OpenStreetMap');
  const [placeName, setPlaceName] = useState('Saudi Arabia');
  const tileLayerRef = useRef(null);

  // Fetch place name from coordinates using reverse geocoding
  const fetchPlaceName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        const parts = data.display_name.split(',');
        const shortName = parts.slice(0, 3).join(',').trim();
        setPlaceName(shortName);
        return shortName;
      }
    } catch (error) {
      console.error('Error fetching place name:', error);
    }
    return 'Unknown Location';
  };

  // Update popup content
  const updatePopupContent = (name, lat, lng) => {
    return `
      <div class="map-popup">
        <h4 style="color: #059669; margin: 0 0 8px 0; font-size: 14px;">${name}</h4>
        <div style="color: #4b5563; font-size: 12px;">
          <div><strong>Latitude:</strong> ${parseFloat(lat).toFixed(6)}</div>
          <div><strong>Longitude:</strong> ${parseFloat(lng).toFixed(6)}</div>
        </div>
      </div>
    `;
  };

  useEffect(() => {
    // Only initialize if map hasn't been initialized
    if (mapRef.current && !mapInstanceRef.current) {
      const lat = parseFloat(latitude) || 24.7136;
      const lng = parseFloat(longitude) || 46.6753;

      // Initialize map centered on provided coordinates
      const map = L.map(mapRef.current, {
        zoomControl: false // Disable default zoom control to position it manually
      }).setView([lat, lng], 6);

      // Add zoom control with custom position
      L.control.zoom({
        position: 'topright'
      }).addTo(map);

      // Add OpenStreetMap tiles
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      tileLayerRef.current = osmLayer;

      // Create draggable marker icon
      const markerIcon = L.divIcon({
        className: 'site-marker',
        html: `
          <div class="site-marker-container" style="--marker-color: #059669">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4C10.477 4 6 8.477 6 14C6 21 16 30 16 30C16 30 26 21 26 14C26 8.477 21.523 4 16 4Z"
                    fill="#059669"
                    stroke="white"
                    stroke-width="2"/>
              <circle cx="16" cy="14" r="4" fill="white"/>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      // Add draggable marker
      const marker = L.marker([lat, lng], {
        icon: markerIcon,
        draggable: true
      }).addTo(map);

      // Set initial popup
      marker.bindPopup(updatePopupContent(placeName, lat, lng));

      // Fetch initial place name
      fetchPlaceName(lat, lng).then(name => {
        marker.setPopupContent(updatePopupContent(name, lat, lng));
      });

      // Handle marker drag end
      marker.on('dragend', async (e) => {
        const position = e.target.getLatLng();
        const newLat = position.lat.toFixed(6);
        const newLng = position.lng.toFixed(6);

        // Update parent component
        onLocationChange(newLat, newLng);

        // Fetch and update place name
        const name = await fetchPlaceName(newLat, newLng);
        marker.setPopupContent(updatePopupContent(name, newLat, newLng));
        marker.openPopup();
      });

      // Handle map click to move marker
      map.on('click', async (e) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        const newLat = clickLat.toFixed(6);
        const newLng = clickLng.toFixed(6);

        // Move marker to clicked position
        marker.setLatLng([clickLat, clickLng]);

        // Update parent component
        onLocationChange(newLat, newLng);

        // Fetch and update place name
        const name = await fetchPlaceName(newLat, newLng);
        marker.setPopupContent(updatePopupContent(name, newLat, newLng));
        marker.openPopup();
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Update marker position when latitude/longitude props change
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      const lat = parseFloat(latitude) || 24.7136;
      const lng = parseFloat(longitude) || 46.6753;

      const currentPos = markerRef.current.getLatLng();
      if (Math.abs(currentPos.lat - lat) > 0.0001 || Math.abs(currentPos.lng - lng) > 0.0001) {
        markerRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current.panTo([lat, lng]);

        // Fetch and update place name
        fetchPlaceName(lat, lng).then(name => {
          markerRef.current.setPopupContent(updatePopupContent(name, lat, lng));
        });
      }
    }
  }, [latitude, longitude]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const changeMapStyle = (styleName) => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    // Remove current tile layer
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    // Add new tile layer based on selection
    let newLayer;
    if (styleName === 'OpenStreetMap') {
      newLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      });
    } else if (styleName === 'OpenTopoMap') {
      newLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
        maxZoom: 17
      });
    }

    newLayer.addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
    setCurrentStyle(styleName);
  };

  return (
    <div className="map-container">
      <div ref={mapRef} className="map-view"></div>

      {/* Map Style Switcher - Top Center */}
      <div className="map-style-switcher-top">
        <button
          className={`map-style-btn ${currentStyle === 'OpenStreetMap' ? 'active' : ''}`}
          onClick={() => changeMapStyle('OpenStreetMap')}
        >
          OpenStreetMap
        </button>
        <button
          className={`map-style-btn ${currentStyle === 'OpenTopoMap' ? 'active' : ''}`}
          onClick={() => changeMapStyle('OpenTopoMap')}
        >
          OpenTopoMap
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="zoom-controls">
        <button className="zoom-btn" onClick={handleZoomIn} title="Zoom In">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="zoom-btn" onClick={handleZoomOut} title="Zoom Out">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MapFro;
