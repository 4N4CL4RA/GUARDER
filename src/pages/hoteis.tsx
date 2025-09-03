import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Hotel, Search, Filter, Star, MapPin, Wifi, Car, Utensils, Shield } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'

export default function HoteisPage() {
  const { isLoggedIn, loading } = useAuth()
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [priceFilter, setPriceFilter] = useState(null)
  const [starFilter, setStarFilter] = useState(null)

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
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filtros
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPriceFilter("low")}>Até R$ 200</Button>
                  <Button variant="outline" size="sm" onClick={() => setPriceFilter("mid")}>R$ 200-500</Button>
                  <Button variant="outline" size="sm" onClick={() => setPriceFilter("high")}>Acima R$ 500</Button>
                  <Button variant="outline" size="sm" onClick={() => setStarFilter("5")}>5 Estrelas</Button>
                </div>
              </CardContent>
            </Card>
          </div>

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
