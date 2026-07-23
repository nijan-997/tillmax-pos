'use client';

import React, { useState, useRef } from 'react';
import { useBasket } from '@/lib/basket-context';
import { useSession } from '@/lib/session-context';
import {
  searchProducts, getProductByBarcode, getProductsByCategory,
  Product, ProductVariant,
} from '@/lib/mock-data/products';
import { getTopLevelCategories, getSubcategories, Category } from '@/lib/mock-data/categories';
import { useRouter } from 'next/navigation';
import { SyncStatusPill } from '@/components/shared/SyncStatusPill';

// ─── Height budget (px) for 768-high terminal ──────────────────────────────────
// StatusBar: 48  SearchBar: 52  ActionBar: 64  ⟹  Content: 604
const CONTENT_H = 604;

// ─── Top status bar ───────────────────────────────────────────────────────────
function StatusBar() {
  const { session } = useSession();
  const router = useRouter();

  return (
    <div style={{
      height: 48, flexShrink: 0,
      background: '#1A1D21',
      display: 'flex', alignItems: 'center',
      padding: '0 16px',
      gap: 0,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 20 }}>
        <span style={{ background: '#1F5FD1', color: 'white', fontWeight: 800, fontSize: 12, padding: '3px 9px', borderRadius: 4, letterSpacing: '0.06em' }}>TILLMAX</span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>RetailMAX POS</span>
        <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.15)' }} />
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Till 01 · Store #001</span>
      </div>

      {/* Staff name — centre */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
          {session.staff?.name ?? ''}
        </span>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <SyncStatusPill />
        {session.staff?.role !== 'Till Staff' && (
          <button
            onClick={() => router.push('/manager/elevate')}
            aria-label="Manager mode"
            style={{
              height: 30, padding: '0 14px', borderRadius: 6,
              background: '#6B4FCC', border: 'none',
              color: 'white', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >Manager</button>
        )}
      </div>
    </div>
  );
}

// ─── Department tile ───────────────────────────────────────────────────────────
function DeptTile({ cat, onClick }: { cat: Category; onClick: () => void }) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      aria-label={`Browse ${cat.name}`}
      style={{
        background: pressed ? '#E4E6EA' : '#EBEBEB',
        border: '1.5px solid rgba(0,0,0,0.07)',
        borderRadius: 12,
        cursor: 'pointer', fontFamily: 'inherit',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 10,
        padding: '14px 8px',
        transition: 'all 120ms',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
      }}
    >
      {/* Circular coloured disc */}
      <div style={{
        width: 60, height: 60, borderRadius: '50%',
        background: cat.colour,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, lineHeight: 1,
        boxShadow: `0 4px 12px ${cat.colour}50`,
        flexShrink: 0,
      }}>
        {cat.icon}
      </div>
      {/* Label */}
      <span style={{
        fontSize: 12, fontWeight: 600, color: '#1A1D21',
        textAlign: 'center', lineHeight: 1.3,
        maxWidth: 120,
      }}>
        {cat.name}
      </span>
    </button>
  );
}

// ─── Product tile (inside a category) ─────────────────────────────────────────
function ProductTile({ product, accent, onSelect }: { product: Product; accent: string; onSelect: () => void }) {
  const hasVariants = !!product.variants?.length;
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onSelect}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      aria-label={hasVariants ? `Pick variety of ${product.name}` : `Add ${product.name}`}
      style={{
        background: pressed ? `${accent}14` : 'white',
        border: `1.5px solid ${pressed ? accent : 'rgba(0,0,0,0.09)'}`,
        borderRadius: 10,
        cursor: 'pointer', fontFamily: 'inherit',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        padding: '10px 10px 8px',
        gap: 4,
        transition: 'all 100ms',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
      }}
    >
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {product.ageRestricted && <span style={{ fontSize: 9, background: '#FFEBEE', color: '#C4314B', padding: '1px 5px', borderRadius: 99, fontWeight: 700 }}>🔞</span>}
        {product.weighed && <span style={{ fontSize: 9, background: '#E3F2FD', color: '#1565C0', padding: '1px 5px', borderRadius: 99, fontWeight: 700 }}>⚖️</span>}
        {hasVariants && <span style={{ fontSize: 9, background: `${accent}18`, color: accent, padding: '1px 5px', borderRadius: 99, fontWeight: 700 }}>{product.variants!.length} types</span>}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1D21', lineHeight: 1.3, flex: 1 }}>{product.name}</div>
      <div style={{ fontSize: 14, fontWeight: 800, color: accent, fontVariantNumeric: 'tabular-nums' }}>
        {hasVariants ? 'from ' : ''}£{product.price.toFixed(2)}
      </div>
    </button>
  );
}

// ─── Variant slide-up panel ───────────────────────────────────────────────────
function VariantPanel({
  product, accent, open, onClose, onSelect, onSelectDefault,
}: {
  product: Product | null; accent: string; open: boolean;
  onClose: () => void;
  onSelect: (v: ProductVariant) => void;
  onSelectDefault: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.32)',
        opacity: open ? 1 : 0,
        transition: 'opacity 260ms ease',
        pointerEvents: open ? 'auto' : 'none',
        zIndex: 10,
      }} />
      {/* Panel */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'white',
        borderRadius: '16px 16px 0 0',
        boxShadow: '0 -6px 28px rgba(0,0,0,0.18)',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 300ms cubic-bezier(0.32,0.72,0,1)',
        zIndex: 20,
        maxHeight: '70%',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: 'rgba(0,0,0,0.14)' }} />
        </div>
        {/* Header */}
        <div style={{ padding: '4px 16px 12px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.07)', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1A1D21' }}>{product?.name}</div>
            <div style={{ fontSize: 12, color: '#8A90A0', marginTop: 2 }}>
              Tap a variety to add to basket
              {product?.ageRestricted && <span style={{ marginLeft: 8, color: '#C4314B', fontWeight: 700 }}>🔞 Age restricted</span>}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 30, height: 30, borderRadius: '50%', background: '#F0F2F5', border: 'none', cursor: 'pointer', fontSize: 14, color: '#5A6072', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 12, flexShrink: 0 }}>✕</button>
        </div>
        {/* Variants */}
        <div style={{ overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(product?.variants ?? []).map((v, i) => (
            <button key={v.id} onClick={() => onSelect(v)} aria-label={`Add ${v.name}`}
              style={{ padding: '12px 14px', borderRadius: 10, background: '#F8F9FA', border: '1.5px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 110ms' }}
              onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = `${accent}0D`; b.style.borderColor = accent; }}
              onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = '#F8F9FA'; b.style.borderColor = 'rgba(0,0,0,0.08)'; }}
            >
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${accent}20`, border: `1.5px solid ${accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: accent, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1D21' }}>{v.name}</div>
                {v.note && <div style={{ fontSize: 11, color: '#8A90A0', marginTop: 1 }}>{v.note}</div>}
              </div>
              <span style={{ fontSize: 15, fontWeight: 800, color: accent, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>£{(v.price ?? product?.price ?? 0).toFixed(2)}</span>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: accent, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>+</span>
            </button>
          ))}
          <button onClick={onSelectDefault} aria-label="Add without variety"
            style={{ padding: '10px 14px', borderRadius: 10, background: 'transparent', border: '1.5px dashed rgba(0,0,0,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontFamily: 'inherit', color: '#8A90A0', marginTop: 2 }}>
            <span style={{ fontSize: 13 }}>Add without selecting variety</span>
            <span style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>£{(product?.price ?? 0).toFixed(2)}</span>
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Basket line ──────────────────────────────────────────────────────────────
function BasketLine({ line, onVoid, onDiscount, onQtyChange, onWeightChange, onVerifyAge }: {
  line: ReturnType<typeof useBasket>['state']['lines'][0];
  onVoid: () => void; onDiscount: () => void;
  onQtyChange: (n: number) => void; onWeightChange: (n: number) => void;
  onVerifyAge: () => void;
}) {
  const [menu, setMenu] = useState(false);
  const isWeighed = line.weight !== undefined;
  const qty = isWeighed ? (line.weight ?? 0) : (line.qty ?? 1);
  const rawTotal = line.unitPrice * qty;
  const finalTotal = line.lineDiscount
    ? rawTotal - (line.lineDiscount.type === 'percent'
        ? rawTotal * (line.lineDiscount.value / 100)
        : line.lineDiscount.value)
    : rawTotal;
  const needsAge = line.ageVerified === false;

  return (
    <div style={{
      padding: '0 0 0 0',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
    }}>
      {/* Age warning banner */}
      {needsAge && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(240,163,10,0.08)', padding: '5px 12px', borderBottom: '1px solid rgba(240,163,10,0.2)' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#B8800A' }}>🪪 Challenge 25 — verify age</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={onVerifyAge} aria-label="Verified" style={{ height: 24, padding: '0 8px', borderRadius: 5, background: '#107C10', border: 'none', color: 'white', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>✓ Verified</button>
            <button onClick={onVoid} aria-label="Remove" style={{ height: 24, padding: '0 8px', borderRadius: 5, background: 'transparent', border: '1px solid rgba(196,49,75,0.4)', color: '#C4314B', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: line.isPromotionLine ? 'rgba(16,124,16,0.04)' : 'white', minHeight: 46 }}>
        {line.isPromotionLine && <span style={{ fontSize: 13 }}>🏷️</span>}

        {/* Name */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: line.isPromotionLine ? 500 : 500, color: line.isPromotionLine ? '#107C10' : '#1A1D21', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {line.productName}
          </div>
          {line.lineDiscount && (
            <div style={{ fontSize: 10, color: '#8A90A0' }}>
              {line.lineDiscount.type === 'percent' ? `${line.lineDiscount.value}% off` : `£${line.lineDiscount.value.toFixed(2)} off`}
            </div>
          )}
        </div>

        {/* Qty / weight stepper */}
        {!line.isPromotionLine && (
          isWeighed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <button onClick={() => onWeightChange(Math.max(0.05, (line.weight ?? 0) - 0.05))} aria-label="Less" style={{ width: 24, height: 24, borderRadius: 5, background: '#F0F2F5', border: '1px solid rgba(0,0,0,0.12)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', minWidth: 52, textAlign: 'center', fontWeight: 600, color: '#1A1D21' }}>{(line.weight ?? 0).toFixed(2)}kg</span>
              <button onClick={() => onWeightChange((line.weight ?? 0) + 0.05)} aria-label="More" style={{ width: 24, height: 24, borderRadius: 5, background: '#F0F2F5', border: '1px solid rgba(0,0,0,0.12)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <button onClick={() => (line.qty ?? 1) > 1 ? onQtyChange((line.qty ?? 1) - 1) : onVoid()} aria-label="-" style={{ width: 24, height: 24, borderRadius: 5, background: '#F0F2F5', border: '1px solid rgba(0,0,0,0.12)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span style={{ fontSize: 14, fontVariantNumeric: 'tabular-nums', minWidth: 28, textAlign: 'center', fontWeight: 600, color: '#1A1D21' }}>{line.qty ?? 1}</span>
              <button onClick={() => onQtyChange((line.qty ?? 1) + 1)} aria-label="+" style={{ width: 24, height: 24, borderRadius: 5, background: '#F0F2F5', border: '1px solid rgba(0,0,0,0.12)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
          )
        )}

        {/* Total */}
        <div style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums', minWidth: 50, textAlign: 'right', color: line.isPromotionLine ? '#107C10' : '#1A1D21' }}>
          {line.isPromotionLine ? '−' : ''}£{Math.abs(finalTotal).toFixed(2)}
        </div>

        {/* 3-dot menu */}
        {!line.isPromotionLine && (
          <div style={{ position: 'relative' }}>
            <button onClick={() => setMenu(!menu)} aria-label="Options" style={{ width: 24, height: 24, borderRadius: 5, background: 'transparent', border: 'none', fontSize: 16, cursor: 'pointer', color: '#B0B4C0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⋮</button>
            {menu && (
              <div style={{ position: 'absolute', right: 0, top: 28, background: 'white', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8, boxShadow: '0 6px 20px rgba(0,0,0,0.14)', zIndex: 200, minWidth: 130, overflow: 'hidden' }}>
                <button onClick={() => { onDiscount(); setMenu(false); }} style={{ display: 'block', width: '100%', padding: '9px 12px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#1A1D21' }}>% Discount</button>
                <div style={{ height: 1, background: 'rgba(0,0,0,0.07)' }} />
                <button onClick={() => { onVoid(); setMenu(false); }} style={{ display: 'block', width: '100%', padding: '9px 12px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#C4314B' }}>✕ Void Line</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Action button ────────────────────────────────────────────────────────────
function Btn({
  label, tier = 'neutral', disabled = false, onClick, wide = false,
}: {
  label: string; tier?: 'quiet' | 'neutral' | 'primary'; disabled?: boolean; onClick: () => void; wide?: boolean;
}) {
  const styles: Record<string, React.CSSProperties> = {
    quiet: {
      background: 'white',
      border: '1.5px solid #C4314B',
      color: '#C4314B',
    },
    neutral: {
      background: 'white',
      border: '1.5px solid rgba(0,0,0,0.22)',
      color: '#1A1D21',
    },
    primary: {
      background: '#1F5FD1',
      border: '1.5px solid #1F5FD1',
      color: 'white',
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        height: 44,
        padding: '0 20px',
        minWidth: wide ? 220 : 80,
        borderRadius: 8,
        fontSize: 14,
        fontWeight: tier === 'primary' ? 700 : 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        opacity: disabled ? 0.45 : 1,
        transition: 'all 100ms',
        whiteSpace: 'nowrap',
        ...styles[tier],
      }}
    >
      {label}
    </button>
  );
}

// ─── MAIN SALE PAGE ───────────────────────────────────────────────────────────
export default function SalePage() {
  const { state, dispatch, totals } = useBasket();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  // Browser nav
  type Level = { view: 'categories' } | { view: 'products'; cat: Category; subcatId: string };
  const [level, setLevel] = useState<Level>({ view: 'categories' });

  // Variant slide panel
  const [variantProduct, setVariantProduct] = useState<Product | null>(null);
  const [variantOpen, setVariantOpen] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newItemPrice, setNewItemPrice] = useState('');

  // Discount
  const [discountLineId, setDiscountLineId] = useState<string | null>(null);
  const [discountValue, setDiscountValue] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');

  // Overlays
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showHeld, setShowHeld] = useState(false);
  const [showNoSale, setShowNoSale] = useState(false);
  const [noSaleReason, setNoSaleReason] = useState('');

  function handleSearch(q: string) {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); setShowCreate(false); return; }
    const r = searchProducts(q);
    setSearchResults(r); setShowCreate(r.length === 0);
  }

  function openVariants(p: Product) {
    setVariantProduct(p);
    setTimeout(() => setVariantOpen(true), 16);
  }
  function closeVariants() {
    setVariantOpen(false);
    setTimeout(() => setVariantProduct(null), 320);
  }

  function commitProduct(product: Product, variant?: ProductVariant) {
    const final = variant
      ? { ...product, id: variant.id, name: variant.name, price: variant.price ?? product.price, variants: undefined }
      : product;
    dispatch({ type: 'ADD_PRODUCT', product: final });
    // ← Always snap back to department grid after adding
    closeVariants();
    setLevel({ view: 'categories' });
    setSearchQuery(''); setSearchResults([]); setShowCreate(false);
  }

  function handleProductSelect(p: Product) {
    if (p.variants?.length) { openVariants(p); } else { commitProduct(p); }
  }

  function goToProducts(cat: Category) {
    const subcats = getSubcategories(cat.id);
    setLevel({ view: 'products', cat, subcatId: subcats.length ? subcats[0].id : cat.id });
  }

  const saleLines = state.lines.filter((l) => !l.isPromotionLine);
  const hasUnverifiedAge = state.lines.some((l) => l.ageVerified === false);
  const isSearching = searchQuery.length > 0;
  const accent = level.view === 'products' ? (level.cat.colour ?? '#1F5FD1') : '#1F5FD1';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#F3F4F6', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── STATUS BAR (48px) ── */}
      <StatusBar />

      {/* ── SEARCH BAR (52px) — full width ── */}
      <div style={{
        height: 52, flexShrink: 0,
        background: 'white',
        borderBottom: '1px solid rgba(0,0,0,0.09)',
        display: 'flex', alignItems: 'center',
        padding: '0 16px', gap: 12,
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>
            {isSearching ? '🔍' : '📷'}
          </span>
          <input
            ref={searchRef}
            type="text"
            placeholder="Scan barcode or search product..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              const p = getProductByBarcode(searchQuery.trim());
              if (p) commitProduct(p);
            }}
            aria-label="Barcode / search"
            style={{
              width: '100%', height: 36, borderRadius: 8,
              border: '1.5px solid rgba(0,0,0,0.14)',
              padding: '0 32px 0 40px', fontSize: 13,
              fontFamily: 'inherit', background: '#F8F9FA',
              outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#1F5FD1'; e.target.style.background = 'white'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.14)'; e.target.style.background = '#F8F9FA'; }}
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} aria-label="Clear" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', color: '#8A90A0' }}>✕</button>
          )}
        </div>
        {/* Item count */}
        <div style={{ fontSize: 13, fontWeight: 600, color: '#5A6072', whiteSpace: 'nowrap' }}>
          {saleLines.length > 0 ? `${saleLines.length} item${saleLines.length !== 1 ? 's' : ''}` : ''}
        </div>
        {state.heldSales.length > 0 && (
          <button onClick={() => setShowHeld(true)} aria-label="Held sales" style={{ height: 30, padding: '0 10px', borderRadius: 6, background: 'rgba(31,95,209,0.08)', border: '1px solid rgba(31,95,209,0.22)', color: '#1F5FD1', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            📋 {state.heldSales.length} held
          </button>
        )}
      </div>

      {/* ── MAIN CONTENT (604px) — two equal columns ── */}
      <div style={{ height: CONTENT_H, display: 'flex', overflow: 'hidden' }}>

        {/* ── LEFT: Browse panel (512px) ── */}
        <div style={{
          width: 512, flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid rgba(0,0,0,0.09)',
          background: '#F3F4F6',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {isSearching ? (
            /* Search results */
            <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
              {searchResults.map((p) => (
                <button key={p.id} onClick={() => handleProductSelect(p)} aria-label={`Add ${p.name}`}
                  style={{ width: '100%', marginBottom: 4, padding: '10px 12px', borderRadius: 8, background: 'white', border: '1.5px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EEF2FF'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; }}
                >
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#8A90A0' }}>{p.weighed ? '⚖️ · ' : ''}{p.ageRestricted ? '🔞 · ' : ''}{p.variants ? `${p.variants.length} types · ` : ''}£{p.price.toFixed(2)}</div>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#1F5FD1', fontVariantNumeric: 'tabular-nums' }}>£{p.price.toFixed(2)}</span>
                </button>
              ))}
              {showCreate && (
                <div style={{ borderRadius: 10, background: '#EEF2FF', border: '1.5px dashed #1F5FD1', padding: 14, marginTop: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1F5FD1', marginBottom: 10 }}>+ Create item</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input placeholder="Price £" type="number" step="0.01" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} aria-label="Price" style={{ flex: 1, height: 36, borderRadius: 6, border: '1px solid rgba(31,95,209,0.3)', padding: '0 8px', fontSize: 13, fontFamily: 'inherit' }} />
                    <button onClick={() => { const price = parseFloat(newItemPrice); if (!price) return; commitProduct({ id: `custom-${Date.now()}`, name: searchQuery, price, categoryId: 'cat-1', vatRate: 0.20 }); setNewItemPrice(''); }} aria-label="Add" style={{ height: 36, padding: '0 14px', borderRadius: 6, background: '#1F5FD1', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Add</button>
                  </div>
                </div>
              )}
              {!showCreate && searchResults.length === 0 && (
                <div style={{ textAlign: 'center', paddingTop: 40, color: '#8A90A0', fontSize: 13 }}>🔍 Nothing found for "{searchQuery}"</div>
              )}
            </div>
          ) : level.view === 'categories' ? (
            /* Department grid */
            <>
              <div style={{ padding: '10px 14px 6px', flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#8A90A0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Departments</div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, alignContent: 'start' }}>
                {getTopLevelCategories().map((cat) => (
                  <DeptTile key={cat.id} cat={cat} onClick={() => goToProducts(cat)} />
                ))}
              </div>
            </>
          ) : (
            /* Product grid */
            <>
              {/* Breadcrumb */}
              <div style={{ padding: '8px 12px', background: `${level.cat.colour}0E`, borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <button onClick={() => setLevel({ view: 'categories' })} aria-label="Departments" style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#8A90A0', cursor: 'pointer', fontFamily: 'inherit', padding: '2px 4px' }}>⊞ Departments</button>
                <span style={{ color: '#C0C4CC', fontSize: 14 }}>›</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: level.cat.colour, padding: '2px 6px', background: `${level.cat.colour}18`, borderRadius: 6 }}>{level.cat.icon} {level.cat.name}</span>
              </div>
              {/* Subcategory tabs */}
              {getSubcategories(level.cat.id).length > 0 && (
                <div style={{ display: 'flex', gap: 6, padding: '7px 12px', overflowX: 'auto', flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.06)', scrollbarWidth: 'none' }}>
                  {getSubcategories(level.cat.id).map((sub) => (
                    <button key={sub.id} onClick={() => setLevel({ ...level, subcatId: sub.id })} aria-label={sub.name}
                      style={{ height: 28, padding: '0 12px', borderRadius: 99, whiteSpace: 'nowrap', background: level.subcatId === sub.id ? level.cat.colour : 'white', border: `1.5px solid ${level.subcatId === sub.id ? level.cat.colour : 'rgba(0,0,0,0.1)'}`, color: level.subcatId === sub.id ? 'white' : '#5A6072', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, transition: 'all 140ms' }}>
                      {sub.icon} {sub.name}
                    </button>
                  ))}
                </div>
              )}
              {/* Products */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, alignContent: 'start' }}>
                {getProductsByCategory(level.subcatId).map((p) => (
                  <ProductTile key={p.id} product={p} accent={level.cat.colour ?? '#1F5FD1'} onSelect={() => handleProductSelect(p)} />
                ))}
              </div>
            </>
          )}

          {/* Variant slide panel — absolutely inside this column */}
          <VariantPanel
            product={variantProduct} accent={accent} open={variantOpen}
            onClose={closeVariants}
            onSelect={(v) => variantProduct && commitProduct(variantProduct, v)}
            onSelectDefault={() => variantProduct && commitProduct(variantProduct)}
          />
        </div>

        {/* ── RIGHT: Basket (remaining width 511px) ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid rgba(0,0,0,0.07)', flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8A90A0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Current Sale</div>
          </div>

          {/* Lines */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {state.lines.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#B0B4C0' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🛒</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Basket is empty</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Browse departments or scan a barcode</div>
              </div>
            ) : (
              state.lines.map((line) => (
                <BasketLine
                  key={line.id} line={line}
                  onVoid={() => dispatch({ type: 'REMOVE_LINE', lineId: line.id })}
                  onDiscount={() => { setDiscountLineId(line.id); setDiscountValue(''); }}
                  onQtyChange={(n) => dispatch({ type: 'SET_QTY', lineId: line.id, qty: n })}
                  onWeightChange={(w) => dispatch({ type: 'SET_WEIGHT', lineId: line.id, weight: w })}
                  onVerifyAge={() => dispatch({ type: 'VERIFY_AGE', lineId: line.id })}
                />
              ))
            )}
          </div>

          {/* Total */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '10px 14px', background: 'white', flexShrink: 0 }}>
            {totals.totalDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#107C10', fontWeight: 600, marginBottom: 4 }}>
                <span>💚 Savings</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>−£{totals.totalDiscount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#8A90A0' }}>Total</span>
              <span style={{ fontSize: 32, fontWeight: 900, color: '#1A1D21', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                £{totals.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── ACTION BAR (64px) ── */}
      <div style={{
        height: 64, flexShrink: 0,
        background: 'white',
        borderTop: '1px solid rgba(0,0,0,0.1)',
        display: 'flex', alignItems: 'center',
        padding: '0 16px',
        boxShadow: '0 -2px 6px rgba(0,0,0,0.06)',
      }}>
        {/* Left/Centre group — secondary actions */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Btn tier="quiet" label="Void" disabled={saleLines.length === 0}
            onClick={() => { const last = [...saleLines].pop(); if (last) dispatch({ type: 'REMOVE_LINE', lineId: last.id }); }}
          />
          <Btn tier="quiet" label="Cancel" disabled={state.lines.length === 0}
            onClick={() => setShowCancelConfirm(true)}
          />
          <Btn tier="neutral" label="Hold" disabled={state.lines.length === 0}
            onClick={() => dispatch({ type: 'HOLD_SALE' })}
          />
          <Btn tier="neutral" label="Discount" disabled={saleLines.length === 0}
            onClick={() => { const last = [...saleLines].pop(); if (last) { setDiscountLineId(last.id); setDiscountValue(''); } }}
          />
          <Btn tier="neutral" label="No Sale" onClick={() => setShowNoSale(true)} />
          <Btn tier="neutral" label="History" onClick={() => router.push('/cashier/history')} />
        </div>

        {/* Pay — right pinned, wide */}
        <Btn
          tier="primary"
          label={saleLines.length > 0 ? `Pay £${totals.total.toFixed(2)}` : 'Pay'}
          disabled={saleLines.length === 0 || hasUnverifiedAge}
          onClick={() => router.push('/cashier/tender')}
          wide
        />
      </div>

      {/* ══ MODALS / OVERLAYS ═══════════════════════════════════════════════════ */}

      {/* Discount panel */}
      {discountLineId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 24, width: 300, boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Apply Discount</div>
            <div style={{ display: 'flex', background: '#F0F2F5', borderRadius: 8, padding: 3, gap: 3, marginBottom: 12 }}>
              {(['percent', 'amount'] as const).map((t) => (
                <button key={t} onClick={() => setDiscountType(t)} aria-label={t} style={{ flex: 1, height: 34, borderRadius: 6, background: discountType === t ? 'white' : 'transparent', border: discountType === t ? '1px solid rgba(0,0,0,0.12)' : 'none', fontWeight: 700, fontSize: 18, cursor: 'pointer', color: discountType === t ? '#1F5FD1' : '#7A8099', fontFamily: 'inherit', boxShadow: discountType === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                  {t === 'percent' ? '%' : '£'}
                </button>
              ))}
            </div>
            <input type="number" placeholder={discountType === 'percent' ? '0 – 100%' : '£0.00'} value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} aria-label="Discount value" style={{ width: '100%', height: 44, borderRadius: 8, border: '1.5px solid #1F5FD1', padding: '0 12px', fontSize: 18, fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 14 }} autoFocus />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setDiscountLineId(null)} aria-label="Cancel" style={{ flex: 1, height: 44, borderRadius: 8, background: 'transparent', border: '1.5px solid rgba(0,0,0,0.15)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={() => {
                const num = parseFloat(discountValue);
                if (!isNaN(num) && num > 0) dispatch({ type: 'SET_LINE_DISCOUNT', lineId: discountLineId, discount: { type: discountType, value: num } });
                setDiscountLineId(null);
              }} aria-label="Apply" style={{ flex: 1, height: 44, borderRadius: 8, background: '#1F5FD1', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* Held sales */}
      {showHeld && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: 16, width: 360, maxHeight: 460, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>📋 Held Sales</div>
              <button onClick={() => setShowHeld(false)} aria-label="Close" style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#7A8099' }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', padding: 12 }}>
              {state.heldSales.map((h) => (
                <button key={h.id} onClick={() => { dispatch({ type: 'RECALL_SALE', heldId: h.id }); setShowHeld(false); }} aria-label="Recall" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: '#F8F9FA', border: '1.5px solid rgba(0,0,0,0.08)', cursor: 'pointer', textAlign: 'left', marginBottom: 6, fontFamily: 'inherit' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EEF2FF'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F8F9FA'; }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Held at {new Date(h.heldAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                  <div style={{ fontSize: 11, color: '#7A8099', marginTop: 2 }}>{h.lines.filter((l) => !l.isPromotionLine).length} items</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cancel confirmation */}
      {showCancelConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, width: 320, boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}>
            <div style={{ fontSize: 22, textAlign: 'center', marginBottom: 10 }}>⚠️</div>
            <div style={{ fontSize: 17, fontWeight: 700, textAlign: 'center', marginBottom: 6 }}>Cancel Sale?</div>
            <div style={{ fontSize: 13, color: '#5A6072', textAlign: 'center', marginBottom: 22, lineHeight: 1.5 }}>All {saleLines.length} item{saleLines.length !== 1 ? 's' : ''} will be removed from the basket.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowCancelConfirm(false)} aria-label="Keep" style={{ flex: 1, height: 48, borderRadius: 8, background: 'transparent', border: '1.5px solid rgba(0,0,0,0.15)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Keep Sale</button>
              <button onClick={() => { dispatch({ type: 'CANCEL_SALE' }); setShowCancelConfirm(false); }} aria-label="Cancel" style={{ flex: 1, height: 48, borderRadius: 8, background: '#C4314B', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel Sale</button>
            </div>
          </div>
        </div>
      )}

      {/* No Sale */}
      {showNoSale && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 22, width: 300, boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>🗄️ Open Cash Drawer</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
              {['Get Change', 'Check Drawer', 'Manager Request', 'Other'].map((r) => (
                <button key={r} onClick={() => setNoSaleReason(r)} aria-label={r} style={{ height: 40, borderRadius: 7, textAlign: 'left', padding: '0 12px', background: noSaleReason === r ? '#EEF2FF' : '#F8F9FA', border: `1.5px solid ${noSaleReason === r ? '#1F5FD1' : 'rgba(0,0,0,0.09)'}`, fontSize: 13, fontWeight: noSaleReason === r ? 600 : 400, color: noSaleReason === r ? '#1F5FD1' : '#1A1D21', cursor: 'pointer', fontFamily: 'inherit' }}>{r}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setShowNoSale(false); setNoSaleReason(''); }} aria-label="Cancel" style={{ flex: 1, height: 44, borderRadius: 8, background: 'transparent', border: '1.5px solid rgba(0,0,0,0.12)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={() => { setShowNoSale(false); setNoSaleReason(''); }} disabled={!noSaleReason} aria-label="Open" style={{ flex: 1, height: 44, borderRadius: 8, background: noSaleReason ? '#1F5FD1' : '#C0C4CC', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: noSaleReason ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>Open Drawer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
