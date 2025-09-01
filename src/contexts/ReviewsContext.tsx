import { createContext, useState, ReactNode, useEffect } from 'react'
import { Review, ReviewsContextType } from '../types/reviews'

export const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined)

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>([])

  // Dados iniciais das reviews com coordenadas
  useEffect(() => {
    const initialReviews: Review[] = [
      {
        id: 1,
        user: "Maria Silva",
        avatar: "MS",
        rating: 5,
        location: "Hotel Segurança Premium - Centro, SP",
        date: "15 de Janeiro, 2024",
        title: "Experiência excepcional de segurança",
        content: "Fiquei impressionada com o nível de segurança do hotel. Portaria 24h muito atenciosa, câmeras em todos os corredores e sistema de cartão para acessar os andares. Me senti completamente segura durante toda a estadia.",
        helpful: 24,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [
          {
            id: 1,
            user: "João Santos",
            content: "Concordo completamente! Também me hospedei lá e a segurança é impecável.",
            date: "16 de Janeiro, 2024"
          }
        ],
        verified: true,
        category: "hotel",
        coordinates: { lat: -23.5505, lng: -46.6333 },
        address: "Rua da Consolação, 222 - Centro",
        city: "São Paulo"
      },
      {
        id: 2,
        user: "João Santos",
        avatar: "JS",
        rating: 4,
        location: "Pousada Vila Tranquila - Jardins, SP",
        date: "10 de Janeiro, 2024",
        title: "Bom custo-benefício para segurança",
        content: "Local muito tranquilo e seguro. A pousada fica em uma rua residencial calma. Único ponto negativo foi o Wi-Fi um pouco instável, mas a segurança compensou completamente.",
        helpful: 18,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: true,
        category: "pousada",
        coordinates: { lat: -23.5629, lng: -46.6544 },
        address: "Rua Augusta, 1500 - Jardins",
        city: "São Paulo"
      },
      {
        id: 3,
        user: "Ana Costa",
        avatar: "AC",
        rating: 5,
        location: "Resort Guarder Valley - Campos do Jordão",
        date: "8 de Janeiro, 2024",
        title: "Resort perfeito para famílias",
        content: "Levei minha família e todos se sentiram muito seguros. O resort tem segurança 24h, área infantil monitorada e todos os funcionários são muito atenciosos. Recomendo para quem viaja com crianças.",
        helpful: 31,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [
          {
            id: 1,
            user: "Carlos Lima",
            content: "Excelente dica! Vou levar minha família no próximo feriado.",
            date: "9 de Janeiro, 2024"
          },
          {
            id: 2,
            user: "Fernanda Oliveira",
            content: "Confirmo! Estive lá no Natal e foi perfeito para as crianças.",
            date: "10 de Janeiro, 2024"
          }
        ],
        verified: true,
        category: "resort",
        coordinates: { lat: -22.7389, lng: -45.5911 },
        address: "Estrada de Campos do Jordão, KM 15",
        city: "Campos do Jordão"
      },
      {
        id: 4,
        user: "Carlos Lima",
        avatar: "CL",
        rating: 3,
        location: "Hostel Juventude - Vila Madalena, SP",
        date: "5 de Janeiro, 2024",
        title: "Segurança básica, mas adequada",
        content: "Para um hostel, a segurança é razoável. Tem armários com cadeado e recepção 24h. Não é luxuoso, mas cumpre o básico de segurança que se espera.",
        helpful: 12,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: true,
        category: "hostel",
        coordinates: { lat: -23.5444, lng: -46.6915 },
        address: "Rua Fradique Coutinho, 300 - Vila Madalena",
        city: "São Paulo"
      },
      {
        id: 5,
        user: "Fernanda Oliveira",
        avatar: "FO",
        rating: 5,
        location: "Hotel Boutique Seguro - Ipanema, RJ",
        date: "3 de Janeiro, 2024",
        title: "Segurança e conforto excepcionais",
        content: "Hotel pequeno mas com segurança de primeiro mundo. Funcionários muito bem treinados, sistema biométrico nos elevadores e cofre digital no quarto. Vale cada centavo!",
        helpful: 28,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [
          {
            id: 1,
            user: "Roberto Silva",
            content: "Adorei a descrição! Já reservei para o mês que vem.",
            date: "4 de Janeiro, 2024"
          }
        ],
        verified: true,
        category: "hotel",
        coordinates: { lat: -22.9838, lng: -43.2057 },
        address: "Rua Visconde de Pirajá, 500 - Ipanema",
        city: "Rio de Janeiro"
      },
      {
        id: 6,
        user: "Roberto Silva",
        avatar: "RS",
        rating: 4,
        location: "Camping Natureza Protegida - Serra da Mantiqueira",
        date: "1 de Janeiro, 2024",
        title: "Boa segurança para um camping",
        content: "Surpreendeu positivamente! Mesmo sendo um camping, tem portaria controlada, rondas noturnas e área cercada. Perfeito para quem gosta de natureza sem abrir mão da segurança.",
        helpful: 15,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: true,
        category: "camping",
        coordinates: { lat: -22.3067, lng: -45.1633 },
        address: "Estrada da Serra, KM 45 - Serra da Mantiqueira",
        city: "Monteiro Lobato"
      },
      {
        id: 7,
        user: "Lucas Pereira",
        avatar: "LP",
        rating: 5,
        location: "Hotel Premium Security - Copacabana, RJ",
        date: "28 de Dezembro, 2023",
        title: "Excelente localização e segurança",
        content: "Ficamos hospedados durante o Réveillon e a segurança foi impecável. Portaria rigorosa, elevadores com cartão e área de lazer muito bem monitorada.",
        helpful: 22,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: true,
        category: "hotel",
        coordinates: { lat: -22.9711, lng: -43.1822 },
        address: "Avenida Atlântica, 1702 - Copacabana",
        city: "Rio de Janeiro"
      },
      {
        id: 8,
        user: "Sofia Martins",
        avatar: "SM",
        rating: 4,
        location: "Pousada Família Segura - Vila Olímpia, SP",
        date: "25 de Dezembro, 2023",
        title: "Ideal para famílias",
        content: "Lugar muito seguro para quem viaja com crianças. Área de recreação monitorada, funcionários atenciosos e sistema de segurança moderno.",
        helpful: 19,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [
          {
            id: 1,
            user: "Ana Costa",
            content: "Concordo! Também levei meus filhos e foi uma experiência excelente.",
            date: "26 de Dezembro, 2023"
          }
        ],
        verified: true,
        category: "pousada",
        coordinates: { lat: -23.5955, lng: -46.6853 },
        address: "Rua Funchal, 375 - Vila Olímpia",
        city: "São Paulo"
      }
    ]
    
    setReviews(initialReviews)
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
    const totalReviews = reviews.length
    const totalLocations = new Set(reviews.map(r => r.location)).size
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews

    return {
      totalLocations,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews
    }
  }

  return (
    <ReviewsContext.Provider value={{
      reviews,
      setReviews,
      addReview,
      updateReview,
      getReviewsByLocation,
      getLocationStats
    }}>
      {children}
    </ReviewsContext.Provider>
  )
}
