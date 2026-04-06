import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { isAuthenticated, loading, hasRole } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/telaLogin" state={{ from: location }} replace />;
    }

    if (requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role))) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;