import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Ambulance,
  PhoneCall,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDateTime } from '../utils/formatters';

export const AmbulanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toastError } = useToast();

  const [ambulance, setAmbulance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.ambulances.getById(id);
        if (res.success && res.data) {
          setAmbulance(res.data.ambulance);
        }
      } catch (err) {
        toastError('Failed to load ambulance profile.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.25rem 5rem', maxWidth: '720px' }}>
        <div className="card skeleton" style={{ height: '300px' }} />
      </div>
    );
  }

  if (!ambulance) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <h2>Ambulance Record Not Found</h2>
        <Link to="/ambulances" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
          Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem', maxWidth: '720px' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div className="card" style={{ padding: '2rem', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <h1 style={{ fontSize: '1.65rem' }}>{ambulance.vehicleNumber}</h1>
              <span
                className={`badge ${
                  ambulance.availability === 'AVAILABLE'
                    ? 'badge-available'
                    : ambulance.availability === 'BUSY'
                    ? 'badge-busy'
                    : 'badge-offline'
                }`}
              >
                ● {ambulance.availability}
              </span>
            </div>
            <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              Category: <strong>{ambulance.ambulanceType.replace(/_/g, ' ')}</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Base Estimated Fare</div>
            <div style={{ fontWeight: 800, fontSize: '1.35rem', color: 'var(--color-primary)' }}>
              {formatCurrency(ambulance.baseFare || 500)}
            </div>
          </div>
        </div>

        {/* Operating Location */}
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <MapPin size={20} color="var(--color-emergency)" />
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Operating Base Station
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>
              {ambulance.humanReadableAddress || 'Delhi-NCR Pilot Area Station'}
            </div>
          </div>
        </div>

        {/* On-board Medical Equipment */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Verified Medical Equipment</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
            {(ambulance.equipment || ['Oxygen Cylinder', 'First Aid Kit', 'Stretcher']).map((eq) => (
              <div
                key={eq}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.88rem',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-light)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <CheckCircle2 size={16} color="var(--color-available)" />
                <span>{eq}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Contact & Verification */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Assigned Driver & Dispatch</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{ambulance.driver?.name || 'Verified Commercial Pilot Driver'}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Government Verified Commercial License
              </div>
            </div>

            <a
              href={`tel:${ambulance.contactNumber}`}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <PhoneCall size={14} /> {ambulance.contactNumber}
            </a>
          </div>
        </div>

        {/* Book Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            onClick={() => navigate(`/book/${ambulance._id}`)}
            disabled={ambulance.availability !== 'AVAILABLE'}
            className="btn btn-emergency btn-lg"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <span>{ambulance.availability === 'AVAILABLE' ? 'Proceed to Book Ambulance' : 'Currently Unavailable'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
