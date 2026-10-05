import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Ambulance,
  MapPin,
  Hospital,
  User,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle2,
  Copy,
  Printer,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { copyToClipboard } from '../utils/clipboard';
import { formatDistance, formatCurrency } from '../utils/formatters';

export const BookingForm = () => {
  const { id: ambulanceId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toastSuccess, toastError, toastInfo } = useToast();

  const [ambulance, setAmbulance] = useState(null);
  const [loadingAmbulance, setLoadingAmbulance] = useState(true);

  // Form Fields
  const [pickupAddress, setPickupAddress] = useState(() => searchParams.get('address') || '');
  const [pickupLat, setPickupLat] = useState(() => parseFloat(searchParams.get('lat')) || 28.6139);
  const [pickupLng, setPickupLng] = useState(() => parseFloat(searchParams.get('lng')) || 77.2090);

  const [destinationAddress, setDestinationAddress] = useState('');
  const [patientName, setPatientName] = useState(() => user?.name || '');
  const [patientPhone, setPatientPhone] = useState(() => user?.phone || '');
  const [emergencyNotes, setEmergencyNotes] = useState('');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [successBooking, setSuccessBooking] = useState(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Fetch ambulance details
  useEffect(() => {
    const fetchAmbulance = async () => {
      try {
        const res = await api.ambulances.getById(ambulanceId);
        if (res.success && res.data) {
          setAmbulance(res.data.ambulance);
        }
      } catch (err) {
        toastError('Failed to load selected ambulance.');
      } finally {
        setLoadingAmbulance(false);
      }
    };
    if (ambulanceId) fetchAmbulance();
  }, [ambulanceId]);

  const validateForm = () => {
    const errors = {};
    if (!pickupAddress.trim()) errors.pickupAddress = 'Pickup address is required.';
    if (!destinationAddress.trim()) errors.destinationAddress = 'Destination or hospital address is required.';
    if (!patientName.trim()) errors.patientName = 'Patient full name is required.';
    if (!patientPhone.trim() || !/^[0-9+() -]{7,20}$/.test(patientPhone.trim())) {
      errors.patientPhone = 'Valid phone number is required for driver coordination.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!isAuthenticated) {
      toastInfo('Please log in or register to complete ambulance dispatch.');
      navigate('/login', { state: { from: window.location.pathname + window.location.search } });
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        ambulanceId,
        pickupAddress: pickupAddress.trim(),
        pickupLatitude: pickupLat,
        pickupLongitude: pickupLng,
        destinationAddress: destinationAddress.trim(),
        destinationLatitude: 28.63, // default hospital area
        destinationLongitude: 77.22,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        emergencyNotes: emergencyNotes.trim(),
      };

      const res = await api.bookings.create(payload);
      if (res.success && res.data) {
        setSuccessBooking(res.data.booking);
        toastSuccess('Ambulance request dispatched successfully!');
      }
    } catch (err) {
      console.error('Booking creation error:', err);
      setServerError(err.message || 'Booking submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyRef = async () => {
    if (successBooking?.bookingNumber) {
      const ok = await copyToClipboard(successBooking.bookingNumber);
      if (ok) {
        setCopiedRef(true);
        toastSuccess('Booking reference copied to clipboard!');
        setTimeout(() => setCopiedRef(false), 3000);
      }
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // SUCCESS STATE (Enhancement #15 & #9 & #10)
  if (successBooking) {
    return (
      <div className="container" style={{ padding: '3rem 1.25rem 5rem', maxWidth: '680px' }}>
        <div
          className="card"
          style={{
            border: '2px solid var(--color-available)',
            boxShadow: 'var(--shadow-xl)',
            padding: '2.5rem 2rem',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-available-subtle)',
                color: 'var(--color-available)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>
              Booking Request Submitted!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Your emergency request has been sent directly to the assigned driver.
            </p>
          </div>

          {/* Reference & Copy Card (Enhancement #9) */}
          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.75rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Booking Reference ID
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                {successBooking.bookingNumber}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyRef}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              title="Copy Booking ID"
            >
              <Copy size={15} />
              <span>{copiedRef ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Trip Summary Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.6rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Initial Status</span>
              <span className="badge badge-emergency">● {successBooking.status}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.6rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Ambulance Vehicle</span>
              <span style={{ fontWeight: 700 }}>{ambulance?.vehicleNumber || 'Assigned Unit'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.6rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Patient Name</span>
              <span style={{ fontWeight: 600 }}>{successBooking.patientName}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.6rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pickup Address</span>
              <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '65%' }}>{successBooking.pickupAddress}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.6rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Destination</span>
              <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '65%' }}>{successBooking.destinationAddress}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="no-print" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handlePrintReceipt}
              className="btn btn-secondary"
              style={{ flex: '1 1 140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <Printer size={16} /> Print Receipt
            </button>
            <Link
              to="/my-bookings"
              className="btn btn-primary"
              style={{ flex: '2 1 200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <span>Track Live Booking</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem', maxWidth: '720px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Confirm & Dispatch Ambulance</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Please provide pickup details and patient contact information for the driver.
        </p>
      </div>

      {/* Selected Ambulance Info Strip */}
      {loadingAmbulance ? (
        <div className="card skeleton" style={{ height: '90px', marginBottom: '1.5rem' }} />
      ) : ambulance ? (
        <div
          className="card"
          style={{
            padding: '1.25rem',
            marginBottom: '1.75rem',
            backgroundColor: 'var(--color-primary-subtle)',
            border: '1px solid rgba(37, 99, 235, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Ambulance size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{ambulance.vehicleNumber}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {ambulance.ambulanceType.replace(/_/g, ' ')}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Fare</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
              {formatCurrency(ambulance.baseFare || 500)}
            </div>
          </div>
        </div>
      ) : null}

      {/* Form Error Banner (Enhancement #16) */}
      {serverError && (
        <div className="alert alert-emergency" role="alert">
          <AlertCircle size={20} />
          <div>
            <strong>Booking failed:</strong> {serverError}
          </div>
        </div>
      )}

      {/* Dispatch Form */}
      <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
          Trip & Patient Details
        </h3>

        {/* Pickup Address */}
        <div className="form-group">
          <label className="form-label">
            Pickup Street Address / Landmark <span className="required">*</span>
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <MapPin size={16} color="var(--color-emergency)" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="text"
              className={`form-input ${fieldErrors.pickupAddress ? 'error' : ''}`}
              style={{ paddingLeft: '2.4rem' }}
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              placeholder="House/Plot No., Street, Metro Gate or Landmark..."
            />
          </div>
          {fieldErrors.pickupAddress && <span className="form-error-text">{fieldErrors.pickupAddress}</span>}
        </div>

        {/* Destination Address */}
        <div className="form-group">
          <label className="form-label">
            Destination / Hospital Name <span className="required">*</span>
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Hospital size={16} color="var(--color-primary)" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="text"
              className={`form-input ${fieldErrors.destinationAddress ? 'error' : ''}`}
              style={{ paddingLeft: '2.4rem' }}
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              placeholder="e.g. City Civil Hospital, Fortis, Apollo or Address..."
            />
          </div>
          {fieldErrors.destinationAddress && <span className="form-error-text">{fieldErrors.destinationAddress}</span>}
        </div>

        {/* Grid: Patient Name & Phone */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">
              Patient Full Name <span className="required">*</span>
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="text"
                className={`form-input ${fieldErrors.patientName ? 'error' : ''}`}
                style={{ paddingLeft: '2.4rem' }}
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Full Name"
              />
            </div>
            {fieldErrors.patientName && <span className="form-error-text">{fieldErrors.patientName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Emergency Contact Phone <span className="required">*</span>
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="tel"
                className={`form-input ${fieldErrors.patientPhone ? 'error' : ''}`}
                style={{ paddingLeft: '2.4rem' }}
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="+91 98765-43210"
              />
            </div>
            {fieldErrors.patientPhone && <span className="form-error-text">{fieldErrors.patientPhone}</span>}
          </div>
        </div>

        {/* Emergency Notes */}
        <div className="form-group">
          <label className="form-label">
            Emergency Condition / Patient Notes (Optional)
          </label>
          <textarea
            className="form-textarea"
            rows={3}
            value={emergencyNotes}
            onChange={(e) => setEmergencyNotes(e.target.value)}
            placeholder="e.g. Difficulty breathing, wheelchair required, 2nd floor with elevator..."
            maxLength={500}
          />
        </div>

        {/* Safety Disclaimer */}
        <div
          style={{
            backgroundColor: 'var(--color-emergency-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.82rem',
            color: 'var(--color-emergency)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <ShieldAlert size={18} />
          <span>
            AmbuNear transmits your request immediately. For unconscious or unresponsive patients, call 108/112 concurrently.
          </span>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-emergency btn-lg"
            style={{ minWidth: '220px' }}
          >
            {submitting ? 'Dispatching Request...' : '🚨 Confirm & Dispatch'}
          </button>
        </div>
      </form>
    </div>
  );
};
