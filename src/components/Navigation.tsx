import { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'nav-blur' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1">
            <img src="/logo.png" alt="Guarder Logo" className="w-20 h-20" />
            <span className="text-2xl font-bold gradient-text">GUARDER</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link to="/history" className="text-foreground hover:text-primary transition-colors">
              História
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contato
            </Link>
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
              <Link to="/about" className="text-left text-foreground hover:text-primary transition-colors py-2">
                Sobre
              </Link>
              <Link to="/resources" className="text-left text-foreground hover:text-primary transition-colors py-2">
                Recursos
              </Link>
              <Link to="/contact" className="text-left text-foreground hover:text-primary transition-colors py-2">
                Contato
              </Link>
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
