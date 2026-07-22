'use client';

import React, { useState } from 'react';
import { NumericKeypadOverlay } from './NumericKeypadOverlay';
import { MANAGER_ACCENT } from '@/lib/theme';
import { STAFF } from '@/lib/mock-data/staff';

export type ApprovalType = 'void' | 'refund' | 'price-override' | 'discount-limit';

interface ManagerElevationModalProps {
  type: ApprovalType;
  context?: string; // e.g. "Void: Warburtons White Sliced £1.49"
  onApprove: () => void;
  onDeny: () => void;
}

const APPROVAL_LABELS: Record<ApprovalType, { title: string; colour: string }> = {
  void: { title: 'Void Authorisation Required', colour: '#C4314B' },
  refund: { title: 'Refund Authorisation Required', colour: '#C4314B' },
  'price-override': { title: 'Price Override Authorisation', colour: '#F0A30A' },
  'discount-limit': { title: 'Discount Limit Exceeded', colour: '#F0A30A' },
};

export function ManagerElevationModal({ type, context, onApprove, onDeny }: ManagerElevationModalProps) {
  const [pinValue, setPinValue] = useState('0');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const { title, colour } = APPROVAL_LABELS[type];

  function handleConfirm(pin: string) {
    const manager = STAFF.find(
      (s) => s.pin === pin && (s.role === 'Manager' || s.role === 'Administrator' || s.role === 'Supervisor')
    );
    if (manager) {
      setError('');
      onApprove();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(newAttempts >= 3 ? 'Too many attempts. Please contact your manager.' : 'Incorrect manager PIN. Try again.');
      setPinValue('0');
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.97)',
          borderRadius: '16px',
          width: '360px',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
          border: `1px solid ${MANAGER_ACCENT}44`,
        }}
      >
        {/* Header bar */}
        <div style={{
          background: MANAGER_ACCENT,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span style={{ fontSize: '22px' }}>🔐</span>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>{title}</div>
            {context && (
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', marginTop: '2px' }}>{context}</div>
            )}
          </div>
        </div>

        {/* Approval badge */}
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{
            background: `${colour}15`,
            border: `1px solid ${colour}44`,
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '13px',
            color: colour,
            fontWeight: 600,
            marginBottom: '4px',
          }}>
            ⚠️ Manager approval required to proceed
          </div>
        </div>

        {/* PIN pad */}
        <div style={{ padding: '8px 20px 20px' }}>
          <NumericKeypadOverlay
            title="Enter Manager PIN"
            subtitle="Supervisors, Managers and Administrators can approve"
            value={pinValue}
            onChange={setPinValue}
            onConfirm={handleConfirm}
            onCancel={onDeny}
            confirmLabel="Approve"
          />
        </div>

        {error && (
          <div style={{
            padding: '0 20px 16px',
            color: '#C4314B',
            fontSize: '13px',
            fontWeight: 500,
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
