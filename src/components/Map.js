import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

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