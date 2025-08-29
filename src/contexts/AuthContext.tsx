import { createContext, useState, useEffect, ReactNode } from 'react';
import { isAuthenticated, getCurrentUser, verifyToken, logoutUser } from '@/services/authApi';

interface User {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  name?: string; // Para compatibilidade
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateAuthState: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      if (isAuthenticated()) {
        const tokenCheck = await verifyToken();
        if (tokenCheck.success) {
          const userData = getCurrentUser();
          if (userData) {
            // Adicionar 'name' para compatibilidade
            const userWithName = {
              ...userData,
              name: `${userData.nome} ${userData.sobrenome}`
            };
            setUser(userWithName);
            setIsLoggedIn(true);
          }
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    const userWithName = {
      ...userData,
      name: `${userData.nome} ${userData.sobrenome}`
    };
    
    setUser(userWithName);
    setIsLoggedIn(true);
  };

  const logout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setUser(null);
  };

  const updateAuthState = () => {
    if (isAuthenticated()) {
      const userData = getCurrentUser();
      if (userData) {
        const userWithName = {
          ...userData,
          name: `${userData.nome} ${userData.sobrenome}`
        };
        setUser(userWithName);
        setIsLoggedIn(true);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const value = {
    isLoggedIn,
    user,
    loading,
    login,
    logout,
    updateAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
