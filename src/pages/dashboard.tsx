import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { 
  Shield, 
  MapPin, 
  Building, 
  Star, 
  Activity, 
  Clock, 
  Users, 
  AlertTriangle,
  TrendingUp,
  Navigation as NavigationIcon
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function DashboardPage() {
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
          <p>Carregando dashboard...</p>
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
        <div className="absolute top-20 left-4 sm:left-10 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-40 right-4 sm:right-20 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-yellow-400/20 to-red-500/20 rounded-full animate-pulse-slow"></div>
      </div>

      <Navigation isLoggedIn={isLoggedIn} />
      
      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 p-3 rounded-full card-iridescent mb-6">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">Dashboard GUARDER</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Bem-vindo de volta! Aqui está um resumo das suas atividades e estatísticas de segurança.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="card-iridescent">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Viagens Registradas</p>
                    <p className="text-3xl font-bold text-primary">24</p>
                  </div>
                  <MapPin className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+12% este mês</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-iridescent">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Locais Favoritos</p>
                    <p className="text-3xl font-bold text-primary">12</p>
                  </div>
                  <Building className="w-8 h-8 text-purple-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-muted-foreground">Média 4.8 estrelas</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-iridescent">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tempo Ativo</p>
                    <p className="text-3xl font-bold text-primary">156h</p>
                  </div>
                  <Clock className="w-8 h-8 text-green-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <Activity className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-muted-foreground">Esta semana</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-iridescent">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Nível de Segurança</p>
                    <p className="text-3xl font-bold text-green-600">Alto</p>
                  </div>
                  <Shield className="w-8 h-8 text-green-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-green-600">98% seguro</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <Card className="card-iridescent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <NavigationIcon className="w-5 h-5" />
                    Ações Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button className="btn-hero h-16 sm:h-20 flex-col gap-2 text-sm sm:text-base" asChild>
                      <a href="/mapa">
                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-xs sm:text-sm">Explorar Mapa</span>
                      </a>
                    </Button>
                    <Button className="btn-hero h-16 sm:h-20 flex-col gap-2 text-sm sm:text-base" asChild>
                      <a href="/hoteis">
                        <Building className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-xs sm:text-sm">Buscar Hotéis</span>
                      </a>
                    </Button>
                    <Button className="btn-hero h-16 sm:h-20 flex-col gap-2 text-sm sm:text-base" asChild>
                      <a href="/avaliacoes">
                        <Star className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-xs sm:text-sm">Ver Avaliações</span>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="card-iridescent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Atividades Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: "Nova avaliação adicionada",
                        location: "Hotel Premium São Paulo",
                        time: "2 horas atrás",
                        icon: Star,
                        color: "text-yellow-500"
                      },
                      {
                        action: "Viagem registrada",
                        location: "Vila Olímpia → Jardins",
                        time: "1 dia atrás",
                        icon: MapPin,
                        color: "text-blue-500"
                      },
                      {
                        action: "Local favoritado",
                        location: "Restaurante Vila Madalena",
                        time: "3 dias atrás",
                        icon: Building,
                        color: "text-purple-500"
                      }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-700/30">
                        <activity.icon className={`w-5 h-5 ${activity.color}`} />
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.location}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Emergency Center */}
              <Card className="card-iridescent border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    Central de Emergência
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    🚨 SOS - Emergência
                  </Button>
                  <div className="space-y-2 text-sm">
                    <p><strong>Polícia:</strong> 190</p>
                    <p><strong>SAMU:</strong> 192</p>
                    <p><strong>Bombeiros:</strong> 193</p>
                  </div>
                </CardContent>
              </Card>

              {/* Weather Widget */}
              <Card className="card-iridescent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Condições Atuais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl mb-2">☀️</div>
                    <p className="text-2xl font-bold">24°C</p>
                    <p className="text-sm text-muted-foreground">Ensolarado em São Paulo</p>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Visibilidade:</span>
                        <span className="text-green-600">Boa</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trânsito:</span>
                        <span className="text-yellow-600">Moderado</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community Stats */}
              <Card className="card-iridescent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Comunidade
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Usuários Online</span>
                    <span className="font-semibold text-green-600">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avaliações Hoje</span>
                    <span className="font-semibold text-blue-600">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Locais Seguros</span>
                    <span className="font-semibold text-purple-600">8,432</span>
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
