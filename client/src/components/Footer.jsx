import React from 'react';
import { Link } from 'react-router-dom';
import { Ambulance, PhoneCall, ShieldAlert, HeartHandshake } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      className="footer"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-light)',
        marginTop: 'auto',
        padding: '3rem 0 1.5rem',
      }}
    >
      <div className="container">
        {/* Important Emergency Alert Callout */}
        <div
          style={{
            backgroundColor: 'var(--color-emergency-subtle)',
            border: '1px solid rgba(220, 38, 38, 0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldAlert size={28} color="var(--color-emergency)" />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-emergency)', fontSize: '0.98rem' }}>
                Life-Threatening Emergency Notice
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                AmbuNear connects you with nearby ambulance operators. If immediate state emergency response is required, dial directly.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <a
              href="tel:108"
              className="btn btn-emergency btn-sm"
              style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <PhoneCall size={15} /> Call 108 (Ambulance)
            </a>
            <a
              href="tel:112"
              className="btn btn-secondary btn-sm"
              style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <PhoneCall size={15} /> Call 112 (National Emergency)
            </a>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  backgroundColor: 'var(--color-emergency)',
                  color: '#fff',
                  padding: '6px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                }}
              >
                <Ambulance size={18} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>AmbuNear</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Emergency Help, Closer to You. A decentralized ambulance discovery and coordination web platform for community medical response.
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Pilot Area: Delhi-NCR Operating Hub (B.Tech Pilot MVP)
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Emergency Quick Access
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <li><Link to="/ambulances" style={{ color: 'var(--text-secondary)' }}>Find Available Ambulances</Link></li>
              <li><Link to="/safety" style={{ color: 'var(--text-secondary)' }}>Emergency Protocols & First Aid</Link></li>
              <li><Link to="/how-it-works" style={{ color: 'var(--text-secondary)' }}>How Booking Works</Link></li>
              <li><Link to="/faq" style={{ color: 'var(--text-secondary)' }}>Frequently Asked Questions</Link></li>
            </ul>
          </div>

          {/* For Operators */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Ambulance Partners
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <li><Link to="/register" style={{ color: 'var(--text-secondary)' }}>Driver / Operator Registration</Link></li>
              <li><Link to="/driver-dashboard" style={{ color: 'var(--text-secondary)' }}>Driver Dispatch Portal</Link></li>
              <li><Link to="/contact" style={{ color: 'var(--text-secondary)' }}>Partner Verification Desk</Link></li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Legal & Disclaimers
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <li><Link to="/terms" style={{ color: 'var(--text-secondary)' }}>Terms of Service</Link></li>
              <li><Link to="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy & Consent</Link></li>
              <li><Link to="/contact" style={{ color: 'var(--text-secondary)' }}>Report a Technical Issue</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-light)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} AmbuNear. Built with <HeartHandshake size={14} style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--color-emergency)' }} /> for community emergency response.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <Link to="/terms" style={{ color: 'var(--text-muted)' }}>Terms</Link>
            <Link to="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy</Link>
            <Link to="/safety" style={{ color: 'var(--text-muted)' }}>Safety</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
