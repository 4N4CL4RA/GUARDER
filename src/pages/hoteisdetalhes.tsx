import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { ArrowLeft, MapPin, Star, Shield } from "lucide-react"

// Dados temporários (deve ser compartilhado via contexto/API futuramente)
const hotelsData = [
  { id: 1, name: "Hotel Segurança Premium", location: "Centro, São Paulo", rating: 4.8, reviews: 342, price: 285, safetyScore: 98, image: "hotel1.jpg" },
  { id: 2, name: "Pousada Vila Tranquila", location: "Jardins, São Paulo", rating: 4.6, reviews: 189, price: 195, safetyScore: 95, image: "hotel2.jpg" },
  { id: 3, name: "Resort Guarder Valley", location: "Campos do Jordão", rating: 4.9, reviews: 567, price: 450, safetyScore: 99, image: "hotel3.jpg" }
]

export default function HotelDetalhesPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const hotel = hotelsData.find(h => h.id === parseInt(id))

  if (!hotel) {
    return <p className="text-center mt-20">Hotel não encontrado.</p>
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Button>

      <Card className="card-iridescent">
        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
          <img src={`/images/${hotel.image}`} alt={hotel.name} className="rounded-lg w-full h-80 object-cover" />

          <div>
            <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" /> {hotel.location}
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                {hotel.rating} ({hotel.reviews} avaliações)
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                Segurança {hotel.safetyScore}%
              </div>
            </div>
            <p className="mb-4">
              Experimente uma estadia inesquecível com conforto, segurança e serviços de qualidade.
            </p>
            <div className="text-xl font-bold text-primary mb-4">R$ {hotel.price} / noite</div>
            <Button className="btn-hero">Reservar Agora</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
