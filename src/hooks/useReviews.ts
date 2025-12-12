import { useState, useEffect } from 'react'
import { Review } from '../types/reviews'

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([])

  // Inicializar com avaliações fictícias
  useEffect(() => {
    setReviews([
      {
        id: 1,
        user: "Juliana Santos",
        avatar: "JS",
        rating: 5,
        location: "Shopping Uberaba - Uberaba, MG",
        date: "2024-12-11",
        title: "Muito seguro para toda a família",
        content: "Shopping bem seguro, com segurança em todos os andares. Estacionamento iluminado e sempre movimento. Perfeito para ir com as crianças.",
        helpful: 45,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: true,
        category: "security",
        coordinates: { lat: -19.7535, lng: -47.9380 }
      },
      {
        id: 2,
        user: "Beatriz Almeida",
        avatar: "BA",
        rating: 5,
        location: "Praça Rui Barbosa - Centro, Uberaba",
        date: "2024-12-10",
        title: "Lugar lindo e seguro",
        content: "A praça é linda, bem iluminada e sempre tem movimento. Gosto de caminhar aqui no final da tarde. Policiamento presente.",
        helpful: 38,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: true,
        category: "security",
        coordinates: { lat: -19.7485, lng: -47.9385 }
      },
      {
        id: 3,
        user: "Camila Rodrigues",
        avatar: "CR",
        rating: 4,
        location: "Avenida Leopoldino de Oliveira - Uberaba",
        date: "2024-12-09",
        title: "Movimentada durante o dia",
        content: "Rua principal bem movimentada. Durante o dia é super tranquilo, à noite tem boa iluminação mas prefiro evitar trechos muito vazios.",
        helpful: 29,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: true,
        category: "security",
        coordinates: { lat: -19.7520, lng: -47.9420 }
      },
      {
        id: 4,
        user: "Mariana Costa",
        avatar: "MC",
        rating: 5,
        location: "Parque das Acácias - Uberaba",
        date: "2024-12-08",
        title: "Excelente para exercícios",
        content: "Parque maravilhoso! Sempre cheio de pessoas fazendo caminhada e corrida. Super seguro, nunca tive problemas. Recomendo muito!",
        helpful: 52,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: true,
        category: "security",
        coordinates: { lat: -19.7615, lng: -47.9510 }
      },
      {
        id: 5,
        user: "Fernanda Lima",
        avatar: "FL",
        rating: 4,
        location: "Mercado Municipal - Uberaba",
        date: "2024-12-07",
        title: "Seguro mas fique atento",
        content: "Lugar muito frequentado, especialmente aos sábados. É seguro mas sempre bom ficar de olho nos pertences por causa do movimento.",
        helpful: 33,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: true,
        category: "security",
        coordinates: { lat: -19.7470, lng: -47.9365 }
      },
      {
        id: 6,
        user: "Patricia Souza",
        avatar: "PS",
        rating: 5,
        location: "UFTM - Universidade Federal - Uberaba",
        date: "2024-12-06",
        title: "Campus muito seguro",
        content: "Estudo aqui e me sinto super segura. Campus bem cuidado, com segurança 24h e bem iluminado à noite.",
        helpful: 41,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: true,
        category: "security",
        coordinates: { lat: -19.7750, lng: -47.9530 }
      },
      {
        id: 7,
        user: "Amanda Silva",
        avatar: "AS",
        rating: 4,
        location: "Bairro Abadia - Uberaba",
        date: "2024-12-05",
        title: "Bairro tranquilo e residencial",
        content: "Moro aqui há anos. Bairro super tranquilo, vizinhança muito boa. À noite é silencioso mas sempre há movimento de moradores.",
        helpful: 27,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: true,
        category: "security",
        coordinates: { lat: -19.7450, lng: -47.9500 }
      },
      {
        id: 8,
        user: "Gabriela Martins",
        avatar: "GM",
        rating: 5,
        location: "Terminal Rodoviário - Uberaba",
        date: "2024-12-04",
        title: "Rodoviária segura e organizada",
        content: "Sempre viajo por aqui. Rodoviária limpa, organizada e com boa segurança. Nunca tive problemas mesmo chegando tarde da noite.",
        helpful: 36,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: true,
        category: "security",
        coordinates: { lat: -19.7640, lng: -47.9280 }
      },
      {
        id: 9,
        user: "Larissa Ferreira",
        avatar: "LF",
        rating: 3,
        location: "Bairro Estados Unidos - Uberaba",
        date: "2024-12-03",
        title: "Precisa de mais iluminação",
        content: "Bairro razoável. Durante o dia é tranquilo, mas algumas ruas precisam de melhor iluminação. Evito caminhar sozinha à noite.",
        helpful: 22,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: false,
        category: "security",
        coordinates: { lat: -19.7690, lng: -47.9620 }
      },
      {
        id: 10,
        user: "Renata Oliveira",
        avatar: "RO",
        rating: 5,
        location: "Uberaba Shopping - Uberaba",
        date: "2024-12-02",
        title: "Shopping seguro e confortável",
        content: "Adoro esse shopping! Sempre limpo, seguro e com várias opções. Estacionamento coberto e segurança sempre presente.",
        helpful: 48,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: true,
        category: "security",
        coordinates: { lat: -19.7580, lng: -47.9650 }
      }
    ])
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
