import { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'nav-blur' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-lilac to-ocean animate-pulse-glow">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">GUARDER</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Sobre
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Como Funciona
            </button>
            <button 
              onClick={() => scrollToSection('resources')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Recursos
            </button>
            <button 
              onClick={() => scrollToSection('download')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Download
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Hotéis
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Avaliações
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Entrar
            </Button>
            <Button className="btn-hero">
              Cadastrar-se
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 p-6 rounded-2xl card-iridescent">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('about')}
                className="text-left text-foreground hover:text-primary transition-colors py-2"
              >
                Sobre
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-left text-foreground hover:text-primary transition-colors py-2"
              >
                Como Funciona
              </button>
              <button 
                onClick={() => scrollToSection('resources')}
                className="text-left text-foreground hover:text-primary transition-colors py-2"
              >
                Recursos
              </button>
              <button 
                onClick={() => scrollToSection('download')}
                className="text-left text-foreground hover:text-primary transition-colors py-2"
              >
                Download
              </button>
              <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                <Button variant="ghost" className="justify-start">
                  Entrar
                </Button>
                <Button className="btn-hero justify-start">
                  Cadastrar-se
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;