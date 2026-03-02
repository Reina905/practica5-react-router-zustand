import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

  // Mostrar spinner mientras Firebase verifica la sesión
  if (loading) {
    return <LoadingSpinner />;
  }

  // Si no hay usuario autenticado, redirigir a login
  // replace: evita que puedan volver con el botón atrás
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Usuario autenticado: mostrar el contenido protegido
  return children;
}