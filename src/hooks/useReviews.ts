import { useState, useEffect } from 'react'
import { Review } from '../types/reviews'

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([])

  // Inicializar com array vazio - reviews serão adicionadas dinamicamente pelo usuário
  useEffect(() => {
    setReviews([])
  }, [])

  const addReview = (review: Review) => {
    setReviews(prev => [review, ...prev])
  }

  const updateReview = (id: number, updatedReview: Partial<Review>) => {
    setReviews(prev => prev.map(review => 
      review.id === id ? { ...review, ...updatedReview } : review
    ))
  }

  const getReviewsByLocation = (location: string) => {
    return reviews.filter(review => 
      review.location.toLowerCase().includes(location.toLowerCase())
    )
  }

  const getLocationStats = () => {
    if (reviews.length === 0) {
      return {
        totalLocations: 0,
        averageRating: 0,
        totalReviews: 0
      }
    }

    const totalReviews = reviews.length
    const totalLocations = new Set(reviews.map(r => r.location)).size
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews

    return {
      totalLocations,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews
    }
  }

  return {
    reviews,
    setReviews,
    addReview,
    updateReview,
    getReviewsByLocation,
    getLocationStats
  }
}
