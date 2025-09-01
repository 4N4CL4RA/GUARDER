import { useState, useEffect, useCallback } from 'react';
import { isAuthenticated, getCurrentUser, verifyToken, logoutUser } from '@/services/authApi';

// Evento customizado para sincronizar estado entre componentes
const AUTH_CHANGE_EVENT = 'auth-state-changed';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    // Primeiro: verificação rápida do localStorage
    const token = localStorage.getItem('authToken');
    const userDataString = localStorage.getItem('userData');
    
    if (!token || !userDataString) {
      setIsLoggedIn(false);
      setUser(null);
      setLoading(false);
      return;
    }
    
    try {
      const userData = JSON.parse(userDataString);
      
      // Para desenvolvimento com mock: se o token começar com "mock", aceitar
      if (token.startsWith('mock-jwt-token')) {
        const userWithName = {
          ...userData,
          name: `${userData.nome} ${userData.sobrenome}`
        };
        setUser(userWithName);
        setIsLoggedIn(true);
        setLoading(false);
        return;
      }
      
      // Verificação assíncrona para tokens reais
      const authenticated = isAuthenticated();
      
      if (authenticated) {
        const tokenCheck = await verifyToken();
        
        if (tokenCheck.success) {
          const userWithName = {
            ...userData,
            name: `${userData.nome} ${userData.sobrenome}`
          };
          setUser(userWithName);
          setIsLoggedIn(true);
          setLoading(false);
          return;
        }
      }
      
      // Se chegou até aqui, token inválido
      setIsLoggedIn(false);
      setUser(null);
      setLoading(false);
      
    } catch (error) {
      console.error('❌ [useAuth] Erro ao parsear dados ou verificar token:', error);
      setIsLoggedIn(false);
      setUser(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Listener para mudanças de auth em outros componentes
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    };
  }, [checkAuth]);

  // Função para atualizar o estado após login
  const updateAuthState = useCallback(async () => {
    await checkAuth();
    // Disparar evento para sincronizar outros componentes
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }, [checkAuth]);

  // Função para logout
  const logout = useCallback(() => {
    logoutUser();
    setIsLoggedIn(false);
    setUser(null);
    // Disparar evento para sincronizar outros componentes
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }, []);

  return { 
    isLoggedIn, 
    user, 
    loading, 
    updateAuthState, 
    logout,
    checkAuth 
  };
};
