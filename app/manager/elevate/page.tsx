'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/session-context';
import { STAFF } from '@/lib/mock-data/staff';
import { MANAGER_ACCENT } from '@/lib/theme';

export default function ElevatePage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const { signIn } = useSession();
  const router = useRouter();

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  function handleKey(k: string) {
    if (k === '⌫') { setPin((p) => p.slice(0,-1)); setError(''); return; }
    if (pin.length >= 6) return;
    setPin((p) => p + k);
  }

  function handleSubmit() {
    const member = STAFF.find(
      (s) => s.pin === pin && (s.role === 'Manager' || s.role === 'Administrator' || s.role === 'Supervisor')
    );
    if (member) {
      signIn(pin);
      router.push('/manager/dashboard');
    } else {
      const next = attempts + 1;
      setAttempts(next);
      setError(`Incorrect manager PIN. ${Math.max(0, 5 - next)} attempt${5 - next !== 1 ? 's' : ''} remaining.`);
      setPin('');
    }
  }

  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(135deg, #0D1117 0%, #1A1040 100%)`,
      padding: '40px',
    }}>
      <div style={{
        background: 'rgba(107,79,204,0.08)',
        border: `1px solid ${MANAGER_ACCENT}44`,
        borderRadius: '20px',
        padding: '36px',
        width: '340px',
        backdropFilter: 'blur(20px)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔐</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>Manager Access</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '6px' }}>
            Managers, Supervisors & Administrators
          </div>
        </div>

        {/* PIN display */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            fontSize: '32px', letterSpacing: '12px', minHeight: '48px',
            color: error ? '#FF6B85' : 'rgba(255,255,255,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {pin.length > 0 ? '●'.repeat(pin.length) : '· · · ·'}
          </div>
          {error && <div style={{ fontSize: '12px', color: '#FF6B85', marginTop: '8px' }}>{error}</div>}
        </div>

        {/* Keypad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
          {keys.map((k, i) => (
            k === '' ? <div key={`e-${i}`} /> : (
              <button
                key={k}
                onClick={() => handleKey(k)}
                aria-label={k === '⌫' ? 'Backspace' : k}
                style={{
                  height: '72px', borderRadius: '12px',
                  background: k === '⌫' ? 'rgba(255,255,255,0.06)' : 'rgba(107,79,204,0.15)',
                  border: `1px solid ${MANAGER_ACCENT}33`,
                  color: 'rgba(255,255,255,0.9)', fontSize: '24px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 120ms',
                }}
                onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${MANAGER_ACCENT}44`; }}
                onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.background = k === '⌫' ? 'rgba(255,255,255,0.06)' : 'rgba(107,79,204,0.15)'; }}
              >
                {k}
              </button>
            )
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={pin.length < 4}
          aria-label="Confirm manager PIN"
          style={{
            width: '100%', height: '60px', borderRadius: '12px',
            background: pin.length >= 4 ? MANAGER_ACCENT : 'rgba(107,79,204,0.3)',
            border: 'none', color: 'white', fontSize: '17px', fontWeight: 700,
            cursor: pin.length >= 4 ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit', transition: 'all 150ms',
            boxShadow: pin.length >= 4 ? '0 4px 16px rgba(107,79,204,0.5)' : 'none',
          }}
        >
          Enter Manager Mode →
        </button>

        <button
          onClick={() => router.push('/cashier/sale')}
          aria-label="Cancel and return to sale"
          style={{
            width: '100%', height: '44px', borderRadius: '10px', marginTop: '10px',
            background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.4)', fontSize: '13px',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >← Cancel</button>
      </div>
    </div>
  );
}
