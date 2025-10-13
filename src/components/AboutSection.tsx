import { Shield, Heart, Globe, Zap, MapPin, ShieldCheck, Footprints } from 'lucide-react';

const HomePage = () => {
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
    <main>
      {/* Seção About */}
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

          {/* Missão */}
          <div className="card-iridescent p-8 lg:p-12 rounded-3xl mb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-6">
                  Nossa Missão
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Garantir que ninguém precise se sentir inseguro ao se deslocar. O GUARDER 
                  combina tecnologia avançada com cuidado humano para criar uma rede de 
                  proteção que acompanha você onde quer que vá.
                </p>
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
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-lilac/20 to-ocean/20 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-foreground">50K+</div>
                    <div className="text-sm text-muted-foreground">Usuários Protegidos</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-rose/20 to-mint/20 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-foreground">99.9%</div>
                    <div className="text-sm text-muted-foreground">Disponibilidade</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-mint/20 to-lilac/20 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-foreground">&lt;30s</div>
                    <div className="text-sm text-muted-foreground">Tempo de Resposta</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-ocean/20 to-rose/20 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-foreground">24/7</div>
                    <div className="text-sm text-muted-foreground">Suporte Ativo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
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

    </main>
  );
};

export default HomePage;
