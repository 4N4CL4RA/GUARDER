import { useState, useRef, useEffect } from "react";
import Map, { NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Review } from "../types/reviews";

interface SimpleMapProps {
  reviews: Review[];
  onLocationSelect?: (review: Review) => void;
}

export default function SimpleMap({ reviews }: SimpleMapProps) {
  console.log("🗺️ SimpleMap iniciando com", reviews.length, "reviews");

  const mapRef = useRef(null);

  return (
    <div className="h-full w-full relative">
      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs p-2 rounded z-50">
        Básico sem Globe: Reviews {reviews.length}
      </div>
      
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -46.6333,
          latitude: -23.5505,
          zoom: 12,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken="pk.eyJ1IjoiYW5hYWNsYXIiLCJhIjoiY21mcmllYjEzMDlvZDJrcHpmZ3Z2MzcyZCJ9.gG9u9uBioEFzqNVYG3jqOw"
        // projection={{ name: "globe" }}
        onLoad={(evt) => {
          console.log("✅ SimpleMap carregado - testando estilo padrão!");
          console.log("🔍 Verificando mapa:", evt.target);
          console.log("🎨 Estilo carregado:", evt.target.getStyle());
        }}
        onError={(e) => {
          console.error("❌ Erro SimpleMap:", e);
        }}
      >
        <NavigationControl position="top-right" />
      </Map>
    </div>
  );
}