import { Shield, Heart, Globe, Zap } from 'lucide-react';

const HistorySection = () => {
  const features = [
    {
      icon: Shield,
      title: "Proteção 24/7",
      description: "Monitoramento contínuo e alertas em tempo real para garantir sua segurança."
    },
    {
      icon: Heart,
      title: "Cuidado Humanizado",
      description: "Desenvolvido especialmente para pessoas em situação de vulnerabilidade."
    },
    {
      icon: Globe,
      title: "Conexão Global",
      description: "Funciona em qualquer lugar do mundo com cobertura de rede."
    },
    {
      icon: Zap,
      title: "Resposta Rápida",
      description: "Botão de emergência com acionamento instantâneo de contatos e autoridades."
    }
  ];

  return (
    <section id="about" className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold gradient-text mb-6">
            Sobre o GUARDER
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Uma plataforma de segurança digital que revoluciona a proteção pessoal durante 
            deslocamentos, especialmente voltada para públicos vulneráveis.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="card-iridescent p-8 lg:p-12 rounded-3xl mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-6">
                Nossa História
              </h3>
              <div className="max-w-3xl mx-auto text-lg text-muted-foreground leading-relaxed space-y-6">
                <p className="indent-8">
                  O Guarder nasceu da necessidade de criar uma solução tecnológica voltada à proteção e orientação de pessoas em situações de vulnerabilidade durante suas viagens e deslocamentos.
                  O projeto começou como uma iniciativa acadêmica, inspirado em relatos reais de insegurança em trajetos urbanos e turísticos, com o objetivo de unir tecnologia, segurança e acessibilidade em uma única plataforma.
                </p>
                <p className="indent-8">
                  Desde sua concepção, o Guarder foi pensado para ser mais do que um aplicativo de localização: ele representa confiança, apoio e prevenção.
                  Combinando GPS em tempo real, alertas inteligentes e recursos de emergência, o projeto evoluiu para atender não apenas mulheres viajantes, mas todo o público que precisa de suporte adicional em seus deslocamentos.
                  Hoje, o Guarder é construído sobre valores de inovação, empatia e responsabilidade social, buscando tornar cada jornada mais segura, tranquila e conectada.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-lilac to-ocean flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Impacto Social</div>
                  <div className="text-sm text-muted-foreground">Tecnologia que salva vidas</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-lilac/20 to-ocean/20 backdrop-blur-sm text-sm md:text-base">
                  <div className="text-2xl font-bold text-foreground">“A curiosidade abre portas: cada insight se transforma em uma ponte para soluções seguras.”</div>
                  <div className="text-sm text-muted-foreground">Inspiração</div>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-rose/20 to-mint/20 backdrop-blur-sm text-sm md:text-base">
                  <div className="text-2xl font-bold text-foreground">“Do rascunho ao protótipo: cada etapa revela como transformar ideias em proteção prática.”</div>
                  <div className="text-sm text-muted-foreground">Criação</div>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-mint/20 to-lilac/20 backdrop-blur-sm text-sm md:text-base">
                  <div className="text-2xl font-bold text-foreground">“Novas descobertas, melhores práticas: aprendizados que fortalecem nossa abordagem humana.”</div>
                  <div className="text-sm text-muted-foreground">Estudos</div>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-ocean/20 to-rose/20 backdrop-blur-sm text-sm md:text-base">
                  <div className="text-2xl font-bold text-foreground">“Protegemos jornadas reais: mais confiança, menos vulnerabilidades, cada dia mais próximo de um mundo conectado em segurança.”</div>
                  <div className="text-sm text-muted-foreground">Impactos</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="card-iridescent p-8 rounded-2xl text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-lilac to-ocean flex items-center justify-center group-hover:scale-110 transition-transform">
                <feature.icon className="w-8 h-8 text-white" />
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
      </div>
    </section>
  );
};

export default HistorySection;