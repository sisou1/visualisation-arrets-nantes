import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

const busIcon = new L.Icon({
  iconUrl: 'https://icons.veryicon.com/png/o/business/classic-icon/bus-20.png',
  iconSize: [25, 25],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

const MapView = () => {
  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    // Charger les arrêts de bus
    const loadStops = async () => {
      try {
        const response = await fetch('/arret_de_bus.json');
        const data = await response.json();
        setStops(data);
      } catch (error) {
        console.error('Erreur lors du chargement des arrêts:', error);
      }
    };

    // Charger les trajets de bus et leurs coordonnées
    const loadRoutes = async () => {
      try {
        const response = await fetch('/circuits.json');
        const data = await response.json();
        
        // Groupement des segments par couleur et fusion des segments adjacents
        const formattedRoutes = data.reduce((acc, route) => {
          const { route_color, shape } = route;
          const routeSegments = shape.geometry.coordinates;

          routeSegments.forEach(segment => {
            const formattedSegment = segment.map(coord => [coord[1], coord[0]]); // Inverser les coordonnées pour [lat, lon]
            
            // Vérifier si le segment est adjacent à un autre de même couleur
            const existingRoute = acc.find(r => r.color === `#${route_color}`);
            
            if (existingRoute) {
              const lastSegment = existingRoute.coordinates[existingRoute.coordinates.length - 1];
              
              // Si le dernier point du segment précédent est proche du premier point du segment actuel, fusionner
              if (lastSegment && lastSegment[lastSegment.length - 1].toString() === formattedSegment[0].toString()) {
                existingRoute.coordinates.push(formattedSegment.slice(1)); // Ajouter sans répéter le point de jonction
              } else {
                existingRoute.coordinates.push(formattedSegment);
              }
            } else {
              // Nouvelle entrée si la couleur n'existe pas encore
              acc.push({ id: route.route_id, color: `#${route_color}`, coordinates: [formattedSegment] });
            }
          });

          return acc;
        }, []);

        setRoutes(formattedRoutes);
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

      {/* Affichage des lignes de bus après fusion */}
      {routes.map(route => (
        <Polyline 
          key={route.id} 
          positions={route.coordinates.flat()} // Aplatir pour afficher toutes les coordonnées
          color={route.color} 
          weight={4} 
          opacity={0.7}
        />
      ))}
    </MapContainer>
  );
};

export default MapView;
