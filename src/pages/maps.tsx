import { useState, useEffect, useCallback } from "react";
import Navigation from "../components/Navigation";
import FreeMapComponent from "../components/Mapa";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useAuth } from "../hooks/useAuth";
import { useReviews } from "../hooks/useReviews";
import { useToast } from "../hooks/use-toast";
import { Target, Search, Navigation as NavigationIcon, Route, Clock, MapPin, Star, X, Plus, Shield } from "lucide-react";
import type { Review } from "../types/reviews";

interface LatLng {
  lat: number;
  lng: number;
}

interface SearchSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
  address?: {
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  type?: string;
  class?: string;
}

export default function MapaPage() {
  const { isLoggedIn, loading, user } = useAuth();
  const { reviews, addReview } = useReviews();
  const { toast } = useToast();

  // Usar reviews do banco de dados
  const allReviews = reviews;

  // Estados básicos
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<LatLng | null>({ lat: -19.757750, lng: -47.964230 });
  const [selectedDestination, setSelectedDestination] = useState<LatLng | null>(null);
  const [forceRecenter, setForceRecenter] = useState(0);
  
  // Estados para sugestões
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Estados para rota
  const [routeInfo, setRouteInfo] = useState<{distance: string, duration: string} | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<Array<[number, number]>>([]);
  
  // Estados para avaliação
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    location: '',
    content: '',
    coordinates: null as LatLng | null
  });
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);

  // Função para centralizar na localização atual (FIXA)
  const getCurrentLocation = useCallback(() => {
    console.log('🎯 Botão Minha Localização clicado');
    
    // Usar localização fixa
    const location = {
      lat: -19.757750,
      lng: -47.964230
    };
    
    console.log('📍 Usando localização fixa:', location);
    
    setUserLocation(location);
    setForceRecenter(prev => {
      const newValue = prev + 1;
      console.log('🔄 Forçando recentralização, contador:', newValue);
      return newValue;
    });
    
    toast({
      title: "📍 Localização definida!",
      description: "Uberaba, MG - Sua localização",
    });
  }, [toast]);

  // Buscar sugestões usando Nominatim
  const fetchSuggestions = useCallback(async (query: string) => {
    console.log('🔍 Buscando por:', query);
    
    if (query.length < 3) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // Usar URL mais simples para teste
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=br`;
      console.log('🔍 URL da busca:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('🔍 Erro HTTP:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🔍 Resposta da API:', data);
      console.log('🔍 Número de resultados:', data?.length || 0);
      
      if (data && Array.isArray(data) && data.length > 0) {
        // Usar resultados diretamente sem filtros complexos por enquanto
        const results = data.slice(0, 5);
        console.log('🔍 Resultados finais:', results);
        
        setSearchSuggestions(results);
        setShowSuggestions(true);
      } else {
        console.log('🔍 Nenhum resultado encontrado ou array vazio');
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('🔍 Erro ao buscar sugestões:', error);
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  // Calcular rota usando OSRM
  const calculateRoute = useCallback(async (destination: LatLng) => {
    if (!userLocation) {
      toast({
        title: "❌ Localização necessária",
        description: "Ative sua localização para calcular a rota.",
        variant: "destructive"
      });
      return;
    }

    console.log('🗺️ Calculando rota...');
    console.log('📍 Origem:', userLocation);
    console.log('🎯 Destino:', destination);
    
    setIsCalculatingRoute(true);
    
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
      console.log('🔗 URL da rota:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('📦 Resposta OSRM:', data);
      
      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        const distance = (route.distance / 1000).toFixed(1) + ' km';
        const duration = Math.round(route.duration / 60) + ' min';
        
        console.log('✅ Rota encontrada:', { distance, duration });
        
        // Obter coordenadas da rota para desenhar no mapa
        if (route.geometry && route.geometry.coordinates) {
          const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number]);
          console.log('🛣️ Coordenadas da rota:', coordinates.length, 'pontos');
          console.log('🛣️ Primeiros 5 pontos:', coordinates.slice(0, 5));
          setRouteCoordinates(coordinates);
        }
        
        setRouteInfo({ distance, duration });
        
        toast({
          title: "🗺️ Rota calculada!",
          description: `${distance} • ${duration}`,
        });
      } else {
        console.error('❌ Nenhuma rota encontrada na resposta');
        toast({
          title: "⚠️ Rota não encontrada",
          description: "Não foi possível encontrar uma rota para este destino.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Erro ao calcular rota:', error);
      toast({
        title: "⚠️ Erro na rota",
        description: "Não foi possível calcular a rota.",
        variant: "destructive"
      });
    } finally {
      setIsCalculatingRoute(false);
    }
  }, [userLocation, toast]);

  // Debounce para busca automática
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchSuggestions(searchQuery);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, fetchSuggestions]);

  // Recalcular rota automaticamente quando userLocation ou selectedDestination mudar
  useEffect(() => {
    if (userLocation && selectedDestination && !isCalculatingRoute) {
      console.log('🔄 Recalculando rota automaticamente...');
      console.log('📍 userLocation:', userLocation);
      console.log('🎯 selectedDestination:', selectedDestination);
      calculateRoute(selectedDestination);
    }
  }, [userLocation, selectedDestination]);

  // Selecionar uma sugestão
  const selectSuggestion = useCallback((suggestion: SearchSuggestion) => {
    console.log('=== SELECIONOU SUGESTÃO ===');
    console.log('suggestion:', suggestion);
    console.log('display_name:', suggestion.display_name);
    console.log('lat:', suggestion.lat, 'lon:', suggestion.lon);
    
    const coordinates = {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    };
    
    setSelectedDestination(coordinates);
    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);
    
    toast({
      title: "📍 Local selecionado!",
      description: suggestion.display_name.split(',')[0],
    });
    
    // Calcular rota automaticamente se houver localização
    if (userLocation) {
      console.log('✅ Tem localização do usuário, calculando rota...');
      calculateRoute(coordinates);
    } else {
      console.warn('⚠️ Sem localização do usuário, tentando obter...');
      toast({
        title: "⏳ Aguarde...",
        description: "Obtendo sua localização para calcular a rota",
      });
      // Tentar obter localização e depois calcular rota
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          calculateRoute(coordinates);
        },
        (error) => {
          console.error('❌ Erro ao obter localização:', error);
          toast({
            title: "⚠️ Erro",
            description: "Clique em 'Minha Localização' primeiro",
            variant: "destructive"
          });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [toast, calculateRoute, userLocation]);

  // Handler para seleção no mapa
  const handleLocationSelect = (coordinates: LatLng, address: string) => {
    console.log('🗺️ Local selecionado no mapa:', { coordinates, address });
    
    setReviewForm({
      ...reviewForm,
      location: address,
      coordinates: coordinates
    });
    setShowReviewModal(true);
    
    console.log('✅ Modal de review aberto');
  };

  // Limpar rota
  const clearRoute = useCallback(() => {
    setSelectedDestination(null);
    setRouteInfo(null);
    setRouteCoordinates([]);
    setSearchQuery("");
    setShowSuggestions(false);
    setSearchSuggestions([]);
    
    toast({
      title: "🧹 Rota limpa!",
      description: "A rota foi removida do mapa.",
    });
  }, [toast]);

  // Submeter avaliação
  const submitReview = async () => {
    console.log('📝 submitReview chamado', { user, reviewForm });
    
    if (!user || !reviewForm.content.trim() || !reviewForm.location.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newReview: Review = {
        id: Date.now(),
        user: `${user.nome} ${user.sobrenome}`,
        avatar: `${user.nome[0]}${user.sobrenome[0]}`,
        rating: reviewForm.rating,
        location: reviewForm.location,
        date: new Date().toISOString(),
        title: `Avaliação em ${reviewForm.location}`,
        content: reviewForm.content,
        helpful: 0,
        hasUserLiked: false,
        hasUserDisliked: false,
        replies: [],
        verified: false,
        category: "security",
        coordinates: reviewForm.coordinates || undefined
      };

      console.log('➕ Adicionando review:', newReview);
      addReview(newReview);
      
      setShowReviewModal(false);
      setReviewForm({ rating: 5, location: '', content: '', coordinates: null });
      
      toast({
        title: "✅ Avaliação enviada!",
        description: "Sua avaliação foi adicionada ao mapa.",
      });
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a avaliação.",
        variant: "destructive"
      });
    }
  };

  // Criar áreas de segurança baseadas nas avaliações
  const safetyAreas = allReviews
    .filter(review => review.coordinates && review.category === 'security')
    .reduce((acc, review) => {
      if (!review.coordinates) return acc;
      
      const key = `${review.coordinates.lat.toFixed(3)}-${review.coordinates.lng.toFixed(3)}`;
      const existing = acc.find(area => area.key === key);
      
      if (existing) {
        existing.ratings.push(review.rating);
        existing.count++;
      } else {
        acc.push({
          key,
          coordinates: review.coordinates,
          location: review.location,
          ratings: [review.rating],
          count: 1
        });
      }
      
      return acc;
    }, [] as Array<{
      key: string;
      coordinates: { lat: number; lng: number };
      location: string;
      ratings: number[];
      count: number;
    }>)
    .map(area => ({
      coordinates: area.coordinates,
      location: area.location,
      rating: area.ratings.reduce((sum, r) => sum + r, 0) / area.ratings.length
    }));

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
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900" />

      <Navigation isLoggedIn={isLoggedIn} />

      <main className="pt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold gradient-text mb-2">🆓 Mapa Interativo Gratuito</h1>
            <p className="text-muted-foreground">
              Explore locais, avalie segurança e encontre rotas - 100% gratuito
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <NavigationIcon className="w-4 h-4" />
                    Navegação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={getCurrentLocation}
                  >
                    <Target className="w-4 h-4" />
                    Minha Localização
                  </Button>
                  
                  {/* Campo de busca com sugestões */}
                  <div className="space-y-2 relative">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          placeholder="Ex: Rua das Flores, 123 - Centro, São Paulo"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (!e.target.value.trim()) {
                              setShowSuggestions(false);
                            }
                          }}
                          onFocus={() => {
                            if (searchQuery.length >= 3) {
                              setShowSuggestions(true);
                            }
                          }}
                        />
                        
                        {/* Botão X para limpar busca */}
                        {searchQuery && (
                          <button
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            onClick={() => {
                              setSearchQuery("");
                              setShowSuggestions(false);
                              setSearchSuggestions([]);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        
                        {/* Dropdown de sugestões */}
                        {showSuggestions && searchSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                            {searchSuggestions.map((suggestion, index) => (
                              <button
                                key={suggestion.place_id || index}
                                className="w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left text-sm border-b last:border-b-0 focus:outline-none focus:bg-gray-100"
                                onClick={() => selectSuggestion(suggestion)}
                                onMouseDown={(e) => e.preventDefault()}
                              >
                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                  {suggestion.display_name.split(',')[0]}
                                </div>
                                <div className="text-gray-500 dark:text-gray-400 text-xs truncate">
                                  {suggestion.display_name}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button size="sm">
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Botão de limpar rota quando há destino selecionado */}
                    {selectedDestination && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={clearRoute}
                      >
                        <X className="w-4 h-4" />
                        Limpar Rota e Destino
                      </Button>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      💡 Digite pelo menos 3 caracteres para ver sugestões
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Informações da Rota */}
              {(routeInfo || isCalculatingRoute) && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Route className="w-4 h-4" />
                      Rota Calculada
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {isCalculatingRoute ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                        <span className="text-sm text-muted-foreground">Calculando rota...</span>
                      </div>
                    ) : routeInfo && (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Distância:</span>
                            </div>
                            <span className="font-medium">{routeInfo.distance}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Tempo:</span>
                            </div>
                            <span className="font-medium">{routeInfo.duration}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1"
                            onClick={() => selectedDestination && calculateRoute(selectedDestination)}
                          >
                            🔄 Recalcular
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            className="flex-1"
                            onClick={clearRoute}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Limpar
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Mapa */}
            <div className="lg:col-span-3">
              <Card className="h-[70vh] min-h-[500px] relative z-0">
                <CardContent className="p-0 h-full relative">
                  <FreeMapComponent 
                    reviews={allReviews.filter(r => r.coordinates)}
                    onLocationSelect={handleLocationSelect}
                    userLocation={userLocation}
                    selectedDestination={selectedDestination}
                    routeCoordinates={routeCoordinates}
                    safetyAreas={safetyAreas}
                    centerOnUserLocation={true}
                    forceRecenter={forceRecenter}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Nova Avaliação */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Nova Avaliação de Segurança
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Local</label>
              <Input
                value={reviewForm.location}
                onChange={(e) => setReviewForm({...reviewForm, location: e.target.value})}
                placeholder="Nome do local ou endereço"
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Avaliação de Segurança</label>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewForm({...reviewForm, rating: star})}
                    className={`w-8 h-8 ${
                      star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  >
                    <Star className="w-full h-full fill-current" />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {reviewForm.rating === 1 ? 'Muito Inseguro' :
                   reviewForm.rating === 2 ? 'Inseguro' :
                   reviewForm.rating === 3 ? 'Moderado' :
                   reviewForm.rating === 4 ? 'Seguro' : 'Muito Seguro'}
                </span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Comentário</label>
              <textarea
                value={reviewForm.content}
                onChange={(e) => setReviewForm({...reviewForm, content: e.target.value})}
                placeholder="Descreva sua experiência de segurança neste local..."
                className="mt-1 w-full min-h-[80px] px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowReviewModal(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1"
                onClick={submitReview}
              >
                Publicar Avaliação
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Avaliações do Local */}
      <Dialog open={showEvaluationModal} onOpenChange={setShowEvaluationModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Avaliações de Segurança do Local
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {(() => {
              const locationReviews = allReviews.filter(r => 
                r.category === 'security'
              );

              if (locationReviews.length === 0) {
                return (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Ainda não há avaliações de segurança para este local.</p>
                    <p className="text-sm text-gray-400 mt-2">Seja o primeiro a avaliar!</p>
                  </div>
                );
              }

              const avgRating = locationReviews.reduce((sum, r) => sum + r.rating, 0) / locationReviews.length;

              return (
                <>
                  {/* Resumo da Segurança */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Nível de Segurança</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${
                              star <= avgRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`} 
                          />
                        ))}
                        <span className="ml-2 font-bold">
                          {avgRating.toFixed(1)} ({locationReviews.length} avaliações)
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {avgRating >= 4 ? '🟢 Local Seguro' : 
                       avgRating >= 3 ? '🟡 Segurança Moderada' : 
                       avgRating >= 2 ? '🟠 Local Inseguro' : '🔴 Local Perigoso'}
                    </div>
                  </div>

                  {/* Lista de Avaliações */}
                  <div className="space-y-3">
                    {locationReviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {review.avatar || review.user[0]}
                            </div>
                            <div>
                              <div className="font-medium">{review.user}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(review.date).toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-4 h-4 ${
                                  star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                        {review.content && (
                          <p className="text-gray-700 text-sm">{review.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Nova Avaliação */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Nova Avaliação de Segurança
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Local</label>
              <Input
                value={reviewForm.location}
                onChange={(e) => setReviewForm({...reviewForm, location: e.target.value})}
                placeholder="Nome do local ou endereço"
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Avaliação de Segurança</label>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewForm({...reviewForm, rating: star})}
                    className={`w-8 h-8 ${
                      star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  >
                    <Star className="w-full h-full fill-current" />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {reviewForm.rating === 1 ? 'Muito Inseguro' :
                   reviewForm.rating === 2 ? 'Inseguro' :
                   reviewForm.rating === 3 ? 'Moderado' :
                   reviewForm.rating === 4 ? 'Seguro' : 'Muito Seguro'}
                </span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Comentário</label>
              <textarea
                value={reviewForm.content}
                onChange={(e) => setReviewForm({...reviewForm, content: e.target.value})}
                placeholder="Descreva sua experiência sobre a segurança deste local..."
                className="mt-1 w-full min-h-[100px] p-2 border rounded-md resize-none"
              />
            </div>

            {reviewForm.coordinates && (
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                📍 Coordenadas: {reviewForm.coordinates.lat.toFixed(6)}, {reviewForm.coordinates.lng.toFixed(6)}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewForm({ rating: 5, location: '', content: '', coordinates: null });
                }}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1"
                onClick={submitReview}
              >
                Enviar Avaliação
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}