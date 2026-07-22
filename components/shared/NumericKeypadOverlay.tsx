'use client';

import React, { useEffect } from 'react';

interface NumericKeypadOverlayProps {
  title: string;
  subtitle?: string;
  value: string;
  onChange: (val: string) => void;
  onConfirm: (val: string) => void;
  onCancel: () => void;
  /** Optional toggle strip (e.g. %/£ switch) */
  toggle?: React.ReactNode;
  confirmLabel?: string;
  /** If true, displays the value as currency £ */
  isCurrency?: boolean;
}

export function NumericKeypadOverlay({
  title,
  subtitle,
  value,
  onChange,
  onConfirm,
  onCancel,
  toggle,
  confirmLabel = 'Apply',
  isCurrency = false,
}: NumericKeypadOverlayProps) {
  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '⌫'];

  function handleKey(k: string) {
    if (k === '⌫') {
      onChange(value.slice(0, -1) || '0');
    } else if (k === '.' && value.includes('.')) {
      return; // only one decimal
    } else {
      onChange(value === '0' ? k : value + k);
    }
  }

  // Keyboard support
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') { onConfirm(value); return; }
      if (e.key === 'Escape') { onCancel(); return; }
      if (e.key === 'Backspace') { onChange(value.slice(0, -1) || '0'); return; }
      if (/^[0-9.]$/.test(e.key)) { handleKey(e.key); }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const displayValue = isCurrency ? `£${parseFloat(value || '0').toFixed(2)}` : value;

  return (
    // Backdrop
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onCancel}
    >
      {/* Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '24px',
          width: '320px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
          border: '1px solid rgba(255,255,255,0.8)',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#5A6072', marginBottom: '4px' }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: '12px', color: '#8A90A0' }}>{subtitle}</div>
          )}
        </div>

        {/* Toggle (e.g. %/£) */}
        {toggle && <div style={{ marginBottom: '12px' }}>{toggle}</div>}

        {/* Display value */}
        <div style={{
          textAlign: 'center',
          fontSize: '36px',
          fontWeight: 700,
          color: '#1A1D21',
          fontVariantNumeric: 'tabular-nums',
          background: '#F3F4F6',
          borderRadius: '10px',
          padding: '12px',
          marginBottom: '16px',
          minHeight: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          letterSpacing: '-0.02em',
        }}>
          {displayValue || '0'}
        </div>

        {/* Keypad grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
          {keys.map((k) => (
            <button
              key={k}
              onClick={() => handleKey(k)}
              aria-label={k === '⌫' ? 'Backspace' : k}
              style={{
                height: '64px',
                borderRadius: '10px',
                fontSize: k === '⌫' ? '22px' : '22px',
                fontWeight: k === '⌫' ? 400 : 600,
                background: k === '⌫' ? '#F0F2F5' : '#FFFFFF',
                border: '1.5px solid rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 120ms',
                fontFamily: 'inherit',
                color: '#1A1D21',
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#E0E4EF';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)';
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = k === '⌫' ? '#F0F2F5' : '#FFFFFF';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              {k}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onCancel}
            aria-label="Cancel"
            style={{
              flex: 1,
              height: '52px',
              borderRadius: '10px',
              background: 'transparent',
              border: '1.5px solid rgba(0,0,0,0.15)',
              fontSize: '15px',
              fontWeight: 600,
              color: '#5A6072',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(value)}
            aria-label={confirmLabel}
            style={{
              flex: 2,
              height: '52px',
              borderRadius: '10px',
              background: '#1F5FD1',
              border: 'none',
              fontSize: '16px',
              fontWeight: 700,
              color: '#FFFFFF',
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(31,95,209,0.35)',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
