import mapboxgl from "mapbox-gl"
import { useEffect, useRef, useState } from "react"
import { ReviewService } from "../services/reviewService"
import { ReviewForm } from "./ReviewForm"
import { ReviewList } from "./ReviewList"
import type { Review, GeoLocation } from "../types/review"
import { RATING_COLORS } from "../types/review"

mapboxgl.accessToken = "pk.eyJ1IjoiYW5hYWNsYXIiLCJhIjoiY21mc3c4ZXlnMGgzdTJrb2Z0dHJrOTN6MCJ9.cv9VaCOT0_Lg555qIClYVQ"

interface InteractiveMapProps {
  className?: string
}

export default function InteractiveMap({ className = "" }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedLocation, setSelectedLocation] = useState<GeoLocation | null>(null)
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false)
  const [showReviewList, setShowReviewList] = useState<boolean>(false)

  // ---------- Inicializar mapa ----------
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-46.6333, -23.5505], // São Paulo
      zoom: 10,
      projection: "globe"
    })

    mapRef.current.addControl(new mapboxgl.NavigationControl())

    // Evento de clique para adicionar review
    mapRef.current.on('click', (e) => {
      const { lng, lat } = e.lngLat
      setSelectedLocation({ lat, lng })
      setShowReviewForm(true)
      setShowReviewList(false)
    })

    mapRef.current.on('load', () => {
      console.log('✅ Mapa carregado com sucesso!')
      loadReviews()
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // ---------- Carregar reviews ----------
  const loadReviews = async () => {
    try {
      const data = await ReviewService.getAllReviews()
      setReviews(data)
      console.log(`📍 ${data.length} reviews carregados`)
    } catch (error) {
      console.error('Erro ao carregar reviews:', error)
    }
  }

  // ---------- Renderizar marcadores ----------
  useEffect(() => {
    if (!mapRef.current) return

    // Remover marcadores existentes
    document.querySelectorAll('.review-marker').forEach(marker => marker.remove())

    reviews.forEach(review => {
      // Criar elemento do marcador
      const el = document.createElement('div')
      el.className = 'review-marker'
      el.style.cssText = `
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: ${RATING_COLORS[review.rating as keyof typeof RATING_COLORS]};
        border: 2px solid white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 10px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        transition: transform 0.2s;
      `
      el.textContent = review.rating.toString()

      // Hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)'
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)'
      })

      // Click para mostrar detalhes
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        setSelectedLocation({ lat: review.lat, lng: review.lng })
        setShowReviewList(true)
        setShowReviewForm(false)
      })

      // Popup com informações do review
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(`
        <div class="p-2 min-w-[200px]">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-lg">${'⭐'.repeat(review.rating)}</span>
            <span class="text-sm font-medium" style="color: ${RATING_COLORS[review.rating as keyof typeof RATING_COLORS]}">
              ${review.rating}/5
            </span>
          </div>
          ${review.comment ? `<p class="text-sm text-gray-700 mb-2">${review.comment}</p>` : ''}
          <div class="text-xs text-gray-500">
            ${review.created_at ? new Date(review.created_at).toLocaleDateString('pt-BR') : ''}
          </div>
        </div>
      `)

      // Criar marcador
      new mapboxgl.Marker(el)
        .setLngLat([review.lng, review.lat])
        .setPopup(popup)
        .addTo(mapRef.current!)
    })
  }, [reviews])

  // Handler para quando review é adicionado
  const handleReviewAdded = (success: boolean) => {
    if (success) {
      setShowReviewForm(false)
      loadReviews() // Recarregar reviews
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Mapa */}
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {/* Instruções */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md shadow-md text-sm text-gray-700 max-w-xs">
        <p>🖱️ Clique no mapa para avaliar um local</p>
        <p>📍 Clique nos marcadores para ver avaliações</p>
      </div>

      {/* Painel de estatísticas */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md shadow-md text-sm">
        <div className="text-center">
          <p className="font-medium text-gray-800">{reviews.length} Avaliações</p>
          <button 
            onClick={() => {
              setShowReviewList(!showReviewList)
              setShowReviewForm(false)
              setSelectedLocation(null)
            }}
            className="text-blue-600 hover:text-blue-800 text-xs mt-1"
          >
            {showReviewList ? 'Ocultar' : 'Ver todas'}
          </button>
        </div>
      </div>

      {/* Formulário de Review */}
      {showReviewForm && selectedLocation && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
          <ReviewForm
            location={selectedLocation}
            onReviewAdded={handleReviewAdded}
            onCancel={() => {
              setShowReviewForm(false)
              setSelectedLocation(null)
            }}
          />
        </div>
      )}

      {/* Lista de Reviews */}
      {showReviewList && (
        <div className="absolute top-0 right-0 w-80 h-full bg-white/95 backdrop-blur-sm shadow-lg p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Avaliações</h3>
            <button
              onClick={() => setShowReviewList(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          <ReviewList
            location={selectedLocation || undefined}
            radiusKm={selectedLocation ? 1 : undefined}
            showAll={!selectedLocation}
            maxReviews={20}
          />
        </div>
      )}
    </div>
  )
}