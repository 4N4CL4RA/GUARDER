import { Download, UserPlus, MapPin, Shield, Bell, Users } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Download,
      title: "1. Baixe o App",
      description: "Faça o download gratuito do GUARDER na sua loja de aplicativos preferida."
    },
    {
      icon: UserPlus,
      title: "2. Crie sua Conta",
      description: "Cadastre-se de forma rápida e segura com verificação em duas etapas."
    },
    {
      icon: Users,
      title: "3. Adicione Contatos",
      description: "Configure sua rede de confiança com familiares e amigos próximos."
    },
    {
      icon: MapPin,
      title: "4. Ative o Rastreamento",
      description: "Compartilhe sua localização em tempo real com quem você escolher."
    },
    {
      icon: Shield,
      title: "5. Viaje Protegido",
      description: "Desfrute da tranquilidade de estar sempre conectado e protegido."
    }
  ];

  const features = [
    {
      icon: Bell,
      title: "Botão de Emergência",
      description: "Acione alertas instantâneos com um toque",
      highlight: "Resposta em segundos"
    },
    {
      icon: MapPin,
      title: "Rastreamento GPS",
      description: "Localização precisa e compartilhamento seguro",
      highlight: "Precisão de 3 metros"
    },
    {
      icon: Users,
      title: "Rede de Confiança",
      description: "Conecte-se com pessoas que se importam com você",
      highlight: "Até 10 contatos"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-lilac/5 via-ocean/5 to-rose/5"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold gradient-text mb-6">
            Como Funciona
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Em poucos passos simples, você estará protegido por uma tecnologia que cuida de você 24 horas por dia.
          </p>
        </div>

        {/* Steps */}
        <div className="mb-20">
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="card-iridescent p-6 rounded-2xl text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-lilac to-ocean flex items-center justify-center group-hover:scale-110 transition-transform animate-pulse-glow">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-3">
                    {step.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-8 h-0.5 bg-gradient-to-r from-lilac to-ocean opacity-50"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card-iridescent p-8 rounded-3xl text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-r from-lilac via-ocean to-rose flex items-center justify-center group-hover:scale-110 transition-transform animate-pulse-glow">
                <feature.icon className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-foreground mb-4">
                {feature.title}
              </h4>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {feature.description}
              </p>
              <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-lilac/20 to-ocean/20 text-sm font-semibold text-foreground">
                {feature.highlight}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Map Preview */}
        <div className="mt-20 text-center">
          <div className="card-iridescent p-12 rounded-3xl">
            <h3 className="text-3xl font-bold gradient-text mb-6">
              Visualização em Tempo Real
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Acompanhe seus trajetos com mapas interativos, pontos de segurança e rotas otimizadas.
            </p>
            
            {/* Mock Map Interface */}
            <div className="relative max-w-4xl mx-auto">
              <div className="aspect-video bg-gradient-to-br from-lilac/10 to-ocean/10 rounded-2xl border border-lilac/20 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-lilac mx-auto mb-4 animate-pulse" />
                  <div className="text-xl font-semibold text-foreground mb-2">Interface do Mapa</div>
                  <div className="text-muted-foreground">Visualização em tempo real da sua localização e rotas seguras</div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 left-4 px-3 py-2 bg-white/90 rounded-lg shadow-lg text-sm font-semibold text-foreground">
                📍 Você está aqui
              </div>
              <div className="absolute top-4 right-4 px-3 py-2 bg-green-500 text-white rounded-lg shadow-lg text-sm font-semibold">
                🛡️ Área Segura
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-lilac text-white rounded-lg shadow-lg text-sm font-semibold">
                🚶‍♀️ Caminhando • 3 contatos acompanhando
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;