import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'

const busIcon = new L.Icon({
    iconUrl: 'https://example.com/bus-icon.png', // Remplace avec l'URL de ton icône de bus
    iconSize: [25, 25],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });

const MapView = () => {
  useEffect(() => {
    // Appelle l'API de Nantes pour charger les arrêts ici
  }, []);

  return (
    <MapContainer center={[47.218371, -1.553621]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/* Ajoute les marqueurs ici */}
    </MapContainer>
  );
};

export default MapView;