import { useEffect, useRef, useState } from "react";
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { MapPin, Star, Eye, Navigation } from "lucide-react";
import { Review } from "../types/reviews";

// Corrige bug do ícone no Vite
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface InteractiveMapProps {
  reviews: Review[];
  onLocationSelect?: (review: Review) => void;
}

function Routing({ destination }: { destination: Review | null }) {
  const map = useMap();
  const routingRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!destination?.coordinates) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const start = L.latLng(pos.coords.latitude, pos.coords.longitude);
        const end = L.latLng(
          destination.coordinates!.lat,
          destination.coordinates!.lng
        );

        if (routingRef.current) {
          map.removeControl(routingRef.current);
        }

        routingRef.current = L.Routing.control({
          waypoints: [start, end],
          lineOptions: { styles: [{ color: "blue", weight: 4 }] },
          addWaypoints: false,
          draggableWaypoints: false,
          createMarker: () => null,
        }).addTo(map);

        map.fitBounds(L.latLngBounds([start, end]));
      },
      (err) => console.error("Erro ao pegar localização:", err)
    );
  }, [destination, map]);

  return null;
}

export default function InteractiveMap({
  reviews,
  onLocationSelect,
}: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<Review | null>(null);

  const handleMarkerClick = (review: Review) => {
    setSelectedLocation(review);
    onLocationSelect?.(review);
  };

  return (
    <div className="h-full relative">
      {/* Mapa real */}
      <LeafletMapContainer
        center={[-23.5505, -46.6333] as [number, number]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reviews.map(
          (review, i) =>
            review.coordinates && (
              <Marker
                key={i}
                position={[review.coordinates.lat, review.coordinates.lng]}
                eventHandlers={{
                  click: () => handleMarkerClick(review),
                }}
              >
                <Popup>
                  <strong>{review.location}</strong>
                  <br />
                  {review.city} <br />
                  ⭐ {review.rating}
                </Popup>
              </Marker>
            )
        )}

        {/* Traça rota até o local selecionado */}
        <Routing destination={selectedLocation} />
  </LeafletMapContainer>

      {/* Card de detalhes do local selecionado */}
      {selectedLocation && (
        <Card className="absolute top-4 left-4 w-80 max-w-[calc(100%-2rem)] card-iridescent shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                  {selectedLocation.avatar}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1 truncate">
                  {selectedLocation.location}
                </h4>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < selectedLocation.rating
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {selectedLocation.rating}/5
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {selectedLocation.content}
                </p>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {selectedLocation.category}
                  </Badge>
                  {selectedLocation.verified && (
                    <Badge variant="outline" className="text-xs">
                      Verificado
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    <Eye className="w-3 h-3 mr-1" />
                    Ver Detalhes
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                    onClick={() => setSelectedLocation(selectedLocation)}
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    Navegar
                  </Button>
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="w-6 h-6 p-0"
                onClick={() => setSelectedLocation(null)}
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
