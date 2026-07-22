'use client';

import React, { useState, useRef } from 'react';
import { useBasket } from '@/lib/basket-context';
import { useSession } from '@/lib/session-context';
import { PRODUCTS, searchProducts, getProductByBarcode, getProductsByCategory, Product } from '@/lib/mock-data/products';
import { CATEGORIES, getTopLevelCategories, getSubcategories } from '@/lib/mock-data/categories';
import { useRouter } from 'next/navigation';
import { ActionButton } from '@/components/shared/ActionButton';
import { NumericKeypadOverlay } from '@/components/shared/NumericKeypadOverlay';
import { ManagerElevationModal, ApprovalType } from '@/components/shared/ManagerElevationModal';
import { EmptyState } from '@/components/shared/EmptyState';

// ─── Basket Line Component ───────────────────────────────────────────────────
function BasketLineItem({
  line,
  onVoid,
  onDiscount,
  onQtyChange,
  onWeightChange,
  onVerifyAge,
}: {
  line: ReturnType<typeof useBasket>['state']['lines'][0];
  onVoid: () => void;
  onDiscount: () => void;
  onQtyChange: (qty: number) => void;
  onWeightChange: (w: number) => void;
  onVerifyAge: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isWeighed = line.weight !== undefined;
  const effectiveQty = isWeighed ? line.weight ?? 1 : line.qty ?? 1;
  const lineTotal = line.unitPrice * effectiveQty;
  const discountedTotal = line.lineDiscount
    ? lineTotal * (1 - (line.lineDiscount.type === 'percent' ? line.lineDiscount.value / 100 : 0)) -
      (line.lineDiscount.type === 'amount' ? line.lineDiscount.value : 0)
    : lineTotal;
  const needsAgeVerify = line.ageVerified === false;

  return (
    <div style={{
      padding: '10px 12px',
      borderRadius: '10px',
      background: line.isPromotionLine
        ? 'rgba(16, 124, 16, 0.06)'
        : needsAgeVerify
        ? 'rgba(240, 163, 10, 0.08)'
        : 'white',
      border: `1px solid ${line.isPromotionLine ? 'rgba(16,124,16,0.2)' : needsAgeVerify ? 'rgba(240,163,10,0.3)' : 'rgba(0,0,0,0.07)'}`,
      marginBottom: '6px',
      transition: 'all 150ms',
      position: 'relative',
    }}>
      {/* Age-restriction banner */}
      {needsAgeVerify && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(240,163,10,0.12)',
          borderRadius: '6px',
          padding: '6px 10px',
          marginBottom: '8px',
          border: '1px solid rgba(240,163,10,0.35)',
        }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#B8800A' }}>
            🪪 Challenge 25 — Verify customer age
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={onVerifyAge}
              aria-label="Confirm age verified"
              style={{
                height: '32px', padding: '0 12px', borderRadius: '6px',
                background: '#107C10', border: 'none', color: 'white',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >✓ Verified</button>
            <button
              onClick={onVoid}
              aria-label="Remove age-restricted item"
              style={{
                height: '32px', padding: '0 12px', borderRadius: '6px',
                background: 'transparent', border: '1px solid rgba(196,49,75,0.4)',
                color: '#C4314B', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >✕ Remove</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Promo icon */}
        {line.isPromotionLine && <span style={{ fontSize: '14px', flexShrink: 0 }}>🏷️</span>}

        {/* Product name */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '14px', fontWeight: line.isPromotionLine ? 500 : 600,
            color: line.isPromotionLine ? '#107C10' : '#1A1D21',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {line.productName}
          </div>
          {line.lineDiscount && (
            <div style={{ fontSize: '11px', color: '#5A6072' }}>
              {line.lineDiscount.type === 'percent' ? `${line.lineDiscount.value}% off` : `£${line.lineDiscount.value.toFixed(2)} off`}
            </div>
          )}
        </div>

        {/* Qty / weight stepper */}
        {!line.isPromotionLine && (
          isWeighed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => onWeightChange(Math.max(0.05, (line.weight ?? 0) - 0.05))}
                aria-label="Decrease weight"
                style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F0F2F5', border: '1px solid rgba(0,0,0,0.1)', fontSize: '16px', cursor: 'pointer', fontFamily: 'inherit' }}
              >−</button>
              <span style={{ fontSize: '13px', fontVariantNumeric: 'tabular-nums', minWidth: '52px', textAlign: 'center', fontWeight: 600 }}>
                {(line.weight ?? 0).toFixed(2)}kg
              </span>
              <button
                onClick={() => onWeightChange((line.weight ?? 0) + 0.05)}
                aria-label="Increase weight"
                style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F0F2F5', border: '1px solid rgba(0,0,0,0.1)', fontSize: '16px', cursor: 'pointer', fontFamily: 'inherit' }}
              >+</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => line.qty && line.qty > 1 ? onQtyChange((line.qty ?? 1) - 1) : onVoid()}
                aria-label="Decrease quantity"
                style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F0F2F5', border: '1px solid rgba(0,0,0,0.1)', fontSize: '16px', cursor: 'pointer', fontFamily: 'inherit' }}
              >−</button>
              <span style={{ fontSize: '15px', fontVariantNumeric: 'tabular-nums', minWidth: '28px', textAlign: 'center', fontWeight: 700 }}>
                {line.qty ?? 1}
              </span>
              <button
                onClick={() => onQtyChange((line.qty ?? 1) + 1)}
                aria-label="Increase quantity"
                style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F0F2F5', border: '1px solid rgba(0,0,0,0.1)', fontSize: '16px', cursor: 'pointer', fontFamily: 'inherit' }}
              >+</button>
            </div>
          )
        )}

        {/* Line total */}
        <div style={{
          fontSize: '16px', fontWeight: 700, fontVariantNumeric: 'tabular-nums',
          minWidth: '64px', textAlign: 'right',
          color: line.isPromotionLine ? '#107C10' : '#1A1D21',
        }}>
          {line.isPromotionLine || lineTotal < 0
            ? `-£${Math.abs(discountedTotal).toFixed(2)}`
            : `£${discountedTotal.toFixed(2)}`}
        </div>

        {/* Context menu */}
        {!line.isPromotionLine && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Line options"
              style={{
                width: '28px', height: '28px', borderRadius: '6px',
                background: menuOpen ? '#E0E4EF' : 'transparent',
                border: '1px solid transparent', fontSize: '16px',
                cursor: 'pointer', fontFamily: 'inherit', color: '#5A6072',
              }}
            >⋯</button>
            {menuOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '32px', background: 'white',
                border: '1px solid rgba(0,0,0,0.12)', borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 100,
                overflow: 'hidden', minWidth: '140px',
              }}>
                <button
                  onClick={() => { onDiscount(); setMenuOpen(false); }}
                  style={{ display: 'block', width: '100%', padding: '10px 16px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                >% Discount</button>
                <div style={{ height: '1px', background: 'rgba(0,0,0,0.08)' }} />
                <button
                  onClick={() => { onVoid(); setMenuOpen(false); }}
                  style={{ display: 'block', width: '100%', padding: '10px 16px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#C4314B', cursor: 'pointer', fontFamily: 'inherit' }}
                >✕ Void Line</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Category Browser ────────────────────────────────────────────────────────
function CategoryBrowser({ onProductSelect }: { onProductSelect: (p: Product) => void }) {
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const topLevel = getTopLevelCategories();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', flex: 1 }}>
      {topLevel.map((cat) => {
        const subcats = getSubcategories(cat.id);
        const isExpanded = expandedCat === cat.id;

        return (
          <div key={cat.id}>
            <button
              onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
              aria-label={`${cat.name} department`}
              aria-expanded={isExpanded}
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '10px',
                background: isExpanded ? `${cat.colour}22` : 'white',
                border: `1.5px solid ${isExpanded ? cat.colour + '55' : 'rgba(0,0,0,0.08)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0 12px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 150ms',
              }}
            >
              <span style={{ fontSize: '20px' }}>{cat.icon}</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: isExpanded ? cat.colour : '#1A1D21', flex: 1, textAlign: 'left' }}>{cat.name}</span>
              <span style={{ color: isExpanded ? cat.colour : '#8A90A0', fontSize: '12px', transition: 'transform 150ms', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>▼</span>
            </button>

            {/* Expand in-place — subcategories + quick-key items, no navigation */}
            {isExpanded && (
              <div style={{
                marginTop: '4px',
                marginLeft: '8px',
                borderLeft: `3px solid ${cat.colour}44`,
                paddingLeft: '10px',
              }}>
                {subcats.map((sub) => {
                  const products = getProductsByCategory(sub.id);
                  return (
                    <div key={sub.id} style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#7A8099', padding: '4px 0 6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{sub.icon}</span> {sub.name}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {products.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => onProductSelect(p)}
                            aria-label={`Add ${p.name}`}
                            style={{
                              height: '52px',
                              padding: '0 12px',
                              borderRadius: '8px',
                              background: 'white',
                              border: '1.5px solid rgba(0,0,0,0.1)',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: '#1A1D21',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 120ms',
                              maxWidth: '180px',
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = `${cat.colour}15`;
                              (e.currentTarget as HTMLButtonElement).style.borderColor = `${cat.colour}55`;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = 'white';
                              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.1)';
                            }}
                          >
                            {p.weighed && <span title="Weighed item" style={{ fontSize: '14px' }}>⚖️</span>}
                            {p.ageRestricted && <span title="Age restricted" style={{ fontSize: '14px' }}>🔞</span>}
                            <div style={{ textAlign: 'left', minWidth: 0 }}>
                              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '110px' }}>{p.name}</div>
                              <div style={{ fontSize: '11px', color: '#5A6072', fontVariantNumeric: 'tabular-nums' }}>£{p.price.toFixed(2)}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Direct products in this top-level category */}
                {getProductsByCategory(cat.id).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onProductSelect(p)}
                    aria-label={`Add ${p.name}`}
                    style={{
                      height: '52px', padding: '0 12px', borderRadius: '8px',
                      background: 'white', border: '1.5px solid rgba(0,0,0,0.1)',
                      cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px',
                      fontWeight: 600, color: '#1A1D21', display: 'flex',
                      alignItems: 'center', gap: '6px', marginBottom: '6px',
                    }}
                  >
                    {p.ageRestricted && <span>🔞</span>}
                    <span>{p.name}</span>
                    <span style={{ marginLeft: 'auto', color: '#5A6072', fontVariantNumeric: 'tabular-nums' }}>£{p.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN SALE PAGE ──────────────────────────────────────────────────────────
export default function SalePage() {
  const { state, dispatch, totals } = useBasket();
  const { session } = useSession();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', dept: '' });

  // Keypad overlay state
  const [keypadFor, setKeypadFor] = useState<{ lineId: string; mode: 'qty' | 'weight' | 'discount' } | null>(null);
  const [keypadValue, setKeypadValue] = useState('0');
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');

  // Manager elevation state
  const [elevationFor, setElevationFor] = useState<{ lineId: string; type: ApprovalType; price?: number } | null>(null);

  // Hold/Recall panel
  const [showRecall, setShowRecall] = useState(false);

  // Cancel confirm
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // No-sale
  const [showNoSale, setShowNoSale] = useState(false);
  const [noSaleReason, setNoSaleReason] = useState('');

  function handleSearch(q: string) {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); setShowCreateItem(false); return; }
    const results = searchProducts(q);
    setSearchResults(results);
    setShowCreateItem(results.length === 0);
  }

  function handleBarcodeEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const product = getProductByBarcode(searchQuery.trim());
      if (product) {
        dispatch({ type: 'ADD_PRODUCT', product });
        setSearchQuery('');
        setSearchResults([]);
      } else {
        handleSearch(searchQuery);
      }
    }
  }

  function handleProductSelect(product: Product) {
    dispatch({ type: 'ADD_PRODUCT', product });
    setSearchQuery('');
    setSearchResults([]);
    setShowCreateItem(false);
  }

  function handleCreateItem() {
    const price = parseFloat(newItem.price);
    if (!newItem.name || isNaN(price)) return;
    const fakeProduct: Product = {
      id: `custom-${Date.now()}`,
      name: newItem.name,
      price,
      categoryId: newItem.dept || 'cat-1',
      vatRate: 0.20,
    };
    dispatch({ type: 'ADD_PRODUCT', product: fakeProduct });
    setNewItem({ name: '', price: '', dept: '' });
    setShowCreateItem(false);
    setSearchQuery('');
    setSearchResults([]);
  }

  function openDiscount(lineId: string) {
    setKeypadFor({ lineId, mode: 'discount' });
    setKeypadValue('0');
    setDiscountType('percent');
  }

  function handleKeypadConfirm(val: string) {
    if (!keypadFor) return;
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) { setKeypadFor(null); return; }

    if (keypadFor.mode === 'qty') {
      dispatch({ type: 'SET_QTY', lineId: keypadFor.lineId, qty: Math.round(num) });
    } else if (keypadFor.mode === 'weight') {
      dispatch({ type: 'SET_WEIGHT', lineId: keypadFor.lineId, weight: num });
    } else if (keypadFor.mode === 'discount') {
      // Check discount limit
      const line = state.lines.find((l) => l.id === keypadFor.lineId);
      const currentStaff = session.staff;
      if (currentStaff && discountType === 'percent' && num > (currentStaff.discountLimit ?? 100)) {
        // Requires manager approval
        setElevationFor({ lineId: keypadFor.lineId, type: 'discount-limit' });
        setKeypadFor(null);
        return;
      }
      dispatch({ type: 'SET_LINE_DISCOUNT', lineId: keypadFor.lineId, discount: { type: discountType, value: num } });
    }
    setKeypadFor(null);
  }

  function handleHold() {
    dispatch({ type: 'HOLD_SALE' });
  }

  function handleRecall(heldId: string) {
    dispatch({ type: 'RECALL_SALE', heldId });
    setShowRecall(false);
  }

  const hasUnverifiedAge = state.lines.some((l) => l.ageVerified === false);

  return (
    <div style={{ display: 'flex', height: '100%', background: '#F3F4F6', overflow: 'hidden' }}>

      {/* ── LEFT: Category browser + Search ── */}
      <div style={{
        width: '360px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(0,0,0,0.08)',
        background: '#F8F9FA',
        overflow: 'hidden',
      }}>
        {/* Search / Scan input */}
        <div style={{ padding: '12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', pointerEvents: 'none' }}>🔍</span>
            <input
              type="text"
              placeholder="Scan barcode or search product…"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleBarcodeEnter}
              aria-label="Scan barcode or search product"
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '10px',
                border: '1.5px solid rgba(0,0,0,0.12)',
                padding: '0 12px 0 40px',
                fontSize: '14px',
                fontFamily: 'inherit',
                background: 'white',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Search results / Create Item */}
        {(searchResults.length > 0 || showCreateItem) ? (
          <div style={{ overflowY: 'auto', flex: 1, padding: '8px 12px' }}>
            {searchResults.map((p) => (
              <button
                key={p.id}
                onClick={() => handleProductSelect(p)}
                aria-label={`Add ${p.name}`}
                style={{
                  width: '100%', marginBottom: '4px', padding: '10px 12px',
                  borderRadius: '10px', background: 'white',
                  border: '1.5px solid rgba(0,0,0,0.08)',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 120ms',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EEF2FF'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; }}
              >
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: '#8A90A0' }}>
                    {p.weighed ? '⚖️ Weighed · ' : ''}{p.ageRestricted ? '🔞 Age restricted · ' : ''}£{p.price.toFixed(2)}
                  </div>
                </div>
              </button>
            ))}

            {showCreateItem && (
              <div style={{
                borderRadius: '12px', background: '#EEF2FF',
                border: '1.5px dashed #1F5FD1', padding: '16px',
              }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1F5FD1', marginBottom: '12px' }}>
                  + Create Item — "{searchQuery}"
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    placeholder="Product name"
                    value={newItem.name || searchQuery}
                    onChange={(e) => setNewItem((n) => ({ ...n, name: e.target.value }))}
                    aria-label="New product name"
                    style={{ height: '40px', borderRadius: '8px', border: '1px solid rgba(31,95,209,0.3)', padding: '0 10px', fontSize: '14px', fontFamily: 'inherit' }}
                  />
                  <input
                    placeholder="Price £"
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem((n) => ({ ...n, price: e.target.value }))}
                    aria-label="New product price"
                    style={{ height: '40px', borderRadius: '8px', border: '1px solid rgba(31,95,209,0.3)', padding: '0 10px', fontSize: '14px', fontFamily: 'inherit' }}
                  />
                  <button
                    onClick={handleCreateItem}
                    aria-label="Create and add item to basket"
                    style={{
                      height: '44px', borderRadius: '8px', background: '#1F5FD1',
                      border: 'none', color: 'white', fontSize: '14px',
                      fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    Add to Basket
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Category browser */
          <div style={{ padding: '8px 12px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#8A90A0', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Browse Departments
            </div>
            <CategoryBrowser onProductSelect={handleProductSelect} />
          </div>
        )}
      </div>

      {/* ── CENTRE+RIGHT: Basket ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#F3F4F6',
      }}>
        {/* Basket header */}
        <div style={{
          padding: '12px 16px 8px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#F8F9FA',
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#5A6072' }}>
            Current Sale {state.lines.filter((l) => !l.isPromotionLine).length > 0 && `· ${state.lines.filter((l) => !l.isPromotionLine).length} item${state.lines.filter((l) => !l.isPromotionLine).length !== 1 ? 's' : ''}`}
          </div>
          {state.heldSales.length > 0 && (
            <button
              onClick={() => setShowRecall(true)}
              aria-label={`Recall held sales (${state.heldSales.length})`}
              style={{
                height: '32px', padding: '0 12px', borderRadius: '8px',
                background: 'rgba(31,95,209,0.1)', border: '1px solid rgba(31,95,209,0.3)',
                color: '#1F5FD1', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              📋 {state.heldSales.length} Held Sale{state.heldSales.length !== 1 ? 's' : ''}
            </button>
          )}
        </div>

        {/* Basket lines */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {state.lines.length === 0 ? (
            <EmptyState
              icon="🛒"
              title="Scan or tap an item to start"
              description="Search, scan a barcode, or browse departments on the left"
            />
          ) : (
            state.lines.map((line) => (
              <BasketLineItem
                key={line.id}
                line={line}
                onVoid={() => dispatch({ type: 'REMOVE_LINE', lineId: line.id })}
                onDiscount={() => openDiscount(line.id)}
                onQtyChange={(qty) => dispatch({ type: 'SET_QTY', lineId: line.id, qty })}
                onWeightChange={(w) => dispatch({ type: 'SET_WEIGHT', lineId: line.id, weight: w })}
                onVerifyAge={() => dispatch({ type: 'VERIFY_AGE', lineId: line.id })}
              />
            ))
          )}
        </div>

        {/* Basket totals */}
        {state.lines.length > 0 && (
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(0,0,0,0.08)',
            background: 'white',
          }}>
            {totals.totalDiscount > 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#5A6072', marginBottom: '4px' }}>
                  <span>Subtotal</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>£{totals.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#107C10', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Savings</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>−£{totals.totalDiscount.toFixed(2)}</span>
                </div>
              </>
            )}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'baseline',
              borderTop: totals.totalDiscount > 0 ? '1px solid rgba(0,0,0,0.08)' : 'none',
              paddingTop: totals.totalDiscount > 0 ? '8px' : 0,
            }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#5A6072' }}>Total</span>
              <span style={{
                fontSize: '36px', fontWeight: 800,
                color: '#1A1D21', fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
              }}>
                £{totals.total.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* ── Action Row ── */}
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          background: '#F8F9FA',
          display: 'flex',
          gap: '8px',
          alignItems: 'stretch',
        }}>
          {/* Quiet tier — destructive, far left, visually separate */}
          <div style={{ display: 'flex', gap: '6px', marginRight: '8px' }}>
            <ActionButton
              tier="quiet"
              label="Void"
              disabled={state.lines.filter((l) => !l.isPromotionLine).length === 0}
              onClick={() => {
                const lastLine = [...state.lines].filter((l) => !l.isPromotionLine).pop();
                if (lastLine) dispatch({ type: 'REMOVE_LINE', lineId: lastLine.id });
              }}
            />
            <ActionButton
              tier="quiet"
              label="Cancel"
              disabled={state.lines.length === 0}
              onClick={() => setShowCancelConfirm(true)}
            />
          </div>

          {/* Visual separator */}
          <div style={{ width: '1px', background: 'rgba(0,0,0,0.1)', margin: '4px 0', flexShrink: 0 }} />

          {/* Neutral tier */}
          <ActionButton
            tier="neutral"
            label="Hold"
            disabled={state.lines.length === 0}
            onClick={handleHold}
          />
          <ActionButton
            tier="neutral"
            label="Discount"
            disabled={state.lines.filter((l) => !l.isPromotionLine).length === 0}
            onClick={() => {
              const lastLine = [...state.lines].filter((l) => !l.isPromotionLine).pop();
              if (lastLine) openDiscount(lastLine.id);
            }}
          />
          <ActionButton
            tier="neutral"
            label="No Sale"
            onClick={() => setShowNoSale(true)}
          />

          {/* Primary: Payment — the ONE big action */}
          <ActionButton
            tier="primary"
            label={`Pay  £${totals.total.toFixed(2)}`}
            size="large"
            disabled={state.lines.filter((l) => !l.isPromotionLine).length === 0 || hasUnverifiedAge}
            onClick={() => router.push('/cashier/tender')}
            style={{ flex: 1, maxWidth: '220px', marginLeft: 'auto' }}
          />
        </div>
      </div>

      {/* ── OVERLAYS ── */}

      {/* Keypad overlay for discount */}
      {keypadFor && (
        <NumericKeypadOverlay
          title={keypadFor.mode === 'discount' ? 'Apply Discount' : keypadFor.mode === 'qty' ? 'Set Quantity' : 'Set Weight (kg)'}
          subtitle={keypadFor.mode === 'discount' ? 'Enter value, then choose % or £' : undefined}
          value={keypadValue}
          onChange={setKeypadValue}
          onConfirm={handleKeypadConfirm}
          onCancel={() => setKeypadFor(null)}
          isCurrency={keypadFor.mode === 'discount' && discountType === 'amount'}
          confirmLabel={keypadFor.mode === 'discount' ? 'Apply Discount' : 'Set'}
          toggle={keypadFor.mode === 'discount' ? (
            // One panel, one %/£ toggle — spec requirement
            <div style={{ display: 'flex', background: '#F0F2F5', borderRadius: '8px', padding: '3px', gap: '3px' }}>
              {(['percent', 'amount'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setDiscountType(t)}
                  aria-label={`Discount by ${t === 'percent' ? 'percentage' : 'fixed amount'}`}
                  style={{
                    flex: 1, height: '36px', borderRadius: '6px',
                    background: discountType === t ? 'white' : 'transparent',
                    border: discountType === t ? '1px solid rgba(0,0,0,0.12)' : 'none',
                    fontWeight: 700, fontSize: '16px', cursor: 'pointer',
                    color: discountType === t ? '#1F5FD1' : '#7A8099',
                    boxShadow: discountType === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    fontFamily: 'inherit',
                    transition: 'all 150ms',
                  }}
                >
                  {t === 'percent' ? '%' : '£'}
                </button>
              ))}
            </div>
          ) : undefined}
        />
      )}

      {/* Manager elevation modal */}
      {elevationFor && (
        <ManagerElevationModal
          type={elevationFor.type}
          context={elevationFor.type === 'discount-limit' ? 'Discount exceeds your authorised limit' : undefined}
          onApprove={() => {
            if (elevationFor.type === 'discount-limit' && keypadFor) {
              // Would continue with discount — simplified for prototype
            }
            setElevationFor(null);
          }}
          onDeny={() => setElevationFor(null)}
        />
      )}

      {/* Recall panel */}
      {showRecall && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', width: '400px',
            maxHeight: '500px', overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
          }}>
            <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>📋 Held Sales</div>
              <button onClick={() => setShowRecall(false)} aria-label="Close" style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#5A6072' }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', maxHeight: '380px', padding: '12px' }}>
              {state.heldSales.map((held) => (
                <button
                  key={held.id}
                  onClick={() => handleRecall(held.id)}
                  aria-label={`Recall sale from ${new Date(held.heldAt).toLocaleTimeString()}`}
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: '10px',
                    background: '#F8F9FA', border: '1.5px solid rgba(0,0,0,0.08)',
                    cursor: 'pointer', textAlign: 'left', marginBottom: '8px',
                    fontFamily: 'inherit', transition: 'all 150ms',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EEF2FF'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F8F9FA'; }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                    Held at {new Date(held.heldAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ fontSize: '12px', color: '#7A8099' }}>
                    {held.lines.filter((l) => !l.isPromotionLine).length} items
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cancel sale confirm */}
      {showCancelConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '28px',
            width: '360px', boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '12px', textAlign: 'center' }}>⚠️</div>
            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Cancel Sale?</div>
            <div style={{ fontSize: '14px', color: '#5A6072', textAlign: 'center', marginBottom: '24px', lineHeight: 1.5 }}>
              This will remove all {state.lines.filter((l) => !l.isPromotionLine).length} item{state.lines.filter((l) => !l.isPromotionLine).length !== 1 ? 's' : ''} from the basket. This cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowCancelConfirm(false)}
                aria-label="Keep sale"
                style={{
                  flex: 1, height: '52px', borderRadius: '10px',
                  background: 'transparent', border: '1.5px solid rgba(0,0,0,0.15)',
                  fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Keep Sale</button>
              <button
                onClick={() => { dispatch({ type: 'CANCEL_SALE' }); setShowCancelConfirm(false); }}
                aria-label="Confirm cancel sale"
                style={{
                  flex: 1, height: '52px', borderRadius: '10px',
                  background: '#C4314B', border: 'none',
                  color: 'white', fontSize: '15px', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Cancel Sale</button>
            </div>
          </div>
        </div>
      )}

      {/* No Sale modal */}
      {showNoSale && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '24px',
            width: '340px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>🗄️ Open Cash Drawer</div>
            <div style={{ fontSize: '13px', color: '#5A6072', marginBottom: '12px' }}>Select reason (logged for audit):</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
              {['Get Change', 'Check Drawer', 'Manager Request', 'Other'].map((reason) => (
                <button
                  key={reason}
                  onClick={() => setNoSaleReason(reason)}
                  aria-label={`No sale reason: ${reason}`}
                  style={{
                    height: '44px', borderRadius: '8px', textAlign: 'left', padding: '0 14px',
                    background: noSaleReason === reason ? '#EEF2FF' : '#F8F9FA',
                    border: `1.5px solid ${noSaleReason === reason ? '#1F5FD1' : 'rgba(0,0,0,0.1)'}`,
                    fontSize: '14px', fontWeight: noSaleReason === reason ? 600 : 400,
                    color: noSaleReason === reason ? '#1F5FD1' : '#1A1D21',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >{reason}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setShowNoSale(false); setNoSaleReason(''); }} aria-label="Cancel" style={{ flex: 1, height: '48px', borderRadius: '10px', background: 'transparent', border: '1.5px solid rgba(0,0,0,0.12)', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              <button
                onClick={() => { /* In production: open drawer + log event */ setShowNoSale(false); setNoSaleReason(''); alert(`Drawer opened. Reason: ${noSaleReason} — logged for audit.`); }}
                disabled={!noSaleReason}
                aria-label="Open drawer"
                style={{
                  flex: 1, height: '48px', borderRadius: '10px',
                  background: noSaleReason ? '#1F5FD1' : '#C0C4CC',
                  border: 'none', color: 'white', fontSize: '14px',
                  fontWeight: 700, cursor: noSaleReason ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit',
                }}
              >Open Drawer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
