import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ28taWZyYyIsImEiOiJja3E2bGdvb3QwaXM5MnZtbXN2eGtmaWgwIn0.llipq3Spc_PPA2bLjPwIPQ';

const SimpleMap = ({ locationDistribution }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/go-ifrc/ckrfe16ru4c8718phmckdfjh0',
      center: [25.0, 46.0], // center of Romania
      zoom: 6
    });

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl());

    // Add search control
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Search for locations in Romania',
      bbox: [20.2201924985, 43.6884447292, 29.62654341, 48.2208812526], // Bounding box for Romania
      countries: 'ro' // Limit search to Romania
    });
    map.current.addControl(geocoder);

    map.current.on('load', () => {
      // Fit the map to Romania's bounds
      map.current.fitBounds([
        [20.2201924985, 43.6884447292], // southwestern corner of Romania
        [29.62654341, 48.2208812526]    // northeastern corner of Romania
      ]);

      // Add markers for each location
      Object.entries(locationDistribution).forEach(([name, data]) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundColor = 'red';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.cursor = 'pointer';

        new mapboxgl.Marker(el)
          .setLngLat([data.longitude, data.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<h3>${name}</h3><p>People reached: ${data.count}</p>`)
          )
          .addTo(map.current);
      });
    });
  }, [locationDistribution]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div 
      ref={mapContainer} 
      style={{ 
        width: '100%', 
        height: isFullscreen ? '100vh' : '400px',
        transition: 'height 0.3s ease-in-out'
      }} 
    />
  );
};

export default SimpleMap;