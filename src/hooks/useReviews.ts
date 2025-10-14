import { useState, useEffect } from 'react'
import { Review } from '../types/reviews'

export const useReviews = () => {
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
        coordinates: { lat: -23.5506, lng: -46.6396 },
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
        coordinates: { lat: -23.5647, lng: -46.6587 },
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
        coordinates: { lat: -22.7387, lng: -45.5932 },
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
        coordinates: { lat: -23.5439, lng: -46.6922 },
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
        coordinates: { lat: -22.9836, lng: -43.2048 },
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
        coordinates: { lat: -22.3089, lng: -45.1654 },
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
        coordinates: { lat: -22.9708, lng: -43.1817 },
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
        coordinates: { lat: -23.5947, lng: -46.6867 },
        address: "Rua Funchal, 375 - Vila Olímpia",
        city: "São Paulo"
      },
      // Avaliações de Segurança de Locais
      {
        id: 9,
        user: "Pedro Santos",
        avatar: "PS",
        rating: 4,
        location: "Avenida Paulista - Centro, SP",
        date: "20 de Janeiro, 2024",
        title: "Avaliação de Segurança - Avenida Paulista",
        content: "Área movimentada durante o dia, boa iluminação e presença policial. À noite pode ser mais perigosa em algumas partes.",
        helpful: 15,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: false,
        category: "security",
        coordinates: { lat: -23.5618, lng: -46.6546 },
        address: "Avenida Paulista - Centro",
        city: "São Paulo"
      },
      {
        id: 10,
        user: "Marina Lima",
        avatar: "ML",
        rating: 2,
        location: "Praça da República - Centro, SP",
        date: "18 de Janeiro, 2024",
        title: "Avaliação de Segurança - Praça da República",
        content: "Local com muitos moradores de rua e usuários de drogas. Evito passar aqui à noite. Durante o dia é melhor, mas ainda assim é preciso cuidado.",
        helpful: 8,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: false,
        category: "security",
        coordinates: { lat: -23.5433, lng: -46.6418 },
        address: "Praça da República - Centro",
        city: "São Paulo"
      },
      {
        id: 11,
        user: "Rafael Costa",
        avatar: "RC",
        rating: 5,
        location: "Villa Lobos Park - Vila Leopoldina, SP",
        date: "15 de Janeiro, 2024",
        title: "Avaliação de Segurança - Parque Villa Lobos",
        content: "Parque muito seguro, com policiamento constante, câmeras de segurança e muitas famílias. Excelente para atividades ao ar livre.",
        helpful: 22,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [
          {
            id: 1,
            user: "Ana Costa",
            content: "Concordo! Sempre levo meus filhos para brincar lá, muito seguro mesmo.",
            date: "16 de Janeiro, 2024"
          }
        ],
        verified: false,
        category: "security",
        coordinates: { lat: -23.5462, lng: -46.7205 },
        address: "Avenida Professor Fonseca Rodrigues, 2001",
        city: "São Paulo"
      },
      {
        id: 12,
        user: "Carla Mendes",
        avatar: "CM",
        rating: 3,
        location: "Largo do Arouche - Centro, SP",
        date: "12 de Janeiro, 2024",
        title: "Avaliação de Segurança - Largo do Arouche",
        content: "Área em transição. Durante o dia é tranquilo para circular, mas à noite fica mais perigoso. Tem alguns bares e restaurantes que movimentam a região.",
        helpful: 11,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: false,
        category: "security",
        coordinates: { lat: -23.5371, lng: -46.6435 },
        address: "Largo do Arouche - Centro",
        city: "São Paulo"
      },
      // Avaliações de Segurança - Uberaba, MG
      {
        id: 13,
        user: "Marcos Silva",
        avatar: "MS",
        rating: 5,
        location: "Centro Histórico - Uberaba, MG",
        date: "22 de Janeiro, 2024",
        title: "Avaliação de Segurança - Centro de Uberaba",
        content: "Centro muito seguro durante o dia, com boa movimentação de pessoas e comércio ativo. Policiamento presente e bem iluminado. Recomendo para turismo e compras.",
        helpful: 18,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [
          {
            id: 1,
            user: "Ana Paula",
            content: "Concordo! Sempre me sinto segura andando no centro durante o dia.",
            date: "23 de Janeiro, 2024"
          }
        ],
        verified: false,
        category: "security",
        coordinates: { lat: -19.7500032, lng: -47.9366620 },
        address: "Praça Rui Barbosa - Centro",
        city: "Uberaba"
      },
      {
        id: 14,
        user: "Julia Mendes",
        avatar: "JM",
        rating: 4,
        location: "Parque das Acácias - Uberaba, MG",
        date: "20 de Janeiro, 2024",
        title: "Avaliação de Segurança - Parque das Acácias",
        content: "Parque familiar muito agradável e seguro. Ideal para caminhadas e atividades com crianças. Tem segurança durante o dia e é bem frequentado por famílias da região.",
        helpful: 25,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [
          {
            id: 1,
            user: "Roberto Carlos",
            content: "Ótimo lugar para levar as crianças! Sempre vou lá aos finais de semana.",
            date: "21 de Janeiro, 2024"
          }
        ],
        verified: false,
        category: "security",
        coordinates: { lat: -19.7618, lng: -47.9439 },
        address: "Rua das Acácias, 500 - Parque das Acácias",
        city: "Uberaba"
      },
      {
        id: 15,
        user: "Carlos Eduardo",
        avatar: "CE",
        rating: 4,
        location: "Shopping Uberaba - Uberaba, MG",
        date: "18 de Janeiro, 2024",
        title: "Avaliação de Segurança - Shopping Uberaba",
        content: "Shopping com excelente segurança, estacionamento bem iluminado e monitorado. Área interna muito segura, ideal para compras e alimentação com a família.",
        helpful: 32,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [
          {
            id: 1,
            user: "Marina Santos",
            content: "Sempre me sinto muito segura no shopping. Funcionários muito atenciosos!",
            date: "19 de Janeiro, 2024"
          }
        ],
        verified: false,
        category: "security",
        coordinates: { lat: -19.7349, lng: -47.9267 },
        address: "Avenida Leopoldino de Oliveira, 4444",
        city: "Uberaba"
      },
      {
        id: 16,
        user: "Fernanda Costa",
        avatar: "FC",
        rating: 3,
        location: "Estação Rodoviária - Uberaba, MG",
        date: "15 de Janeiro, 2024",
        title: "Avaliação de Segurança - Rodoviária de Uberaba",
        content: "Rodoviária com segurança básica. Durante o dia é tranquilo, mas à noite é melhor ter cuidado redobrado. Tem policiamento, mas poderia ser mais intenso.",
        helpful: 14,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: false,
        category: "security",
        coordinates: { lat: -19.7477, lng: -47.9305 },
        address: "Rua Coronel Antônio Alves - Centro",
        city: "Uberaba"
      },
      {
        id: 17,
        user: "Rafael Oliveira",
        avatar: "RO",
        rating: 5,
        location: "Campus UFTM - Uberaba, MG",
        date: "12 de Janeiro, 2024",
        title: "Avaliação de Segurança - Universidade Federal",
        content: "Campus universitário muito seguro, com portaria controlada, câmeras de monitoramento e segurança 24h. Ambiente acadêmico excelente e muito bem protegido.",
        helpful: 28,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [
          {
            id: 1,
            user: "Laura Silva",
            content: "Estudo lá e confirmo! Nunca tive problemas de segurança no campus.",
            date: "13 de Janeiro, 2024"
          }
        ],
        verified: false,
        category: "security",
        coordinates: { lat: -19.7736, lng: -47.9472 },
        address: "Avenida Getúlio Guaritá - UFTM",
        city: "Uberaba"
      },
      {
        id: 18,
        user: "Patricia Lima",
        avatar: "PL",
        rating: 4,
        location: "Mercado Municipal - Uberaba, MG",
        date: "10 de Janeiro, 2024",
        title: "Avaliação de Segurança - Mercado Municipal",
        content: "Mercado tradicional com boa segurança durante o funcionamento. Ambiente familiar, vendedores conhecidos e movimentação constante. Recomendo para compras locais.",
        helpful: 21,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [
          {
            id: 1,
            user: "José Carlos",
            content: "Lugar tradicional da cidade! Sempre compro lá e é muito seguro.",
            date: "11 de Janeiro, 2024"
          }
        ],
        verified: false,
        category: "security",
        coordinates: { lat: -19.7505, lng: -47.9343 },
        address: "Praça Mercado - Centro",
        city: "Uberaba"
      },
      {
        id: 19,
        user: "Anderson Santos",
        avatar: "AS",
        rating: 3,
        location: "Avenida Santos Dumont - Uberaba, MG",
        date: "8 de Janeiro, 2024",
        title: "Avaliação de Segurança - Av. Santos Dumont",
        content: "Avenida principal com movimento intenso. Durante o dia é tranquila para circular, mas à noite alguns trechos ficam mais desertos. Boa iluminação na maioria dos pontos.",
        helpful: 16,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: false,
        category: "security",
        coordinates: { lat: -19.7458, lng: -47.9401 },
        address: "Avenida Santos Dumont - Centro",
        city: "Uberaba"
      },
      {
        id: 20,
        user: "Luciana Ferreira",
        avatar: "LF",
        rating: 5,
        location: "Parque Jacarandá - Uberaba, MG",
        date: "5 de Janeiro, 2024",
        title: "Avaliação de Segurança - Parque Jacarandá",
        content: "Parque maravilhoso para toda família! Muito seguro, com guardas, boa iluminação e frequentado por muitas pessoas. Perfeito para exercícios e lazer com crianças.",
        helpful: 35,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [
          {
            id: 1,
            user: "Miguel Santos",
            content: "Um dos meus lugares favoritos em Uberaba! Muito seguro mesmo.",
            date: "6 de Janeiro, 2024"
          },
          {
            id: 2,
            user: "Carla Rosa",
            content: "Levo meus filhos lá sempre! Ambiente família e super seguro.",
            date: "7 de Janeiro, 2024"
          }
        ],
        verified: false,
        category: "security",
        coordinates: { lat: -19.7580, lng: -47.9357 },
        address: "Rua Jacarandá, 1200 - Jardim Primavera",
        city: "Uberaba"
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

  return {
    reviews,
    setReviews,
    addReview,
    updateReview,
    getReviewsByLocation,
    getLocationStats
  }
}
