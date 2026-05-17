import { type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserRole } from '../../types/auth';
import { useAuthStore } from '../../stores/auth.store';
import { useUiStore } from '../../stores/ui.store';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userRole = useAuthStore((s) => s.user?.role);
  const navigate = useNavigate();
  const openLogin = useUiStore((s) => s.openLogin);

  const hasAccess =
    isAuthenticated && (!requiredRole || userRole === requiredRole);

  useEffect(() => {
    if (!isAuthenticated) {
      openLogin();
      navigate('/', { replace: true });
    } else if (requiredRole && userRole !== requiredRole) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, userRole, requiredRole, navigate, openLogin]);

  if (!hasAccess) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
