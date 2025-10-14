
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import useScrollToTop from "@/hooks/useScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/about";
import ResourcesPage from "./pages/resources";
import HistoryPage from "./pages/history";
import ContactPage from "./pages/contact";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";
import MapaPage from "./pages/maps";
import HoteisPage from "./pages/hoteis";
import AvaliacaoPage from "./pages/avaliacoes";
import PerfilPage from "./pages/perfil";


const queryClient = new QueryClient();

const AppRoutes = () => {
  useScrollToTop();
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/mapa" element={<MapaPage />} />
      <Route path="/hoteis" element={<HoteisPage />} />
      <Route path="/avaliacoes" element={<AvaliacaoPage />} />
      <Route path="/perfil" element={<PerfilPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppRoutes />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
