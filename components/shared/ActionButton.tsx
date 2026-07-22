'use client';

import React, { ButtonHTMLAttributes } from 'react';

export type ActionButtonTier = 'primary' | 'neutral' | 'quiet';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tier: ActionButtonTier;
  label: string;
  icon?: React.ReactNode;
  size?: 'default' | 'large';
  fullWidth?: boolean;
}

const TIER_STYLES: Record<ActionButtonTier, React.CSSProperties> = {
  // PRIMARY: Payment — bold, filled, brand blue, unmistakable
  primary: {
    background: '#1F5FD1',
    color: '#FFFFFF',
    border: 'none',
    fontWeight: 700,
    fontSize: '17px',
    boxShadow: '0 4px 16px rgba(31, 95, 209, 0.4)',
  },
  // NEUTRAL: Hold, Discount — outlined, functional
  neutral: {
    background: 'rgba(255,255,255,0.9)',
    color: '#1A1D21',
    border: '1.5px solid rgba(0,0,0,0.15)',
    fontWeight: 600,
    fontSize: '15px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  // QUIET: Void, Cancel — text/subtle outline, visually de-emphasised
  quiet: {
    background: 'transparent',
    color: '#C4314B',
    border: '1px solid rgba(196, 49, 75, 0.3)',
    fontWeight: 500,
    fontSize: '14px',
    boxShadow: 'none',
  },
};

const TIER_HOVER: Record<ActionButtonTier, React.CSSProperties> = {
  primary: { background: '#1748A8', boxShadow: '0 6px 20px rgba(31, 95, 209, 0.5)' },
  neutral: { background: '#F0F2F5', borderColor: 'rgba(0,0,0,0.25)' },
  quiet: { background: 'rgba(196, 49, 75, 0.06)', borderColor: 'rgba(196, 49, 75, 0.5)' },
};

export function ActionButton({
  tier,
  label,
  icon,
  size = 'default',
  fullWidth = false,
  disabled,
  style,
  ...props
}: ActionButtonProps) {
  const [hovered, setHovered] = React.useState(false);
  const height = size === 'large' ? '72px' : '56px';

  return (
    <button
      aria-label={label}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: icon ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        height,
        minHeight: height,
        padding: size === 'large' ? '0 24px' : '0 16px',
        borderRadius: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'all 150ms',
        fontFamily: 'inherit',
        width: fullWidth ? '100%' : 'auto',
        userSelect: 'none',
        ...TIER_STYLES[tier],
        ...(hovered && !disabled ? TIER_HOVER[tier] : {}),
        ...style,
      }}
      {...props}
    >
      {icon && <span style={{ fontSize: size === 'large' ? '22px' : '18px' }}>{icon}</span>}
      <span style={{ lineHeight: 1.2 }}>{label}</span>
    </button>
  );
}
