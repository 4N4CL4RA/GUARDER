import React, { useState, useEffect, useCallback } from 'react'
import { ReviewService } from '../services/reviewService'
import type { Review, GeoLocation } from '../types/review'
import { RATING_LABELS, RATING_COLORS } from '../types/review'

interface ReviewListProps {
  location?: GeoLocation
  radiusKm?: number
  showAll?: boolean
  maxReviews?: number
}

export function ReviewList({ 
  location, 
  radiusKm = 1, 
  showAll = false, 
  maxReviews = 10 
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const loadReviews = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let data: Review[]

      if (showAll) {
        data = await ReviewService.getAllReviews()
      } else if (location) {
        data = await ReviewService.getReviewsByLocation(location, radiusKm)
      } else {
        data = []
      }

      // Limitar número de reviews se especificado
      if (maxReviews > 0) {
        data = data.slice(0, maxReviews)
      }

      setReviews(data)
    } catch (err) {
      console.error('Erro ao carregar reviews:', err)
      setError('Erro ao carregar avaliações')
    } finally {
      setLoading(false)
    }
  }, [location, radiusKm, showAll, maxReviews])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDistance = (reviewLat: number, reviewLng: number) => {
    if (!location) return ''
    
    // Cálculo aproximado de distância em km
    const deltaLat = Math.abs(reviewLat - location.lat)
    const deltaLng = Math.abs(reviewLng - location.lng)
    const distance = Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng) * 111 // conversão aproximada para km
    
    if (distance < 0.1) return '< 100m'
    if (distance < 1) return `${Math.round(distance * 1000)}m`
    return `${distance.toFixed(1)}km`
  }

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={loadReviews}
          className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-gray-600">
          {location ? 'Nenhuma avaliação encontrada nesta área' : 'Nenhuma avaliação disponível'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-800">
        {showAll ? 'Todas as Avaliações' : `Avaliações próximas (${reviews.length})`}
      </h4>
      
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-4 rounded-lg shadow border-l-4" 
             style={{ borderLeftColor: RATING_COLORS[review.rating as keyof typeof RATING_COLORS] }}>
          
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getRatingStars(review.rating)}</span>
              <span className="text-sm font-medium" 
                    style={{ color: RATING_COLORS[review.rating as keyof typeof RATING_COLORS] }}>
                {RATING_LABELS[review.rating as keyof typeof RATING_LABELS]}
              </span>
            </div>
            
            {location && (
              <span className="text-xs text-gray-500">
                📍 {formatDistance(review.lat, review.lng)}
              </span>
            )}
          </div>

          {/* Comment */}
          {review.comment && (
            <p className="text-gray-700 text-sm mb-2 line-clamp-3">
              {review.comment}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {review.created_at ? formatDate(review.created_at) : 'Data não disponível'}
            </span>
            {!location && (
              <span className="text-gray-400">
                {review.lat.toFixed(4)}, {review.lng.toFixed(4)}
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Load More Button (para implementação futura) */}
      {reviews.length >= maxReviews && (
        <div className="text-center">
          <button 
            onClick={() => {/* Implementar paginação */}}
            className="px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50"
          >
            Ver mais avaliações
          </button>
        </div>
      )}
    </div>
  )
}