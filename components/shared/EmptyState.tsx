'use client';

import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = '🛍️', title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '48px 24px',
      textAlign: 'center',
      opacity: 0.6,
    }}>
      <span style={{ fontSize: '48px', lineHeight: 1 }}>{icon}</span>
      <div style={{ fontSize: '18px', fontWeight: 600, color: '#4A5168' }}>{title}</div>
      {description && (
        <div style={{ fontSize: '14px', color: '#7A8099', maxWidth: '260px', lineHeight: 1.5 }}>
          {description}
        </div>
      )}
      {action && <div style={{ marginTop: '8px' }}>{action}</div>}
    </div>
  );
}
