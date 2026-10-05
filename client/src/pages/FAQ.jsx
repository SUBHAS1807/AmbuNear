import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

const FAQ_DATA = [
  {
    category: 'Booking & Dispatch',
    items: [
      {
        q: 'How does AmbuNear calculate distances to available ambulances?',
        a: 'The platform calculates spherical surface distances using the Haversine formula based on the geographic coordinates of your pickup location and the driver’s last updated coordinates.',
      },
      {
        q: 'What happens if two people try to book the same ambulance at the same time?',
        a: 'AmbuNear uses atomic database reservation locks. When a booking request is initiated, the selected ambulance’s status is immediately updated to BUSY. The first request succeeds, and the second user is gently advised that the vehicle has just become unavailable and prompted to select another unit.',
      },
      {
        q: 'Can I cancel an ambulance request after submitting?',
        a: 'Yes. You can cancel your booking as long as the trip is in REQUESTED, ACCEPTED, or ON_THE_WAY status. Once cancelled, the ambulance is immediately released back to the available pool. Please only cancel if genuinely necessary so ambulances remain free for others.',
      },
    ],
  },
  {
    category: 'Drivers & Fleet Verification',
    items: [
      {
        q: 'Who drives the ambulances on AmbuNear?',
        a: 'Ambulances are operated by licensed drivers and ambulance service providers. Drivers submit their commercial driving license credentials during onboarding, which are verified by platform administrators before active deployment.',
      },
      {
        q: 'How can drivers update their availability status?',
        a: 'Drivers have access to a dedicated Driver Portal where they can switch their status between AVAILABLE and OFFLINE at any time. When marked OFFLINE, their ambulance will not appear in user search results.',
      },
    ],
  },
  {
    category: 'Emergency Boundaries & Privacy',
    items: [
      {
        q: 'Does AmbuNear collect sensitive health or medical diagnosis history?',
        a: 'No. AmbuNear collects only the minimal information required for dispatch: patient name, emergency phone number, pickup location, destination hospital, and optional notes (e.g. oxygen required). We do not record or share private medical history.',
      },
      {
        q: 'Is AmbuNear a replacement for national emergency lines (108 / 112)?',
        a: 'No. AmbuNear is a technological booking and coordination tool. In catastrophic or life-threatening emergencies, we encourage callers to dial 108 or 112 immediately.',
      },
    ],
  },
];

export const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState({});

  const toggle = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.25rem 5rem', maxWidth: '820px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Frequently Asked Questions</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Find answers regarding booking workflows, driver onboarding, and platform safety.
        </p>

        {/* Search Bar */}
        <div style={{ maxWidth: '500px', margin: '1.75rem auto 0', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {FAQ_DATA.map((cat, catIdx) => {
          const filteredItems = cat.items.filter(
            (item) =>
              item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.a.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={cat.category}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                {cat.category}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredItems.map((item, itemIdx) => {
                  const id = `${catIdx}-${itemIdx}`;
                  const isExpanded = !!expanded[id];

                  return (
                    <div
                      key={item.q}
                      className="card"
                      style={{
                        padding: '0',
                        overflow: 'hidden',
                        borderColor: isExpanded ? 'var(--border-focus)' : 'var(--border-light)',
                      }}
                    >
                      <button
                        onClick={() => toggle(id)}
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
                        <span>{item.q}</span>
                        <ChevronDown
                          size={18}
                          style={{
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                            transition: 'transform var(--transition-fast)',
                            color: 'var(--text-muted)',
                            flexShrink: 0,
                            marginLeft: '0.5rem',
                          }}
                        />
                      </button>

                      {isExpanded && (
                        <div
                          style={{
                            padding: '0 1.25rem 1.25rem',
                            fontSize: '0.92rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.55,
                          }}
                        >
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
