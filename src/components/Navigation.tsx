import { useState, useEffect } from 'react';
import { Menu, X, Shield, User, LogOut, MapPin, Building, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface NavigationProps {
  isLoggedIn?: boolean;
}

const Navigation = ({ isLoggedIn = false }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    // Forçar reload para garantir que o estado seja atualizado em toda a aplicação
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

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
          {isLoggedIn ? (
            <div className="flex items-center space-x-1 cursor-default select-none">
              <img src="/logo.png" alt="Guarder Logo" className="w-16 h-16 sm:w-20 sm:h-20" />
              <span className="text-xl sm:text-2xl font-bold gradient-text">GUARDER</span>
            </div>
          ) : (
            <Link to="/" className="flex items-center space-x-1">
              <img src="/logo.png" alt="Guarder Logo" className="w-16 h-16 sm:w-20 sm:h-20" />
              <span className="text-xl sm:text-2xl font-bold gradient-text">GUARDER</span>
            </Link>
          )}

          <div className="hidden md:flex items-center space-x-8">
            <Link to={isLoggedIn ? "/dashboard" : "/"} className="text-foreground hover:text-primary transition-colors">
              {isLoggedIn ? "Dashboard" : "Início"}
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/mapa" className="text-foreground hover:text-primary transition-colors">
                  Mapa
                </Link>
                <Link to="/hoteis" className="text-foreground hover:text-primary transition-colors">
                  Hotéis
                </Link>
                <Link to="/avaliacoes" className="text-foreground hover:text-primary transition-colors">
                  Avaliações
                </Link>
              </>
            ) : (
              <Link to="/history" className="text-foreground hover:text-primary transition-colors">
                História
              </Link>
            )}
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contato
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Button className="btn-profile" asChild>
                  <Link to="/perfil" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Perfil
                  </Link>
                </Button>
                <Button 
                  className="btn-logout"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button className="btn-login" asChild>
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button className="btn-hero" asChild>
                  <Link to="/register">Cadastrar-se</Link>
                </Button>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 p-6 rounded-2xl card-iridescent">
            <div className="flex flex-col space-y-4">
              <Link to={isLoggedIn ? "/dashboard" : "/"} className="text-left text-foreground hover:text-primary transition-colors py-2">
                {isLoggedIn ? "Dashboard" : "Início"}
              </Link>
              {isLoggedIn && (
                <>
                  <Link to="/mapa" className="text-left text-foreground hover:text-primary transition-colors py-2">
                    Mapa
                  </Link>
                  <Link to="/hoteis" className="text-left text-foreground hover:text-primary transition-colors py-2">
                    Hotéis
                  </Link>
                  <Link to="/avaliacoes" className="text-left text-foreground hover:text-primary transition-colors py-2">
                    Avaliações
                  </Link>
                </>
              )}
              {!isLoggedIn && (
                <Link to="/history" className="text-left text-foreground hover:text-primary transition-colors py-2">
                  História
                </Link>
              )}
              <Link to="/contact" className="text-left text-foreground hover:text-primary transition-colors py-2">
                Contato
              </Link>
              <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                {isLoggedIn ? (
                  <>
                    <Button className="btn-profile justify-start" asChild>
                      <Link to="/perfil" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Perfil
                      </Link>
                    </Button>
                    <Button 
                      className="btn-logout justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="btn-login justify-start" asChild>
                      <Link to="/login">Entrar</Link>
                    </Button>
                    <Button className="btn-hero justify-start" asChild>
                      <Link to="/register">Cadastrar-se</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
