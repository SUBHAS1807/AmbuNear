import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('ambunear_cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('ambunear_cookie_consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('ambunear_cookie_consent', 'essential_only');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      className="cookie-banner no-print"
      role="region"
      aria-label="Cookie consent banner"
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        right: '1rem',
        maxWidth: '540px',
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        padding: '1.25rem',
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div
          style={{
            backgroundColor: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)',
            padding: '8px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
          }}
        >
          <Cookie size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
            Privacy & Essential Cookies
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            AmbuNear uses essential session cookies to authenticate accounts and remember your theme preferences. We do not run third-party behavioral trackers. Learn more in our{' '}
            <Link to="/privacy" style={{ fontWeight: 600 }}>
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button onClick={decline} className="btn btn-secondary btn-sm">
          Essential Only
        </button>
        <button onClick={accept} className="btn btn-primary btn-sm">
          Accept All
        </button>
      </div>
    </aside>
  );
};
