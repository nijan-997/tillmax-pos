'use client';

import React, { useState } from 'react';
import { useBasket, computeBasketTotals } from '@/lib/basket-context';
import { useRouter } from 'next/navigation';
import { StatusBar } from '@/components/shared/StatusBar';
import { NumericKeypadOverlay } from '@/components/shared/NumericKeypadOverlay';

type TenderMethod = 'cash' | 'card' | 'mixed' | 'loyalty';
type CardState = 'idle' | 'processing' | 'approved' | 'declined';

export default function TenderPage() {
  const { state, dispatch, totals } = useBasket();
  const router = useRouter();

  const [method, setMethod] = useState<TenderMethod>('cash');
  const [cashTendered, setCashTendered] = useState('0');
  const [showKeypad, setShowKeypad] = useState(false);
  const [cardState, setCardState] = useState<CardState>('idle');
  const [mixedCash, setMixedCash] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [loyaltyCard, setLoyaltyCard] = useState('');

  const total = totals.total;
  const change = Math.max(0, parseFloat(cashTendered) - total);
  const cardRemainder = Math.max(0, total - mixedCash);

  function simulateCard() {
    setCardState('processing');
    setTimeout(() => setCardState('approved'), 2200);
  }

  function completeSale() {
    dispatch({ type: 'CANCEL_SALE' }); // clear basket
    setShowReceipt(true);
  }

  if (showReceipt) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F3F4F6' }}>
        <StatusBar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            background: 'white', borderRadius: '16px', width: '380px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)', overflow: 'hidden',
          }}>
            {/* Receipt header */}
            <div style={{ background: '#1F5FD1', padding: '20px', textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>✓</div>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>Sale Complete</div>
              <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>£{total.toFixed(2)} — {method.toUpperCase()}</div>
            </div>

            {/* Mock receipt */}
            <div style={{ padding: '20px', fontFamily: '"Courier New", monospace', fontSize: '12px', lineHeight: 1.6 }}>
              <div style={{ textAlign: 'center', fontWeight: 700, marginBottom: '8px' }}>TILLMAX RETAILMAX POS</div>
              <div style={{ textAlign: 'center', marginBottom: '12px', color: '#5A6072' }}>Store #001 · Till 01</div>
              <div style={{ borderTop: '1px dashed #ccc', margin: '8px 0' }} />
              {state.lines.slice(0, 5).map((l) => ( // show from previous (basket cleared)
                <div key={l.id} />
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>TOTAL</span>
                <span style={{ fontWeight: 700 }}>£{total.toFixed(2)}</span>
              </div>
              {method === 'cash' && change > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#107C10' }}>
                  <span>CHANGE</span>
                  <span>£{change.toFixed(2)}</span>
                </div>
              )}
              <div style={{ borderTop: '1px dashed #ccc', margin: '8px 0' }} />
              <div style={{ textAlign: 'center', fontSize: '11px', color: '#8A90A0' }}>
                {new Date().toLocaleString('en-GB')}<br />
                Receipt #R-{Date.now().toString().slice(-6)}<br />
                Thank you for shopping with us
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding: '16px', display: 'flex', gap: '8px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              <button
                onClick={() => router.push('/cashier/sale')}
                aria-label="Skip receipt — new sale"
                style={{
                  flex: 1, height: '52px', borderRadius: '10px',
                  background: 'transparent', border: '1.5px solid rgba(0,0,0,0.15)',
                  fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Skip Receipt</button>
              <button
                onClick={() => router.push('/cashier/sale')}
                aria-label="Print receipt — new sale"
                style={{
                  flex: 2, height: '52px', borderRadius: '10px',
                  background: '#1F5FD1', border: 'none',
                  color: 'white', fontSize: '15px', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >🖨️ Print Receipt</button>
            </div>
            {/* Email receipt — flagged as unconfirmed scope per spec */}
            <div style={{ padding: '0 16px 16px', textAlign: 'center' }}>
              <button
                style={{ background: 'none', border: 'none', color: '#8A90A0', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}
                aria-label="Email receipt (not yet confirmed in scope)"
                title="Email/SMS receipt — not yet confirmed in scope"
              >
                📧 Email Receipt (coming soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F3F4F6' }}>
      <StatusBar />
      <div style={{ flex: 1, display: 'flex', gap: '24px', padding: '24px', overflow: 'hidden' }}>

        {/* Left: Tender method selection */}
        <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#8A90A0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Payment Method
          </div>

          {/* Customer/Loyalty attach — optional, non-blocking */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '14px',
            border: '1px solid rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#5A6072', marginBottom: '8px' }}>Customer / Loyalty (optional)</div>
            <input
              placeholder="Phone, card, or name…"
              value={loyaltyCard}
              onChange={(e) => setLoyaltyCard(e.target.value)}
              aria-label="Customer lookup"
              style={{
                width: '100%', height: '36px', borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.12)', padding: '0 10px',
                fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Method buttons */}
          {(['cash', 'card', 'mixed', 'loyalty'] as TenderMethod[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMethod(m); setCardState('idle'); }}
              aria-label={`Pay by ${m}`}
              style={{
                height: '64px', borderRadius: '12px',
                background: method === m ? '#1F5FD1' : 'white',
                border: `1.5px solid ${method === m ? '#1F5FD1' : 'rgba(0,0,0,0.1)'}`,
                color: method === m ? 'white' : '#1A1D21',
                fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 150ms',
                display: 'flex', alignItems: 'center', gap: '12px', padding: '0 20px',
              }}
            >
              <span>{m === 'cash' ? '💵' : m === 'card' ? '💳' : m === 'mixed' ? '🔀' : '⭐'}</span>
              <span style={{ textTransform: 'capitalize' }}>{m === 'loyalty' ? 'Loyalty Points' : m}</span>
            </button>
          ))}

          <button
            onClick={() => router.push('/cashier/sale')}
            aria-label="Back to sale"
            style={{
              height: '48px', borderRadius: '10px', marginTop: 'auto',
              background: 'transparent', border: '1.5px solid rgba(0,0,0,0.12)',
              fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', color: '#5A6072',
            }}
          >← Back to Sale</button>
        </div>

        {/* Right: Tender panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', flex: 1, display: 'flex', flexDirection: 'column' }}>

            {/* Total header */}
            <div style={{
              background: '#1F5FD1', padding: '20px 24px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Total to Pay</div>
              <div style={{
                color: 'white', fontSize: '42px', fontWeight: 800,
                fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
              }}>
                £{total.toFixed(2)}
              </div>
            </div>

            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* CASH */}
              {method === 'cash' && (
                <>
                  <div>
                    <div style={{ fontSize: '13px', color: '#5A6072', marginBottom: '8px', fontWeight: 600 }}>Cash Tendered</div>
                    <button
                      onClick={() => setShowKeypad(true)}
                      aria-label="Enter cash amount"
                      style={{
                        width: '100%', height: '72px', borderRadius: '12px',
                        background: '#F3F4F6', border: '2px solid rgba(31,95,209,0.3)',
                        fontSize: '36px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                        fontVariantNumeric: 'tabular-nums', color: '#1A1D21',
                      }}
                    >
                      £{parseFloat(cashTendered || '0').toFixed(2)}
                    </button>
                    {/* Quick amounts */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                      {[total, Math.ceil(total), 10, 20, 50].filter((v, i, a) => a.indexOf(v) === i).sort((a,b) => a-b).slice(0,5).map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setCashTendered(amt.toFixed(2))}
                          aria-label={`Tender £${amt.toFixed(2)}`}
                          style={{
                            height: '44px', padding: '0 16px', borderRadius: '8px',
                            background: cashTendered === amt.toFixed(2) ? '#1F5FD1' : '#F0F2F5',
                            border: 'none', color: cashTendered === amt.toFixed(2) ? 'white' : '#1A1D21',
                            fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                          }}
                        >
                          £{amt.toFixed(2)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {parseFloat(cashTendered) >= total && (
                    <div style={{
                      background: '#E6F5E6', borderRadius: '12px', padding: '16px 20px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      border: '1px solid rgba(16,124,16,0.3)',
                    }}>
                      <span style={{ fontSize: '16px', fontWeight: 600, color: '#107C10' }}>Change Due</span>
                      <span style={{
                        fontSize: '36px', fontWeight: 800, color: '#107C10',
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        £{change.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={completeSale}
                    disabled={parseFloat(cashTendered) < total}
                    aria-label="Confirm cash payment"
                    style={{
                      height: '72px', borderRadius: '12px', marginTop: 'auto',
                      background: parseFloat(cashTendered) >= total ? '#1F5FD1' : '#C0C4CC',
                      border: 'none', color: 'white', fontSize: '20px', fontWeight: 700,
                      cursor: parseFloat(cashTendered) >= total ? 'pointer' : 'not-allowed',
                      fontFamily: 'inherit',
                      boxShadow: parseFloat(cashTendered) >= total ? '0 4px 16px rgba(31,95,209,0.4)' : 'none',
                    }}
                  >
                    Confirm Payment ✓
                  </button>
                </>
              )}

              {/* CARD */}
              {method === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                  {cardState === 'idle' && (
                    <>
                      <div style={{ textAlign: 'center', padding: '24px', color: '#5A6072' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>💳</div>
                        <div style={{ fontSize: '16px', fontWeight: 600 }}>Present card to terminal</div>
                        <div style={{ fontSize: '13px', marginTop: '8px' }}>Amount: £{total.toFixed(2)}</div>
                      </div>
                      <button
                        onClick={simulateCard}
                        aria-label="Simulate card tap"
                        style={{
                          height: '72px', borderRadius: '12px', marginTop: 'auto',
                          background: '#1F5FD1', border: 'none',
                          color: 'white', fontSize: '18px', fontWeight: 700,
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}
                      >
                        Simulate Card Tap
                      </button>
                    </>
                  )}
                  {cardState === 'processing' && (
                    <div style={{ textAlign: 'center', padding: '40px', flex: 1 }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                      <div style={{ fontSize: '18px', fontWeight: 600, color: '#5A6072' }}>Processing…</div>
                      <div style={{ fontSize: '13px', color: '#8A90A0', marginTop: '8px' }}>Communicating with card terminal</div>
                    </div>
                  )}
                  {cardState === 'approved' && (
                    <>
                      <div style={{ textAlign: 'center', padding: '24px', flex: 1 }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
                        <div style={{ fontSize: '22px', fontWeight: 700, color: '#107C10' }}>Payment Approved</div>
                        <div style={{ fontSize: '14px', color: '#5A6072', marginTop: '8px' }}>£{total.toFixed(2)} authorised</div>
                      </div>
                      <button
                        onClick={completeSale}
                        aria-label="Complete sale after card approval"
                        style={{
                          height: '72px', borderRadius: '12px',
                          background: '#107C10', border: 'none',
                          color: 'white', fontSize: '20px', fontWeight: 700,
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}
                      >Complete Sale ✓</button>
                    </>
                  )}
                </div>
              )}

              {/* MIXED */}
              {method === 'mixed' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#5A6072', fontWeight: 600, marginBottom: '8px' }}>Cash Portion</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {[5, 10, 20].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setMixedCash(Math.min(amt, total))}
                          aria-label={`Cash portion: £${amt}`}
                          style={{
                            height: '52px', padding: '0 20px', borderRadius: '10px',
                            background: mixedCash === Math.min(amt, total) ? '#1F5FD1' : '#F0F2F5',
                            border: 'none', color: mixedCash === Math.min(amt, total) ? 'white' : '#1A1D21',
                            fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                          }}
                        >£{amt}</button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#5A6072' }}>Cash:</span>
                      <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>£{mixedCash.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#5A6072' }}>Card:</span>
                      <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>£{cardRemainder.toFixed(2)}</span>
                    </div>
                  </div>

                  {mixedCash > 0 && cardRemainder > 0 && cardState === 'idle' && (
                    <button
                      onClick={simulateCard}
                      aria-label="Process card for remainder"
                      style={{
                        height: '64px', borderRadius: '12px',
                        background: '#1F5FD1', border: 'none',
                        color: 'white', fontSize: '17px', fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit', marginTop: 'auto',
                      }}
                    >
                      Process Card — £{cardRemainder.toFixed(2)}
                    </button>
                  )}

                  {cardState === 'processing' && <div style={{ textAlign: 'center', color: '#5A6072', padding: '20px' }}>⏳ Processing card…</div>}

                  {cardState === 'approved' && (
                    <button
                      onClick={completeSale}
                      aria-label="Complete mixed payment"
                      style={{
                        height: '64px', borderRadius: '12px',
                        background: '#107C10', border: 'none',
                        color: 'white', fontSize: '17px', fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit', marginTop: 'auto',
                      }}
                    >✅ Complete Sale</button>
                  )}
                </div>
              )}

              {/* LOYALTY */}
              {method === 'loyalty' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                  <div style={{ textAlign: 'center', padding: '24px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>⭐</div>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>Loyalty Balance: 524 pts</div>
                    <div style={{ fontSize: '13px', color: '#5A6072', marginTop: '4px' }}>≈ £{(524 * 0.01).toFixed(2)} redeemable</div>
                  </div>
                  <button
                    onClick={completeSale}
                    aria-label="Redeem loyalty points"
                    style={{
                      height: '72px', borderRadius: '12px', marginTop: 'auto',
                      background: '#1F5FD1', border: 'none',
                      color: 'white', fontSize: '18px', fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >Redeem Points ✓</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showKeypad && (
        <NumericKeypadOverlay
          title="Cash Tendered"
          value={cashTendered}
          onChange={setCashTendered}
          onConfirm={(v) => { setCashTendered(v); setShowKeypad(false); }}
          onCancel={() => setShowKeypad(false)}
          isCurrency
          confirmLabel="Set Amount"
        />
      )}
    </div>
  );
}
