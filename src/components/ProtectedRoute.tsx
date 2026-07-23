// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  treasurerOnly?: boolean;
  memberOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false,
  treasurerOnly = false,
  memberOnly = false
}) => {
  const { isAuthenticated, loading, user } = useAuth();


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C85A32] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role;

  // Check adminOnly
  if (adminOnly) {
    if (userRole !== 'admin') {
      // Redirect based on role
      if (userRole === 'treasurer') {
        return <Navigate to="/treasurer" replace />;
      } else if (userRole === 'member') {
        return <Navigate to="/member" replace />;
      }
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  }

  // Check treasurerOnly
  if (treasurerOnly) {
    if (userRole !== 'treasurer') {
      // Redirect based on role
      if (userRole === 'admin' ) {
        return <Navigate to="/admin" replace />;
      } else if (userRole === 'member') {
        return <Navigate to="/member" replace />;
      }
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  }

  // Check memberOnly
  if (memberOnly) {
    if (userRole !== 'member') {
      // Redirect based on role
      if (userRole === 'admin') {
        return <Navigate to="/admin" replace />;
      } else if (userRole === 'treasurer') {
        return <Navigate to="/treasurer" replace />;
      }
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  }

  // Default: allow any authenticated user
  return <>{children}</>;
};

export default ProtectedRoute;