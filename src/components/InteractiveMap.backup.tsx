import mapboxgl from "mapbox-gl"
import { useEffect, useRef, useState } from "react"
import { ReviewService } from "../services/reviewService"
import { ReviewForm } from "./ReviewForm"
import { ReviewList } from "./ReviewList"
import type { Review, GeoLocation } from "../types/review"
import { RATING_COLORS } from "../types/review"

mapboxgl.accessToken = "pk.eyJ1IjoiYW5hYWNsYXIiLCJhIjoiY21mcmllYjEzMDlvZDJrcHpmZ3Z2MzcyZCJ9.gG9u9uBioEFzqNVYG3jqOw" // seu token

interface InteractiveMapProps {
  reviews: Review[]
  onLocationSelect?: (review: Review) => void
}

// GeoJSON com pontos de exemplo
const geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-77.032, 38.913]
      },
      properties: {
        title: 'Mapbox',
        description: 'Washington, D.C.'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-122.414, 37.776]
      },
      properties: {
        title: 'Mapbox',
        description: 'San Francisco, California'
      }
    }
  ]
};

export default function InteractiveMap({ reviews, onLocationSelect }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  // Adicionar estilos CSS para os marcadores
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .marker {
        background-image: url('https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png');
        background-size: cover;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
      }

      .mapboxgl-popup {
        max-width: 200px;
      }

      .mapboxgl-popup-content {
        text-align: center;
        font-family: 'Open Sans', sans-serif;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // ---------- Inicializa o mapa ----------
  useEffect(() => {
    if (mapRef.current) return // evita reinicializar

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/light-v11", // Usando estilo do seu exemplo
      center: [-46.6333, -23.5505], // São Paulo
      zoom: 10, // Zoom ajustado para melhor visualização
      projection: "globe" // Projeção globe como no exemplo
    })

    mapRef.current.addControl(new mapboxgl.NavigationControl())

    // Log para debug
    mapRef.current.on('load', () => {
      console.log('✅ Mapa carregado com sucesso!')
      
      // add markers to map
      for (const feature of geojson.features) {
        
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
          .setLngLat(feature.geometry.coordinates as [number, number])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
              .setHTML(
                `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
              )
          )
          .addTo(mapRef.current!);

         //code from step 8 will go here
      }
    })
  }, [])

  // ---------- Busca áreas de risco do backend ----------
  useEffect(() => {
    if (!mapRef.current) return

    async function fetchAreas() {
      try {
        const res = await fetch("/api/areas-risco") // sua rota no backend
        const data = await res.json() // deve retornar um GeoJSON válido

        if (mapRef.current!.getSource("areas-risco")) {
          // Se já existe, só atualiza
          const source = mapRef.current!.getSource("areas-risco") as mapboxgl.GeoJSONSource
          source.setData(data)
        } else {
          // Se não existe, cria
          mapRef.current!.addSource("areas-risco", {
            type: "geojson",
            data
          })

          mapRef.current!.addLayer({
            id: "areas-risco-layer",
            type: "fill",
            source: "areas-risco",
            paint: {
              "fill-color": [
                "interpolate",
                ["linear"],
                ["get", "risco"],
                0, "green",
                5, "yellow",
                10, "red"
              ],
              "fill-opacity": 0.4
            }
          })

          mapRef.current!.addLayer({
            id: "areas-risco-borda",
            type: "line",
            source: "areas-risco",
            paint: {
              "line-color": "black",
              "line-width": 1
            }
          })
        }
      } catch (err) {
        console.error("Erro ao carregar áreas de risco:", err)
      }
    }

    fetchAreas()

    // opcional: recarregar a cada 60s
    const interval = setInterval(fetchAreas, 60000)
    return () => clearInterval(interval)
  }, [])

  // ---------- Renderiza os marcadores ----------
  useEffect(() => {
    if (!mapRef.current) return

    // Remove marcadores antigos
    document.querySelectorAll(".custom-marker").forEach(m => m.remove())

    // Adiciona novos marcadores com base nos reviews
    reviews.forEach(review => {
      if (!review.coordinates) return

      // Cria elemento customizado para o marcador
      const el = document.createElement("div")
      el.className = "custom-marker"
      el.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: ${review.rating >= 4 ? "#10B981" : review.rating >= 3 ? "#F59E0B" : "#EF4444"};
        border: 2px solid white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `
      el.innerHTML = review.rating.toString()

      el.addEventListener("click", () => {
        onLocationSelect?.(review)
      })

      // Popup melhorado
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px;">
          <b>${review.location}</b><br/>
          <div style="margin: 4px 0;">
            ${"⭐".repeat(Math.floor(review.rating))} ${review.rating}
          </div>
          <small style="color: #666;">${review.address || 'Endereço não informado'}</small>
        </div>
      `)

      new mapboxgl.Marker(el)
        .setLngLat([review.coordinates.lng, review.coordinates.lat])
        .setPopup(popup)
        .addTo(mapRef.current!)
    })
  }, [reviews, onLocationSelect])

  return <div ref={mapContainer} className="w-full h-full rounded-lg" />
}
