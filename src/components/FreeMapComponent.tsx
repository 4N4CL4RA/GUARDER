import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Corrigir ícones do Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  location: string;
  date: string;
  title: string;
  content: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface FreeMapProps {
  reviews: Review[];
  onLocationSelect?: (coordinates: { lat: number; lng: number }, address: string) => void;
  userLocation?: { lat: number; lng: number } | null;
  selectedDestination?: { lat: number; lng: number } | null;
  routeCoordinates?: Array<[number, number]>;
  safetyAreas?: Array<{
    coordinates: { lat: number; lng: number };
    rating: number;
    location: string;
  }>;
}

// Componente para capturar cliques no mapa
const MapClickHandler: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Função para obter cor baseada na avaliação
const getRiskColor = (rating: number): string => {
  if (rating >= 4.5) return '#22c55e'; // Verde - Muito Seguro
  if (rating >= 3.5) return '#eab308';  // Amarelo - Seguro
  if (rating >= 2.5) return '#f97316';  // Laranja - Moderado
  return '#ef4444'; // Vermelho - Atenção
};

// Função para obter nível de risco
const getRiskLevel = (rating: number): string => {
  if (rating >= 4.5) return 'Muito Seguro';
  if (rating >= 3.5) return 'Seguro';
  if (rating >= 2.5) return 'Moderado';
  return 'Atenção';
};

// Geocoding reverso simples usando Nominatim (gratuito)
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.error('Erro no geocoding:', error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};

// Ícone personalizado para usuário
const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="#ffffff" stroke-width="3"/>
      <circle cx="12" cy="12" r="4" fill="#ffffff"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

// Componente para gerenciar a localização do usuário
const UserLocationManager: React.FC<{
  userLocation: { lat: number; lng: number } | null;
  selectedDestination: { lat: number; lng: number } | null;
}> = ({ userLocation, selectedDestination }) => {
  const map = useMap();
  const userMarkerRef = useRef<L.Marker | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);

  // Atualizar localização do usuário
  useEffect(() => {
    if (!userLocation) return;

    // Remover marcador anterior se existir
    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }

    // Criar ícone personalizado para o usuário
    const customUserIcon = L.divIcon({
      className: 'user-location-marker',
      html: '<div style="background: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    // Adicionar novo marcador do usuário
    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: customUserIcon })
      .addTo(map)
      .bindPopup('<b>📍 Sua localização</b>');

    // Centrar mapa na localização do usuário
    map.setView([userLocation.lat, userLocation.lng], 15);
  }, [userLocation, map]);

  // Atualizar marcador do destino
  useEffect(() => {
    // Remover marcador anterior se existir
    if (destinationMarkerRef.current) {
      map.removeLayer(destinationMarkerRef.current);
      destinationMarkerRef.current = null;
    }

    if (selectedDestination) {
      // Criar ícone personalizado para o destino
      const destinationIcon = L.divIcon({
        className: 'destination-marker',
        html: '<div style="background: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      // Adicionar marcador do destino
      destinationMarkerRef.current = L.marker([selectedDestination.lat, selectedDestination.lng], { icon: destinationIcon })
        .addTo(map)
        .bindPopup('<b>🎯 Destino</b>');
    }
  }, [selectedDestination, map]);

  return null;
};

export const FreeMapComponent: React.FC<FreeMapProps> = ({ 
  reviews, 
  onLocationSelect,
  userLocation,
  selectedDestination,
  routeCoordinates = [],
  safetyAreas = []
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.5505, -46.6333]); // São Paulo como padrão
  const [mapError, setMapError] = useState<string | null>(null);

  // Agrupar avaliações por localização
  const locationGroups = reviews
    .filter(review => review.coordinates)
    .reduce((acc, review) => {
      if (!review.coordinates) return acc;
      const key = `${review.coordinates.lat.toFixed(4)}-${review.coordinates.lng.toFixed(4)}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(review);
      return acc;
    }, {} as Record<string, Review[]>);

  // Handler para cliques no mapa
  const handleMapClick = async (lat: number, lng: number) => {
    try {
      const address = await reverseGeocode(lat, lng);
      onLocationSelect?.({ lat, lng }, address);
    } catch (error) {
      console.error('Erro ao obter endereço:', error);
      onLocationSelect?.({ lat, lng }, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  };

  if (mapError) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center p-6">
          <h3 className="text-lg font-semibold mb-2">❌ Erro no Mapa</h3>
          <p className="text-sm text-muted-foreground mb-4">{mapError}</p>
          <button 
            onClick={() => setMapError(null)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ 
          height: '100%', 
          width: '100%', 
          position: 'relative',
          zIndex: 0
        }}
        zoomControl={true}
        whenReady={() => console.log('Mapa carregado com sucesso')}
      >
      {/* Camada de tiles do OpenStreetMap - GRATUITA */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Handler para cliques no mapa */}
      <MapClickHandler onMapClick={handleMapClick} />
      <UserLocationManager 
        userLocation={userLocation} 
        selectedDestination={selectedDestination}
      />

      {/* Linha da Rota */}
      {routeCoordinates && routeCoordinates.length > 0 && (
        <Polyline
          positions={routeCoordinates}
          color="#3b82f6"
          weight={4}
          opacity={0.8}
        />
      )}
      
      {/* Círculos de risco e marcadores das avaliações */}
      {Object.entries(locationGroups).map(([key, locationReviews]) => {
        const avgRating = locationReviews.reduce((acc, r) => acc + r.rating, 0) / locationReviews.length;
        const riskColor = getRiskColor(avgRating);
        const riskLevel = getRiskLevel(avgRating);
        const coords = locationReviews[0].coordinates!;
        
        // Raio baseado no número de avaliações e rating
        const baseRadius = 200;
        const ratingMultiplier = avgRating >= 4 ? 0.8 : avgRating >= 3 ? 1.0 : 1.5;
        const countMultiplier = Math.min(locationReviews.length / 10, 2);
        const radius = baseRadius * ratingMultiplier * countMultiplier;
        
        return (
          <React.Fragment key={key}>
            {/* Círculo de risco */}
            <Circle
              center={[coords.lat, coords.lng]}
              radius={radius}
              fillColor={riskColor}
              fillOpacity={0.2}
              color={riskColor}
              weight={2}
            />
            
            {/* Marcador central */}
            <Marker position={[coords.lat, coords.lng]}>
              <Popup maxWidth={300}>
                <div className="p-2">
                  <h4 className="font-bold text-sm mb-2">{locationReviews[0].location}</h4>
                  
                  {/* Rating e nível de risco */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={i < Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="font-bold" style={{ color: riskColor }}>
                      {avgRating.toFixed(1)}/5
                    </span>
                    <span className="text-xs text-gray-600">
                      ({locationReviews.length} avaliações)
                    </span>
                  </div>
                  
                  {/* Badge de nível de risco */}
                  <div 
                    className="inline-block px-2 py-1 rounded text-xs font-bold mb-2"
                    style={{ backgroundColor: `${riskColor}20`, color: riskColor }}
                  >
                    {riskLevel}
                  </div>
                  
                  {/* Últimas avaliações */}
                  <div className="max-h-20 overflow-y-auto">
                    {locationReviews.slice(0, 3).map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-1 mb-1 last:border-b-0">
                        <div className="text-xs text-gray-600">
                          {review.user} - {review.rating}★
                        </div>
                        <div className="text-xs text-gray-800">
                          {review.content.substring(0, 60)}...
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Botões de ação */}
                  <div className="flex gap-1 mt-2">
                    <button 
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                      onClick={() => {
                        if (userLocation) {
                          const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation.lat}%2C${userLocation.lng}%3B${coords.lat}%2C${coords.lng}`;
                          window.open(url, '_blank');
                        }
                      }}
                    >
                      🗺️ Rota
                    </button>
                    <button 
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                      onClick={() => {
                        alert('Funcionalidade de horários em desenvolvimento');
                      }}
                    >
                      🕒 Horários
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        );
      })}

      {/* Círculos de segurança para áreas avaliadas */}
      {safetyAreas.map((area, index) => {
        const getSafetyColor = (rating: number) => {
          if (rating >= 4) return '#10B981'; // Verde - Seguro
          if (rating >= 3) return '#F59E0B'; // Amarelo - Moderado  
          if (rating >= 2) return '#F97316'; // Laranja - Inseguro
          return '#EF4444'; // Vermelho - Perigoso
        };

        const getSafetyLevel = (rating: number) => {
          if (rating >= 4) return 'Seguro';
          if (rating >= 3) return 'Moderado';
          if (rating >= 2) return 'Inseguro';
          return 'Perigoso';
        };

        const color = getSafetyColor(area.rating);
        const level = getSafetyLevel(area.rating);

        return (
          <Circle
            key={`safety-${index}`}
            center={[area.coordinates.lat, area.coordinates.lng]}
            radius={300} // Raio fixo de 300m para área de segurança
            fillColor={color}
            fillOpacity={0.15}
            color={color}
            weight={2}
            dashArray="10, 10" // Linha pontilhada para diferenciar dos círculos de risco
          >
            <Popup>
              <div className="text-center">
                <div className="font-bold text-sm mb-1">{area.location}</div>
                <div 
                  className="inline-block px-2 py-1 rounded text-xs font-bold mb-2"
                  style={{ backgroundColor: `${color}20`, color: color }}
                >
                  {level} - {area.rating}★
                </div>
                <div className="text-xs text-gray-600">
                  Área de segurança baseada em avaliações da comunidade
                </div>
              </div>
            </Popup>
          </Circle>
        );
      })}
    </MapContainer>
    </div>
  );
};

export default FreeMapComponent;