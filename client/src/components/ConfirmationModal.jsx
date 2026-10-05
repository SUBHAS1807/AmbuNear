import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={isLoading ? undefined : onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              backgroundColor: isDestructive ? 'var(--color-emergency-subtle)' : 'var(--color-primary-subtle)',
              color: isDestructive ? 'var(--color-emergency)' : 'var(--color-primary)',
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 id="confirm-modal-title" style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>
              {title}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              {message}
            </p>
          </div>
          {!isLoading && (
            <button
              onClick={onCancel}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="btn btn-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`btn ${isDestructive ? 'btn-emergency' : 'btn-primary'}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
