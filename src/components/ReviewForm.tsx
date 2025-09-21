import React, { useState, useEffect } from 'react'
import { ReviewService } from '../services/reviewService'
import type { ReviewInsert, GeoLocation, Review } from '../types/review'
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
  const [existingReview, setExistingReview] = useState<Review | null>(null)
  const [isCheckingExisting, setIsCheckingExisting] = useState<boolean>(true)

  // Verificar se já existe um review neste local ao carregar
  useEffect(() => {
    const checkExistingReview = async () => {
      setIsCheckingExisting(true)
      try {
        const existing = await ReviewService.getExistingReviewAtLocation(location, 0.05)
        if (existing) {
          setExistingReview(existing)
          setRating(existing.rating)
          setComment(existing.comment || '')
          console.log('📝 Review existente encontrado, carregando dados para edição')
        }
      } catch (error) {
        console.error('Erro ao verificar review existente:', error)
      } finally {
        setIsCheckingExisting(false)
      }
    }

    checkExistingReview()
  }, [location])

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

      const result = await ReviewService.createOrUpdateReview(reviewData)
      
      if (result) {
        const action = existingReview ? 'atualizado' : 'adicionado'
        console.log(`✅ Review ${action} com sucesso:`, result)
        setRating(3)
        setComment('')
        onReviewAdded?.(true)
      } else {
        console.error('❌ Falha ao processar review')
        onReviewAdded?.(false)
      }
    } catch (error) {
      console.error('❌ Erro ao enviar review:', error)
      onReviewAdded?.(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCheckingExisting) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Verificando local...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          {existingReview ? 'Atualizar Avaliação' : 'Avaliar Segurança do Local'}
        </h3>
        {existingReview && (
          <p className="text-sm text-blue-600 mt-1">
            📝 Já existe uma avaliação neste local. Seus dados foram carregados para edição.
          </p>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Nível de Segurança
          </label>
          <div className="flex gap-3 justify-center mb-3">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`w-12 h-12 rounded-full border-2 transition-all text-lg ${
                  rating >= value
                    ? 'bg-yellow-400 border-yellow-500 text-white scale-110'
                    : 'bg-gray-100 border-gray-300 hover:border-yellow-400 hover:scale-105'
                }`}
                style={{
                  backgroundColor: rating >= value ? RATING_COLORS[value as keyof typeof RATING_COLORS] : undefined
                }}
              >
                ⭐
              </button>
            ))}
          </div>
          <p className="text-center text-base font-medium text-gray-700">
            {RATING_LABELS[rating as keyof typeof RATING_LABELS]}
          </p>
        </div>

        {/* Comment Input */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-3">
            Comentário (opcional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Descreva sua experiência neste local..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            rows={4}
            maxLength={500}
          />
          <div className="text-right text-xs text-gray-500 mt-2">
            {comment.length}/500
          </div>
        </div>

        {/* Location Info */}
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          📍 Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
          {existingReview && (
            <span className="ml-2 text-blue-600">
              (Editando review #{existingReview.id})
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting 
              ? 'Processando...' 
              : existingReview 
                ? 'Atualizar Avaliação' 
                : 'Avaliar Local'
            }
          </button>
        </div>
      </form>
    </div>
  )
}