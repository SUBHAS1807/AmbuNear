import React from 'react';

export const Privacy = () => {
  return (
    <div className="container" style={{ padding: '3.5rem 1.25rem 5rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Privacy Policy</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
        Effective Date: October 2026 &bull; AmbuNear
      </p>

      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: 1.6 }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>1. Information We Collect</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            We adhere to strict data minimization principles. We only collect details essential to emergency dispatch:
          </p>
          <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <li>Name and contact phone number.</li>
            <li>Email address for secure authentication.</li>
            <li>Pickup and destination addresses and coordinate locations.</li>
            <li>Optional emergency context notes provided explicitly by the user.</li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>2. Use of Information</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Information is used solely to facilitate connection between the caller and the assigned ambulance driver. We do not sell personal data, display commercial advertisements, or run invasive tracking scripts.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>3. Data Security</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Passwords are encrypted using bcrypt hashing before storage. Sensitive tokens and endpoints are secured via JWT and rate limiting.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>4. Location Data</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Browser geolocation is queried strictly with user consent. Users may also manually enter addresses if they decline location sharing.
          </p>
        </div>
      </div>
    </div>
  );
};
