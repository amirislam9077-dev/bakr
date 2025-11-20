import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import './map.css';
import { sites } from './sites';
import { MapPin } from 'lucide-react';

// Create a custom location icon
const createLocationIcon = () => {
  return L.divIcon({
    className: 'location-pin',
    html: `
      <div class="location-pin-container">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#4285F4" stroke="white" stroke-width="2"/>
          <circle cx="12" cy="9" r="3" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

const Map = ({ selectedLocation, onViewSite }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [currentStyle, setCurrentStyle] = useState('OpenStreetMap');
  const [isClusterEnabled, setIsClusterEnabled] = useState(false);
  const tileLayerRef = useRef(null);
  const popupRef = useRef(null);
  const markersRef = useRef({});
  const markersArrayRef = useRef([]);
  const clusterGroupRef = useRef(null);
  const locationMarkerRef = useRef(null);

  // Handle selected location changes
  useEffect(() => {
    if (selectedLocation && mapInstanceRef.current) {
      const { coordinates, name } = selectedLocation;
      const [lat, lng] = coordinates;

      // Remove existing popup if any
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }

      // Always remove existing location marker if any
      if (locationMarkerRef.current) {
        mapInstanceRef.current.removeLayer(locationMarkerRef.current);
        locationMarkerRef.current = null;
      }

      // Add location marker at the center
      const locationIcon = createLocationIcon();
      locationMarkerRef.current = L.marker([lat, lng], { 
        icon: locationIcon, 
        zIndexOffset: 1000 
      }).addTo(mapInstanceRef.current);
      
      // Store the current coordinates for later use
      locationMarkerRef.current.coordinates = [lat, lng];
      
      // Add click handler to the marker to toggle popup
      locationMarkerRef.current.on('click', (e) => {
        // Close if already open
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
          return;
        }
        
        // Otherwise open the popup
        openPopupAt(lat, lng);
        
        // Ensure the popup is visible in the viewport
        setTimeout(() => {
          if (mapInstanceRef.current && popupRef.current) {
            // Get the popup's pixel position
            const point = mapInstanceRef.current.latLngToContainerPoint([lat, lng]);
            // Adjust the view to ensure the popup is visible
            mapInstanceRef.current.panBy([0, -100], { animate: true });
          }
        }, 50);
      });

      // Find the marker for this location by comparing coordinates with tolerance
      let foundMarker = null;
      let foundSite = sites.find(s =>
        Math.abs(s.coordinates.lat - lat) < 0.0001 &&
        Math.abs(s.coordinates.lng - lng) < 0.0001
      );

      // Search through all markers to find matching one
      for (const key in markersRef.current) {
        const [markerLat, markerLng] = key.split('-').map(Number);
        if (Math.abs(markerLat - lat) < 0.0001 && Math.abs(markerLng - lng) < 0.0001) {
          foundMarker = markersRef.current[key];
          break;
        }
      }

      // Force a small delay before centering to ensure the map is ready
      setTimeout(() => {
        // Set the view with animation
        mapInstanceRef.current.setView([lat, lng], 14, {
          animate: true,
          duration: 0.5,
          easeLinearity: 0.5
        });

        // Ensure the view is set correctly after animation
        setTimeout(() => {
          mapInstanceRef.current.panTo([lat, lng], {
            animate: false
          });
        }, 100);
      }, 10);

      // Open the marker's popup after a short delay if marker is found
      if (foundMarker) {
        setTimeout(() => {
          foundMarker.openPopup();
          // One more view adjustment after popup opens to ensure centering
          setTimeout(() => {
            mapInstanceRef.current.panTo([lat, lng], {
              animate: false
            });
          }, 100);
        }, 500);
      } else {
        // Show popup for the selected location
        openPopupAt(lat, lng);

        // Remove existing location marker if any
        if (locationMarkerRef.current) {
          mapInstanceRef.current.removeLayer(locationMarkerRef.current);
        }

        // Add location marker at the center
        const locationIcon = createLocationIcon();
        locationMarkerRef.current = L.marker([lat, lng], { icon: locationIcon, zIndexOffset: 1000 })
          .addTo(mapInstanceRef.current);

        // Zoom to the selected location
        mapInstanceRef.current.setView([lat, lng], 14, {
          animate: true,
          duration: 1
        });
      }
    }
  }, [selectedLocation]);

  // Function to open popup at specific coordinates
  const openPopupAt = (lat, lng) => {
    const site = sites.find(s =>
      Math.abs(s.coordinates.lat - lat) < 0.0001 &&
      Math.abs(s.coordinates.lng - lng) < 0.0001
    );
    
    if (site) {
      const popupContent = createPopupContent(site);
      
      // Create popup with offset to position it above the marker
      popupRef.current = L.popup({
        className: 'custom-popup-container',
        closeButton: true,
        maxWidth: 280,
        autoClose: false,
        closeOnClick: false,
        offset: L.point(0, -40) // This moves the popup up by 40 pixels
      })
        .setLatLng([lat, lng])
        .setContent(popupContent);
        
      // Open the popup
      popupRef.current.openOn(mapInstanceRef.current);
      
      // Ensure the popup is in the correct position
      if (popupRef.current && popupRef.current._container) {
        const popup = popupRef.current._container;
        popup.style.marginTop = '-40px'; // Additional offset to ensure it's above the marker
      }
        
      // Add click handler to close button
      const closeButton = document.querySelector('.leaflet-popup-close-button');
      if (closeButton) {
        // Remove any existing event listeners to prevent duplicates
        const newCloseButton = closeButton.cloneNode(true);
        closeButton.parentNode.replaceChild(newCloseButton, closeButton);
        
        newCloseButton.addEventListener('click', (e) => {
          e.stopPropagation();
          if (popupRef.current) {
            popupRef.current.remove();
            popupRef.current = null;
          }
        });
      }
    }
  };
  
  // Create popup content
  const createPopupContent = (site) => {
    return '<div class="modern-popup">' +
      '<div class="popup-header" style="background-color: #059669;">' +
        '<h3 class="popup-title">' + site.name + '</h3>' +
        '<span class="popup-badge">' + site.type + '</span>' +
      '</div>' +
      '<div class="popup-body">' +
        '<div class="info-row">' +
          '<svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
            '<circle cx="12" cy="10" r="3"/>' +
            '<path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>' +
          '</svg>' +
          '<span class="info-text">' + site.city + ', ' + site.state + '</span>' +
        '</div>' +
        '<div class="info-row">' +
          '<svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
            '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>' +
            '<line x1="16" y1="2" x2="16" y2="6"/>' +
            '<line x1="8" y1="2" x2="8" y2="6"/>' +
            '<line x1="3" y1="10" x2="21" y2="10"/>' +
          '</svg>' +
          '<span class="info-text">' + site.period + '</span>' +
        '</div>' +
      '</div>' +
      '<button class="view-details-btn" onclick="window.dispatchEvent(new CustomEvent(\'openViewPanel\', { detail: \'' + site.name + '\' }))">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
          '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>' +
          '<circle cx="12" cy="12" r="3"/>' +
        '</svg>' +
        'View Details' +
      '</button>' +
    '</div>';
  };

  // Handle map click to close popup
  useEffect(() => {
    if (mapInstanceRef.current) {
      const handleMapClick = (e) => {
        // Check if click is on a marker or popup
        if (e.originalEvent.target.closest('.leaflet-marker-icon, .leaflet-popup')) {
          return;
        }
        
        // Close popup if open
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      };
      
      mapInstanceRef.current.on('click', handleMapClick);
      
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.off('click', handleMapClick);
        }
      };
    }
  }, []);
  
  // Listen for view panel open events
  useEffect(() => {
    const handleOpenViewPanel = (event) => {
      if (onViewSite) {
        onViewSite(event.detail);
      }
    };

    window.addEventListener('openViewPanel', handleOpenViewPanel);
    return () => {
      window.removeEventListener('openViewPanel', handleOpenViewPanel);
    };
  }, [onViewSite]);

  useEffect(() => {
    let zoomTimeout;

    // Only initialize if map hasn't been initialized
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize map centered on Saudi Arabia with closer zoom (zoom in first)
      const map = L.map(mapRef.current, {
        zoomControl: false, // Disable default zoom control
        zoom: 7,
        center: [23.8859, 45.0792]
      });
      mapInstanceRef.current = map;

      // Add custom zoom control to top right
      L.control.zoom({
        position: 'topright'
      }).addTo(map);

      // Add OpenStreetMap tiles
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      tileLayerRef.current = osmLayer;

      // Add markers for all sites
      const markers = [];

      sites.forEach(site => {
        // Create Google Maps style marker
        const siteIcon = L.divIcon({
          className: 'site-marker',
          html: '<div class="google-marker" style="--marker-color: ' + site.color + '">' +
              '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M20 2C12.27 2 6 8.27 6 16C6 26.5 20 38 20 38C20 38 34 26.5 34 16C34 8.27 27.73 2 20 2Z" fill="white" stroke="' + site.color + '" stroke-width="2"/>' +
                '<path d="M20 22C22.2091 22 24 20.2091 24 18C24 15.7909 22.2091 14 20 14C17.7909 14 16 15.7909 16 18C16 20.2091 17.7909 22 20 22Z" fill="' + site.color + '"/>' +
              '</svg>' +
            '</div>',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40]
        });

        // Add marker to map with popup
        const marker = L.marker(
          [site.coordinates.lat, site.coordinates.lng],
          {
            icon: siteIcon,
            id: site.id || `marker-${Math.random().toString(36).substr(2, 9)}`
          }
        )
        .addTo(map);

        // Store marker reference
        const markerKey = `${site.coordinates.lat}-${site.coordinates.lng}`;
        markersRef.current[markerKey] = marker;

        // Create popup content with modern design
        const popupContent = '<div class="modern-popup">' +
            '<div class="popup-header" style="background-color: #059669;">' +
              '<h3 class="popup-title">' + site.name + '</h3>' +
              '<span class="popup-badge">' + site.type + '</span>' +
            '</div>' +
            '<div class="popup-body">' +
              '<div class="info-row">' +
                '<svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                  '<circle cx="12" cy="10" r="3"/>' +
                  '<path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>' +
                '</svg>' +
                '<span class="info-text">' + site.city + ', ' + site.state + '</span>' +
              '</div>' +
              '<div class="info-row">' +
                '<svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                  '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>' +
                  '<line x1="16" y1="2" x2="16" y2="6"/>' +
                  '<line x1="8" y1="2" x2="8" y2="6"/>' +
                  '<line x1="3" y1="10" x2="21" y2="10"/>' +
                '</svg>' +
                '<span class="info-text">' + site.period + '</span>' +
              '</div>' +
            '</div>' +
            '<button class="view-details-btn" onclick="window.dispatchEvent(new CustomEvent(\'openViewPanel\', { detail: \'' + site.name + '\' }))">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>' +
                '<circle cx="12" cy="12" r="3"/>' +
              '</svg>' +
              'View Details' +
            '</button>' +
          '</div>';

        // Add popup content
        const popup = L.popup({
          className: 'custom-popup-container',
          closeButton: true,
          maxWidth: 280
        }).setContent(popupContent);

        // Bind popup to marker
        marker.bindPopup(popup);

        markers.push(marker);
      });

      // Store markers array for clustering
      markersArrayRef.current = markers;

      // Fit map to show all markers
      if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
      }

      mapInstanceRef.current = map;

      // Automatically zoom out after 1 second with smooth animation
      zoomTimeout = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([23.8859, 45.0792], 5, {
            animate: true,
            duration: 1.5
          });
        }
      }, 1000);

      // Force Leaflet to recalculate its size after DOM is ready
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);
    }

    // Also invalidate size on window resize
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      if (zoomTimeout) {
        clearTimeout(zoomTimeout);
      }
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

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

  const toggleCluster = () => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const markers = markersArrayRef.current;

    if (!isClusterEnabled) {
      // Enable clustering - remove individual markers and add to cluster group
      markers.forEach(marker => {
        map.removeLayer(marker);
      });

      // Create cluster group
      const clusterGroup = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 200,
        disableClusteringAtZoom: 8,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          let size = 'small';
          if (count >= 4) size = 'medium';
          if (count >= 6) size = 'large';

          return L.divIcon({
            html: '<div class="cluster-marker cluster-' + size + '"><span>' + count + '</span></div>',
            className: 'custom-cluster-icon',
            iconSize: L.point(40, 40)
          });
        }
      });

      markers.forEach(marker => {
        clusterGroup.addLayer(marker);
      });

      map.addLayer(clusterGroup);
      clusterGroupRef.current = clusterGroup;
    } else {
      // Disable clustering - remove cluster group and add individual markers
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
        clusterGroupRef.current = null;
      }

      markers.forEach(marker => {
        map.addLayer(marker);
      });
    }

    setIsClusterEnabled(!isClusterEnabled);
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
    setIsStyleMenuOpen(false);
  };

  return (
    <div className="map-container" style={{
      position: 'fixed',
      top: '60px',
      left: '20%',
      width: '80%',
      height: 'calc(100vh - 60px)',
      overflow: 'hidden'
    }}>
      <div ref={mapRef} className="map-view" style={{
        width: '100%',
        height: '100%'
      }}></div>

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

      {/* Cluster Toggle Button */}
      <div className="cluster-toggle">
        <button
          className={`cluster-btn ${isClusterEnabled ? 'active' : ''}`}
          onClick={toggleCluster}
          title={isClusterEnabled ? 'Disable Clustering' : 'Enable Clustering'}
        >
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            <circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="20" cy="8" r="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="4" cy="16" r="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="20" cy="16" r="2" stroke="currentColor" strokeWidth="2"/>
          </svg>
          {isClusterEnabled ? 'Uncluster' : 'Cluster'}
        </button>
      </div>

      {/* Map Style Switcher */}
      <div className="map-style-switcher">
        {isStyleMenuOpen && (
          <div className="style-menu">
            <button
              className={`style-option ${currentStyle === 'OpenStreetMap' ? 'active' : ''}`}
              onClick={() => changeMapStyle('OpenStreetMap')}
            >
              <svg className="style-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"/>
              </svg>
              OpenStreetMap
            </button>
            <button
              className={`style-option ${currentStyle === 'OpenTopoMap' ? 'active' : ''}`}
              onClick={() => changeMapStyle('OpenTopoMap')}
            >
              <svg className="style-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"/>
              </svg>
              OpenTopoMap
            </button>
          </div>
        )}

        <button
          className="style-toggle-btn"
          onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
        >
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
          </svg>
          Map Style
        </button>
      </div>
    </div>
  );
};

export default Map;
