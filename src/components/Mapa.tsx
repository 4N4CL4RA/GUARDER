import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Ícone padrão (mantido para compatibilidade)
const guarderMarkerSVG = `
  <svg width="40" height="55" viewBox="0 0 40 55" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gradientes holográficos -->
      <linearGradient id="holographicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#00f5ff;stop-opacity:0.9" />
        <stop offset="25%" style="stop-color:#00e5ff;stop-opacity:0.8" />
        <stop offset="50%" style="stop-color:#8e24aa;stop-opacity:0.9" />
        <stop offset="75%" style="stop-color:#e91e63;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#ff6ec7;stop-opacity:0.9" />
      </linearGradient>
      
      <!-- Gradiente do escudo interno -->
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
      </linearGradient>
      
      <!-- Filtros para efeitos -->
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="rgba(0,0,0,0.4)"/>
      </filter>
    </defs>
    
    <!-- Formato de marcador principal -->
    <path d="M20 3C13 3 7.5 8.5 7.5 15.5c0 7 12.5 22.5 12.5 22.5s12.5-15.5 12.5-22.5C32.5 8.5 27 3 20 3z" 
          fill="url(#holographicGrad)" 
          stroke="rgba(255,255,255,0.8)" 
          stroke-width="2" 
          filter="url(#shadow)"/>
    
    <!-- Reflexos e brilhos holográficos -->
    <ellipse cx="17.5" cy="13" rx="1.8" ry="2.5" 
             fill="rgba(255,255,255,0.3)" 
             transform="rotate(-30 17.5 13)"
             opacity="0.6"/>
    
    <ellipse cx="22" cy="16.5" rx="1.2" ry="1.8" 
             fill="rgba(255,255,255,0.25)" 
             transform="rotate(25 22 16.5)"
             opacity="0.5"/>
    
    <!-- Pontos de luz holográficos -->
    <circle cx="18" cy="14" r="0.8" 
            fill="rgba(255,255,255,0.4)" 
            filter="url(#glow)"/>
    
    <circle cx="21.5" cy="17" r="0.6" 
            fill="rgba(255,255,255,0.3)" 
            filter="url(#glow)"/>
  </svg>
`;

const guarderIcon = new L.DivIcon({
  html: guarderMarkerSVG,
  className: 'guarder-marker',
  iconSize: [40, 55],
  iconAnchor: [20, 55],
  popupAnchor: [0, -55],
});

// Estilos CSS para o marcador holográfico personalizado
const markerStyles = `
  .guarder-marker, .guarder-marker-rating {
    background: transparent !important;
    border: none !important;
  }
  .guarder-marker svg, .guarder-marker-rating svg {
    filter: drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.4));
    transition: all 0.3s ease;
  }
  .guarder-marker:hover svg, .guarder-marker-rating:hover svg {
    transform: scale(1.15);
    filter: drop-shadow(3px 6px 12px rgba(0, 0, 0, 0.6)) 
            drop-shadow(0 0 20px rgba(59, 130, 246, 0.5));
  }
`;

// Adicionar estilos ao head se ainda não existem
if (!document.querySelector('#guarder-marker-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'guarder-marker-styles';
  styleSheet.textContent = markerStyles;
  document.head.appendChild(styleSheet);
}

// Corrigir ícones padrão do Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl;

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
  centerOnUserLocation?: boolean; // Nova propriedade para centralizar na localização do usuário
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

// Função para criar ícone do Guarder com cor baseada na avaliação
const createGuarderIcon = (rating: number): L.DivIcon => {
  const siteColor = '#7c3aed'; // Cor roxa/violeta do site
  const ratingKey = rating.toFixed(1).replace('.', '_');
  
  console.log('🎨 Criando ícone:', { rating, color: siteColor, ratingKey });
  
  const guarderMarkerSVG = `
    <svg width="40" height="55" viewBox="0 0 40 55" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="siteGrad-${ratingKey}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#7c3aed;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
        </linearGradient>
        
        <filter id="shadow-${ratingKey}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="rgba(0,0,0,0.5)"/>
        </filter>
      </defs>
      
      <path d="M20 3C13 3 7.5 8.5 7.5 15.5c0 7 12.5 22.5 12.5 22.5s12.5-15.5 12.5-22.5C32.5 8.5 27 3 20 3z" 
            fill="url(#siteGrad-${ratingKey})" 
            stroke="white" 
            stroke-width="2.5" 
            filter="url(#shadow-${ratingKey})"/>
      
      <ellipse cx="17.5" cy="13" rx="1.5" ry="2" 
               fill="rgba(255,255,255,0.4)" 
               transform="rotate(-30 17.5 13)"/>
      
      <circle cx="22" cy="16" r="0.8" 
              fill="rgba(255,255,255,0.3)"/>
    </svg>
  `;

  return new L.DivIcon({
    html: guarderMarkerSVG,
    className: 'guarder-marker-rating',
    iconSize: [40, 55],
    iconAnchor: [20, 55],
    popupAnchor: [0, -55],
  });
};

// Geocoding reverso simples usando Nominatim (gratuito)
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=pt-BR,pt,en`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.address) {
      const address = data.address;
      const parts = [];
      
      // Construir endereço mais legível
      if (address.road) {
        let roadPart = address.road;
        if (address.house_number) {
          roadPart += `, ${address.house_number}`;
        }
        parts.push(roadPart);
      }
      
      // Adicionar bairro/distrito
      if (address.neighbourhood || address.suburb || address.district) {
        parts.push(address.neighbourhood || address.suburb || address.district);
      }
      
      // Adicionar cidade
      if (address.city || address.town || address.village) {
        parts.push(address.city || address.town || address.village);
      }
      
      // Adicionar estado se for diferente cidade
      if (address.state) {
        parts.push(address.state);
      }
      
      // Se conseguiu construir endereço, usar ele
      if (parts.length > 0) {
        return parts.join(' - ');
      }
    }
    
    // Fallback para display_name ou coordenadas
    return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.error('Erro no geocoding:', error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};

// Componente para gerenciar a localização do usuário
const UserLocationManager: React.FC<{
  userLocation: { lat: number; lng: number } | null;
  selectedDestination: { lat: number; lng: number } | null;
}> = ({ userLocation, selectedDestination }) => {
  const map = useMap();
  const userMarkerRef = useRef<L.Marker | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const hasUserLocationBeenSet = useRef<boolean>(false);

  // Atualizar localização do usuário em tempo real
  useEffect(() => {
    if (!userLocation) return;

    // Remover marcador anterior se existir
    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }

    // Criar ícone personalizado para o usuário com animação de pulso
    const customUserIcon = L.divIcon({
      className: 'user-location-marker',
      html: `
        <div style="position: relative;">
          <div style="
            background: #3b82f6; 
            width: 16px; 
            height: 16px; 
            border-radius: 50%; 
            border: 3px solid white; 
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
            position: relative;
            z-index: 2;
          "></div>
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 30px;
            height: 30px;
            background: rgba(59, 130, 246, 0.3);
            border-radius: 50%;
            animation: pulse 2s infinite;
            z-index: 1;
          "></div>
        </div>
        <style>
          @keyframes pulse {
            0% {
              transform: translate(-50%, -50%) scale(0.8);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(2);
              opacity: 0;
            }
          }
        </style>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    // Adicionar novo marcador do usuário
    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: customUserIcon })
      .addTo(map)
      .bindPopup('<b>📍 Sua localização atual</b><br><small>Atualização em tempo real</small>');

    // Centrar mapa na localização do usuário apenas na primeira vez
    if (!hasUserLocationBeenSet.current) {
      map.setView([userLocation.lat, userLocation.lng], 15);
      hasUserLocationBeenSet.current = true;
    }
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
  safetyAreas = [],
  centerOnUserLocation = false
}) => {


  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.5505, -46.6333]); // São Paulo como padrão
  const [mapError, setMapError] = useState<string | null>(null);
  const [currentUserLocation, setCurrentUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);

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

  // Rastrear localização do usuário em tempo real
  useEffect(() => {
    console.log('🔍 Verificando rastreamento:', {
      centerOnUserLocation,
      hasGeolocation: !!navigator.geolocation,
      isSecureContext: window.isSecureContext,
      protocol: window.location.protocol
    });

    if (!centerOnUserLocation) {
      console.log('⚠️ centerOnUserLocation está false - rastreamento desativado');
      return;
    }

    if (!navigator.geolocation) {
      console.error('❌ Geolocalização não disponível neste navegador');
      setMapError('Seu navegador não suporta geolocalização.');
      return;
    }

    if (!window.isSecureContext && window.location.protocol !== 'http:') {
      console.warn('⚠️ Contexto não seguro - geolocalização pode não funcionar');
    }

    console.log('🗺️ Iniciando rastreamento de localização em tempo real...');
    setLoadingLocation(true);
    
    // Rastrear posição em tempo real
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log('📍 Localização atualizada:', {
          lat: latitude, 
          lng: longitude, 
          precisão: `${accuracy.toFixed(1)}m`,
          timestamp: new Date(position.timestamp).toLocaleTimeString(),
          qualidade: accuracy < 50 ? '✅ Excelente' : accuracy < 100 ? '✅ Boa' : accuracy < 500 ? '⚠️ Regular' : '❌ Ruim'
        });
        
        const newUserLocation = { lat: latitude, lng: longitude };
        setCurrentUserLocation(newUserLocation);
        
        // Sempre centralizar no início ou quando a precisão melhorar significativamente
        setMapCenter([latitude, longitude]);
        console.log('🎯 Mapa centralizado na localização atual');
        
        setLoadingLocation(false);
      },
      (error) => {
        console.error('❌ Erro ao obter localização:', {
          code: error.code,
          message: error.message,
          PERMISSION_DENIED: error.code === 1,
          POSITION_UNAVAILABLE: error.code === 2,
          TIMEOUT: error.code === 3
        });
        
        let errorMessage = 'Não foi possível obter sua localização.';
        if (error.code === 1) {
          errorMessage = '🚫 Permissão de localização negada. Por favor, permita o acesso à localização no seu navegador.';
        } else if (error.code === 2) {
          errorMessage = '📡 Localização indisponível. Verifique se o GPS está ativado e você está em um local com sinal.';
        } else if (error.code === 3) {
          errorMessage = '⏱️ Tempo esgotado ao tentar obter localização. Tente novamente.';
        }
        
        setMapError(errorMessage);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true, // Usar GPS para maior precisão
        timeout: 15000, // Aumentado para 15 segundos
        maximumAge: 0 // Sempre obter posição atualizada
      }
    );

    // Limpar o rastreamento quando o componente for desmontado
    return () => {
      console.log('🛑 Parando rastreamento de localização (watchId:', watchId, ')');
      navigator.geolocation.clearWatch(watchId);
    };
  }, [centerOnUserLocation]);

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
      {/* Indicador de carregamento da localização */}
      {loadingLocation && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm">Obtendo sua localização...</span>
        </div>
      )}

      {/* Indicador de rastreamento ativo */}
      {currentUserLocation && centerOnUserLocation && !loadingLocation && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">📍 Localização em tempo real ativa</span>
        </div>
      )}

      {/* Dica de clique no mapa */}
      {onLocationSelect && !loadingLocation && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <span className="text-sm font-medium">💡 Clique no mapa para adicionar uma avaliação</span>
        </div>
      )}
      
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
        userLocation={currentUserLocation || userLocation} 
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
        
        // Criar ícone personalizado com cor da avaliação
        const ratingIcon = createGuarderIcon(avgRating);
        
        // Raio baseado no número de avaliações e rating
        const baseRadius = 200;
        const ratingMultiplier = avgRating >= 4 ? 0.8 : avgRating >= 3 ? 1.0 : 1.5;
        const countMultiplier = Math.min(locationReviews.length / 10, 2);
        const radius = baseRadius * ratingMultiplier * countMultiplier;
        
        return (
          <React.Fragment key={key}>
            {/* Círculo externo de risco com cor baseada na avaliação */}
            <Circle
              center={[coords.lat, coords.lng]}
              radius={radius}
              fillColor={riskColor}
              fillOpacity={0.15}
              color={riskColor}
              weight={3}
              opacity={0.6}
            />
            
            {/* Círculo interno mais intenso */}
            <Circle
              center={[coords.lat, coords.lng]}
              radius={radius * 0.4}
              fillColor={riskColor}
              fillOpacity={0.3}
              color={riskColor}
              weight={2}
              opacity={0.8}
            />
            
            {/* Marcador central com logo do Guarder colorido pela avaliação */}
            <Marker position={[coords.lat, coords.lng]} icon={ratingIcon}>
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
        // Usando as funções globais unificadas
        const color = getRiskColor(area.rating);
        const level = getRiskLevel(area.rating);

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