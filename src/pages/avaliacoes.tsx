import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Star, Search, Filter, ThumbsUp, ThumbsDown, MessageSquare, Calendar, MapPin, Plus, Send } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useReviews } from '../hooks/useReviews'
import { Review, Reply } from '../types/reviews'

export default function AvaliacaoPage() {
  const { user, isLoggedIn, loading } = useAuth()
  const navigate = useNavigate()
  const { reviews, setReviews, addReview, getLocationStats } = useReviews()
  
  // Proteger rota - redirecionar usuários não logados (apenas se não estiver carregando)
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login')
    }
  }, [isLoggedIn, loading, navigate])
  
  // Estados para formulário de nova avaliação
  const [newReview, setNewReview] = useState({
    location: '',
    rating: 0,
    title: '',
    content: '',
    category: ''
  })
  
  // Estados para filtros e busca
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [showFilters, setShowFilters] = useState(false)
  
  // Estados para reviews
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReplyDialog, setShowReplyDialog] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState('')
  
  // Estado para mostrar mais reviews
  const [visibleReviews, setVisibleReviews] = useState(6)

  // Filtrar e buscar reviews
  useEffect(() => {
    const filtered = reviews.filter(review => {
      const matchesSearch = review.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           review.user.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesFilter = selectedFilter === 'all' || 
                           (selectedFilter === '5' && review.rating === 5) ||
                           (selectedFilter === '4' && review.rating === 4) ||
                           (selectedFilter === '3' && review.rating === 3) ||
                           (selectedFilter === 'verified' && review.verified)
      
      return matchesSearch && matchesFilter
    })

    // Ordenar
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else if (sortBy === 'helpful') {
      filtered.sort((a, b) => b.helpful - a.helpful)
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    }

    setFilteredReviews(filtered)
  }, [reviews, searchQuery, selectedFilter, sortBy])

  // Função para dar like/dislike
  const handleLike = (reviewId: number) => {
    if (!isLoggedIn) {
      alert('Você precisa estar logado para avaliar como útil. Clique em "Fazer Login" para continuar.')
      return
    }
    
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        if (review.hasUserLiked) {
          return { ...review, helpful: review.helpful - 1, hasUserLiked: false }
        } else {
          return { 
            ...review, 
            helpful: review.helpful + (review.hasUserDisliked ? 2 : 1), 
            hasUserLiked: true,
            hasUserDisliked: false
          }
        }
      }
      return review
    }))
  }

  const handleDislike = (reviewId: number) => {
    if (!isLoggedIn) {
      alert('Você precisa estar logado para avaliar como não útil. Clique em "Fazer Login" para continuar.')
      return
    }
    
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        if (review.hasUserDisliked) {
          return { ...review, hasUserDisliked: false }
        } else {
          return { 
            ...review, 
            helpful: review.hasUserLiked ? review.helpful - 1 : review.helpful,
            hasUserLiked: false,
            hasUserDisliked: true
          }
        }
      }
      return review
    }))
  }

  // Função para enviar nova avaliação
  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      alert('Você precisa estar logado para enviar uma avaliação')
      return
    }

    if (!newReview.location || !newReview.title || !newReview.content || newReview.rating === 0) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setIsSubmitting(true)

    // Simular envio
    setTimeout(() => {
      const review: Review = {
        id: Date.now(),
        user: user?.name || 'Usuário',
        avatar: user?.name?.split(' ').map(n => n[0]).join('') || 'U',
        rating: newReview.rating,
        location: newReview.location,
        date: new Date().toLocaleDateString('pt-BR', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        title: newReview.title,
        content: newReview.content,
        helpful: 0,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: true,
        category: newReview.category
      }

      addReview(review)
      setNewReview({
        location: '',
        rating: 0,
        title: '',
        content: '',
        category: ''
      })
      setIsSubmitting(false)
      alert('Avaliação enviada com sucesso!')
    }, 1000)
  }

  // Função para enviar resposta
  const handleSubmitReply = (reviewId: number) => {
    if (!isLoggedIn || !replyContent.trim()) return

    const reply: Reply = {
      id: Date.now(),
      user: user?.name || 'Usuário',
      content: replyContent,
      date: new Date().toLocaleDateString('pt-BR'),
      isOwner: true
    }

    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return { ...review, replies: [...review.replies, reply] }
      }
      return review
    }))

    setReplyContent('')
    setShowReplyDialog(null)
  }

  // Calcular estatísticas
  const stats = getLocationStats()
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    stars: rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: Math.round((reviews.filter(r => r.rating === rating).length / reviews.length) * 100)
  }))

  // Se estiver carregando ou não estiver logado, não renderizar o conteúdo
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando avaliações...</p>
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
                  </div>
                  
                  {showFilters && (
                    <div className="mt-4 p-4 border rounded-lg bg-background/50">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Filtrar por avaliação</Label>
                          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todas as avaliações</SelectItem>
                              <SelectItem value="5">5 Estrelas</SelectItem>
                              <SelectItem value="4">4 Estrelas</SelectItem>
                              <SelectItem value="3">3 Estrelas</SelectItem>
                              <SelectItem value="verified">Apenas verificadas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Ordenar por</Label>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="recent">Mais recentes</SelectItem>
                              <SelectItem value="helpful">Mais úteis</SelectItem>
                              <SelectItem value="rating">Maior avaliação</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button 
                      variant={selectedFilter === 'all' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedFilter('all')}
                    >
                      Todas
                    </Button>
                    <Button 
                      variant={selectedFilter === '5' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedFilter('5')}
                    >
                      5 Estrelas
                    </Button>
                    <Button 
                      variant={selectedFilter === '4' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedFilter('4')}
                    >
                      4 Estrelas
                    </Button>
                    <Button 
                      variant={sortBy === 'recent' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSortBy('recent')}
                    >
                      Recentes
                    </Button>
                    <Button 
                      variant={sortBy === 'helpful' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSortBy('helpful')}
                    >
                      Mais Úteis
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              {filteredReviews.slice(0, visibleReviews).map((review) => (
                <Card key={review.id} className="card-iridescent">
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
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`flex items-center gap-1 ${review.hasUserLiked ? 'text-green-600' : ''}`}
                            onClick={() => handleLike(review.id)}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-xs">Útil ({review.helpful})</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`flex items-center gap-1 ${review.hasUserDisliked ? 'text-red-600' : ''}`}
                            onClick={() => handleDislike(review.id)}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                          <Dialog open={showReplyDialog === review.id} onOpenChange={(open) => setShowReplyDialog(open ? review.id : null)}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-1" 
                                onClick={(e) => {
                                  if (!isLoggedIn) {
                                    e.preventDefault()
                                    alert('Você precisa estar logado para responder avaliações. Clique em "Fazer Login" para continuar.')
                                    return
                                  }
                                }}
                              >
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-xs">{review.replies.length} respostas</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Responder Avaliação</DialogTitle>
                                <DialogDescription>
                                  Responda à avaliação de {review.user}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="bg-muted p-3 rounded-lg">
                                  <p className="text-sm">{review.content}</p>
                                </div>
                                <Textarea
                                  placeholder="Escreva sua resposta..."
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                />
                                <Button 
                                  onClick={() => handleSubmitReply(review.id)}
                                  disabled={!replyContent.trim()}
                                  className="w-full"
                                >
                                  <Send className="w-4 h-4 mr-2" />
                                  Enviar Resposta
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        {/* Replies */}
                        {review.replies.length > 0 && (
                          <div className="ml-8 space-y-3 pt-3 border-t">
                            {review.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white text-xs">
                                    {reply.user.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{reply.user}</span>
                                    {reply.isOwner && (
                                      <Badge variant="outline" className="text-xs">Você</Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">{reply.date}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Load More */}
              {visibleReviews < filteredReviews.length && (
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    className="w-full max-w-sm"
                    onClick={() => setVisibleReviews(prev => prev + 6)}
                  >
                    Carregar Mais Avaliações ({filteredReviews.length - visibleReviews} restantes)
                  </Button>
                </div>
              )}

              {filteredReviews.length === 0 && (
                <Card className="card-iridescent">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Nenhuma avaliação encontrada para os filtros selecionados.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Write Review */}
              <Card className="card-iridescent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Escrever Avaliação
                  </CardTitle>
                  <CardDescription>Compartilhe sua experiência</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isLoggedIn ? (
                    <div className="text-center p-4 border rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-2">
                        Você precisa estar logado para escrever uma avaliação
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/login')}
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        Fazer Login
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="location">Local ou estabelecimento *</Label>
                        <Input 
                          id="location"
                          placeholder="Ex: Hotel Segurança Premium - Centro, SP"
                          value={newReview.location}
                          onChange={(e) => setNewReview(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="category">Categoria</Label>
                        <Select 
                          value={newReview.category} 
                          onValueChange={(value) => setNewReview(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hotel">Hotel</SelectItem>
                            <SelectItem value="pousada">Pousada</SelectItem>
                            <SelectItem value="resort">Resort</SelectItem>
                            <SelectItem value="hostel">Hostel</SelectItem>
                            <SelectItem value="camping">Camping</SelectItem>
                            <SelectItem value="apartamento">Apartamento</SelectItem>
                            <SelectItem value="outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Avaliação *</Label>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-6 h-6 cursor-pointer transition-colors ${
                                i < newReview.rating 
                                  ? 'text-yellow-500 fill-current' 
                                  : 'text-gray-300 hover:text-yellow-400'
                              }`}
                              onClick={() => setNewReview(prev => ({ ...prev, rating: i + 1 }))}
                            />
                          ))}
                        </div>
                        {newReview.rating > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {newReview.rating} de 5 estrelas
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="title">Título da avaliação *</Label>
                        <Input 
                          id="title"
                          placeholder="Ex: Experiência excepcional de segurança"
                          value={newReview.title}
                          onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="content">Descrição *</Label>
                        <Textarea 
                          id="content"
                          placeholder="Descreva sua experiência de segurança em detalhes..."
                          className="min-h-[100px]"
                          value={newReview.content}
                          onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                        />
                      </div>
                      
                      <Button 
                        className="w-full btn-hero" 
                        onClick={handleSubmitReview}
                        disabled={isSubmitting || !newReview.location || !newReview.title || !newReview.content || newReview.rating === 0}
                      >
                        {isSubmitting ? 'Publicando...' : 'Publicar Avaliação'}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Rating Overview */}
              <Card className="card-iridescent">
                <CardHeader>
                  <CardTitle>Visão Geral das Avaliações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {stats.averageRating}
                    </div>
                    <div className="flex justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.round(stats.averageRating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Baseado em {stats.totalReviews.toLocaleString()} avaliações
                    </div>
                  </div>

                  <div className="space-y-2">
                    {ratingDistribution.map((item) => (
                      <div key={item.stars} className="flex items-center gap-2 text-sm">
                        <span className="w-2">{item.stars}</span>
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                          <div 
                            className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded transition-all duration-500"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-muted-foreground w-8 text-right">{item.count}</span>
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
                    { name: "Ana Costa", reviews: 25, helpful: 143 },
                    { name: "Maria Silva", reviews: 22, helpful: 128 }
                  ].map((contributor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                              {contributor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {index < 3 && (
                            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              index === 0 ? 'bg-yellow-500' : 
                              index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                            }`}>
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{contributor.name}</div>
                          <div className="text-xs text-muted-foreground">{contributor.reviews} avaliações</div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {contributor.helpful} úteis
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="card-iridescent">
                <CardHeader>
                  <CardTitle>Estatísticas do Mês</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-primary">127</div>
                      <div className="text-xs text-muted-foreground">Novas avaliações</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-primary">4.8</div>
                      <div className="text-xs text-muted-foreground">Média do mês</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-primary">89%</div>
                      <div className="text-xs text-muted-foreground">5 estrelas</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-primary">543</div>
                      <div className="text-xs text-muted-foreground">Interações</div>
                    </div>
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
