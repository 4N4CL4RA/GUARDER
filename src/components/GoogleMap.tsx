/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Navigation, Loader2, Satellite, Layers } from 'lucide-react'
import { Review } from '../types/reviews'

interface GoogleMapProps {
  reviews: Review[]
  onLocationSelect?: (review: Review) => void
}

// Tipos simples para Google Maps
declare global {
  interface Window {
    google?: any
    initGoogleMap?: () => void
  }
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyBjJeUAmh_MJNhkJhF7HW6ExS-O_oo2lwo'


export default function GoogleMapComponent({ reviews, onLocationSelect }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationTime, setLocationTime] = useState<number | null>(null)

  // Carregar Google Maps
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap()
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMap`
      script.async = true
      script.defer = true
      document.head.appendChild(script)

      window.initGoogleMap = () => {
        initializeMap()
      }
    }

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -23.5505, lng: -46.6333 },
        zoom: 11,
        styles: [
          {
            featureType: 'poi.business',
            stylers: [{ visibility: 'on' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#f5f1e6' }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true
      })

      setMapInstance(map)
      setIsLoading(false)
    }

    loadGoogleMaps()
  }, [])

  // Atualizar marcadores quando reviews mudarem
  useEffect(() => {
    if (!mapInstance || !window.google || !reviews.length) return

    // Limpar marcadores existentes
    markers.forEach((marker: any) => marker.setMap(null))
    const newMarkers: any[] = []

    // Agrupar por localização
    const locationGroups = reviews.reduce((acc, review) => {
      if (!review.coordinates) return acc
      const key = `${review.coordinates.lat}-${review.coordinates.lng}`
      if (!acc[key]) acc[key] = []
      acc[key].push(review)
      return acc
    }, {} as Record<string, Review[]>)

    // Criar marcadores
    Object.entries(locationGroups).forEach(([, locationReviews]) => {
      const mainReview = locationReviews[0]
      const avgRating = locationReviews.reduce((acc, r) => acc + r.rating, 0) / locationReviews.length

      const getMarkerColor = (rating: number) => {
        if (rating >= 4.5) return '#22c55e'
        if (rating >= 3.5) return '#eab308'
        if (rating >= 2.5) return '#f97316'
        return '#ef4444'
      }

      const marker = new window.google.maps.Marker({
        position: {
          lat: mainReview.coordinates!.lat,
          lng: mainReview.coordinates!.lng
        },
        map: mapInstance,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: getMarkerColor(avgRating),
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 10
        },
        title: mainReview.location,
        animation: window.google.maps.Animation.DROP
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: createInfoWindowContent(mainReview, locationReviews, avgRating)
      })

      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker)
        onLocationSelect?.(mainReview)
      })

      newMarkers.push(marker)
    })

    setMarkers(newMarkers)

    // Ajustar bounds
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      newMarkers.forEach((marker: any) => {
        bounds.extend(marker.getPosition())
      })
      ;(mapInstance as any).fitBounds(bounds)
    }
  }, [mapInstance, reviews, onLocationSelect, markers])

  // Criar conteúdo do InfoWindow
  const createInfoWindowContent = (review: Review, allReviews: Review[], avgRating: number) => {
    const starsHtml = Array.from({ length: 5 }, (_, i) => 
      i < Math.round(avgRating) ? '★' : '☆'
    ).join('')

    return `
      <div style="max-width: 280px; font-family: system-ui; line-height: 1.4;">
        <div style="display: flex; align-items: start; gap: 10px; margin-bottom: 10px;">
          <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">
            ${review.avatar}
          </div>
          <div style="flex: 1;">
            <h4 style="margin: 0 0 4px 0; font-weight: 600; font-size: 14px; color: #1f2937;">${review.location}</h4>
            <div style="margin-bottom: 6px; color: #fbbf24; font-size: 14px;">
              ${starsHtml} <span style="color: #6b7280; font-size: 12px; margin-left: 4px;">${avgRating.toFixed(1)}/5</span>
            </div>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #4b5563; line-height: 1.3;">
              ${review.content.length > 80 ? review.content.substring(0, 80) + '...' : review.content}
            </p>
            ${allReviews.length > 1 ? `<div style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 11px; color: #6b7280; margin-bottom: 8px;">+${allReviews.length - 1} avaliações adicionais</div>` : ''}
            <div style="display: flex; gap: 6px;">
              <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${review.coordinates!.lat},${review.coordinates!.lng}', '_blank')" style="background: #10b981; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">
                🧭 Direções
              </button>
              <button onclick="alert('Ver detalhes em desenvolvimento')" style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">
                👁️ Detalhes
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  }

  // Obter localização atual
  const getCurrentLocation = () => {
    if (navigator.geolocation && mapInstance) {
      setLocationLoading(true);
      const start = Date.now();
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(loc);
          (mapInstance as any).panTo(loc);
          (mapInstance as any).setZoom(14);
          new window.google.maps.Marker({
            position: loc,
            map: mapInstance,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
              scale: 8
            },
            title: 'Sua localização',
            animation: window.google.maps.Animation.BOUNCE
          });
          setLocationLoading(false);
          setLocationTime(Date.now() - start);
        },
        (error) => {
          setLocationLoading(false);
          setLocationTime(null);
          console.error('Erro ao obter localização:', error);
          alert('Não foi possível obter sua localização.');
        }
      )
    }
  }

  // Obter localização automaticamente ao carregar o mapa
  useEffect(() => {
    if (mapInstance && !userLocation) {
      getCurrentLocation();
    }
    // eslint-disable-next-line
  }, [mapInstance]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Carregando Google Maps...</p>
          <p className="text-xs text-muted-foreground mt-1">Conectando em tempo real</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          size="sm"
          variant="outline"
          className="bg-white/90 backdrop-blur-sm shadow-lg"
          onClick={getCurrentLocation}
          title="Minha localização"
          disabled={locationLoading}
        >
          <Navigation className="w-4 h-4" />
          {locationLoading ? 'Localizando...' : 'Minha localização'}
        </Button>
        {locationTime !== null && (
          <span className="text-xs text-muted-foreground mt-1">Tempo: {locationTime}ms</span>
        )}
        <Button
          size="sm"
          variant="outline"
          className="bg-white/90 backdrop-blur-sm shadow-lg"
          onClick={() => (mapInstance as any)?.setMapTypeId('satellite')}
          title="Vista satélite"
        >
          <Satellite className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-white/90 backdrop-blur-sm shadow-lg"
          onClick={() => (mapInstance as any)?.setMapTypeId('roadmap')}
          title="Vista do mapa"
        >
          <Layers className="w-4 h-4" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Google Maps Live</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {reviews.filter(r => r.coordinates).length} locais • Atualizado agora
        </div>
      </div>

      <div className="absolute top-4 left-4 bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h4 className="text-sm font-semibold mb-2">Nível de Segurança</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Muito Seguro (4.5+)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Seguro (3.5+)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Moderado (2.5+)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Atenção (&lt;2.5)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
