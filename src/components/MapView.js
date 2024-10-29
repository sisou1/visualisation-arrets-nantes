import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Définition de l'icône de bus
const busIcon = new L.Icon({
  iconUrl: 'https://icons.veryicon.com/png/o/business/classic-icon/bus-20.png',
  iconSize: [25, 25],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

const MapView = () => {
  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [routeShapes, setRouteShapes] = useState({});

  useEffect(() => {
    // Charger les arrêts de bus
    const loadStops = async () => {
      try {
        const response = await fetch('/arret_de_bus.json'); // Vérifiez le chemin d'accès
        const data = await response.json();
        setStops(data);
      } catch (error) {
        console.error('Erreur lors du chargement des arrêts:', error);
      }
    };

    // Charger les routes de bus
    const loadRoutes = async () => {
      try {
        const response = await fetch('/routes.json'); // Vérifiez le chemin d'accès
        const data = await response.json();
        setRoutes(data);
        
        // Charger les coordonnées des polylignes à partir des routes
        const shapes = {};
        data.forEach(route => {
          route.trips.forEach(trip => {
            const shapeId = trip.shape_id;
            // Ajoutez ici la logique pour récupérer les coordonnées réelles de chaque shape_id
            // Exemple de coordonnées fictives à ajouter pour l'exemple :
            if (!shapes[shapeId]) {
              shapes[shapeId] = [
                [47.218371, -1.553621],
                [47.220111, -1.570000],
                // Ajoutez plus de coordonnées selon vos données
              ];
            }
          });
        });
        setRouteShapes(shapes);
      } catch (error) {
        console.error('Erreur lors du chargement des routes:', error);
      }
    };

    loadStops();
    loadRoutes();
  }, []);

  return (
    <MapContainer center={[47.218371, -1.553621]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* Affichage des arrêts de bus */}
      {stops.map((stop, index) => (
        <Marker key={index} position={[stop.stop_coordinates.lat, stop.stop_coordinates.lon]} icon={busIcon}>
          <Popup>
            <div>
              <h3>{stop.stop_name}</h3>
              <p>Coordonnées: {stop.stop_coordinates.lat}, {stop.stop_coordinates.lon}</p>
              <p>Arrêts originaux: {stop.original_stops.join(', ')}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Affichage des polylignes pour les routes */}
      {Object.entries(routeShapes).map(([shapeId, coordinates]) => (
        <Polyline 
          key={shapeId} 
          positions={coordinates} 
          color="#007A45" // Couleur par défaut
          weight={4} 
          opacity={0.7}
        />
      ))}
    </MapContainer>
  );
};

export default MapView;
