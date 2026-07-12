import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { ShieldCheck, Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#0A2540] text-[#E69536] flex items-center justify-center shadow-xl animate-pulse mb-4 border border-[#0F3B4C]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <h3 className="font-heading font-extrabold text-lg text-[#0A2540]">
          Verifying Security Credentials...
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Authenticating active session with Uma International Admin Portal.
        </p>
      </div>
    );
  }

  if (!session) {
    // Redirect to login while preserving the intended destination URL
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
