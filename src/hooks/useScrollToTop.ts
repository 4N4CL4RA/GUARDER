import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Força o scroll para o topo sempre que a rota mudar
    window.scrollTo(0, 0);
  }, [pathname]);
};

export default useScrollToTop;
