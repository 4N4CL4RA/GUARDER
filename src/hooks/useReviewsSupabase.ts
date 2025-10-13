import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Review } from '../types/reviews';

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar avaliações do Supabase
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('reviews').select('*');
      if (!error && data) {
        setReviews(data as Review[]);
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  // Adicionar avaliação
  const addReview = async (review: Omit<Review, 'id'>) => {
    const { data, error } = await supabase.from('reviews').insert([review]).select();
    
    if (!error && data) {
      setReviews(prev => [data[0] as Review, ...prev]);
    } else if (error) {
      console.error('Erro ao adicionar avaliação:', error);
    }
  };

  // Atualizar avaliação
  const updateReview = async (id: number, updatedReview: Partial<Review>) => {
    const { data, error } = await supabase.from('reviews').update(updatedReview).eq('id', id).select();
    if (!error && data) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, ...updatedReview } : r));
    }
  };

  const getReviewsByLocation = (location: string) => {
    return reviews.filter(review => 
      review.location.toLowerCase().includes(location.toLowerCase())
    );
  };

  const getLocationStats = () => {
    const totalReviews = reviews.length;
    const totalLocations = new Set(reviews.map(r => r.location)).size;
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / (totalReviews || 1);
    return {
      totalLocations,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews
    };
  };

  return {
    reviews,
    setReviews,
    addReview,
    updateReview,
    getReviewsByLocation,
    getLocationStats,
    loading
  };
};
