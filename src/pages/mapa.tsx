import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { MapPin, Search, Filter, Navigation as NavigationIcon, Star } from 'lucide-react'

export default function MapaPage() {
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

      <Navigation isLoggedIn={true} />
      
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
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filtros
                  </Button>
                  <Button className="btn-hero flex items-center gap-2">
                    <NavigationIcon className="w-4 h-4" />
                    Minha Localização
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Map Area */}
            <div className="lg:col-span-2">
              <Card className="card-iridescent h-[400px] sm:h-[500px] lg:h-[600px]">
                <CardContent className="p-4 sm:p-6 h-full">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">Mapa Interativo</h3>
                      <p className="text-sm sm:text-base text-muted-foreground px-4">
                        Aqui será exibido o mapa interativo com localizações seguras
                      </p>
                    </div>
                  </div>
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
                    Estatísticas Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Locais Seguros</span>
                    <span className="font-semibold text-green-600">847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avaliações</span>
                    <span className="font-semibold text-blue-600">2,341</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Usuários Ativos</span>
                    <span className="font-semibold text-purple-600">156</span>
                  </div>
                </CardContent>
              </Card>

              {/* Nearby Places */}
              <Card className="card-iridescent">
                <CardHeader>
                  <CardTitle>Lugares Próximos</CardTitle>
                  <CardDescription>Locais seguros na sua região</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Shopping Center Norte", distance: "850m", rating: 4.8, category: "Shopping" },
                    { name: "Parque da Juventude", distance: "1.2km", rating: 4.6, category: "Parque" },
                    { name: "Hospital São Camilo", distance: "2.1km", rating: 4.9, category: "Hospital" },
                  ].map((place, index) => (
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
