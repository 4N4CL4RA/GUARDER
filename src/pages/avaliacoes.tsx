import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Star, Search, Filter, ThumbsUp, ThumbsDown, MessageSquare, Calendar, MapPin } from 'lucide-react'

export default function AvaliacaoPage() {
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

      <Navigation isLoggedIn={true} />
      
      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 p-3 rounded-full card-iridescent mb-6">
              <Star className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">Avaliações</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compartilhe sua experiência e ajude outros viajantes a escolher destinos seguros
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search and Filters */}
              <Card className="card-iridescent">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input 
                        placeholder="Buscar avaliações por local, hotel ou usuário..." 
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filtros
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button variant="outline" size="sm">Todas</Button>
                    <Button variant="outline" size="sm">5 Estrelas</Button>
                    <Button variant="outline" size="sm">4 Estrelas</Button>
                    <Button variant="outline" size="sm">Recentes</Button>
                    <Button variant="outline" size="sm">Mais Úteis</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              {[
                {
                  user: "Maria Silva",
                  avatar: "MS",
                  rating: 5,
                  location: "Hotel Segurança Premium - Centro, SP",
                  date: "15 de Janeiro, 2024",
                  title: "Experiência excepcional de segurança",
                  content: "Fiquei impressionada com o nível de segurança do hotel. Portaria 24h muito atenciosa, câmeras em todos os corredores e sistema de cartão para acessar os andares. Me senti completamente segura durante toda a estadia.",
                  helpful: 24,
                  replies: 3,
                  verified: true
                },
                {
                  user: "João Santos",
                  avatar: "JS",
                  rating: 4,
                  location: "Pousada Vila Tranquila - Jardins, SP",
                  date: "10 de Janeiro, 2024",
                  title: "Bom custo-benefício para segurança",
                  content: "Local muito tranquilo e seguro. A pousada fica em uma rua residencial calma. Único ponto negativo foi o Wi-Fi um pouco instável, mas a segurança compensou completamente.",
                  helpful: 18,
                  replies: 1,
                  verified: true
                },
                {
                  user: "Ana Costa",
                  avatar: "AC",
                  rating: 5,
                  location: "Resort Guarder Valley - Campos do Jordão",
                  date: "8 de Janeiro, 2024",
                  title: "Resort perfeito para famílias",
                  content: "Levei minha família e todos se sentiram muito seguros. O resort tem segurança 24h, área infantil monitorada e todos os funcionários são muito atenciosos. Recomendo para quem viaja com crianças.",
                  helpful: 31,
                  replies: 5,
                  verified: true
                }
              ].map((review, index) => (
                <Card key={index} className="card-iridescent">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                        <AvatarImage src="" alt={review.user} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                          {review.avatar}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-sm sm:text-base">{review.user}</h4>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  Verificado
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{review.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {review.date}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">{review.title}</h5>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {review.content}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-xs">Útil ({review.helpful})</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-xs">{review.replies} respostas</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Load More */}
              <div className="text-center">
                <Button variant="outline" className="w-full max-w-sm">
                  Carregar Mais Avaliações
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Write Review */}
              <Card className="card-iridescent">
                <CardHeader>
                  <CardTitle>Escrever Avaliação</CardTitle>
                  <CardDescription>Compartilhe sua experiência</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Local ou estabelecimento" />
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Avaliação</label>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-6 h-6 text-gray-300 hover:text-yellow-500 cursor-pointer" 
                        />
                      ))}
                    </div>
                  </div>

                  <Input placeholder="Título da avaliação" />
                  
                  <Textarea 
                    placeholder="Descreva sua experiência de segurança..."
                    className="min-h-[100px]"
                  />
                  
                  <Button className="w-full btn-hero">
                    Publicar Avaliação
                  </Button>
                </CardContent>
              </Card>

              {/* Rating Overview */}
              <Card className="card-iridescent">
                <CardHeader>
                  <CardTitle>Visão Geral das Avaliações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">4.7</div>
                    <div className="flex justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < 4 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">Baseado em 1,847 avaliações</div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { stars: 5, count: 1245, percentage: 67 },
                      { stars: 4, count: 421, percentage: 23 },
                      { stars: 3, count: 134, percentage: 7 },
                      { stars: 2, count: 32, percentage: 2 },
                      { stars: 1, count: 15, percentage: 1 },
                    ].map((item) => (
                      <div key={item.stars} className="flex items-center gap-2 text-sm">
                        <span className="w-2">{item.stars}</span>
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded">
                          <div 
                            className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-muted-foreground w-8">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Contributors */}
              <Card className="card-iridescent">
                <CardHeader>
                  <CardTitle>Principais Colaboradores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Carlos Lima", reviews: 47, helpful: 234 },
                    { name: "Fernanda Oliveira", reviews: 32, helpful: 189 },
                    { name: "Roberto Silva", reviews: 28, helpful: 156 },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.reviews} avaliações</div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {user.helpful} úteis
                      </Badge>
                    </div>
                  ))}
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
