import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import InteractiveMap from '../components/InteractiveMap'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { MapPin } from 'lucide-react'

export default function MapaPage() {
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
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-yellow-400/20 to-red-500/20 rounded-full animate-pulse-slow"></div>
      </div>

      <Navigation />
      
      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-4 py-8 h-screen">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 p-3 rounded-full card-iridescent mb-4">
              <MapPin className="w-8 h-8 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold gradient-text">Mapa de Segurança</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Avalie e consulte a segurança de locais. Clique no mapa para adicionar sua avaliação.
            </p>
          </div>

          {/* Map Container - Full Height */}
          <Card className="card-iridescent h-[calc(100vh-200px)]">
            <CardContent className="p-4 h-full">
              <InteractiveMap className="w-full h-full" />
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}