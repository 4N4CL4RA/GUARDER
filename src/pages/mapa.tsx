import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import GoogleMapComponent from '../components/GoogleMap'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { MapPin, Search, Filter, Navigation as NavigationIcon, Star, Eye, MessageSquare } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useReviews } from '../hooks/useReviewsSupabase'
import { Review } from '../types/reviews'

export default function MapaPage() {
  const { isLoggedIn, loading } = useAuth()
  const { reviews, getLocationStats } = useReviews()
  const navigate = useNavigate()
  
  // Proteger rota - redirecionar usuários não logados (apenas se não estiver carregando)
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login')
    }
  }, [isLoggedIn, loading, navigate])
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Se estiver carregando ou não estiver logado, não renderizar o conteúdo
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando mapa...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null
  }

  // Filtrar reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.city?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || review.category === selectedCategory
    
    return matchesSearch && matchesCategory && review.coordinates
  })

  const stats = getLocationStats()

  const handleLocationSelect = (review: Review) => {
    setSelectedReview(review)
  }

  // Obter lugares próximos (simulado baseado nas avaliações)
  const nearbyPlaces = reviews
    .filter(r => r.coordinates && r.city === 'São Paulo')
    .slice(0, 3)
    .map(review => ({
      name: review.location.split(' - ')[0],
      distance: `${(Math.random() * 3 + 0.5).toFixed(1)}km`,
      rating: review.rating,
      category: review.category
    }))

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
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-yellow-400/20 to-red-500/20 rounded-full animate-pulse-slow"></div>
      </div>

      <Navigation isLoggedIn={isLoggedIn} />
      
      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 p-3 rounded-full card-iridescent mb-6">
              <MapPin className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">Mapa Interativo</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore destinos seguros, encontre pontos de interesse e navegue com confiança
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <Card className="card-iridescent">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input 
                      placeholder="Buscar por cidade, bairro ou ponto de interesse..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4" />
                    Filtros
                  </Button>
                  <Button className="btn-hero flex items-center gap-2">
                    <NavigationIcon className="w-4 h-4" />
                    Minha Localização
                  </Button>
                </div>
                
                {showFilters && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button 
                      variant={selectedCategory === 'all' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedCategory('all')}
                    >
                      Todos
                    </Button>
                    <Button 
                      variant={selectedCategory === 'hotel' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedCategory('hotel')}
                    >
                      Hotéis
                    </Button>
                    <Button 
                      variant={selectedCategory === 'pousada' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedCategory('pousada')}
                    >
                      Pousadas
                    </Button>
                    <Button 
                      variant={selectedCategory === 'resort' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedCategory('resort')}
                    >
                      Resorts
                    </Button>
                    <Button 
                      variant={selectedCategory === 'camping' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedCategory('camping')}
                    >
                      Camping
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Map Area */}
            <div className="lg:col-span-2">
              <Card className="card-iridescent h-[400px] sm:h-[500px] lg:h-[600px]">
                <CardContent className="p-4 sm:p-6 h-full">
                  <GoogleMapComponent 
                    reviews={filteredReviews} 
                    onLocationSelect={handleLocationSelect}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="card-iridescent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Estatísticas em Tempo Real
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Locais Seguros</span>
                    <span className="font-semibold text-green-600">{stats.totalLocations}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avaliações</span>
                    <span className="font-semibold text-blue-600">{stats.totalReviews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Média Geral</span>
                    <span className="font-semibold text-purple-600">{stats.averageRating}⭐</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Locais Exibidos</span>
                    <span className="font-semibold text-orange-600">{filteredReviews.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Nearby Places */}
              <Card className="card-iridescent">
                <CardHeader>
                  <CardTitle>Lugares Próximos</CardTitle>
                  <CardDescription>Locais seguros baseados nas avaliações</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {nearbyPlaces.map((place, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-700/30">
                      <div>
                        <h4 className="font-medium">{place.name}</h4>
                        <p className="text-sm text-muted-foreground">{place.category} • {place.distance}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{place.rating}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Location Details Dialog */}
              {selectedReview && (
                <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{selectedReview.location}</DialogTitle>
                      <DialogDescription>{selectedReview.address}</DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {selectedReview.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{selectedReview.user}</h4>
                            {selectedReview.verified && (
                              <Badge variant="secondary">Verificado</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < selectedReview.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="ml-2 text-sm font-medium">{selectedReview.rating}/5</span>
                          </div>
                          <h5 className="font-medium mb-2">{selectedReview.title}</h5>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                            {selectedReview.content}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Eye className="w-4 h-4" />
                              {selectedReview.helpful} acharam útil
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MessageSquare className="w-4 h-4" />
                              {selectedReview.replies.length} respostas
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-4 border-t">
                        <Button className="flex-1">
                          <NavigationIcon className="w-4 h-4 mr-2" />
                          Como Chegar
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Todas Avaliações
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Legend */}
              <Card className="card-iridescent">
                <CardHeader>
                  <CardTitle>Legenda</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Muito Seguro</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Moderadamente Seguro</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Atenção Necessária</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Pontos de Interesse</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
