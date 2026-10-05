import React, { useState, useEffect } from 'react';
import {
  Activity,
  Ambulance,
  PhoneCall,
  CheckCircle2,
  XCircle,
  MapPin,
  Hospital,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Navigation,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { formatDateTime, formatDistance } from '../utils/formatters';

export const DriverDashboard = () => {
  const { user } = useAuth();
  const { toastSuccess, toastError, toastInfo } = useToast();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [rejectingBooking, setRejectingBooking] = useState(null);

  const fetchDashboard = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.driver.getDashboard();
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      if (!silent) toastError('Failed to load driver dashboard.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // Controlled polling every 4 seconds for new incoming emergency dispatches
    const interval = setInterval(() => {
      fetchDashboard(true);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleAvailability = async () => {
    const current = dashboardData?.driverProfile?.isAvailable;
    try {
      const res = await api.driver.updateAvailability(!current);
      if (res.success) {
        toastSuccess(`You are now ${!current ? 'ONLINE & AVAILABLE' : 'OFFLINE'}.`);
        await fetchDashboard(true);
      }
    } catch (err) {
      toastError(err.message || 'Could not update availability.');
    }
  };

  const handleAcceptRequest = async (bookingId) => {
    setUpdatingStatus(true);
    try {
      const res = await api.bookings.accept(bookingId);
      if (res.success) {
        toastSuccess('Emergency booking accepted! Proceed to pickup location.');
        await fetchDashboard(false);
      }
    } catch (err) {
      toastError(err.message || 'Failed to accept request.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingBooking) return;
    setUpdatingStatus(true);
    try {
      const res = await api.bookings.reject(rejectingBooking._id);
      if (res.success) {
        toastInfo('Booking request declined.');
        setRejectingBooking(null);
        await fetchDashboard(false);
      }
    } catch (err) {
      toastError(err.message || 'Failed to reject request.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAdvanceTripStatus = async (bookingId, targetStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await api.bookings.updateStatus(bookingId, targetStatus);
      if (res.success) {
        toastSuccess(`Trip status updated to: ${targetStatus.replace(/_/g, ' ')}`);
        await fetchDashboard(false);
      }
    } catch (err) {
      toastError(err.message || 'Failed to update trip progress.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const driverProfile = dashboardData?.driverProfile;
  const isAvailable = driverProfile?.isAvailable;
  const incomingRequests = dashboardData?.incomingRequests || [];
  const activeTrip = dashboardData?.activeTrip;
  const completedTrips = dashboardData?.completedTrips || [];

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem' }}>
      {/* Header with Availability Switch */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Activity size={28} color="var(--color-primary)" />
            <h1 style={{ fontSize: '1.85rem' }}>Ambulance Driver Portal</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Operator: <strong>{user?.name}</strong> &bull; License: <strong>{driverProfile?.licenseNumber || 'Verified'}</strong>
          </p>
        </div>

        {/* Availability Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={handleToggleAvailability}
            className={`btn ${isAvailable ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: isAvailable ? 'var(--color-available)' : 'var(--bg-surface)',
              borderColor: isAvailable ? 'var(--color-available)' : 'var(--border-medium)',
              color: isAvailable ? '#ffffff' : 'var(--text-primary)',
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: isAvailable ? '#ffffff' : 'var(--color-offline)',
              }}
            />
            <span>{isAvailable ? 'STATUS: AVAILABLE' : 'STATUS: OFFLINE'}</span>
          </button>

          <button
            onClick={() => fetchDashboard(false)}
            className="btn btn-secondary btn-sm"
            title="Refresh portal"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card skeleton" style={{ height: '180px' }} />
          <div className="card skeleton" style={{ height: '240px' }} />
        </div>
      ) : (
        <>
          {/* Top Metric Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Assigned Vehicle
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', marginTop: '0.25rem' }}>
                {driverProfile?.assignedAmbulance?.vehicleNumber || 'DL-01-AB-1234'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {driverProfile?.assignedAmbulance?.ambulanceType?.replace(/_/g, ' ') || 'Basic Life Support'}
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Total Trips Delivered
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--color-primary)', marginTop: '0.25rem' }}>
                {dashboardData?.totalCompletedTrips || 0}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-available)' }}>
                ★ 4.9 Driver Rating
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Verification Status
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                <ShieldCheck size={18} color="var(--color-available)" />
                <span style={{ fontWeight: 700, color: 'var(--color-available)' }}>
                  {driverProfile?.licenseVerificationStatus || 'VERIFIED'}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Authorized for medical pilot
              </div>
            </div>
          </div>

          {/* Incoming Emergency Booking Alert Banner / Modal */}
          {incomingRequests.length > 0 && !activeTrip && (
            <div
              className="card"
              style={{
                border: '2px solid var(--color-emergency)',
                backgroundColor: 'var(--color-emergency-subtle)',
                marginBottom: '2.5rem',
                padding: '1.75rem',
                animation: 'scaleUp 200ms ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <span className="badge badge-emergency" style={{ fontSize: '0.85rem' }}>
                  🚨 INCOMING EMERGENCY REQUEST
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-emergency)', fontWeight: 600 }}>
                  Immediate Response Required
                </span>
              </div>

              {incomingRequests.map((req) => (
                <div key={req._id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: '1rem',
                      backgroundColor: 'var(--bg-surface)',
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(220, 38, 38, 0.25)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Patient
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{req.patientName}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                        <PhoneCall size={13} style={{ display: 'inline', marginRight: '4px' }} />
                        {req.patientPhone}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Pickup Spot
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                        <MapPin size={13} style={{ display: 'inline', color: 'var(--color-emergency)', marginRight: '4px' }} />
                        {req.pickupAddress}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Approx {formatDistance(req.distanceKm)} away
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Destination
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                        <Hospital size={13} style={{ display: 'inline', color: 'var(--color-primary)', marginRight: '4px' }} />
                        {req.destinationAddress}
                      </div>
                    </div>
                  </div>

                  {req.emergencyNotes && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <strong>Emergency Note:</strong> {req.emergencyNotes}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setRejectingBooking(req)}
                      disabled={updatingStatus}
                      className="btn btn-secondary"
                    >
                      <XCircle size={16} /> Decline
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(req._id)}
                      disabled={updatingStatus}
                      className="btn btn-emergency btn-lg"
                      style={{ minWidth: '200px' }}
                    >
                      <CheckCircle2 size={18} /> {updatingStatus ? 'Accepting...' : 'ACCEPT EMERGENCY'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Trip Progression Panel */}
          {activeTrip ? (
            <div
              className="card"
              style={{
                border: '2px solid var(--color-primary)',
                marginBottom: '2.5rem',
                padding: '2rem',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <span className="badge badge-primary">ACTIVE DISPATCH IN PROGRESS</span>
                  <h2 style={{ fontSize: '1.45rem', marginTop: '0.4rem' }}>
                    Trip #{activeTrip.bookingNumber}
                  </h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Current Status: <strong style={{ color: 'var(--color-primary)' }}>{activeTrip.status}</strong>
                  </div>
                </div>

                {activeTrip.patientPhone && (
                  <a
                    href={`tel:${activeTrip.patientPhone}`}
                    className="btn btn-emergency btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <PhoneCall size={15} /> Call Patient ({activeTrip.patientName})
                  </a>
                )}
              </div>

              {/* Trip Addresses */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '1.25rem',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.75rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Pickup Location
                  </div>
                  <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>
                    {activeTrip.pickupAddress}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Destination Hospital
                  </div>
                  <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>
                    {activeTrip.destinationAddress}
                  </div>
                </div>
              </div>

              {/* Sequential Status Advance Action */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Next sequential step in protocol:
                </div>

                {activeTrip.status === 'ACCEPTED' && (
                  <button
                    onClick={() => handleAdvanceTripStatus(activeTrip._id, 'ON_THE_WAY')}
                    disabled={updatingStatus}
                    className="btn btn-primary btn-lg"
                  >
                    <span>1. Mark Ambulance "On The Way"</span>
                    <ArrowRight size={16} />
                  </button>
                )}

                {activeTrip.status === 'ON_THE_WAY' && (
                  <button
                    onClick={() => handleAdvanceTripStatus(activeTrip._id, 'ARRIVED')}
                    disabled={updatingStatus}
                    className="btn btn-primary btn-lg"
                  >
                    <span>2. Mark Ambulance "Arrived at Pickup"</span>
                    <ArrowRight size={16} />
                  </button>
                )}

                {activeTrip.status === 'ARRIVED' && (
                  <button
                    onClick={() => handleAdvanceTripStatus(activeTrip._id, 'TRIP_STARTED')}
                    disabled={updatingStatus}
                    className="btn btn-primary btn-lg"
                  >
                    <span>3. Patient Onboard — Start Transit to Hospital</span>
                    <ArrowRight size={16} />
                  </button>
                )}

                {activeTrip.status === 'TRIP_STARTED' && (
                  <button
                    onClick={() => handleAdvanceTripStatus(activeTrip._id, 'COMPLETED')}
                    disabled={updatingStatus}
                    className="btn btn-emergency btn-lg"
                    style={{ backgroundColor: 'var(--color-available)' }}
                  >
                    <span>4. Hospital Reached — Mark Trip Completed</span>
                    <CheckCircle2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ) : null}

          {/* Completed Trips History */}
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recent Completed Dispatches</h3>
            {completedTrips.length === 0 ? (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No completed trips recorded for your profile yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {completedTrips.map((trip) => (
                  <div key={trip._id} className="card" style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 700 }}>{trip.bookingNumber}</span>
                      <span className="badge badge-available">● Completed</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Patient: {trip.patientName} &bull; Route: {trip.pickupAddress} &rarr; {trip.destinationAddress}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      Completed at {formatDateTime(trip.completedAt || trip.updatedAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Confirmation Modal for Rejecting Request */}
      <ConfirmationModal
        isOpen={!!rejectingBooking}
        title="Decline Emergency Request"
        message="Are you sure you want to decline this request? The system will return this ambulance to the search pool."
        confirmText="Yes, Decline"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={updatingStatus}
        onConfirm={handleConfirmReject}
        onCancel={() => setRejectingBooking(null)}
      />
    </div>
  );
};
