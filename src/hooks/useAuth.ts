import { useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser, verifyToken } from '@/services/authApi';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          // Verifica se o token ainda é válido
          const tokenCheck = await verifyToken();
          if (tokenCheck.success) {
            setIsLoggedIn(true);
            setUser(getCurrentUser());
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

    checkAuth();
  }, []);

  return { isLoggedIn, user, loading };
};
