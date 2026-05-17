import { type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { useUiStore } from '../../stores/ui.store';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const openLogin = useUiStore((s) => s.openLogin);

  useEffect(() => {
    if (!isAuthenticated) {
      openLogin();
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate, openLogin]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
