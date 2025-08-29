export interface Review {
  id: number
  user: string
  avatar: string
  rating: number
  location: string
  date: string
  title: string
  content: string
  helpful: number
  hasUserLiked: boolean
  hasUserDisliked: boolean
  replies: Reply[]
  verified: boolean
  category: string
  coordinates?: {
    lat: number
    lng: number
  }
  address?: string
  city?: string
}

export interface Reply {
  id: number
  user: string
  content: string
  date: string
  isOwner?: boolean
}

export interface ReviewsContextType {
  reviews: Review[]
  setReviews: (reviews: Review[]) => void
  addReview: (review: Review) => void
  updateReview: (id: number, updatedReview: Partial<Review>) => void
  getReviewsByLocation: (location: string) => Review[]
  getLocationStats: () => {
    totalLocations: number
    averageRating: number
    totalReviews: number
  }
}
