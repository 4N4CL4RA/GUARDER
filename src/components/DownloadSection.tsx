import { Smartphone, Download, QrCode, Star, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DownloadSection = () => {
  return (
    <section id="download" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero opacity-90"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 animate-float">
          <Shield className="w-12 h-12 text-white/20" />
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s' }}>
          <Users className="w-8 h-8 text-white/20" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '4s' }}>
          <Star className="w-10 h-10 text-white/20" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Baixe Agora e Leve Segurança com Você
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Disponível gratuitamente para iOS e Android. Comece a se proteger hoje mesmo.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* App Preview */}
          <div className="lg:col-span-1">
            <div className="relative">
              <div className="w-80 h-96 mx-auto relative">
                {/* Phone Frame */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-4 shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-lilac/20 to-ocean/20 rounded-[2.5rem] flex items-center justify-center">
                    <div className="text-center text-white">
                      <Smartphone className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                      <div className="text-lg font-semibold mb-2">GUARDER</div>
                      <div className="text-sm opacity-75">Sua Segurança em Primeiro Lugar</div>
                    </div>
                  </div>
                </div>
                
                {/* Screen Highlight */}
                <div className="absolute top-8 left-8 right-8 h-4 bg-white/10 rounded-full"></div>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-lilac via-ocean to-rose opacity-30 blur-xl rounded-full animate-pulse-glow"></div>
            </div>
          </div>

          {/* Download Options */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Store Buttons */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Baixe nas principais lojas
                </h3>
                
                {/* App Store */}
                <Button className="w-full h-16 bg-black hover:bg-gray-800 text-white rounded-2xl flex items-center justify-start px-6 space-x-4 transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold text-lg">🍎</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-300">Download na</div>
                    <div className="text-lg font-semibold">App Store</div>
                  </div>
                </Button>

                {/* Google Play */}
                <Button className="w-full h-16 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-2xl flex items-center justify-start px-6 space-x-4 transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-lg">▶️</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-100">Baixar no</div>
                    <div className="text-lg font-semibold">Google Play</div>
                  </div>
                </Button>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">4.9</div>
                    <div className="text-sm text-white/70">Avaliação</div>
                    <div className="flex justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">1M+</div>
                    <div className="text-sm text-white/70">Downloads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">Free</div>
                    <div className="text-sm text-white/70">Grátis</div>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Ou escaneie o QR Code
                </h3>
                
                <div className="inline-block p-8 bg-white rounded-3xl shadow-2xl">
                  <div className="w-48 h-48 bg-gradient-to-br from-lilac to-ocean rounded-2xl flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-white" />
                  </div>
                </div>
                
                <p className="text-white/80 mt-4 text-sm max-w-xs mx-auto">
                  Escaneie com a câmera do seu celular para baixar diretamente
                </p>

                {/* Feature Highlights */}
                <div className="mt-8 space-y-3">
                  <div className="flex items-center justify-center space-x-3 text-white/90">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">100% Seguro e Privado</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 text-white/90">
                    <Download className="w-5 h-5" />
                    <span className="text-sm">Download Gratuito</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 text-white/90">
                    <Smartphone className="w-5 h-5" />
                    <span className="text-sm">iOS 12+ e Android 8+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-block p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Pronto para se sentir mais seguro?
            </h3>
            <p className="text-white/80 mb-6 max-w-md mx-auto">
              Junte-se a milhares de pessoas que já confiam no GUARDER para suas viagens e deslocamentos diários.
            </p>
            <Button className="btn-hero text-lg px-8 py-4">
              Começar Agora
              <Download className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;