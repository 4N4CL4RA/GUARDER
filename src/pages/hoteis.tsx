import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Hotel, Search, Filter, Star, MapPin, Wifi, Car, Utensils, Shield, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'

export default function HoteisPage() {
  const { isLoggedIn, loading } = useAuth()
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [priceFilter, setPriceFilter] = useState(null)
  const [starFilter, setStarFilter] = useState(null)

  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    setSearch("")
    setPriceFilter(null)
    setStarFilter(null)
  }

  // Função para alternar filtros (aplicar/remover)
  const togglePriceFilter = (filter) => {
    setPriceFilter(priceFilter === filter ? null : filter)
  }

  const toggleStarFilter = (filter) => {
    setStarFilter(starFilter === filter ? null : filter)
  }

  const hotels = [
    {
      id: 1,
      name: "Hotel Segurança Premium",
      location: "Centro, São Paulo",
      rating: 4.8,
      reviews: 342,
      price: 285,
      image: "hotel1",
      amenities: ["Wi-Fi", "Estacionamento", "Restaurante", "Segurança 24h"],
      safetyScore: 98,
      featured: true
    },
    {
      id: 2,
      name: "Pousada Vila Tranquila",
      location: "Jardins, São Paulo",
      rating: 4.6,
      reviews: 189,
      price: 195,
      image: "hotel2",
      amenities: ["Wi-Fi", "Café da manhã", "Segurança 24h"],
      safetyScore: 95,
      featured: false
    },
    {
      id: 3,
      name: "Resort Guarder Valley",
      location: "Campos do Jordão",
      rating: 4.9,
      reviews: 567,
      price: 450,
      image: "hotel3",
      amenities: ["Wi-Fi", "Estacionamento", "Spa", "Restaurante", "Segurança 24h"],
      safetyScore: 99,
      featured: true
    }
  ]

  // Filtro dinâmico
  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(search.toLowerCase()) ||
      hotel.location.toLowerCase().includes(search.toLowerCase())

    const matchesPrice =
      !priceFilter ||
      (priceFilter === "low" && hotel.price <= 200) ||
      (priceFilter === "mid" && hotel.price > 200 && hotel.price <= 500) ||
      (priceFilter === "high" && hotel.price > 500)

    const matchesStars =
      !starFilter || (starFilter === "5" && hotel.rating >= 4.8)

    return matchesSearch && matchesPrice && matchesStars
  })

  // Proteção de rota
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login')
    }
  }, [isLoggedIn, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando hotéis...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen relative">
      {/* Background animado */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      </div>

      <Navigation isLoggedIn={isLoggedIn} />

      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 p-3 rounded-full card-iridescent mb-6">
              <Hotel className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">Hotéis Seguros</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Encontre acomodações verificadas e seguras para sua viagem
            </p>
          </div>

          {/* Barra de busca e filtros */}
          <div className="mb-8">
            <Card className="card-iridescent">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative sm:col-span-2 lg:col-span-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Destino ou hotel..."
                      className="pl-10"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Input type="date" placeholder="Check-in" />
                  <Input type="date" placeholder="Check-out" />
                  <Button className="btn-hero flex items-center gap-2 sm:col-span-2 lg:col-span-1">
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:inline">Buscar</span>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="flex items-center gap-2 mr-4">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Filtros:</span>
                  </div>
                  
                  {/* Filtros de Preço */}
                  <Button 
                    variant={priceFilter === "low" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => togglePriceFilter("low")}
                    className={priceFilter === "low" ? "bg-blue-500 hover:bg-blue-600" : ""}
                  >
                    Até R$ 200
                  </Button>
                  <Button 
                    variant={priceFilter === "mid" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => togglePriceFilter("mid")}
                    className={priceFilter === "mid" ? "bg-blue-500 hover:bg-blue-600" : ""}
                  >
                    R$ 200-500
                  </Button>
                  <Button 
                    variant={priceFilter === "high" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => togglePriceFilter("high")}
                    className={priceFilter === "high" ? "bg-blue-500 hover:bg-blue-600" : ""}
                  >
                    Acima R$ 500
                  </Button>
                  
                  {/* Filtro de Estrelas */}
                  <Button 
                    variant={starFilter === "5" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => toggleStarFilter("5")}
                    className={starFilter === "5" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                  >
                    <Star className="w-4 h-4 mr-1" />
                    5 Estrelas
                  </Button>

                  {/* Botão Limpar Filtros - só aparece se há filtros ativos */}
                  {(priceFilter || starFilter || search) && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Limpar Filtros
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros Ativos */}
          {(search || priceFilter || starFilter) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/20">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Filtros aplicados:
                    </span>
                    
                    {search && (
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800"
                        onClick={() => setSearch("")}
                      >
                        Busca: "{search}" ✕
                      </Badge>
                    )}
                    
                    {priceFilter && (
                      <Badge 
                        variant="secondary" 
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 cursor-pointer hover:bg-green-200 dark:hover:bg-green-800"
                        onClick={() => setPriceFilter(null)}
                      >
                        {priceFilter === "low" && "Até R$ 200"}
                        {priceFilter === "mid" && "R$ 200-500"}
                        {priceFilter === "high" && "Acima R$ 500"} ✕
                      </Badge>
                    )}
                    
                    {starFilter && (
                      <Badge 
                        variant="secondary" 
                        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-800"
                        onClick={() => setStarFilter(null)}
                      >
                        5 Estrelas ✕
                      </Badge>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ml-2"
                    >
                      Limpar todos
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-2">
                    {filteredHotels.length} hotel(s) encontrado(s)
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Lista de hotéis */}
          <div className="grid gap-6">
            <AnimatePresence>
              {filteredHotels.map((hotel) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`card-iridescent ${hotel.featured ? 'ring-2 ring-primary/50' : ''}`}>
  <CardContent className="p-6 flex gap-6 items-center">
    {/* Imagem */}
    <div className="w-40 h-28 flex-shrink-0 overflow-hidden rounded-xl">
      <img
        src={`/images/${hotel.image}.jpg`}
        alt={hotel.name}
        className="w-full h-full object-cover"
      />
    </div>

    {/* Info */}
    <div className="flex-1">
      <CardTitle className="flex items-center gap-2">
        {hotel.name}
        {hotel.featured && <Badge className="ml-2">Destaque</Badge>}
      </CardTitle>
      <CardDescription className="flex items-center gap-2 mt-1">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        {hotel.location}
      </CardDescription>

      {/* Avaliação */}
      <div className="flex items-center gap-1 mt-2 text-yellow-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.round(hotel.rating) ? "fill-current" : "stroke-current"}`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-2">
          {hotel.reviews} avaliações
        </span>
      </div>

      {/* Amenidades */}
      <div className="flex gap-2 mt-2 text-sm text-muted-foreground flex-wrap">
        {hotel.amenities.map((amenity, i) => (
          <Badge key={i} variant="outline">{amenity}</Badge>
        ))}
      </div>
    </div>

    {/* Preço + botão */}
    <div className="text-right">
      <div className="text-xl font-bold text-primary">R$ {hotel.price}</div>
      <div className="text-sm text-muted-foreground">por noite</div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 text-white font-medium shadow-lg"
      >
        Reservar Agora
      </motion.button>
    </div>
  </CardContent>
</Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Estatísticas */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { value: "1,247", label: "Hotéis Verificados", color: "text-blue-600" },
              { value: "98.5%", label: "Taxa de Segurança", color: "text-green-600" },
              { value: "15,678", label: "Reservas Realizadas", color: "text-purple-600" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="card-iridescent text-center">
                  <CardContent className="p-6">
                    <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
