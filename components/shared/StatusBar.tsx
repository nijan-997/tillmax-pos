'use client';

import React from 'react';
import { useSession } from '@/lib/session-context';
import { SyncStatusPill } from './SyncStatusPill';
import { useRouter } from 'next/navigation';
import { MANAGER_ACCENT } from '@/lib/theme';

interface StatusBarProps {
  isManagerMode?: boolean;
}

export function StatusBar({ isManagerMode = false }: StatusBarProps) {
  const { session, signOut } = useSession();
  const router = useRouter();

  return (
    <div
      style={{
        background: isManagerMode
          ? `linear-gradient(90deg, #1A1D21 0%, ${MANAGER_ACCENT}33 100%)`
          : '#1A1D21',
        color: '#E8EAED',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
        borderBottom: isManagerMode ? `2px solid ${MANAGER_ACCENT}` : '1px solid rgba(255,255,255,0.08)',
        zIndex: 100,
      }}
    >
      {/* Left: Store identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: '#1F5FD1',
            color: 'white',
            fontWeight: 700,
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '4px',
            letterSpacing: '0.05em',
          }}>
            TILLMAX
          </span>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
            RetailMAX POS
          </span>
        </div>
        <div style={{
          height: '16px',
          width: '1px',
          background: 'rgba(255,255,255,0.15)',
        }} />
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
          Till 01 · Store #001
        </span>
        {isManagerMode && (
          <span style={{
            background: MANAGER_ACCENT,
            color: 'white',
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 10px',
            borderRadius: '99px',
            letterSpacing: '0.04em',
          }}>
            MANAGER MODE
          </span>
        )}
      </div>

      {/* Centre: Staff name */}
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
        {session.staff?.name ?? '—'}
        {session.clockedIn && (
          <span style={{ color: '#107C10', fontSize: '11px', marginLeft: '8px' }}>● Clocked In</span>
        )}
      </div>

      {/* Right: Sync pill + Manager Mode btn */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <SyncStatusPill />

        {!isManagerMode && session.staff?.role !== 'Till Staff' && (
          <button
            onClick={() => router.push('/manager/elevate')}
            aria-label="Enter Manager Mode"
            style={{
              background: `${MANAGER_ACCENT}22`,
              border: `1px solid ${MANAGER_ACCENT}66`,
              color: '#C4A8FF',
              borderRadius: '6px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.03em',
              transition: 'all 150ms',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = `${MANAGER_ACCENT}44`;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = `${MANAGER_ACCENT}22`;
            }}
          >
            Manager
          </button>
        )}

        {isManagerMode && (
          <button
            onClick={() => router.push('/cashier/sale')}
            aria-label="Exit Manager Mode"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)',
              borderRadius: '6px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ← Exit
          </button>
        )}

        {session.staff && (
          <button
            onClick={signOut}
            aria-label="Sign out"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.5)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}
