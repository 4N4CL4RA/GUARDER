// Tipos para o sistema de reviews de segurança

export interface Review {
  id?: number
  user_id?: string | null
  rating: number // 1-5 (1 = muito inseguro, 5 = muito seguro)
  comment?: string | null
  lat: number
  lng: number
  created_at?: string
}

export interface ReviewInsert {
  rating: number
  comment?: string
  lat: number
  lng: number
  user_id?: string | null
}

export interface ReviewUpdate {
  rating?: number
  comment?: string
}

export interface ReviewStats {
  total: number
  averageRating: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export interface GeoLocation {
  lat: number
  lng: number
}

// Constantes para ratings
export const RATING_LABELS = {
  1: 'Muito Inseguro',
  2: 'Inseguro', 
  3: 'Neutro',
  4: 'Seguro',
  5: 'Muito Seguro'
} as const

export const RATING_COLORS = {
  1: '#ef4444', // red-500
  2: '#f97316', // orange-500
  3: '#eab308', // yellow-500
  4: '#22c55e', // green-500
  5: '#10b981'  // emerald-500
} as const

export type RatingValue = keyof typeof RATING_LABELS