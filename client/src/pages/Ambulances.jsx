import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Navigation,
  Search,
  Filter,
  Ambulance,
  PhoneCall,
  Clock,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import { InteractiveMap } from '../components/InteractiveMap';
import { formatDistance, formatCurrency, formatTimeAgo } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export const Ambulances = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toastError, toastInfo } = useToast();

  // Search State
  const [latitude, setLatitude] = useState(() => searchParams.get('lat') || '28.6139');
  const [longitude, setLongitude] = useState(() => searchParams.get('lng') || '77.2090');
  const [addressInput, setAddressInput] = useState(() => searchParams.get('address') || 'Delhi-NCR Pilot Area');
  const [radiusKm, setRadiusKm] = useState('25');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Data & Loading State
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState(null);
  const [geoLocating, setGeoLocating] = useState(false);

  // Fetch nearby ambulances
  const fetchNearby = async (lat, lng, radius) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.ambulances.getNearby(lat, lng, radius);
      if (res.success && res.data) {
        setAmbulances(res.data.ambulances || []);
        if (res.data.ambulances.length > 0) {
          setSelectedAmbulanceId(res.data.ambulances[0]._id);
        }
      }
    } catch (err) {
      console.error('Fetch ambulances failed:', err);
      setError(err.message || 'Unable to retrieve nearby ambulances.');
      // If server failed (e.g. offline local DB), set empty or fallback
      setAmbulances([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearby(latitude, longitude, radiusKm);
  }, [latitude, longitude, radiusKm]);

  // Request browser geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toastError('Browser geolocation is not supported on this browser.');
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocating(false);
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        setLatitude(lat);
        setLongitude(lng);
        setAddressInput('Current GPS Location');
        setSearchParams({ lat, lng });
        toastInfo('Updated to your current location.');
      },
      (err) => {
        setGeoLocating(false);
        toastError('Location access denied. Please enter your location coordinates or address.');
      },
      { timeout: 8000 }
    );
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    fetchNearby(latitude, longitude, radiusKm);
  };

  // Filter ambulances by type
  const filteredAmbulances = ambulances.filter((amb) => {
    if (typeFilter === 'ALL') return true;
    return amb.ambulanceType === typeFilter;
  });

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      {/* Search Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Ambulance size={28} color="var(--color-emergency)" />
          <h1 style={{ fontSize: '1.85rem' }}>Find Nearby Ambulances</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Real-time availability of verified ambulances operating in your vicinity.
        </p>
      </div>

      {/* Search & Location Bar Card */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '2rem',
          border: '1px solid var(--border-medium)',
        }}
      >
        <form onSubmit={handleManualSearch}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              alignItems: 'flex-end',
            }}
          >
            {/* Address / Location */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Pickup Location / City</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <MapPin size={16} color="var(--color-emergency)" style={{ position: 'absolute', left: '10px' }} />
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.2rem' }}
                  placeholder="Enter area or landmark..."
                />
              </div>
            </div>

            {/* Radius Filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Search Radius</label>
              <select
                value={radiusKm}
                onChange={(e) => setRadiusKm(e.target.value)}
                className="form-select"
              >
                <option value="5">Within 5 km (Immediate)</option>
                <option value="15">Within 15 km (City Zone)</option>
                <option value="25">Within 25 km (Metro Region)</option>
                <option value="50">Within 50 km (Extended)</option>
              </select>
            </div>

            {/* Ambulance Type Filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Ambulance Category</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="form-select"
              >
                <option value="ALL">All Categories</option>
                <option value="BASIC_LIFE_SUPPORT">Basic Life Support (BLS)</option>
                <option value="ADVANCED_LIFE_SUPPORT">Advanced Life Support (ICU)</option>
                <option value="PATIENT_TRANSPORT">Patient Transport</option>
              </select>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={geoLocating}
                className="btn btn-secondary"
                style={{ flex: 1 }}
                title="Detect GPS location"
              >
                <Navigation size={16} />
                <span>{geoLocating ? 'Locating...' : 'GPS'}</span>
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <Search size={16} />
                <span>Search</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Demo Data Notice */}
      <div
        className="alert alert-info"
        style={{ fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <Info size={18} />
        <span>
          <strong>Pilot Demonstration Mode:</strong> Displaying test ambulances in Delhi-NCR pilot area. Distances are calculated using coordinate geometry.
        </span>
      </div>

      {/* Split View: Map + Ambulance Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Interactive Radar Map */}
        <div>
          <InteractiveMap
            userCoords={{ latitude: parseFloat(latitude), longitude: parseFloat(longitude) }}
            ambulances={filteredAmbulances}
            selectedAmbulanceId={selectedAmbulanceId}
            onSelectAmbulance={(amb) => setSelectedAmbulanceId(amb._id)}
            searchRadiusKm={radiusKm}
          />
        </div>

        {/* Right Column: Ambulance List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>
              Available Ambulances ({filteredAmbulances.length})
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Sorted by closest proximity
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="card skeleton" style={{ height: '140px' }} />
              ))}
            </div>
          ) : error ? (
            <div className="alert alert-emergency">
              <AlertTriangle size={20} />
              <div>
                <strong>Error fetching fleet data:</strong> {error}
              </div>
            </div>
          ) : filteredAmbulances.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <Ambulance size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>No Available Ambulances in this Radius</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                All nearby units may currently be occupied or outside your selected {radiusKm} km search radius.
              </p>
              <button
                onClick={() => setRadiusKm('50')}
                className="btn btn-secondary btn-sm"
              >
                Expand search radius to 50 km
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredAmbulances.map((amb) => {
                const isSelected = selectedAmbulanceId === amb._id;
                return (
                  <div
                    key={amb._id}
                    className="card"
                    onClick={() => setSelectedAmbulanceId(amb._id)}
                    style={{
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-light)',
                      backgroundColor: isSelected ? 'var(--color-primary-subtle)' : 'var(--bg-surface)',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            {amb.vehicleNumber}
                          </span>
                          <span className="badge badge-available">● Available</span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {amb.ambulanceType.replace(/_/g, ' ')}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-emergency)' }}>
                          ~{amb.estimatedEtaMinutes || 5} mins
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {formatDistance(amb.distanceKm)} away
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      <MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                      {amb.humanReadableAddress || 'Pilot Operating Station'}
                    </div>

                    {/* Equipment tags */}
                    {amb.equipment && amb.equipment.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                        {amb.equipment.slice(0, 3).map((eq) => (
                          <span
                            key={eq}
                            style={{
                              fontSize: '0.75rem',
                              backgroundColor: 'var(--bg-subtle)',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            ✓ {eq}
                          </span>
                        ))}
                      </div>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid var(--border-light)',
                        paddingTop: '0.75rem',
                        marginTop: '0.5rem',
                      }}
                    >
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Updated {formatTimeAgo(amb.locationUpdatedAt)}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/book/${amb._id}?lat=${latitude}&lng=${longitude}&address=${encodeURIComponent(addressInput)}`);
                        }}
                        className="btn btn-emergency btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <span>Book Ambulance</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
