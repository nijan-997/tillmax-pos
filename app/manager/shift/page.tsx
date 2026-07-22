'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NumericKeypadOverlay } from '@/components/shared/NumericKeypadOverlay';
import { PAY_IN_REASONS, PAY_OUT_REASONS, NO_SALE_REASONS } from '@/lib/mock-data/promotions';
import { MANAGER_ACCENT } from '@/lib/theme';

type ShiftAction = 'float' | 'payin' | 'payout' | 'cashdrop' | 'nosale-audit' | null;

function ActionPanel({
  title, icon, amount, setAmount, reason, setReason,
  reasons, onConfirm, onBack, colour,
}: {
  title: string; icon: string; amount: string; setAmount: (v: string) => void;
  reason: string; setReason: (v: string) => void; reasons?: string[];
  onConfirm: () => void; onBack: () => void; colour: string;
}) {
  const [showKeypad, setShowKeypad] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '56px' }}>✅</div>
        <div style={{ fontSize: '20px', fontWeight: 700 }}>{title} Recorded</div>
        <div style={{ fontSize: '14px', color: '#5A6072' }}>£{parseFloat(amount).toFixed(2)} — {reason}</div>
        <button onClick={onBack} aria-label="Back" style={{ height: '48px', padding: '0 32px', borderRadius: '10px', background: colour, border: 'none', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: '8px' }}>
          ← Done
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
        <span style={{ fontSize: '28px' }}>{icon}</span>
        <div style={{ fontSize: '20px', fontWeight: 700 }}>{title}</div>
      </div>

      {/* Amount */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#5A6072', marginBottom: '8px' }}>Amount</div>
        <button
          onClick={() => setShowKeypad(true)}
          aria-label="Enter amount"
          style={{
            width: '100%', height: '72px', borderRadius: '12px',
            background: '#F3F4F6', border: `2px solid ${colour}44`,
            fontSize: '36px', fontWeight: 700, cursor: 'pointer',
            fontVariantNumeric: 'tabular-nums', fontFamily: 'inherit',
          }}
        >
          £{parseFloat(amount || '0').toFixed(2)}
        </button>
      </div>

      {/* Reason */}
      {reasons && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#5A6072', marginBottom: '8px' }}>Reason</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {reasons.map((r) => (
              <button
                key={r}
                onClick={() => setReason(r)}
                aria-label={`Reason: ${r}`}
                style={{
                  height: '48px', borderRadius: '10px', textAlign: 'left', padding: '0 16px',
                  background: reason === r ? `${colour}15` : '#F8F9FA',
                  border: `1.5px solid ${reason === r ? colour : 'rgba(0,0,0,0.1)'}`,
                  fontSize: '14px', fontWeight: reason === r ? 700 : 400,
                  color: reason === r ? colour : '#1A1D21',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >{r}</button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
        <button onClick={onBack} aria-label="Cancel" style={{ flex: 1, height: '56px', borderRadius: '12px', background: 'transparent', border: '1.5px solid rgba(0,0,0,0.12)', fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
        <button
          onClick={() => { onConfirm(); setDone(true); }}
          disabled={!amount || parseFloat(amount) <= 0 || (!!reasons && !reason)}
          aria-label={`Confirm ${title}`}
          style={{
            flex: 2, height: '56px', borderRadius: '12px',
            background: (!amount || parseFloat(amount) <= 0 || (!!reasons && !reason)) ? '#C0C4CC' : colour,
            border: 'none', color: 'white', fontSize: '16px', fontWeight: 700,
            cursor: (!amount || parseFloat(amount) <= 0 || (!!reasons && !reason)) ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}
        >Confirm</button>
      </div>

      {showKeypad && (
        <NumericKeypadOverlay
          title={`Enter ${title} Amount`}
          value={amount || '0'}
          onChange={setAmount}
          onConfirm={(v) => { setAmount(v); setShowKeypad(false); }}
          onCancel={() => setShowKeypad(false)}
          isCurrency
          confirmLabel="Set Amount"
        />
      )}
    </div>
  );
}

// No-sale audit view
function NoSaleAuditView({ onBack }: { onBack: () => void }) {
  const mockEvents = [
    { time: '08:15', cashier: 'Amy Chen', reason: 'Get Change' },
    { time: '09:42', cashier: 'Tom Walsh', reason: 'Manager Request' },
    { time: '11:05', cashier: 'Amy Chen', reason: 'Check Drawer' },
  ];
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>🗄️ No-Sale Audit Log</div>
      <div style={{ fontSize: '12px', color: '#8A90A0', marginBottom: '16px' }}>Read-only — all no-sale drawer-open events logged for audit</div>
      {mockEvents.map((e, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', background: 'white', border: '1px solid rgba(0,0,0,0.08)', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{e.cashier}</div>
            <div style={{ fontSize: '12px', color: '#7A8099' }}>{e.reason}</div>
          </div>
          <div style={{ fontSize: '14px', fontVariantNumeric: 'tabular-nums', color: '#5A6072' }}>Today {e.time}</div>
        </div>
      ))}
      <button onClick={onBack} aria-label="Back" style={{ marginTop: '16px', height: '48px', padding: '0 24px', borderRadius: '10px', background: 'transparent', border: '1.5px solid rgba(0,0,0,0.12)', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
    </div>
  );
}

export default function ShiftPage() {
  const router = useRouter();
  const [action, setAction] = useState<ShiftAction>(null);
  const [amount, setAmount] = useState('0');
  const [reason, setReason] = useState('');

  function reset() { setAction(null); setAmount('0'); setReason(''); }

  const shiftActions = [
    { id: 'float', label: 'Opening Float', icon: '💷', desc: 'Record starting cash in drawer', colour: '#107C10' },
    { id: 'payin', label: 'Pay In', icon: '📥', desc: 'Add cash to the drawer', colour: '#1F5FD1' },
    { id: 'payout', label: 'Pay Out', icon: '📤', desc: 'Remove cash from drawer', colour: '#F0A30A' },
    { id: 'cashdrop', label: 'Cash Drop', icon: '🏦', desc: 'Remove excess cash to safe', colour: MANAGER_ACCENT },
    { id: 'nosale-audit', label: 'No-Sale Audit', icon: '🗄️', desc: 'Review cashier drawer-open events', colour: '#5A6072' },
  ] as const;

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#F3F4F6' }}>
      {/* Left nav */}
      <div style={{ width: '260px', background: 'white', borderRight: '1px solid rgba(0,0,0,0.08)', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#8A90A0', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px' }}>Shift & Cash</div>
        {shiftActions.map((a) => (
          <button
            key={a.id}
            onClick={() => { setAction(a.id as ShiftAction); setAmount('0'); setReason(''); }}
            aria-label={a.label}
            style={{
              height: '60px', borderRadius: '12px', textAlign: 'left', padding: '0 14px',
              background: action === a.id ? `${a.colour}15` : 'transparent',
              border: `1.5px solid ${action === a.id ? a.colour : 'transparent'}`,
              display: 'flex', alignItems: 'center', gap: '12px',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms',
            }}
          >
            <span style={{ fontSize: '20px' }}>{a.icon}</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: action === a.id ? a.colour : '#1A1D21' }}>{a.label}</div>
              <div style={{ fontSize: '11px', color: '#8A90A0' }}>{a.desc}</div>
            </div>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => router.push('/manager/dashboard')} aria-label="Back to manager" style={{ height: '44px', borderRadius: '10px', background: 'transparent', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', color: '#5A6072' }}>← Dashboard</button>
      </div>

      {/* Right content */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'white', margin: '16px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        {!action && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#8A90A0', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '48px' }}>💰</span>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>Select an action from the left</div>
          </div>
        )}
        {action === 'float' && (
          <ActionPanel title="Opening Float" icon="💷" amount={amount} setAmount={setAmount} reason={reason} setReason={setReason} onConfirm={() => {}} onBack={reset} colour="#107C10" />
        )}
        {action === 'payin' && (
          <ActionPanel title="Pay In" icon="📥" amount={amount} setAmount={setAmount} reason={reason} setReason={setReason} reasons={PAY_IN_REASONS} onConfirm={() => {}} onBack={reset} colour="#1F5FD1" />
        )}
        {action === 'payout' && (
          <ActionPanel title="Pay Out" icon="📤" amount={amount} setAmount={setAmount} reason={reason} setReason={setReason} reasons={PAY_OUT_REASONS} onConfirm={() => {}} onBack={reset} colour="#F0A30A" />
        )}
        {action === 'cashdrop' && (
          <ActionPanel title="Cash Drop" icon="🏦" amount={amount} setAmount={setAmount} reason={reason} setReason={setReason} onConfirm={() => {}} onBack={reset} colour={MANAGER_ACCENT} />
        )}
        {action === 'nosale-audit' && <NoSaleAuditView onBack={reset} />}
      </div>
    </div>
  );
}
