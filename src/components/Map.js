import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = ({ locationDistribution }) => {
  return (
    <MapContainer center={[45.9432, 24.9668]} zoom={7} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {Object.entries(locationDistribution).map(([name, data]) => (
        <Marker key={name} position={[data.latitude, data.longitude]}>
          <Popup>
            <strong>{name}</strong><br />
            People reached: {data.count}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;