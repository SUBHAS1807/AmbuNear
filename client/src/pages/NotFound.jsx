import React from 'react';
import { Link } from 'react-router-dom';
import { Ambulance, ArrowLeft, Home, Search } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="container" style={{ padding: '5rem 1.25rem 7rem', textAlign: 'center', maxWidth: '560px' }}>
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-emergency-subtle)',
          color: 'var(--color-emergency)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}
      >
        <Ambulance size={36} />
      </div>

      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-emergency)', lineHeight: 1 }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', margin: '0.75rem 0' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
        The emergency route or resource you requested could not be located. It may have moved or been retired.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-secondary">
          <Home size={16} /> Return Home
        </Link>
        <Link to="/ambulances" className="btn btn-emergency">
          <Search size={16} /> Search Ambulances
        </Link>
      </div>
    </div>
  );
};
