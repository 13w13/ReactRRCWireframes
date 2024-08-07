import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ28taWZyYyIsImEiOiJja3E2bGdvb3QwaXM5MnZtbXN2eGtmaWgwIn0.llipq3Spc_PPA2bLjPwIPQ';

const SimpleMap = ({ locationDistribution }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/go-ifrc/ckrfe16ru4c8718phmckdfjh0',
      center: [26.1025, 44.4268], // center on Romania
      zoom: 6
    });

    map.current.on('load', () => {
      // Add markers for each location
      Object.entries(locationDistribution).forEach(([name, data]) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundColor = 'red';
        el.style.width = '10px';
        el.style.height = '10px';
        el.style.borderRadius = '50%';

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

  return <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />;
};

export default SimpleMap;