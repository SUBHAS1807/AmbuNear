import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ambulance,
  PhoneCall,
  Clock,
  MapPin,
  Hospital,
  AlertCircle,
  CheckCircle2,
  Copy,
  Printer,
  XCircle,
  RefreshCw,
  Search,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { copyToClipboard } from '../utils/clipboard';
import { formatDateTime, formatDistance } from '../utils/formatters';

const TRIP_STEPS = [
  { key: 'REQUESTED', label: 'Requested' },
  { key: 'ACCEPTED', label: 'Accepted' },
  { key: 'ON_THE_WAY', label: 'On The Way' },
  { key: 'ARRIVED', label: 'Arrived' },
  { key: 'TRIP_STARTED', label: 'Trip Started' },
  { key: 'COMPLETED', label: 'Completed' },
];

export const MyBookings = () => {
  const { user } = useAuth();
  const { toastSuccess, toastError, toastInfo } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('Found alternate arrangement');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const fetchBookings = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.bookings.getAll();
      if (res.success && res.data) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      if (!silent) toastError('Could not load booking history.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Controlled polling every 5 seconds if an active booking is in progress
  const activeBooking = bookings.find((b) =>
    ['REQUESTED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'TRIP_STARTED'].includes(b.status)
  );

  useEffect(() => {
    if (!activeBooking) return;
    const interval = setInterval(() => {
      fetchBookings(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBooking]);

  const handleCopy = async (text, id) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      toastSuccess('Copied to clipboard!');
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;
    setCancelLoading(true);
    try {
      const res = await api.bookings.cancel(cancellingBooking._id, cancelReason);
      if (res.success) {
        toastSuccess('Booking has been cancelled.');
        setCancellingBooking(null);
        await fetchBookings(false);
      }
    } catch (err) {
      toastError(err.message || 'Cancellation failed.');
    } finally {
      setCancelLoading(false);
    }
  };

  const pastBookings = bookings.filter((b) => ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(b.status));

  // Determine active step index
  const getStepStatus = (stepKey, currentStatus) => {
    const stepOrder = ['REQUESTED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'TRIP_STARTED', 'COMPLETED'];
    const currentIndex = stepOrder.indexOf(currentStatus);
    const stepIndex = stepOrder.indexOf(stepKey);

    if (currentStatus === 'CANCELLED' || currentStatus === 'REJECTED') {
      return 'cancelled';
    }
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>My Ambulance Bookings</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Live status tracking and historical trip logs for {user?.name}.
          </p>
        </div>

        <button
          onClick={() => fetchBookings(false)}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={15} /> Refresh Status
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card skeleton" style={{ height: '220px' }} />
          <div className="card skeleton" style={{ height: '140px' }} />
        </div>
      ) : (
        <>
          {/* Active Booking Card */}
          {activeBooking ? (
            <div
              className="card"
              style={{
                border: '2px solid var(--color-primary)',
                boxShadow: 'var(--shadow-lg)',
                marginBottom: '3rem',
                padding: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span className="badge badge-emergency">● Live Trip</span>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>
                      {activeBooking.bookingNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(activeBooking.bookingNumber, activeBooking._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '2px 6px' }}
                      title="Copy Reference"
                    >
                      <Copy size={13} />
                      <span style={{ fontSize: '0.75rem' }}>
                        {copiedId === activeBooking._id ? 'Copied' : 'Copy'}
                      </span>
                    </button>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Booked at {formatDateTime(activeBooking.requestedAt)}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {activeBooking.driver?.phone && (
                    <a
                      href={`tel:${activeBooking.driver.phone}`}
                      className="btn btn-emergency btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <PhoneCall size={14} /> Call Driver ({activeBooking.driver.name.split(' ')[0]})
                    </a>
                  )}
                  {['REQUESTED', 'ACCEPTED', 'ON_THE_WAY'].includes(activeBooking.status) && (
                    <button
                      onClick={() => setCancellingBooking(activeBooking)}
                      className="btn btn-secondary btn-sm"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>

              {/* Status Timeline Stepper */}
              <div className="timeline-stepper">
                {TRIP_STEPS.map((step, idx) => {
                  const state = getStepStatus(step.key, activeBooking.status);
                  return (
                    <div
                      key={step.key}
                      className={`timeline-step ${state}`}
                    >
                      <div className="step-circle">
                        {state === 'completed' ? '✓' : idx + 1}
                      </div>
                      <div className="step-label">{step.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Route & Vehicle details */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.25rem',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  marginTop: '1.5rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Pickup Location
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    <MapPin size={14} style={{ display: 'inline', color: 'var(--color-emergency)', marginRight: '4px' }} />
                    {activeBooking.pickupAddress}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Destination Hospital
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    <Hospital size={14} style={{ display: 'inline', color: 'var(--color-primary)', marginRight: '4px' }} />
                    {activeBooking.destinationAddress}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Assigned Ambulance
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {activeBooking.ambulance?.vehicleNumber || 'Dispatch Assigned'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {activeBooking.ambulance?.ambulanceType?.replace(/_/g, ' ') || 'Basic Life Support'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '2.5rem 1.5rem',
                marginBottom: '3rem',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              <Ambulance size={36} color="var(--color-primary)" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>No Active Booking in Progress</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Need emergency assistance? Search available ambulances nearby.
              </p>
              <Link to="/ambulances" className="btn btn-emergency btn-sm">
                <Search size={15} /> Find Ambulances
              </Link>
            </div>
          )}

          {/* Past Bookings Section */}
          <div>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Past Bookings History</h2>

            {pastBookings.length === 0 ? (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No completed or past bookings recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pastBookings.map((b) => (
                  <div key={b._id} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '1rem' }}>{b.bookingNumber}</span>
                          <span
                            className={`badge ${
                              b.status === 'COMPLETED'
                                ? 'badge-available'
                                : b.status === 'CANCELLED'
                                ? 'badge-offline'
                                : 'badge-busy'
                            }`}
                          >
                            ● {b.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {formatDateTime(b.createdAt)}
                        </div>
                      </div>

                      <button
                        onClick={() => window.print()}
                        className="btn btn-secondary btn-sm no-print"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <Printer size={14} /> Print Receipt
                      </button>
                    </div>

                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
                      <div>
                        <strong>Pickup:</strong> {b.pickupAddress}
                      </div>
                      <div>
                        <strong>Drop:</strong> {b.destinationAddress}
                      </div>
                      <div>
                        <strong>Patient:</strong> {b.patientName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Cancellation Confirmation Modal (Enhancement #17) */}
      <ConfirmationModal
        isOpen={!!cancellingBooking}
        title="Cancel Ambulance Booking"
        message="Are you sure you want to cancel this emergency request? The assigned ambulance will be released back to the available fleet."
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        isDestructive={true}
        isLoading={cancelLoading}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancellingBooking(null)}
      />
    </div>
  );
};
