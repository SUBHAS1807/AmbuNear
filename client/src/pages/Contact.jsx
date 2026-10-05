import React, { useState } from 'react';
import { Mail, PhoneCall, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { toastSuccess } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toastSuccess('Message received. The pilot team will respond shortly.');
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.25rem 5rem', maxWidth: '840px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Contact & Pilot Support</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Have questions regarding the pilot deployment or want to register an ambulance fleet?
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {/* Contact Information */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Support Information</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.92rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <PhoneCall size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 600 }}>Emergency Hotline</div>
                <div style={{ color: 'var(--color-emergency)', fontWeight: 700 }}>108 / 112 (Toll Free)</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Mail size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 600 }}>Pilot Desk Email</div>
                <div style={{ color: 'var(--text-secondary)' }}>support@ambunear.com</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <MapPin size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 600 }}>Operating Headquarters</div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  Department of Computer Science & Engineering, Pilot Innovation Lab, Delhi-NCR
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="card" style={{ padding: '2rem' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <CheckCircle2 size={48} color="var(--color-available)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Thank You for Reaching Out</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Your message has been logged. Our student development and coordination team will get back to you.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Pilot inquiry, fleet onboarding, or feedback"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  required
                  rows={4}
                  className="form-textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you?"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <Send size={16} /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
