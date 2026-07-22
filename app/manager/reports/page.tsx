'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TRANSACTIONS } from '@/lib/mock-data/transactions';
import { MANAGER_ACCENT } from '@/lib/theme';

type ReportType = 'x-report' | 'eod' | 'shift' | 'journal' | null;

function StatCard({ label, value, icon, colour }: { label: string; value: string; icon: string; colour: string }) {
  return (
    <div style={{
      background: 'white', borderRadius: '12px', padding: '16px 20px',
      border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#7A8099' }}>{label}</div>
        <span style={{ fontSize: '18px' }}>{icon}</span>
      </div>
      <div style={{ fontSize: '24px', fontWeight: 800, color: colour, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

function XReport() {
  const sales = TRANSACTIONS.filter((t) => t.type === 'sale');
  const refunds = TRANSACTIONS.filter((t) => t.type === 'refund');
  const totalSales = sales.reduce((s, t) => s + t.total, 0);
  const totalRefunds = refunds.reduce((s, t) => s + Math.abs(t.total), 0);
  const net = totalSales - totalRefunds;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{ fontSize: '28px' }}>📈</span>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>X Report — Mid-Shift Snapshot</div>
          <div style={{ fontSize: '12px', color: '#7A8099' }}>Non-resetting · {new Date().toLocaleString('en-GB')}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <StatCard label="Gross Sales" value={`£${totalSales.toFixed(2)}`} icon="💷" colour="#107C10" />
        <StatCard label="Refunds" value={`£${totalRefunds.toFixed(2)}`} icon="↩️" colour="#C4314B" />
        <StatCard label="Net Total" value={`£${net.toFixed(2)}`} icon="✅" colour="#1F5FD1" />
        <StatCard label="Transactions" value={sales.length.toString()} icon="🧾" colour={MANAGER_ACCENT} />
        <StatCard label="Avg. Basket" value={`£${(totalSales / Math.max(1, sales.length)).toFixed(2)}`} icon="🛒" colour="#B8800A" />
        <StatCard label="Cash Sales" value={`£${sales.filter(t => t.paymentMethod === 'cash').reduce((s, t) => s + t.total, 0).toFixed(2)}`} icon="💵" colour="#5A6072" />
      </div>

      {/* Payment breakdown */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', background: '#F8F9FA', borderBottom: '1px solid rgba(0,0,0,0.06)', fontSize: '13px', fontWeight: 700 }}>Payment Method Breakdown</div>
        {['cash', 'card', 'mixed', 'loyalty'].map((m) => {
          const txs = sales.filter((t) => t.paymentMethod === m);
          const total = txs.reduce((s, t) => s + t.total, 0);
          const icon = m === 'cash' ? '💵' : m === 'card' ? '💳' : m === 'mixed' ? '🔀' : '⭐';
          return (
            <div key={m} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span>{icon}</span>
                <span style={{ fontSize: '14px', textTransform: 'capitalize' }}>{m}</span>
              </div>
              <div style={{ display: 'flex', gap: '32px' }}>
                <span style={{ fontSize: '13px', color: '#7A8099' }}>{txs.length} txn{txs.length !== 1 ? 's' : ''}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', minWidth: '80px', textAlign: 'right' }}>
                  £{total.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EODReport() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{ fontSize: '28px' }}>📅</span>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>End of Day Report</div>
          <div style={{ fontSize: '12px', color: '#7A8099' }}>Financial by Period · Today</div>
        </div>
      </div>
      <XReport />
      <div style={{ marginTop: '20px', background: 'rgba(240,163,10,0.08)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(240,163,10,0.3)' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#B8800A' }}>⚠️ Z Report / VAT Summary / Sales-by-Department</div>
        <div style={{ fontSize: '12px', color: '#7A8099', marginTop: '6px' }}>
          {/* NOTE per spec: these deeper reports are pending Cloud Back Office boundary decision */}
          These detailed reports are pending confirmation — expected to move to Cloud Back Office. Placeholder shown here.
        </div>
      </div>
    </div>
  );
}

function TillJournal() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{ fontSize: '28px' }}>📖</span>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>Till Journal</div>
          <div style={{ fontSize: '12px', color: '#7A8099' }}>Chronological log of all transactions on this till</div>
        </div>
      </div>
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', background: '#F8F9FA', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 700 }}>All Till Events — Today</span>
          <span style={{ fontSize: '12px', color: '#7A8099' }}>{TRANSACTIONS.length} entries</span>
        </div>
        {TRANSACTIONS.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((tx) => (
          <div key={tx.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.04)',
            fontSize: '13px',
          }}>
            <div>
              <div style={{ fontWeight: 600 }}>{tx.receiptNumber}</div>
              <div style={{ fontSize: '11px', color: '#8A90A0' }}>{tx.cashier} · {tx.paymentMethod}</div>
            </div>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <span style={{ color: '#7A8099' }}>{new Date(tx.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
              <span style={{
                fontSize: '11px', fontWeight: 700, padding: '2px 8px',
                borderRadius: '99px', textTransform: 'uppercase',
                background: tx.type === 'sale' ? 'rgba(16,124,16,0.1)' : tx.type === 'refund' ? 'rgba(240,163,10,0.1)' : 'rgba(196,49,75,0.1)',
                color: tx.type === 'sale' ? '#107C10' : tx.type === 'refund' ? '#B8800A' : '#C4314B',
              }}>{tx.type}</span>
              <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', minWidth: '72px', textAlign: 'right' }}>
                {tx.total < 0 ? '-' : ''}£{Math.abs(tx.total).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const REPORTS = [
  { id: 'x-report', label: 'X Report', icon: '📈', desc: 'Mid-shift snapshot, non-resetting' },
  { id: 'eod', label: 'End of Day', icon: '📅', desc: 'Day/week/month/custom period' },
  { id: 'shift', label: 'End of Shift', icon: '🕐', desc: 'Shift summary (linked to clock in/out)' },
  { id: 'journal', label: 'Till Journal', icon: '📖', desc: 'Chronological audit-grade log' },
];

export default function ReportsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<ReportType>('x-report');

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#F3F4F6' }}>
      {/* Left nav */}
      <div style={{ width: '240px', background: 'white', borderRight: '1px solid rgba(0,0,0,0.08)', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#8A90A0', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px' }}>Reports</div>
        {REPORTS.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelected(r.id as ReportType)}
            aria-label={r.label}
            style={{
              height: '60px', borderRadius: '12px', textAlign: 'left', padding: '0 14px',
              background: selected === r.id ? `${MANAGER_ACCENT}15` : 'transparent',
              border: `1.5px solid ${selected === r.id ? MANAGER_ACCENT : 'transparent'}`,
              display: 'flex', alignItems: 'center', gap: '12px',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms',
            }}
          >
            <span style={{ fontSize: '20px' }}>{r.icon}</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: selected === r.id ? MANAGER_ACCENT : '#1A1D21' }}>{r.label}</div>
              <div style={{ fontSize: '11px', color: '#8A90A0' }}>{r.desc}</div>
            </div>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => router.push('/manager/dashboard')} aria-label="Back to manager" style={{ height: '44px', borderRadius: '10px', background: 'transparent', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', color: '#5A6072' }}>← Dashboard</button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {selected === 'x-report' && <XReport />}
        {selected === 'eod' && <EODReport />}
        {selected === 'shift' && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#8A90A0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🕐</div>
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>End of Shift Report</div>
            <div style={{ fontSize: '13px', lineHeight: 1.6 }}>This report is linked to the Clock In/Out system.<br />Placeholder — full implementation pending clock-in UX confirmation.</div>
          </div>
        )}
        {selected === 'journal' && <TillJournal />}
      </div>
    </div>
  );
}
