import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
import { MapPin, Star, Eye, Navigation } from 'lucide-react'
import { Review } from '../types/reviews'

interface InteractiveMapProps {
  reviews: Review[]
  onLocationSelect?: (review: Review) => void
}

export default function InteractiveMap({ reviews, onLocationSelect }: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<Review | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: -23.5505, lng: -46.6333 }) // São Paulo

  // Agrupar reviews por localização
  const locationGroups = reviews.reduce((acc, review) => {
    if (!review.coordinates) return acc
    
    const key = `${review.coordinates.lat}-${review.coordinates.lng}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(review)
    return acc
  }, {} as Record<string, Review[]>)

  const handleLocationClick = (locationReviews: Review[]) => {
    const mainReview = locationReviews[0]
    setSelectedLocation(mainReview)
    onLocationSelect?.(mainReview)
  }

  const getMarkerColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-green-500'
    if (rating >= 3.5) return 'bg-yellow-500'
    if (rating >= 2.5) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  return (
    <div className="h-full relative">
      {/* Mapa Simulado */}
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="map-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#map-grid)" />
          </svg>
        </div>

        {/* Markers dos Locais */}
        {Object.entries(locationGroups).map(([key, locationReviews]) => {
          const mainReview = locationReviews[0]
          const avgRating = locationReviews.reduce((acc, r) => acc + r.rating, 0) / locationReviews.length
          
          // Posição relativa no mapa (simulada)
          const x = ((mainReview.coordinates!.lng + 46.8) / 0.4) * 100
          const y = ((mainReview.coordinates!.lat + 23.8) / 0.6) * 100

          return (
            <div
              key={key}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ 
                left: `${Math.max(5, Math.min(95, x))}%`, 
                top: `${Math.max(5, Math.min(95, 100 - y))}%` 
              }}
              onClick={() => handleLocationClick(locationReviews)}
            >
              {/* Marker */}
              <div className={`w-6 h-6 rounded-full ${getMarkerColor(avgRating)} border-2 border-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <MapPin className="w-3 h-3 text-white" />
              </div>
              
              {/* Badge com número de avaliações */}
              {locationReviews.length > 1 && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {locationReviews.length}
                </div>
              )}

              {/* Tooltip */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {mainReview.location}
                <br />
                ⭐ {avgRating.toFixed(1)} ({locationReviews.length} avaliações)
              </div>
            </div>
          )
        })}

        {/* Centro do Mapa */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
        </div>

        {/* Controles do Mapa */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button size="sm" variant="outline" className="w-10 h-10 p-0">
            +
          </Button>
          <Button size="sm" variant="outline" className="w-10 h-10 p-0">
            −
          </Button>
          <Button size="sm" variant="outline" className="w-10 h-10 p-0">
            <Navigation className="w-4 h-4" />
          </Button>
        </div>

        {/* Escala do Mapa */}
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/90 px-2 py-1 rounded text-xs">
          10 km
        </div>
      </div>

      {/* Detalhes do Local Selecionado */}
      {selectedLocation && (
        <Card className="absolute top-4 left-4 w-80 max-w-[calc(100%-2rem)] card-iridescent shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                  {selectedLocation.avatar}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1 truncate">
                  {selectedLocation.location}
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < selectedLocation.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {selectedLocation.rating}/5
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {selectedLocation.content}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {selectedLocation.category}
                  </Badge>
                  {selectedLocation.verified && (
                    <Badge variant="outline" className="text-xs">
                      Verificado
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    <Eye className="w-3 h-3 mr-1" />
                    Ver Detalhes
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    <Navigation className="w-3 h-3 mr-1" />
                    Navegar
                  </Button>
                </div>
              </div>
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="w-6 h-6 p-0"
                onClick={() => setSelectedLocation(null)}
              >
                ×
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
