'use client';

import React from 'react';
import { useSession } from '@/lib/session-context';

export function SyncStatusPill() {
  const { session, toggleSync } = useSession();
  const { online, pendingCount } = session.syncStatus;

  const isOnline = online && pendingCount === 0;
  const isPending = online && pendingCount > 0;
  const isOffline = !online;

  let bg: string;
  let textColor: string;
  let label: string;
  let dot: string;

  if (isOnline) {
    bg = 'rgba(16, 124, 16, 0.2)';
    textColor = '#4EC94E';
    dot = '#4EC94E';
    label = 'Synced';
  } else if (isPending) {
    bg = 'rgba(240, 163, 10, 0.2)';
    textColor = '#F0A30A';
    dot = '#F0A30A';
    label = `${pendingCount} waiting`;
  } else {
    bg = 'rgba(196, 49, 75, 0.2)';
    textColor = '#FF6B85';
    dot = '#FF6B85';
    label = 'Offline';
  }

  return (
    <button
      onClick={toggleSync}
      title="Click to toggle sync state (prototype demo)"
      aria-label={`Sync status: ${label}. Click to toggle.`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: bg,
        border: `1px solid ${dot}44`,
        borderRadius: '99px',
        padding: '3px 10px 3px 8px',
        cursor: 'pointer',
        transition: 'all 150ms',
        fontFamily: 'inherit',
      }}
    >
      {/* Animated dot */}
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: dot,
          flexShrink: 0,
          boxShadow: isOnline ? `0 0 6px ${dot}` : 'none',
          animation: isOffline ? 'none' : isPending ? 'pulse 1.5s infinite' : 'none',
        }}
      />
      <span style={{ fontSize: '12px', fontWeight: 600, color: textColor, whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </button>
  );
}
