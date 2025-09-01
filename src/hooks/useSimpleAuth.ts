import { useState, useEffect } from 'react';

// Hook de autenticação simplificado para debug
export const useSimpleAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 [SimpleAuth] Verificando localStorage...');
    
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    console.log('🔍 [SimpleAuth] Token:', token);
    console.log('🔍 [SimpleAuth] UserData:', userData);
    
    const loggedIn = !!(token && userData);
    console.log('✅ [SimpleAuth] IsLoggedIn:', loggedIn);
    
    setIsLoggedIn(loggedIn);
    setLoading(false);
  }, []);

  // Listener para mudanças no localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('🔄 [SimpleAuth] Storage changed');
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      const loggedIn = !!(token && userData);
      console.log('🔄 [SimpleAuth] New state:', loggedIn);
      setIsLoggedIn(loggedIn);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-state-changed', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-state-changed', handleStorageChange);
    };
  }, []);

  return { isLoggedIn, loading };
};
