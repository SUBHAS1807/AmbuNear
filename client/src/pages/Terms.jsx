import React from 'react';

export const Terms = () => {
  return (
    <div className="container" style={{ padding: '3.5rem 1.25rem 5rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Terms & Conditions</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
        Last Updated: October 2026 &bull; AmbuNear Pilot MVP
      </p>

      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: 1.6 }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>1. Scope of Service</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            AmbuNear is a technological booking and coordination platform connecting emergency callers with nearby available ambulance drivers. AmbuNear is not a medical provider, diagnostic facility, or healthcare practitioner.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>2. Emergency Disclaimer</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            AmbuNear does not replace national emergency dispatch services (such as 108 or 112). We cannot guarantee unconditional vehicle availability, arrival times, or road traffic conditions. In immediate life-threatening situations, always dial official toll-free services.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>3. User Responsibilities</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Users agree to provide accurate pickup location and contact details. Creating fraudulent or malicious emergency dispatches is strictly prohibited and subject to account suspension and reporting.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>4. Driver and Operator Compliance</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Ambulance drivers agree to maintain valid commercial driving licenses, appropriate vehicular fitness, and up-to-date availability statuses.
          </p>
        </div>
      </div>
    </div>
  );
};
