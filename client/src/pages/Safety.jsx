import React from 'react';
import { ShieldAlert, PhoneCall, CheckCircle2, AlertTriangle, HeartPulse, Info } from 'lucide-react';

export const Safety = () => {
  return (
    <div className="container" style={{ padding: '3.5rem 1.25rem 5rem', maxWidth: '820px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'var(--color-emergency-subtle)',
            color: 'var(--color-emergency)',
            padding: '0.35rem 0.8rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}
        >
          <ShieldAlert size={16} /> Official Emergency Disclaimer
        </div>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Safety & Emergency Protocol</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Important guidelines for emergency medical situations and patient safety.
        </p>
      </div>

      {/* Emergency Call Box */}
      <div
        className="card"
        style={{
          border: '2px solid var(--color-emergency)',
          backgroundColor: 'var(--color-emergency-subtle)',
          padding: '1.75rem',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <PhoneCall size={24} color="var(--color-emergency)" />
          <h2 style={{ fontSize: '1.35rem', color: 'var(--color-emergency)' }}>
            Immediate Life-Threatening Situations
          </h2>
        </div>
        <p style={{ color: 'var(--text-primary)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          If the patient has collapsed, is unresponsive, has stopped breathing, or is experiencing severe trauma, dial the official state emergency hotlines immediately without waiting for web app confirmation:
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="tel:108" className="btn btn-emergency btn-lg" style={{ flex: '1 1 200px' }}>
            <PhoneCall size={18} /> Call 108 (National Ambulance)
          </a>
          <a href="tel:112" className="btn btn-secondary btn-lg" style={{ flex: '1 1 200px' }}>
            <PhoneCall size={18} /> Call 112 (Police & Emergency)
          </a>
        </div>
      </div>

      {/* What to do while waiting for ambulance */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HeartPulse color="var(--color-primary)" size={22} />
          What to Do While Waiting for the Ambulance
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <CheckCircle2 color="var(--color-available)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Stay Calm & Reassure the Patient:</strong> Speak in calm, soothing tones. Panic raises heart rate and increases patient distress.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <CheckCircle2 color="var(--color-available)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Clear Entryways & Pathways:</strong> Open building main gates, call building elevators, lock up domestic pets, and ensure stretcher access is clear.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <CheckCircle2 color="var(--color-available)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Gather Critical Medical Records:</strong> Collect existing prescription medicines, recent discharge summaries, and identity cards for fast hospital triage.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <AlertTriangle color="var(--color-busy)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Do Not Administer Fluids or Food:</strong> If the patient is drowsy, vomiting, or semi-conscious, never attempt to feed oral liquids or solid foods.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <CheckCircle2 color="var(--color-available)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Assign a Guide at the Street Corner:</strong> If your location is in an alley or interior colony, have someone stand at the main junction with a flashlight or bright cloth to flag down the ambulance.
            </div>
          </div>
        </div>
      </div>

      {/* Platform Scope & Boundaries */}
      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Platform Scope & Boundaries</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
          AmbuNear functions as an independent booking and coordination technological platform. AmbuNear is not a licensed hospital, medical diagnostics clinic, or replacement for government health dispatch centers.
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
          All ambulance vehicles and drivers are third-party operators whose certifications and commercial licenses are logged for transparency.
        </p>
      </div>
    </div>
  );
};
