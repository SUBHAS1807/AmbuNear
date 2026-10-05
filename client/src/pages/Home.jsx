import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Ambulance,
  MapPin,
  Clock,
  ShieldCheck,
  PhoneCall,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Navigation,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { captureUtmParameters } from '../utils/utm';
import { useToast } from '../context/ToastContext';

export const Home = () => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [faqExpanded, setFaqExpanded] = useState({ 0: true });
  const navigate = useNavigate();
  const { toastInfo, toastError } = useToast();

  useEffect(() => {
    captureUtmParameters();
  }, []);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toastError('Browser geolocation is not supported on this device.');
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingLocation(false);
        const { latitude, longitude } = pos.coords;
        toastInfo('Location detected! Redirecting to available ambulances.');
        navigate(`/ambulances?lat=${latitude}&lng=${longitude}`);
      },
      (err) => {
        setDetectingLocation(false);
        toastError('Location permission denied or unavailable. Please enter your address manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (pickupAddress.trim()) {
      navigate(`/ambulances?address=${encodeURIComponent(pickupAddress.trim())}`);
    } else {
      navigate('/ambulances');
    }
  };

  const toggleFaq = (idx) => {
    setFaqExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const homeFaqs = [
    {
      q: 'How does AmbuNear locate nearby ambulances?',
      a: 'AmbuNear uses your browser GPS coordinates or street address and matches them with active registered ambulances in the pilot operating area using distance calculations.',
    },
    {
      q: 'Does AmbuNear guarantee arrival time?',
      a: 'No platform can guarantee exact traffic or arrival times. AmbuNear provides approximate estimates based on distance and route conditions. In extreme life-threatening emergencies, dial 108 or 112 directly.',
    },
    {
      q: 'Can I choose between Basic Life Support (BLS) and Advanced (ICU) ambulances?',
      a: 'Yes. On the ambulance discovery page, you can filter by ambulance type and review on-board equipment such as oxygen cylinders, ventilators, and stretchers before requesting.',
    },
    {
      q: 'How do drivers confirm bookings?',
      a: 'When you submit a request, it is dispatched instantly to the assigned driver’s portal. Once the driver accepts, you will see real-time status transitions from "On The Way" to "Arrived".',
    },
  ];

  return (
    <div>
      {/* Top Hero Section */}
      <section
        style={{
          background: 'radial-gradient(circle at 50% 0%, var(--bg-subtle) 0%, var(--bg-primary) 100%)',
          padding: '4rem 0 3.5rem',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '880px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-emergency-subtle)',
              color: 'var(--color-emergency)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
            }}
          >
            <ShieldAlert size={15} /> Emergency Ambulance Coordination
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em',
            }}
          >
            Emergency Help, <span style={{ color: 'var(--color-emergency)' }}>Closer to You.</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              color: 'var(--text-secondary)',
              marginBottom: '2.5rem',
              lineHeight: 1.6,
            }}
          >
            Find, book, and coordinate with nearby verified ambulance drivers in real time. Fast, direct, and accessible when every second counts.
          </p>

          {/* Quick Location Search Bar Card */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-medium)',
              textAlign: 'left',
              maxWidth: '720px',
              margin: '0 auto',
            }}
          >
            <form onSubmit={handleSearchSubmit}>
              <label
                htmlFor="pickup-input"
                style={{
                  display: 'block',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)',
                }}
              >
                Where is the patient located?
              </label>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                <div style={{ flex: '1 1 280px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <MapPin
                    size={18}
                    color="var(--color-emergency)"
                    style={{ position: 'absolute', left: '12px' }}
                  />
                  <input
                    id="pickup-input"
                    type="text"
                    placeholder="Enter landmark, street or city..."
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detectingLocation}
                  className="btn btn-secondary"
                  title="Detect my current coordinates"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Navigation size={16} />
                  <span>{detectingLocation ? 'Locating...' : 'Use GPS'}</span>
                </button>

                <button
                  type="submit"
                  className="btn btn-emergency"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Search size={18} />
                  <span>Find Nearby Ambulances</span>
                </button>
              </div>
            </form>

            <div
              style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}
            >
              <span>Pilot Operating Region: Delhi-NCR Test Area</span>
              <a href="tel:108" style={{ color: 'var(--color-emergency)', fontWeight: 600 }}>
                Direct Emergency Call: 108
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>How AmbuNear Works</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              A straightforward three-step process built to minimize delays during emergencies.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Step 1 */}
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-subtle)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <MapPin size={26} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                STEP 1
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Locate & Discover</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Share your GPS location or type your pickup address to see all available ambulances nearby with distance and estimated arrival time.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-emergency-subtle)',
                  color: 'var(--color-emergency)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <Ambulance size={26} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-emergency)', marginBottom: '0.25rem' }}>
                STEP 2
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Book & Dispatch</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Select an ambulance equipped for your patient's needs, enter destination details, and dispatch your request directly to the driver.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-available-subtle)',
                  color: 'var(--color-available)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <Clock size={26} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-available)', marginBottom: '0.25rem' }}>
                STEP 3
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Track & Coordinate</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Track the booking status live from driver acceptance to pickup and hospital arrival with direct driver contact details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>Platform Features & Standards</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Built with focus on data reliability, security, and clear emergency communication.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <CheckCircle2 color="var(--color-available)" size={22} />
                <h4 style={{ fontSize: '1.1rem' }}>Atomic Availability</h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Simultaneous booking safeguards ensure that once an ambulance is reserved, it cannot be double-booked by other users.
              </p>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <ShieldCheck color="var(--color-primary)" size={22} />
                <h4 style={{ fontSize: '1.1rem' }}>Driver & Fleet Verification</h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Commercial driver licenses and ambulance vehicle specifications are reviewed by platform administrators before activation.
              </p>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Clock color="var(--color-busy)" size={22} />
                <h4 style={{ fontSize: '1.1rem' }}>Sequential Trip State Machine</h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Strict server-side validation guarantees every trip moves sequentially through Requested, Accepted, En Route, Arrived, and Completed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expandable FAQ Section (Enhancement #19) */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-surface)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Clear answers about booking, coverage, and the platform’s scope.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {homeFaqs.map((faq, idx) => {
              const isExpanded = !!faqExpanded[idx];
              return (
                <div
                  key={faq.q}
                  className="card"
                  style={{
                    padding: '0',
                    overflow: 'hidden',
                    borderColor: isExpanded ? 'var(--border-focus)' : 'var(--border-light)',
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '1.15rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '0.98rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                    aria-expanded={isExpanded}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform var(--transition-fast)',
                        color: 'var(--text-muted)',
                      }}
                    />
                  </button>

                  {isExpanded && (
                    <div
                      style={{
                        padding: '0 1.25rem 1.15rem',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5,
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/faq" className="btn btn-outline btn-sm">
              View All Questions & Answers <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section
        style={{
          padding: '3rem 0',
          backgroundColor: 'var(--color-navy)',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '680px' }}>
          <h2 style={{ color: '#ffffff', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
            Need an ambulance immediately?
          </h2>
          <p style={{ color: '#94A3B8', marginBottom: '1.75rem', fontSize: '1rem' }}>
            Check real-time availability in your neighborhood without delays.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/ambulances" className="btn btn-emergency btn-lg">
              <Search size={18} /> Find Available Ambulances
            </Link>
            <a href="tel:108" className="btn btn-secondary btn-lg" style={{ color: '#0F172A' }}>
              <PhoneCall size={18} /> Call 108 Hotline
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
