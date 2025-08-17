import { Users, Heart, Shield, MapPin, Clock, Phone } from 'lucide-react';

const ResourcesSection = () => {
  const userTypes = [
    {
      icon: Users,
      title: "Mulheres Viajando Sozinhas",
      description: "Proteção especializada para mulheres em deslocamentos urbanos e viagens",
      features: ["Botão de pânico discreto", "Rotas seguras", "Contatos de emergência"],
      color: "from-rose to-lilac"
    },
    {
      icon: Heart,
      title: "Idosos e Pessoas com Mobilidade Reduzida",
      description: "Cuidado extra para quem precisa de atenção especial durante trajetos",
      features: ["Monitoramento de saúde", "Alertas automáticos", "Interface simplificada"],
      color: "from-ocean to-mint"
    },
    {
      icon: Shield,
      title: "Profissionais em Áreas de Risco",
      description: "Segurança para quem trabalha em locais ou horários de maior vulnerabilidade",
      features: ["Rastreamento corporativo", "Relatórios de segurança", "Suporte 24h"],
      color: "from-lilac to-ocean"
    },
    {
      icon: MapPin,
      title: "Estudantes e Jovens",
      description: "Tranquilidade para pais e responsáveis acompanharem trajetos escolares",
      features: ["Geofencing escolar", "Notificações aos pais", "Grupos de segurança"],
      color: "from-mint to-rose"
    }
  ];

  const emergencyFeatures = [
    {
      icon: Phone,
      title: "Contato Direto com Autoridades",
      description: "Conexão imediata com polícia, bombeiros e serviços de emergência"
    },
    {
      icon: Clock,
      title: "Histórico de Movimentação",
      description: "Registro detalhado de todos os seus deslocamentos para maior segurança"
    },
    {
      icon: Shield,
      title: "Verificação de Check-in",
      description: "Sistema que confirma sua chegada segura aos destinos planejados"
    }
  ];

  return (
    <section id="resources" className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold gradient-text mb-6">
            Para Quem é o GUARDER
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Nossa tecnologia foi desenvolvida pensando especialmente em pessoas que precisam de proteção extra durante seus deslocamentos.
          </p>
        </div>

        {/* User Types Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {userTypes.map((userType, index) => (
            <div 
              key={index} 
              className="card-iridescent p-8 rounded-3xl group hover:scale-105 transition-all duration-300"
            >
              <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${userType.color} flex items-center justify-center group-hover:scale-110 transition-transform animate-pulse-glow`}>
                <userType.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {userType.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {userType.description}
              </p>
              
              <div className="space-y-2">
                {userType.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-lilac to-ocean"></div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Features */}
        <div className="card-iridescent p-8 lg:p-12 rounded-3xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold gradient-text mb-4">
              Recursos de Emergência
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quando você precisa de ajuda, cada segundo conta. Por isso, desenvolvemos recursos que agem instantaneamente.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {emergencyFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-r from-rose via-lilac to-ocean flex items-center justify-center animate-pulse-glow">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-4">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Emergency Button Demo */}
          <div className="mt-12 text-center">
            <div className="inline-block p-8 rounded-3xl bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center shadow-2xl animate-pulse-glow">
                <span className="text-2xl text-white font-bold">SOS</span>
              </div>
              <div className="text-lg font-semibold text-foreground mb-2">
                Botão de Emergência
              </div>
              <div className="text-sm text-muted-foreground max-w-xs mx-auto">
                Pressione e segure por 3 segundos para acionar alertas automáticos
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-lilac/10 to-ocean/10">
            <div className="text-3xl font-bold gradient-text mb-2">95%</div>
            <div className="text-sm text-muted-foreground">dos usuários se sentem mais seguros</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-ocean/10 to-rose/10">
            <div className="text-3xl font-bold gradient-text mb-2">2min</div>
            <div className="text-sm text-muted-foreground">tempo médio de resposta</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-rose/10 to-mint/10">
            <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">monitoramento ativo</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-mint/10 to-lilac/10">
            <div className="text-3xl font-bold gradient-text mb-2">100K+</div>
            <div className="text-sm text-muted-foreground">vidas protegidas</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;