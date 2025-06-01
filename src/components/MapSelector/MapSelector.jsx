import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultPosition = [-16.5, -68.15]; // La Paz, Bolivia

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      console.log("Ubicación enviada al padre:", lat, lng); // <-- NUEVO LOG
      onLocationSelect({
        latitude: lat,
        longitude: lng,
        gmapsLink: `https://www.google.com/maps?q=${lat},${lng}`
      });
    }
  });

  return position ? (
    <Marker position={position} icon={markerIcon}>
      <Popup>
        Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
      </Popup>
    </Marker>
  ) : null;
}

const MapSelector = ({ onLocationSelect, initialPosition }) => {
  return (
    <div style={{ height: '250px', margin: '10px 0', border: '2px solid #ccc', borderRadius: '8px' }}>
      <MapContainer 
        center={initialPosition || defaultPosition} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', borderRadius: '6px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default MapSelector;