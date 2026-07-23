'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/session-context';
import { STAFF } from '@/lib/mock-data/staff';

type SignOnMode = 'cashier' | 'manager' | 'clockinout';

export default function SignOnPage() {
  const [mode, setMode] = useState<SignOnMode>('cashier');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [clockAction, setClockAction] = useState<'in' | 'out'>('in');
  const { signIn, clockIn, clockOut, session } = useSession();
  const router = useRouter();

  const quickStaff = STAFF.filter((s) => s.showOnSignOn);
  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  function handleKey(k: string) {
    if (locked) return;
    if (k === '⌫') { setPin((p) => p.slice(0, -1)); setError(''); return; }
    if (pin.length >= 6) return;
    setPin((p) => p + k);
  }

  function handleSubmit() {
    if (locked || pin.length < 4) { setError('PIN must be at least 4 digits'); return; }

    if (mode === 'clockinout') {
      const member = STAFF.find((s) => s.pin === pin);
      if (member) {
        if (clockAction === 'in') clockIn();
        else clockOut();
        setPin(''); setError('');
        return;
      } else {
        setError('PIN not recognised');
        setPin('');
        return;
      }
    }

    if (mode === 'manager') {
      const member = STAFF.find(
        (s) => s.pin === pin && (s.role === 'Manager' || s.role === 'Administrator')
      );
      if (member) {
        signIn(pin);
        router.push('/manager/elevate');
      } else {
        setError('Incorrect manager PIN');
        setPin('');
        const next = attempts + 1;
        setAttempts(next);
        if (next >= 5) setLocked(true);
      }
      return;
    }

    // Cashier mode
    const ok = signIn(pin);
    if (ok) {
      setPin(''); setError(''); setAttempts(0);
      router.push('/cashier/sale');
    } else {
      setPin('');
      const next = attempts + 1;
      setAttempts(next);
      if (next >= 5) {
        setLocked(true);
        setError('Till locked after 5 failed attempts. Manager unlock required.');
      } else {
        setError(`Incorrect PIN. ${5 - next} attempt${5 - next !== 1 ? 's' : ''} remaining.`);
      }
    }
  }

  function handleQuickStaff(staffPin: string) {
    setPin(staffPin);
    // Auto-submit
    const member = STAFF.find((s) => s.pin === staffPin);
    if (member) {
      signIn(staffPin);
      router.push('/cashier/sale');
    }
  }

  const pinDisplay = '●'.repeat(pin.length) + '·'.repeat(Math.max(0, 4 - pin.length));

  return (
    <div style={{
      minHeight: '100%',
      background: 'linear-gradient(135deg, #0D1117 0%, #161B2E 50%, #1A1340 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top branding bar */}
      <div style={{
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#1F5FD1',
            color: 'white',
            fontWeight: 800,
            fontSize: '15px',
            padding: '6px 12px',
            borderRadius: '6px',
            letterSpacing: '0.06em',
          }}>TILLMAX</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>RetailMAX POS</div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          {' · '}
          {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Main sign-on area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '60px',
        padding: '40px',
      }}>
        {/* Left: Quick staff selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '200px' }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Quick Sign In
          </div>
          {quickStaff.map((staff) => (
            <button
              key={staff.id}
              onClick={() => handleQuickStaff(staff.pin)}
              aria-label={`Sign in as ${staff.name}`}
              style={{
                height: '60px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.85)',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0 16px',
                transition: 'all 150ms',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(31,95,209,0.3)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(31,95,209,0.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#1F5FD1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {staff.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{staff.name}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{staff.role}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Centre: PIN pad */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '32px',
          width: '320px',
          backdropFilter: 'blur(20px)',
        }}>
          {/* Mode tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '4px' }}>
            {(['cashier', 'manager'] as SignOnMode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setPin(''); setError(''); }}
                aria-label={`${m} sign-in mode`}
                style={{
                  flex: 1,
                  height: '36px',
                  borderRadius: '7px',
                  background: mode === m ? (m === 'manager' ? '#6B4FCC' : '#1F5FD1') : 'transparent',
                  border: 'none',
                  color: mode === m ? 'white' : 'rgba(255,255,255,0.45)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  fontFamily: 'inherit',
                  transition: 'all 150ms',
                }}
              >
                {m === 'manager' ? '🔐 Manager' : '🧾 Cashier'}
              </button>
            ))}
          </div>

          {/* PIN display */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
          }}>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '12px' }}>
              {mode === 'manager' ? 'Manager PIN' : 'Enter your PIN'}
            </div>
            <div style={{
              fontSize: '32px',
              letterSpacing: '12px',
              color: error ? '#FF6B85' : 'rgba(255,255,255,0.9)',
              fontVariantNumeric: 'tabular-nums',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {pin.length > 0 ? '●'.repeat(pin.length) : '· · · ·'}
            </div>
            {error && (
              <div style={{ fontSize: '12px', color: '#FF6B85', marginTop: '8px', fontWeight: 500 }}>
                {error}
              </div>
            )}
            {locked && (
              <div style={{
                marginTop: '12px',
                background: 'rgba(196,49,75,0.15)',
                border: '1px solid rgba(196,49,75,0.4)',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '13px',
                color: '#FF6B85',
              }}>
                🔒 Till locked. Manager unlock required.
              </div>
            )}
          </div>

          {/* Keypad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
            {keys.map((k, i) => (
              k === '' ? (
                <div key={`empty-${i}`} />
              ) : (
                <button
                  key={k}
                  onClick={() => handleKey(k)}
                  disabled={locked}
                  aria-label={k === '⌫' ? 'Backspace' : k}
                  style={{
                    height: '72px',
                    borderRadius: '12px',
                    background: k === '⌫'
                      ? 'rgba(255,255,255,0.06)'
                      : 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: k === '⌫' ? '22px' : '24px',
                    fontWeight: 600,
                    cursor: locked ? 'not-allowed' : 'pointer',
                    opacity: locked ? 0.4 : 1,
                    transition: 'all 120ms',
                    fontFamily: 'inherit',
                  }}
                  onMouseDown={(e) => {
                    if (!locked) {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(31,95,209,0.4)';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.94)';
                    }
                  }}
                  onMouseUp={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = k === '⌫' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                  }}
                >
                  {k}
                </button>
              )
            ))}
          </div>

          {/* Sign In button */}
          <button
            onClick={handleSubmit}
            disabled={locked || pin.length < 4}
            aria-label="Sign In"
            style={{
              width: '100%',
              height: '60px',
              borderRadius: '12px',
              background: mode === 'manager' ? '#6B4FCC' : '#1F5FD1',
              border: 'none',
              color: 'white',
              fontSize: '17px',
              fontWeight: 700,
              cursor: locked || pin.length < 4 ? 'not-allowed' : 'pointer',
              opacity: locked || pin.length < 4 ? 0.5 : 1,
              transition: 'all 150ms',
              fontFamily: 'inherit',
              boxShadow: mode === 'manager'
                ? '0 4px 16px rgba(107,79,204,0.4)'
                : '0 4px 16px rgba(31,95,209,0.4)',
            }}
          >
            {mode === 'manager' ? '🔐 Enter Manager Mode' : 'Sign In →'}
          </button>
        </div>

        {/* Right: Clock In/Out — SEPARATE from sign-on per spec */}
        <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Clock In / Out
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px',
            padding: '20px',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '16px', lineHeight: 1.4 }}>
              Clock in/out is separate from till sign-on. Enter your PIN below.
            </div>

            {/* Clock action toggle */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '3px' }}>
              {(['in', 'out'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setClockAction(a)}
                  aria-label={`Clock ${a}`}
                  style={{
                    flex: 1,
                    height: '32px',
                    borderRadius: '6px',
                    background: clockAction === a ? (a === 'in' ? '#107C10' : '#C4314B') : 'transparent',
                    border: 'none',
                    color: clockAction === a ? 'white' : 'rgba(255,255,255,0.4)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 150ms',
                  }}
                >
                  {a === 'in' ? '▶ Clock In' : '■ Clock Out'}
                </button>
              ))}
            </div>

            <button
              onClick={() => { setMode('clockinout'); }}
              aria-label="Go to clock in/out"
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '10px',
                background: clockAction === 'in' ? 'rgba(16,124,16,0.2)' : 'rgba(196,49,75,0.2)',
                border: `1.5px solid ${clockAction === 'in' ? 'rgba(16,124,16,0.5)' : 'rgba(196,49,75,0.5)'}`,
                color: clockAction === 'in' ? '#4EC94E' : '#FF6B85',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {clockAction === 'in' ? '▶ Clock In with PIN' : '■ Clock Out with PIN'}
            </button>

            {session.clockedIn && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#4EC94E', textAlign: 'center' }}>
                ● Currently clocked in
              </div>
            )}
          </div>

          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', lineHeight: 1.5 }}>
            Clock in/out is logged separately from till transactions for shift reporting.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 32px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        color: 'rgba(255,255,255,0.2)',
        fontSize: '11px',
      }}>
        <span>RetailMAX POS v2.0 — Interactive Prototype</span>
        <span>Till 01 · Store #001 · TILLMAX EPOS Ecosystem</span>
      </div>
    </div>
  );
}
