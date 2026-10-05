import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Ambulance, ShieldCheck, HelpCircle, FileText } from 'lucide-react';

const SEARCHABLE_CONTENT = [
  {
    title: 'Find Nearby Ambulances',
    description: 'Search available ambulances in your area by GPS or address.',
    link: '/ambulances',
    category: 'Emergency Dispatch',
    icon: Ambulance,
  },
  {
    title: 'Emergency Safety Guidelines',
    description: 'First aid instructions, what to do while waiting for ambulance arrival.',
    link: '/safety',
    category: 'Safety & First Aid',
    icon: ShieldCheck,
  },
  {
    title: 'How It Works (3 Steps)',
    description: 'Discover nearby ambulances, book instantly, and track driver status.',
    link: '/how-it-works',
    category: 'Guides',
    icon: FileText,
  },
  {
    title: 'Frequently Asked Questions (FAQ)',
    description: 'Common questions on response times, driver approval, and cancellations.',
    link: '/faq',
    category: 'Help Center',
    icon: HelpCircle,
  },
  {
    title: 'Ambulance Types & Life Support',
    description: 'Difference between Basic Life Support (BLS) and Advanced (ALS ICU).',
    link: '/ambulances',
    category: 'Fleet Information',
    icon: Ambulance,
  },
  {
    title: 'Contact Technical Helpdesk',
    description: 'Get in touch with the AmbuNear pilot coordination team.',
    link: '/contact',
    category: 'Support',
    icon: HelpCircle,
  },
  {
    title: 'Terms and Conditions',
    description: 'Platform scope, user responsibilities, and emergency boundaries.',
    link: '/terms',
    category: 'Legal',
    icon: FileText,
  },
  {
    title: 'Privacy Policy',
    description: 'Minimal data collection policies and privacy guarantees.',
    link: '/privacy',
    category: 'Legal',
    icon: FileText,
  },
];

export const SiteSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K and Esc listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else if (window.openSiteSearch) window.openSiteSearch();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = SEARCHABLE_CONTENT.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (link) => {
    navigate(link);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex].link);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Site Search">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px', padding: '1.25rem' }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            borderBottom: '1px solid var(--border-medium)',
            paddingBottom: '0.85rem',
            marginBottom: '1rem',
          }}
        >
          <Search size={20} color="var(--text-muted)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, safety advice, or questions..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              fontSize: '1rem',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
            }}
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.title}
                  onClick={() => handleSelect(item.link)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--color-primary-subtle)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color var(--transition-fast)',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      color: isSelected ? 'var(--color-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {item.description}
                    </div>
                  </div>
                  <ArrowRight size={16} color="var(--text-muted)" />
                </div>
              );
            })
          ) : (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No matching pages or articles found for "{query}".
            </div>
          )}
        </div>

        {/* Keyboard navigation hints */}
        <div
          style={{
            marginTop: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>Use &uarr; &darr; to navigate, Enter to select</span>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
};
