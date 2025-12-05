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
  centerOnUserLocation?: boolean;
  forceRecenter?: number; // Contador para forçar recentralização
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

// Função para criar ícone do Guarder com estilo moderno degradê azul-rosa
const createGuarderIcon = (rating: number): L.DivIcon => {
  const ratingKey = rating.toFixed(1).replace('.', '_');
  
  console.log('🎨 Criando ícone moderno:', { rating, ratingKey });
  
  const guarderMarkerSVG = `
    <svg width="45" height="60" viewBox="0 0 45 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="modernGrad-${ratingKey}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#a855f7;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
        </linearGradient>
        
        <filter id="shadow3d-${ratingKey}" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="0" dy="3" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="innerShadow-${ratingKey}">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
          <feOffset in="blur" dx="0" dy="2" result="offsetBlur"/>
          <feFlood flood-color="#000000" flood-opacity="0.2" result="offsetColor"/>
          <feComposite in="offsetColor" in2="offsetBlur" operator="in" result="offsetBlur"/>
          <feComposite in="SourceGraphic" in2="offsetBlur" operator="over"/>
        </filter>
      </defs>
      
      <!-- Pin em formato de gota 3D -->
      <path d="M22.5 5C15 5 9 11 9 18.5c0 9 13.5 27 13.5 27s13.5-18 13.5-27C36 11 30 5 22.5 5z" 
            fill="url(#modernGrad-${ratingKey})" 
            filter="url(#shadow3d-${ratingKey})"
            stroke="rgba(255,255,255,0.3)" 
            stroke-width="1.5"/>
      
      <!-- Reflexo superior para efeito 3D -->
      <ellipse cx="18" cy="14" rx="4" ry="5" 
               fill="rgba(255,255,255,0.25)" 
               transform="rotate(-35 18 14)"
               filter="url(#innerShadow-${ratingKey})"/>
      
      <!-- Círculo central branco -->
      <circle cx="22.5" cy="18.5" r="7" 
              fill="white" 
              opacity="0.95"/>
      
      <!-- Borda interna do círculo com gradiente -->
      <circle cx="22.5" cy="18.5" r="7" 
              fill="none"
              stroke="url(#modernGrad-${ratingKey})" 
              stroke-width="2.5"
              opacity="0.8"/>
      
      <!-- Brilho pequeno no círculo -->
      <circle cx="20" cy="16" r="2" 
              fill="rgba(255,255,255,0.6)"/>
      
      <!-- Ponto de luz menor -->
      <circle cx="24" cy="17" r="1" 
              fill="rgba(255,255,255,0.4)"/>
    </svg>
  `;

  return new L.DivIcon({
    html: guarderMarkerSVG,
    className: 'guarder-marker-rating',
    iconSize: [45, 60],
    iconAnchor: [22.5, 60],
    popupAnchor: [0, -60],
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
  forceRecenter?: number;
}> = ({ userLocation, selectedDestination, forceRecenter }) => {
  const map = useMap();
  const userMarkerRef = useRef<L.Marker | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const hasUserLocationBeenSet = useRef<boolean>(false);

  // Efeito para forçar recentralização quando o botão é clicado
  useEffect(() => {
    if (forceRecenter && forceRecenter > 0 && userLocation) {
      console.log('🎯 Forçando recentralização para:', userLocation);
      map.setView([userLocation.lat, userLocation.lng], 15, {
        animate: true,
        duration: 1
      });
    }
  }, [forceRecenter, userLocation, map]);

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
  centerOnUserLocation = false,
  forceRecenter = 0
}) => {


  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.5505, -46.6333]); // São Paulo como padrão
  const [mapError, setMapError] = useState<string | null>(null);
  const [currentUserLocation, setCurrentUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);

  // Renderizar cada avaliação separadamente (sem agrupamento)
  const renderReviews = () => {
    return reviews
      .filter(review => review.coordinates)
      .map((review) => {
        const riskColor = getRiskColor(review.rating);
        const riskLevel = getRiskLevel(review.rating);
        const coords = review.coordinates!;
        
        // Criar ícone personalizado com cor da avaliação específica - usando a cor da avaliação
        const ratingIcon = createGuarderIcon(review.rating);
        
        // Raio fixo menor para todos os círculos
        const radius = 120; // Círculos menores e uniformes
        
        return (
          <React.Fragment key={`${review.id}-${coords.lat}-${coords.lng}`}>
            {/* Círculo externo com borda pontilhada da cor da avaliação */}
            <Circle
              center={[coords.lat, coords.lng]}
              radius={radius}
              fillColor={riskColor}
              fillOpacity={0.15}
              color={riskColor}
              weight={3}
              opacity={0.7}
              dashArray="10, 5"
            />
            
            {/* Círculo interno mais intenso da mesma cor */}
            <Circle
              center={[coords.lat, coords.lng]}
              radius={radius * 0.10}
              fillColor={riskColor}
              fillOpacity={0.3}
              color={riskColor}
              weight={2}
              opacity={0.9}
            />
            
            {/* Marcador central com logo do Guarder colorido pela avaliação */}
            <Marker position={[coords.lat, coords.lng]} icon={ratingIcon}>
              <Popup maxWidth={300}>
                <div className="p-2">
                  <h4 className="font-bold text-sm mb-2">{review.location}</h4>
                  
                  {/* Rating e nível de risco */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={i < Math.round(review.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="font-bold" style={{ color: riskColor }}>
                      {review.rating.toFixed(1)}/5
                    </span>
                  </div>
                  
                  {/* Badge de nível de risco */}
                  <div 
                    className="inline-block px-2 py-1 rounded text-xs font-bold mb-2"
                    style={{ backgroundColor: riskColor, color: 'white' }}
                  >
                    {riskLevel}
                  </div>
                  
                  {/* Conteúdo da avaliação */}
                  <p className="text-sm text-gray-700 mb-2">{review.title}</p>
                  <p className="text-xs text-gray-600 mb-2">{review.content}</p>
                  
                  {/* Informações do usuário */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                      {review.user.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium">{review.user}</p>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        );
      });
  };

  // Rastrear localização do usuário em tempo real - REFATORADO COMPLETAMENTE
  useEffect(() => {
    if (!centerOnUserLocation) {
      console.log('⚠️ Rastreamento desativado (centerOnUserLocation=false)');
      return;
    }

    if (!navigator.geolocation) {
      console.error('❌ Navegador não suporta geolocalização');
      setMapError('Seu navegador não suporta geolocalização.');
      return;
    }

    console.log('🚀 INICIANDO NOVO SISTEMA DE RASTREAMENTO');
    console.log('📱 Tipo de conexão:', (navigator as any).connection?.effectiveType || 'desconhecido');
    console.log('🌐 Protocolo:', window.location.protocol);
    console.log('🔒 Contexto seguro:', window.isSecureContext);
    
    setLoadingLocation(true);
    let isFirstLocation = true;
    let watchId: number | null = null;
    
    // Primeiro: tentar obter localização imediata com baixa precisão (rápido)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('⚡ Localização inicial rápida obtida');
        const quickLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentUserLocation(quickLocation);
        setMapCenter([quickLocation.lat, quickLocation.lng]);
        setLoadingLocation(false);
      },
      (error) => {
        console.warn('⚠️ Localização rápida falhou:', error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 60000
      }
    );

    // Depois: iniciar rastreamento com alta precisão
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, altitude, heading, speed } = position.coords;
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📍 NOVA POSIÇÃO DETECTADA');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📌 Latitude:', latitude);
        console.log('📌 Longitude:', longitude);
        console.log('🎯 Precisão:', `${accuracy.toFixed(1)} metros`);
        console.log('⛰️ Altitude:', altitude ? `${altitude.toFixed(1)}m` : 'N/A');
        console.log('🧭 Direção:', heading !== null ? `${heading}°` : 'N/A');
        console.log('🚗 Velocidade:', speed !== null ? `${(speed * 3.6).toFixed(1)} km/h` : 'N/A');
        console.log('🕐 Timestamp:', new Date(position.timestamp).toLocaleString('pt-BR'));
        console.log('📊 Qualidade:', accuracy < 20 ? '🟢 EXCELENTE' : accuracy < 50 ? '🟡 MUITO BOA' : accuracy < 100 ? '🟠 BOA' : accuracy < 500 ? '🔴 REGULAR' : '⚫ RUIM');
        console.log('🗺️ Google Maps:', `https://www.google.com/maps?q=${latitude},${longitude}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const preciseLocation = { lat: latitude, lng: longitude };
        setCurrentUserLocation(preciseLocation);
        
        // Centralizar apenas na primeira localização precisa
        if (isFirstLocation) {
          setMapCenter([latitude, longitude]);
          console.log('🎯 Mapa centralizado na localização precisa');
          isFirstLocation = false;
        }
        
        setLoadingLocation(false);
      },
      (error) => {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ ERRO DE LOCALIZAÇÃO');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('Código:', error.code);
        console.error('Mensagem:', error.message);
        
        let errorMessage = 'Não foi possível obter sua localização.';
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = '🚫 Permissão negada. Clique no ícone 🔒 ao lado da URL e permita localização.';
            console.error('💡 SOLUÇÃO: Permita acesso à localização nas configurações do navegador');
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = '📡 GPS indisponível. Verifique se está ativado nas configurações do sistema.';
            console.error('💡 SOLUÇÃO: Ative o GPS/localização no Windows e vá perto de uma janela');
            break;
          case 3: // TIMEOUT
            errorMessage = '⏱️ Tempo esgotado. Vá perto de uma janela e tente novamente.';
            console.error('💡 SOLUÇÃO: Aguarde mais tempo perto de uma janela ou área aberta');
            break;
        }
        
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        setMapError(errorMessage);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 60000, // 60 segundos para GPS preciso
        maximumAge: 0 // Sempre buscar nova posição
      }
    );

    // Cleanup
    return () => {
      if (watchId !== null) {
        console.log('🛑 Parando rastreamento (ID:', watchId, ')');
        navigator.geolocation.clearWatch(watchId);
      }
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
        forceRecenter={forceRecenter}
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
      {renderReviews()}
    </MapContainer>
    </div>
  );
};

export default FreeMapComponent;