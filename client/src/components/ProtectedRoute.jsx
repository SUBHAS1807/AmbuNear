import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 1.5rem' }} />
        <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Verifying authorization...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <div
          className="card"
          style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '2.5rem 1.5rem' }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-emergency-subtle)',
              color: 'var(--color-emergency)',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <ShieldAlert size={32} />
          </div>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Access Restricted</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Your account role (<strong>{user?.role}</strong>) does not have permission to view this section.
          </p>
          <a href="/" className="btn btn-primary btn-sm">
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  return children;
};
