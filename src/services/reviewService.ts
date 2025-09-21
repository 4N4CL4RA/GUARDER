import { supabase } from '../lib/supabaseClient'
import type { Review, ReviewInsert, ReviewUpdate, ReviewStats, GeoLocation } from '../types/review'

export class ReviewService {
  
  // Criar novo review
  static async createReview(review: ReviewInsert): Promise<Review | null> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(review)
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar review:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erro na criação do review:', error)
      return null
    }
  }

  // Obter reviews por localização (raio em km)
  static async getReviewsByLocation(
    location: GeoLocation, 
    radiusKm: number = 1
  ): Promise<Review[]> {
    try {
      // Fórmula básica de distância (aproximada para pequenas distâncias)
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .gte('lat', location.lat - (radiusKm / 111))
        .lte('lat', location.lat + (radiusKm / 111))
        .gte('lng', location.lng - (radiusKm / 111))
        .lte('lng', location.lng + (radiusKm / 111))
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar reviews por localização:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erro na busca por localização:', error)
      return []
    }
  }

  // Obter todos os reviews
  static async getAllReviews(): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar todos os reviews:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erro na busca de reviews:', error)
      return []
    }
  }

  // Obter review por ID
  static async getReviewById(id: number): Promise<Review | null> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erro ao buscar review por ID:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erro na busca por ID:', error)
      return null
    }
  }

  // Atualizar review
  static async updateReview(id: number, updates: ReviewUpdate): Promise<Review | null> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar review:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erro na atualização:', error)
      return null
    }
  }

  // Deletar review
  static async deleteReview(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao deletar review:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erro na deleção:', error)
      return false
    }
  }

  // Obter estatísticas de reviews
  static async getReviewStats(): Promise<ReviewStats | null> {
    try {
      const { count, error: countError } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })

      if (countError) {
        console.error('Erro ao contar reviews:', countError)
        return null
      }

      const { data: reviews, error: dataError } = await supabase
        .from('reviews')
        .select('rating')

      if (dataError) {
        console.error('Erro ao buscar ratings:', dataError)
        return { 
          total: count || 0, 
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        }
      }

      const ratings = reviews?.map(r => r.rating) || []
      const avgRating = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : 0

      return {
        total: count || 0,
        averageRating: Number(avgRating.toFixed(1)),
        ratingDistribution: {
          1: ratings.filter(r => r === 1).length,
          2: ratings.filter(r => r === 2).length,
          3: ratings.filter(r => r === 3).length,
          4: ratings.filter(r => r === 4).length,
          5: ratings.filter(r => r === 5).length,
        }
      }

    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      return null
    }
  }

  // Obter rating médio por localização
  static async getLocationRating(
    location: GeoLocation, 
    radiusKm: number = 0.5
  ): Promise<number> {
    try {
      const reviews = await this.getReviewsByLocation(location, radiusKm)
      
      if (reviews.length === 0) return 0

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      return Number((totalRating / reviews.length).toFixed(1))

    } catch (error) {
      console.error('Erro ao calcular rating da localização:', error)
      return 0
    }
  }

  // Verificar se usuário já avaliou uma localização
  static async hasUserReviewed(
    userId: string, 
    location: GeoLocation, 
    radiusKm: number = 0.1
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', userId)
        .gte('lat', location.lat - (radiusKm / 111))
        .lte('lat', location.lat + (radiusKm / 111))
        .gte('lng', location.lng - (radiusKm / 111))
        .lte('lng', location.lng + (radiusKm / 111))
        .limit(1)

      if (error) {
        console.error('Erro ao verificar review existente:', error)
        return false
      }

      return (data?.length || 0) > 0

    } catch (error) {
      console.error('Erro na verificação:', error)
      return false
    }
  }

  // Buscar review existente em uma localização específica (para atualização)
  static async getExistingReviewAtLocation(
    location: GeoLocation, 
    radiusKm: number = 0.05 // Raio muito pequeno (50m) para considerar "mesmo local"
  ): Promise<Review | null> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .gte('lat', location.lat - (radiusKm / 111))
        .lte('lat', location.lat + (radiusKm / 111))
        .gte('lng', location.lng - (radiusKm / 111))
        .lte('lng', location.lng + (radiusKm / 111))
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) {
        console.error('Erro ao buscar review existente na localização:', error)
        return null
      }

      return data && data.length > 0 ? data[0] : null

    } catch (error) {
      console.error('Erro na busca de review existente:', error)
      return null
    }
  }

  // Criar ou atualizar review (inteligente)
  static async createOrUpdateReview(review: ReviewInsert): Promise<Review | null> {
    try {
      // Primeiro, verificar se já existe um review próximo (mesmo local)
      const existingReview = await this.getExistingReviewAtLocation(
        { lat: review.lat, lng: review.lng },
        0.05 // 50 metros de raio
      )

      if (existingReview) {
        // Atualizar review existente
        console.log('📝 Atualizando review existente no local:', existingReview.id)
        const updatedReview = await this.updateReview(existingReview.id!, {
          rating: review.rating,
          comment: review.comment
        })
        
        return updatedReview
      } else {
        // Criar novo review
        console.log('✨ Criando novo review no local')
        return await this.createReview(review)
      }

    } catch (error) {
      console.error('Erro ao criar ou atualizar review:', error)
      return null
    }
  }
}