import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuth, user } = useSelector((state) => state.users);

  if (!isAuth) {
    // No está logueado -> redirigir a login
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.rol !== requiredRole) {
    // Está logueado pero no tiene el rol necesario -> redirigir a home
    return <Navigate to="/" replace />;
  }

  // Si pasa las validaciones, mostrar el componente hijo
  return children;
};

export default ProtectedRoute;