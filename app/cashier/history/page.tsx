'use client';

import React, { useState, useMemo } from 'react';
import { StatusBar } from '@/components/shared/StatusBar';
import { EmptyState } from '@/components/shared/EmptyState';
import { TRANSACTIONS, PastTransaction } from '@/lib/mock-data/transactions';
import { STAFF } from '@/lib/mock-data/staff';
import { useRouter } from 'next/navigation';

type FilterState = {
  type: 'all' | 'sale' | 'refund' | 'void';
  cashierId: string;
  paymentMethod: 'all' | 'cash' | 'card' | 'mixed' | 'loyalty';
  keyword: string;
};

const DEFAULT_FILTER: FilterState = {
  type: 'all',
  cashierId: 'all',
  paymentMethod: 'all',
  keyword: '',
};

type ActionMode = { tx: PastTransaction; action: 'repeat' | 'refund' | 'reprint' } | null;

export default function HistoryPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [selected, setSelected] = useState<PastTransaction | null>(null);
  const [actionDone, setActionDone] = useState<ActionMode>(null);

  const results = useMemo(() => {
    return TRANSACTIONS.filter((tx) => {
      if (filter.type !== 'all' && tx.type !== filter.type) return false;
      if (filter.cashierId !== 'all' && tx.cashierId !== filter.cashierId) return false;
      if (filter.paymentMethod !== 'all' && tx.paymentMethod !== filter.paymentMethod) return false;
      if (filter.keyword) {
        const kw = filter.keyword.toLowerCase();
        const matchesReceipt = tx.receiptNumber.toLowerCase().includes(kw);
        const matchesCashier = tx.cashier.toLowerCase().includes(kw);
        if (!matchesReceipt && !matchesCashier) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [filter]);

  const typeColour = (type: string) => {
    if (type === 'sale') return { bg: 'rgba(16,124,16,0.1)', text: '#107C10' };
    if (type === 'refund') return { bg: 'rgba(240,163,10,0.1)', text: '#B8800A' };
    return { bg: 'rgba(196,49,75,0.1)', text: '#C4314B' };
  };

  const methodIcon = (m: string) =>
    m === 'cash' ? '💵' : m === 'card' ? '💳' : m === 'mixed' ? '🔀' : '⭐';

  if (actionDone) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <StatusBar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '56px' }}>
            {actionDone.action === 'repeat' ? '🔁' : actionDone.action === 'refund' ? '↩️' : '🖨️'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700 }}>
            {actionDone.action === 'repeat' ? 'Sale Repeated' : actionDone.action === 'refund' ? 'Refund Processed' : 'Receipt Reprinted'}
          </div>
          <div style={{ fontSize: '14px', color: '#5A6072' }}>{actionDone.tx.receiptNumber}</div>
          <button
            onClick={() => { setActionDone(null); setSelected(null); }}
            aria-label="Back to history"
            style={{
              height: '52px', padding: '0 32px', borderRadius: '12px',
              background: '#1F5FD1', border: 'none', color: 'white',
              fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              marginTop: '8px',
            }}
          >← Back to History</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F3F4F6', overflow: 'hidden' }}>
      <StatusBar />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* ── LEFT: Filter + Results ── */}
        <div style={{
          width: selected ? '55%' : '100%',
          display: 'flex', flexDirection: 'column',
          borderRight: selected ? '1px solid rgba(0,0,0,0.08)' : 'none',
          transition: 'width 200ms',
          overflow: 'hidden',
        }}>
          {/* Unified FilterBar — one control, not five widgets */}
          <div style={{
            background: 'white',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            padding: '14px 20px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#5A6072', marginRight: '4px', whiteSpace: 'nowrap' }}>
              📋 History
            </div>

            {/* Keyword search */}
            <input
              type="text"
              placeholder="Search receipt, cashier…"
              value={filter.keyword}
              onChange={(e) => setFilter((f) => ({ ...f, keyword: e.target.value }))}
              aria-label="Search transactions"
              style={{
                height: '36px', borderRadius: '8px',
                border: '1.5px solid rgba(0,0,0,0.12)',
                padding: '0 12px', fontSize: '13px',
                fontFamily: 'inherit', minWidth: '180px', flex: 1,
              }}
            />

            {/* Type filter */}
            <select
              value={filter.type}
              onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value as FilterState['type'] }))}
              aria-label="Filter by transaction type"
              style={{ height: '36px', borderRadius: '8px', border: '1.5px solid rgba(0,0,0,0.12)', padding: '0 10px', fontSize: '13px', fontFamily: 'inherit', background: 'white' }}
            >
              <option value="all">All Types</option>
              <option value="sale">Sales</option>
              <option value="refund">Refunds</option>
              <option value="void">Voids</option>
            </select>

            {/* Cashier filter */}
            <select
              value={filter.cashierId}
              onChange={(e) => setFilter((f) => ({ ...f, cashierId: e.target.value }))}
              aria-label="Filter by cashier"
              style={{ height: '36px', borderRadius: '8px', border: '1.5px solid rgba(0,0,0,0.12)', padding: '0 10px', fontSize: '13px', fontFamily: 'inherit', background: 'white' }}
            >
              <option value="all">All Cashiers</option>
              {STAFF.filter((s) => s.role === 'Till Staff' || s.role === 'Supervisor').map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            {/* Payment method filter */}
            <select
              value={filter.paymentMethod}
              onChange={(e) => setFilter((f) => ({ ...f, paymentMethod: e.target.value as FilterState['paymentMethod'] }))}
              aria-label="Filter by payment method"
              style={{ height: '36px', borderRadius: '8px', border: '1.5px solid rgba(0,0,0,0.12)', padding: '0 10px', fontSize: '13px', fontFamily: 'inherit', background: 'white' }}
            >
              <option value="all">All Methods</option>
              <option value="cash">💵 Cash</option>
              <option value="card">💳 Card</option>
              <option value="mixed">🔀 Mixed</option>
              <option value="loyalty">⭐ Loyalty</option>
            </select>

            {/* Reset */}
            {JSON.stringify(filter) !== JSON.stringify(DEFAULT_FILTER) && (
              <button
                onClick={() => setFilter(DEFAULT_FILTER)}
                aria-label="Clear all filters"
                style={{
                  height: '36px', padding: '0 12px', borderRadius: '8px',
                  background: 'transparent', border: '1.5px solid rgba(0,0,0,0.12)',
                  fontSize: '12px', color: '#5A6072', cursor: 'pointer', fontFamily: 'inherit',
                }}
              >✕ Clear</button>
            )}

            <button
              onClick={() => router.push('/cashier/sale')}
              aria-label="Back to sale screen"
              style={{
                height: '36px', padding: '0 16px', borderRadius: '8px',
                background: 'transparent', border: '1.5px solid rgba(0,0,0,0.12)',
                fontSize: '13px', color: '#5A6072', cursor: 'pointer', fontFamily: 'inherit',
                marginLeft: 'auto',
              }}
            >← Sale</button>
          </div>

          {/* Result count */}
          <div style={{ padding: '8px 20px', fontSize: '12px', color: '#8A90A0', background: '#F8F9FA', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            {results.length} transaction{results.length !== 1 ? 's' : ''} found
          </div>

          {/* Results list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }}>
            {results.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No transactions found"
                description="Try adjusting your filters"
              />
            ) : (
              results.map((tx) => {
                const { bg, text } = typeColour(tx.type);
                const isSelected = selected?.id === tx.id;
                return (
                  <button
                    key={tx.id}
                    onClick={() => setSelected(isSelected ? null : tx)}
                    aria-label={`Transaction ${tx.receiptNumber} — ${tx.type} — £${Math.abs(tx.total).toFixed(2)}`}
                    style={{
                      width: '100%', padding: '14px 16px', borderRadius: '12px',
                      background: isSelected ? '#EEF2FF' : 'white',
                      border: `1.5px solid ${isSelected ? '#1F5FD1' : 'rgba(0,0,0,0.08)'}`,
                      display: 'flex', alignItems: 'center', gap: '14px',
                      cursor: 'pointer', marginBottom: '8px',
                      fontFamily: 'inherit', transition: 'all 150ms', textAlign: 'left',
                    }}
                    onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = '#F8F9FA'; }}
                    onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'white'; }}
                  >
                    {/* Method icon */}
                    <span style={{ fontSize: '22px', flexShrink: 0 }}>{methodIcon(tx.paymentMethod)}</span>

                    {/* Main info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700 }}>{tx.receiptNumber}</span>
                        <span style={{
                          fontSize: '11px', fontWeight: 700, padding: '1px 8px',
                          borderRadius: '99px', background: bg, color: text, textTransform: 'uppercase',
                        }}>{tx.type}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#7A8099' }}>
                        {tx.cashier} · {new Date(tx.timestamp).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                      </div>
                    </div>

                    {/* Total */}
                    <div style={{
                      fontSize: '18px', fontWeight: 800,
                      fontVariantNumeric: 'tabular-nums',
                      color: tx.total < 0 ? '#C4314B' : '#1A1D21',
                    }}>
                      {tx.total < 0 ? '-' : ''}£{Math.abs(tx.total).toFixed(2)}
                    </div>

                    <span style={{ color: '#C0C4CC', fontSize: '18px' }}>›</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── RIGHT: Transaction detail + actions ── */}
        {selected && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            background: 'white', overflow: 'hidden',
          }}>
            {/* Detail header */}
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700 }}>{selected.receiptNumber}</div>
                <div style={{ fontSize: '12px', color: '#7A8099', marginTop: '2px' }}>
                  {selected.cashier} · {new Date(selected.timestamp).toLocaleString('en-GB')}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close detail"
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#8A90A0' }}
              >✕</button>
            </div>

            {/* Lines */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {selected.lines.map((line) => (
                <div key={line.id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)',
                  fontSize: '14px',
                }}>
                  <span style={{ color: line.unitPrice < 0 ? '#107C10' : '#1A1D21' }}>
                    {line.isPromotionLine ? '🏷️ ' : ''}
                    {line.productName || line.productId}
                    {line.qty && line.qty > 1 ? ` × ${line.qty}` : ''}
                    {line.weight ? ` × ${line.weight}kg` : ''}
                  </span>
                  <span style={{
                    fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                    color: line.unitPrice < 0 ? '#107C10' : '#1A1D21',
                  }}>
                    {line.unitPrice < 0 ? '-' : ''}£{Math.abs(line.unitPrice * (line.qty ?? line.weight ?? 1)).toFixed(2)}
                  </span>
                </div>
              ))}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '12px 0 0', fontSize: '18px', fontWeight: 800,
              }}>
                <span>Total</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {selected.total < 0 ? '-' : ''}£{Math.abs(selected.total).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions — Repeat / Refund / Reprint */}
            <div style={{
              padding: '16px 20px', borderTop: '1px solid rgba(0,0,0,0.08)',
              display: 'flex', flexDirection: 'column', gap: '8px',
            }}>
              {selected.type === 'sale' && (
                <button
                  onClick={() => setActionDone({ tx: selected, action: 'repeat' })}
                  aria-label="Repeat this sale"
                  style={{
                    height: '52px', borderRadius: '10px', background: '#F0F4FF',
                    border: '1.5px solid rgba(31,95,209,0.3)', color: '#1F5FD1',
                    fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >🔁 Repeat Sale</button>
              )}
              {selected.type === 'sale' && (
                <button
                  onClick={() => setActionDone({ tx: selected, action: 'refund' })}
                  aria-label="Process refund for this transaction"
                  style={{
                    height: '52px', borderRadius: '10px', background: 'rgba(240,163,10,0.1)',
                    border: '1.5px solid rgba(240,163,10,0.4)', color: '#B8800A',
                    fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >↩️ Refund</button>
              )}
              <button
                onClick={() => setActionDone({ tx: selected, action: 'reprint' })}
                aria-label="Reprint receipt"
                style={{
                  height: '52px', borderRadius: '10px', background: '#F8F9FA',
                  border: '1.5px solid rgba(0,0,0,0.12)', color: '#1A1D21',
                  fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >🖨️ Reprint Receipt</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
