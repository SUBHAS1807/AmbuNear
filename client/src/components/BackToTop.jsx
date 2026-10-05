import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="back-to-top no-print"
      aria-label="Scroll back to top of page"
      style={{
        position: 'fixed',
        bottom: '5.5rem',
        right: '1.5rem',
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-md)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9997,
        transition: 'transform var(--transition-fast), background-color var(--transition-fast)',
      }}
    >
      <ChevronUp size={20} />
    </button>
  );
};
