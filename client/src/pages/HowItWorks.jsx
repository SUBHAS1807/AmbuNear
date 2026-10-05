import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Ambulance, CheckCircle2, Clock, PhoneCall, ShieldCheck, ArrowRight } from 'lucide-react';

export const HowItWorks = () => {
  return (
    <div className="container" style={{ padding: '3.5rem 1.25rem 5rem', maxWidth: '840px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>How AmbuNear Works</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          A simple, transparent emergency booking system designed to reduce response confusion.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Step 1 */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 800,
                fontSize: '1.15rem',
              }}
            >
              1
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Locate Nearby Available Ambulances
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                Grant permission for browser GPS or type your street landmark. AmbuNear scans verified ambulances within a configurable radius and displays them ordered by approximate distance and arrival ETA.
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                &bull; Filter by Basic Life Support (BLS), Advanced Life Support (ALS ICU), or Patient Transport.
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-emergency-subtle)',
                color: 'var(--color-emergency)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 800,
                fontSize: '1.15rem',
              }}
            >
              2
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Instant Dispatch & Atomic Reservation
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                Enter destination hospital, patient contact, and specific medical notes. Our atomic reservation engine locks the selected vehicle to prevent simultaneous double-bookings and alerts the driver.
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                &bull; Generates a unique tracking reference code e.g. <code>AN-2026-XXXX</code>.
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-available-subtle)',
                color: 'var(--color-available)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 800,
                fontSize: '1.15rem',
              }}
            >
              3
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Live Tracking & Driver Direct Coordination
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                Follow sequential status updates: Driver Accepted &rarr; On The Way &rarr; Arrived &rarr; Trip Started &rarr; Completed. You receive the driver's direct contact phone number for rapid phone alignment.
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                &bull; Full booking summary with printable receipt.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link to="/ambulances" className="btn btn-emergency btn-lg">
          Find Available Ambulances <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};
