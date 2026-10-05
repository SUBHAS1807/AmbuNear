import React, { useState } from 'react';
import { PhoneCall, X, ShieldAlert, LifeBuoy, Mail, MessageSquare } from 'lucide-react';

export const FloatingContact = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="floating-contact no-print" style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9996 }}>
        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-emergency"
          style={{
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 4px 14px rgba(220, 38, 38, 0.45)',
            padding: '0.65rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 700,
          }}
          aria-label="Open emergency numbers and assistance desk"
        >
          <PhoneCall size={18} /> Emergency Help
        </button>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)} role="dialog" aria-modal="true" aria-labelledby="help-modal-title">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LifeBuoy size={22} color="var(--color-emergency)" />
                <h3 id="help-modal-title" style={{ fontSize: '1.15rem' }}>
                  Emergency Helplines & Support
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            {/* Official Hotlines Box */}
            <div
              style={{
                backgroundColor: 'var(--color-emergency-subtle)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--color-emergency)', marginBottom: '0.4rem' }}>
                <ShieldAlert size={18} /> Immediate Emergency Hotlines
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                For immediate life-threatening events, dial official national services directly:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <a
                  href="tel:108"
                  className="btn btn-emergency btn-sm"
                  style={{ textAlign: 'center', textDecoration: 'none' }}
                >
                  Dial 108 (Ambulance)
                </a>
                <a
                  href="tel:112"
                  className="btn btn-secondary btn-sm"
                  style={{ textAlign: 'center', textDecoration: 'none' }}
                >
                  Dial 112 (National)
                </a>
              </div>
            </div>

            {/* Pilot Assistance & Tech Support */}
            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>AmbuNear Pilot Support Desk</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
                  <Mail size={16} color="var(--color-primary)" />
                  <span>Email: <strong>support@ambunear.com</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
                  <PhoneCall size={16} color="var(--color-primary)" />
                  <span>Pilot Helpdesk: <strong>+91 (011) 2345-6789</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
                  <MessageSquare size={16} color="var(--color-primary)" />
                  <span>Operating Hours: <strong>24/7 Pilot Emergency Coordination</strong></span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setModalOpen(false)} className="btn btn-secondary btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
