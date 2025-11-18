import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './locationmap.css';

// Create custom marker icon using inline SVG to avoid CDN blocking
const customIcon = L.divIcon({
  className: 'custom-location-marker',
  html: `
    <div class="modern-marker">
      <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.164 0 0 7.164 0 16C0 28 16 48 16 48C16 48 32 28 32 16C32 7.164 24.836 0 16 0Z"
              fill="#3B82F6"
              stroke="white"
              stroke-width="2"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    </div>
  `,
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48]
});

// Component to handle tile layer changes
const TileLayerControl = ({ currentStyle }) => {
  const map = useMap();
  const tileLayerRef = useRef(null);

  useEffect(() => {
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let newLayer;
    if (currentStyle === 'OpenStreetMap') {
      newLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      });
    } else {
      newLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19
      });
    }

    newLayer.addTo(map);
    tileLayerRef.current = newLayer;
  }, [currentStyle, map]);

  return null;
};

const LocationMap = ({ latitude, longitude, onLocationSelect }) => {
  const [position, setPosition] = useState([24.7136, 46.6753]);
  const [map, setMap] = useState(null);
  const [currentStyle, setCurrentStyle] = useState('OpenStreetMap');
  const [placeName, setPlaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const markerRef = useRef(null);

  // Fetch place name from coordinates using reverse geocoding
  const fetchPlaceName = async (lat, lng) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setPlaceName(data.display_name);
      } else {
        setPlaceName('Unknown location');
      }
    } catch (error) {
      console.error('Error fetching place name:', error);
      setPlaceName('Unable to fetch location name');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (latitude && longitude) {
      const newPos = [parseFloat(latitude), parseFloat(longitude)];
      setPosition(newPos);
      if (map) {
        map.flyTo(newPos, 13);
      }
    }
  }, [latitude, longitude, map]);

  const handleMapClick = (e) => {
    const newPosition = [e.latlng.lat, e.latlng.lng];
    setPosition(newPosition);
    if (onLocationSelect) {
      onLocationSelect(newPosition[0].toString(), newPosition[1].toString());
    }
    fetchPlaceName(newPosition[0], newPosition[1]);
  };

  const handleMarkerDragEnd = (e) => {
    const marker = e.target;
    const newPosition = marker.getLatLng();
    setPosition([newPosition.lat, newPosition.lng]);
    if (onLocationSelect) {
      onLocationSelect(newPosition.lat.toString(), newPosition.lng.toString());
    }
    fetchPlaceName(newPosition.lat, newPosition.lng);

    // Open popup after drag
    marker.openPopup();
  };

  const changeMapStyle = (styleName) => {
    setCurrentStyle(styleName);
  };

  return (
    <div className="map-section" style={{ width: '100%' }}>
      <div className="map-container" style={{ width: '100%', height: '400px', position: 'relative', marginLeft: '-200px' }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
          whenCreated={setMap}
          onClick={handleMapClick}
        >
          <TileLayerControl currentStyle={currentStyle} />
          <Marker
            position={position}
            icon={customIcon}
            draggable={true}
            ref={markerRef}
            eventHandlers={{
              dragend: handleMarkerDragEnd
            }}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                {placeName && (
                  <div style={{
                    marginBottom: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#1f2937',
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '8px'
                  }}>
                    {isLoading ? 'Loading...' : placeName}
                  </div>
                )}
                <div style={{ fontSize: '12px', color: '#4b5563' }}>
                  <div><strong>Latitude:</strong> {position[0].toFixed(6)}</div>
                  <div><strong>Longitude:</strong> {position[1].toFixed(6)}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Map Style Switcher - Top Center */}
        <div className="map-style-switcher-top">
          <button
            className={`map-style-btn ${currentStyle === 'OpenStreetMap' ? 'active' : ''}`}
            onClick={() => changeMapStyle('OpenStreetMap')}
          >
            OpenStreetMap
          </button>
          <button
            className={`map-style-btn ${currentStyle === 'Satellite' ? 'active' : ''}`}
            onClick={() => changeMapStyle('Satellite')}
          >
            Satellite
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
