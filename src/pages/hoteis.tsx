import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Hotel, Search, Filter, Star, MapPin, Wifi, Car, Utensils, Shield } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function HoteisPage() {
  const { isLoggedIn, loading } = useAuth()
  const navigate = useNavigate()
  
  // Proteger rota - redirecionar usuários não logados (apenas se não estiver carregando)
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login')
    }
  }, [isLoggedIn, loading, navigate])

  // Se estiver carregando ou não estiver logado, não renderizar o conteúdo
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando hotéis...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null
  }
  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full animate-float"></div>
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

          {/* Search and Filters */}
          <div className="mb-8">
            <Card className="card-iridescent">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative sm:col-span-2 lg:col-span-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input 
                      placeholder="Destino ou hotel..." 
                      className="pl-10"
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
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filtros
                  </Button>
                  <Button variant="outline" size="sm">Até R$ 200</Button>
                  <Button variant="outline" size="sm">R$ 200-500</Button>
                  <Button variant="outline" size="sm">Acima R$ 500</Button>
                  <Button variant="outline" size="sm">5 Estrelas</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hotel Listings */}
          <div className="grid gap-6">
            {[
              {
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
            ].map((hotel, index) => (
              <Card key={index} className={`card-iridescent ${hotel.featured ? 'ring-2 ring-primary/50' : ''}`}>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Hotel Image */}
                    <div className="lg:col-span-1">
                      <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                        <Hotel className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
                      </div>
                    </div>

                    {/* Hotel Info */}
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{hotel.name}</h3>
                          {hotel.featured && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                              Destaque
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{hotel.location}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{hotel.rating}</span>
                            <span className="text-sm text-muted-foreground">({hotel.reviews} avaliações)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600">
                              Segurança {hotel.safetyScore}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.map((amenity, i) => (
                          <div key={i} className="flex items-center gap-1 text-xs bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-700/30 px-2 py-1 rounded-full">
                            {amenity === "Wi-Fi" && <Wifi className="w-3 h-3" />}
                            {amenity === "Estacionamento" && <Car className="w-3 h-3" />}
                            {amenity === "Restaurante" && <Utensils className="w-3 h-3" />}
                            {amenity === "Segurança 24h" && <Shield className="w-3 h-3" />}
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price and Book */}
                    <div className="lg:col-span-1 flex flex-col justify-between space-y-4 lg:space-y-0">
                      <div className="text-center lg:text-right">
                        <div className="text-xl sm:text-2xl font-bold text-primary">
                          R$ {hotel.price}
                        </div>
                        <div className="text-sm text-muted-foreground">por noite</div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <Button className="w-full btn-hero">
                          Reservar Agora
                        </Button>
                        <Button variant="outline" className="w-full">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="card-iridescent text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
                <div className="text-sm text-muted-foreground">Hotéis Verificados</div>
              </CardContent>
            </Card>
            <Card className="card-iridescent text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">98.5%</div>
                <div className="text-sm text-muted-foreground">Taxa de Segurança</div>
              </CardContent>
            </Card>
            <Card className="card-iridescent text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">15,678</div>
                <div className="text-sm text-muted-foreground">Reservas Realizadas</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
