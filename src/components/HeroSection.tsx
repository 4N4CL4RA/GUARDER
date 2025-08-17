import { ArrowRight, Shield, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-security.jpg';

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-hero opacity-90"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 animate-float">
          <Shield className="w-8 h-8 text-white/30" />
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s' }}>
          <MapPin className="w-6 h-6 text-white/30" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '4s' }}>
          <Users className="w-10 h-10 text-white/30" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Com o <span className="gradient-text">GUARDER</span>, você nunca está só
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
              Monitore, compartilhe e se proteja em seus trajetos com tecnologia de segurança avançada.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="btn-hero text-lg px-8 py-4">
                Cadastrar-se
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                className="btn-secondary text-lg px-8 py-4"
                onClick={() => scrollToSection('about')}
              >
                Saiba Mais
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start space-x-8 mt-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-white/70">Monitoramento</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-sm text-white/70">Seguro</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">5★</div>
                <div className="text-sm text-white/70">Avaliação</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10 animate-float">
              <img 
                src={heroImage} 
                alt="GUARDER App Interface" 
                className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl glow-effect"
              />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-r from-rose to-mint rounded-full opacity-30 animate-pulse-glow"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-r from-lilac to-ocean rounded-full opacity-30 animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;