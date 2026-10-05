import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ambulance, User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PATIENT');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  const { register } = useAuth();
  const { toastSuccess } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Full name is required.';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Valid email is required.';
    if (!phone.trim() || !/^[0-9+() -]{7,20}$/.test(phone)) errors.phone = 'Valid phone number is required.';
    if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters.';
    if (role === 'DRIVER' && !licenseNumber.trim()) {
      errors.licenseNumber = 'Commercial driving license number is required for drivers.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role,
        ...(role === 'DRIVER' && { licenseNumber: licenseNumber.trim().toUpperCase() }),
      };

      const newUser = await register(payload);
      toastSuccess('Registration successful! Welcome to AmbuNear.');

      if (newUser.role === 'DRIVER') {
        navigate('/driver-dashboard', { replace: true });
      } else {
        navigate('/ambulances', { replace: true });
      }
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please check your submitted details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.25rem 6rem', maxWidth: '520px' }}>
      <div className="card" style={{ padding: '2.5rem 2rem', boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <Ambulance size={28} />
          </div>
          <h1 style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>Create AmbuNear Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Register to request nearby ambulances or register as a driver operator.
          </p>
        </div>

        {serverError && (
          <div className="alert alert-emergency" role="alert">
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">I want to register as:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setRole('PATIENT')}
                className={`btn ${role === 'PATIENT' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'center' }}
              >
                Patient / Citizen
              </button>
              <button
                type="button"
                onClick={() => setRole('DRIVER')}
                className={`btn ${role === 'DRIVER' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'center' }}
              >
                Ambulance Driver
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name <span className="required">*</span></label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="text"
                required
                className={`form-input ${fieldErrors.name ? 'error' : ''}`}
                style={{ paddingLeft: '2.4rem' }}
                placeholder="Rahul Verma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {fieldErrors.name && <span className="form-error-text">{fieldErrors.name}</span>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">Contact Phone Number <span className="required">*</span></label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="tel"
                required
                className={`form-input ${fieldErrors.phone ? 'error' : ''}`}
                style={{ paddingLeft: '2.4rem' }}
                placeholder="+91 98765-43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            {fieldErrors.phone && <span className="form-error-text">{fieldErrors.phone}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address <span className="required">*</span></label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="email"
                required
                className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                style={{ paddingLeft: '2.4rem' }}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {fieldErrors.email && <span className="form-error-text">{fieldErrors.email}</span>}
          </div>

          {/* If Driver: License Number */}
          {role === 'DRIVER' && (
            <div className="form-group" style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <label className="form-label">
                Commercial Driving License Number <span className="required">*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FileText size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
                <input
                  type="text"
                  required
                  className={`form-input ${fieldErrors.licenseNumber ? 'error' : ''}`}
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="DL-042026001234"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                />
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Subject to administrative verification before full fleet assignment.
              </div>
              {fieldErrors.licenseNumber && <span className="form-error-text">{fieldErrors.licenseNumber}</span>}
            </div>
          )}

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password <span className="required">*</span></label>
            <div className="password-input-wrapper">
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                style={{ paddingLeft: '2.4rem', paddingRight: '2.5rem' }}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.password && <span className="form-error-text">{fieldErrors.password}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-light)',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
          }}
        >
          Already registered?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
