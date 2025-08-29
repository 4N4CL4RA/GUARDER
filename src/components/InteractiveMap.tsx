import { useState, useRef, useEffect, useCallback } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
  type MapRef,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Review } from "../types/reviews";
import { Star, Eye, Navigation as NavIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import MAPBOX_CONFIG from "../config/mapbox";

interface InteractiveMapProps {
  reviews: Review[];
  onLocationSelect?: (review: Review) => void;
}

export default function InteractiveMap({
  reviews,
  onLocationSelect,
}: InteractiveMapProps) {
  const mapRef = useRef(null);
  const [selected, setSelected] = useState<Review | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [route, setRoute] = useState<GeoJSON.Geometry | null>(null);

  // 🔹 Guardar informações adicionais da rota
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(
    null
  );

  const handleGeolocate = (pos: GeolocationPosition) => {
    setUserLocation([pos.coords.longitude, pos.coords.latitude]);
  };

  const fetchRoute = useCallback(async (destination: [number, number]) => {
    if (!userLocation) return;

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation[0]},${userLocation[1]};${destination[0]},${destination[1]}?geometries=geojson&overview=full&access_token=${
      MAPBOX_CONFIG.accessToken
    }`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.routes && data.routes.length > 0) {
      const routeData = data.routes[0];
      setRoute(routeData.geometry);

      // 🔹 Salvar distância (km) e duração (min)
      setRouteInfo({
        distance: routeData.distance / 1000, // km
        duration: routeData.duration / 60, // min
      });
    }
  }, [userLocation]);

  useEffect(() => {
    if (selected?.coordinates && userLocation) {
      fetchRoute([selected.coordinates.lng, selected.coordinates.lat]);
    }
  }, [selected, userLocation, fetchRoute]);

  useEffect(() => {
    if (selected?.coordinates && userLocation) {
      fetchRoute([selected.coordinates.lng, selected.coordinates.lat]);
    }
  }, [selected, userLocation, fetchRoute]);

  return (
    <div className="h-full relative">
      {/* Debug info */}
      <div className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded z-50">
        Debug: Config OK | Reviews: {reviews.length}
      </div>
      
      <Map
        ref={mapRef}
        {...MAPBOX_CONFIG.initialView}
        style={{ width: "100%", height: "100%", minHeight: "400px" }}
        mapStyle={MAPBOX_CONFIG.styleUrl}
        mapboxAccessToken={MAPBOX_CONFIG.accessToken}
        projection={MAPBOX_CONFIG.settings.projection}
        terrain={MAPBOX_CONFIG.settings.terrain}
        antialias={MAPBOX_CONFIG.settings.antialias}
        optimizeForTerrain={MAPBOX_CONFIG.settings.optimizeForTerrain}
        onLoad={(evt) => {
          console.log("✅ Mapa personalizado Guarder carregado com sucesso!");
          console.log("📍 Token:", MAPBOX_CONFIG.accessToken.substring(0, 20) + "...");
          console.log("🎨 Estilo:", MAPBOX_CONFIG.styleUrl);
          const map = evt.target;
          
          // Aplicar configurações baseadas no style.json customizado
          try {
            map.setConfigProperty('basemap', 'lightPreset', MAPBOX_CONFIG.settings.lightPreset);
            console.log("💡 Iluminação aplicada");
          } catch (e) {
            console.warn("⚠️ Erro ao aplicar iluminação:", e);
          }
          
          // Habilitar atmosfera/fog para o globe
          try {
            if (map.setFog) {
              map.setFog(MAPBOX_CONFIG.settings.fog);
              console.log("🌫️ Fog aplicado");
            }
          } catch (e) {
            console.warn("⚠️ Erro ao aplicar fog:", e);
          }
        }}
        onError={(e) => {
          console.error("❌ Erro ao carregar o mapa personalizado:", e);
          console.error("🔑 Token usado:", MAPBOX_CONFIG.accessToken.substring(0, 20) + "...");
          console.error("🎨 Estilo usado:", MAPBOX_CONFIG.styleUrl);
        }}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl
          position="top-right"
          trackUserLocation
          onGeolocate={(e) => handleGeolocate(e.coords)}
        />

        {reviews.map(
          (review, i) =>
            review.coordinates && (
              <Marker
                key={i}
                latitude={review.coordinates.lat}
                longitude={review.coordinates.lng}
                anchor="bottom"
                onClick={() => {
                  setSelected(review);
                  onLocationSelect?.(review);
                }}
              >
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-pointer"></div>
              </Marker>
            )
        )}

        {selected && selected.coordinates && (
          <Popup
            latitude={selected.coordinates.lat}
            longitude={selected.coordinates.lng}
            anchor="top"
            onClose={() => setSelected(null)}
          >
            <div className="text-sm">
              <strong>{selected.location}</strong>
              <p>{selected.city}</p>
              <p>⭐ {selected.rating}</p>
            </div>
          </Popup>
        )}

        {route && (
          <Source id="route" type="geojson" data={{ type: "Feature", geometry: route }}>
            <Layer
              id="route-line"
              type="line"
              paint={{
                "line-color": "#1E40AF",
                "line-width": 4,
              }}
            />
          </Source>
        )}
      </Map>

      {selected && (
        <Card className="absolute top-4 left-4 w-80 max-w-[calc(100%-2rem)] card-iridescent shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                  {selected.avatar}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1 truncate">
                  {selected.location}
                </h4>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < selected.rating
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {selected.rating}/5
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {selected.content}
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {selected.category}
                  </Badge>
                  {selected.verified && (
                    <Badge variant="outline" className="text-xs">
                      Verificado
                    </Badge>
                  )}
                </div>

                {/* 🔹 Distância e tempo estimado */}
                {routeInfo && (
                  <div className="text-xs text-muted-foreground mb-3">
                    <p>📍 Distância: {routeInfo.distance.toFixed(1)} km</p>
                    <p>⏱️ Tempo: {Math.round(routeInfo.duration)} min</p>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    <Eye className="w-3 h-3 mr-1" />
                    Ver Detalhes
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                    onClick={() =>
                      userLocation &&
                      fetchRoute([selected.coordinates!.lng, selected.coordinates!.lat])
                    }
                  >
                    <NavIcon className="w-3 h-3 mr-1" />
                    Navegar
                  </Button>
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="w-6 h-6 p-0"
                onClick={() => {
                  setSelected(null);
                  setRoute(null);
                  setRouteInfo(null);
                }}
              >
                ×
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
