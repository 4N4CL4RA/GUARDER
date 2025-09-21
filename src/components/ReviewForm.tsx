import React, { useState } from 'react'
import { ReviewService } from '../services/reviewService'
import type { ReviewInsert, GeoLocation } from '../types/review'
import { RATING_LABELS, RATING_COLORS } from '../types/review'

interface ReviewFormProps {
  location: GeoLocation
  onReviewAdded?: (success: boolean) => void
  onCancel?: () => void
}

export function ReviewForm({ location, onReviewAdded, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(3)
  const [comment, setComment] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const reviewData: ReviewInsert = {
        rating,
        comment: comment.trim() || undefined,
        lat: location.lat,
        lng: location.lng
      }

      const result = await ReviewService.createReview(reviewData)
      
      if (result) {
        console.log('✅ Review adicionado com sucesso:', result)
        setRating(3)
        setComment('')
        onReviewAdded?.(true)
      } else {
        console.error('❌ Falha ao adicionar review')
        onReviewAdded?.(false)
      }
    } catch (error) {
      console.error('❌ Erro ao enviar review:', error)
      onReviewAdded?.(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Avaliar Segurança do Local
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nível de Segurança
          </label>
          <div className="flex gap-2 justify-center mb-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  rating >= value
                    ? 'bg-yellow-400 border-yellow-500 text-white'
                    : 'bg-gray-100 border-gray-300 hover:border-yellow-400'
                }`}
                style={{
                  backgroundColor: rating >= value ? RATING_COLORS[value as keyof typeof RATING_COLORS] : undefined
                }}
              >
                ⭐
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            {RATING_LABELS[rating as keyof typeof RATING_LABELS]}
          </p>
        </div>

        {/* Comment Input */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Comentário (opcional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Descreva sua experiência neste local..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {comment.length}/500
          </div>
        </div>

        {/* Location Info */}
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          📍 Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Enviando...' : 'Avaliar Local'}
          </button>
        </div>
      </form>
    </div>
  )
}