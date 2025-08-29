import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SimpleMap from "../components/SimpleMap";
import { useAuth } from "../hooks/useAuth";
import { useReviews } from "../hooks/useReviewsSupabase";

export default function MapaPage() {
  const { isLoggedIn, loading } = useAuth();
  const { reviews } = useReviews();
  const navigate = useNavigate();

  // Proteger rota - redirecionar usuários não logados
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Carregando mapa...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  // Filtrar avaliações que tenham coordenadas
  const filteredReviews = reviews.filter((review) => review.coordinates);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navegação fixa no topo - fundo apenas no hover */}
      <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 hover:bg-white/95 hover:backdrop-blur-sm hover:border-b hover:border-gray-200 hover:shadow-sm py-2 px-4">
        <Navigation isLoggedIn={isLoggedIn} />
      </div>
      
      {/* Área principal do mapa - altura grande mas permite scroll */}
      <main className="flex-1">
        <div className="h-screen">
          <SimpleMap 
            reviews={filteredReviews}
            onLocationSelect={(review) => {
              console.log("Local selecionado:", review);
            }}
          />
        </div>
      </main>

      {/* Rodapé normal (não fixo) - aparece quando rola para baixo */}
      <Footer />
    </div>
  );
}
