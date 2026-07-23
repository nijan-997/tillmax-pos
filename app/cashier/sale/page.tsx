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
import { ActionButton } from '@/components/shared/ActionButton';
import { NumericKeypadOverlay } from '@/components/shared/NumericKeypadOverlay';
import { ManagerElevationModal, ApprovalType } from '@/components/shared/ManagerElevationModal';
import { EmptyState } from '@/components/shared/EmptyState';
import { SyncStatusPill } from '@/components/shared/SyncStatusPill';

// ─── Browser nav type ─────────────────────────────────────────────────────────
type BrowserLevel =
  | { view: 'categories' }
  | { view: 'products'; category: Category; subcatId: string };

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
function Breadcrumb({ level, onGoCategories }: { level: BrowserLevel; onGoCategories: () => void }) {
  if (level.view === 'categories') return null;
  const cat = level.category;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '4px',
      padding: '8px 12px',
      background: `${cat.colour}0E`,
      borderBottom: '1px solid rgba(0,0,0,0.07)',
      flexShrink: 0,
    }}>
      <button
        onClick={onGoCategories}
        aria-label="All departments"
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#8A90A0', padding: '2px 6px', borderRadius: '6px', fontFamily: 'inherit' }}
      >⊞ Departments</button>
      <span style={{ color: '#C0C4CC', fontSize: '14px' }}>›</span>
      <span style={{ fontSize: '12px', fontWeight: 700, color: cat.colour, padding: '2px 6px', background: `${cat.colour}16`, borderRadius: '6px' }}>
        {cat.icon} {cat.name}
      </span>
    </div>
  );
}

// ─── Category Grid ────────────────────────────────────────────────────────────
function CategoryGrid({ onSelect }: { onSelect: (cat: Category) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '12px', overflowY: 'auto', flex: 1 }}>
      {getTopLevelCategories().map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat)}
          aria-label={`Browse ${cat.name}`}
          style={{
            minHeight: '90px', borderRadius: '14px',
            background: `linear-gradient(135deg, ${cat.colour}14 0%, ${cat.colour}28 100%)`,
            border: `2px solid ${cat.colour}38`,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '8px', padding: '12px 8px', transition: 'all 150ms',
          }}
          onMouseEnter={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background = `${cat.colour}28`;
            b.style.borderColor = `${cat.colour}70`;
            b.style.transform = 'scale(1.03)';
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background = `linear-gradient(135deg, ${cat.colour}14 0%, ${cat.colour}28 100%)`;
            b.style.borderColor = `${cat.colour}38`;
            b.style.transform = 'scale(1)';
          }}
        >
          <span style={{ fontSize: '30px', lineHeight: 1 }}>{cat.icon}</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: cat.colour, textAlign: 'center', lineHeight: 1.2 }}>{cat.name}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Product Tile ─────────────────────────────────────────────────────────────
function ProductTile({ product, accent, onSelect }: { product: Product; accent: string; onSelect: () => void }) {
  const hasVariants = !!product.variants?.length;
  return (
    <button
      onClick={onSelect}
      aria-label={hasVariants ? `Pick a variety of ${product.name}` : `Add ${product.name}`}
      style={{
        padding: '12px 10px', borderRadius: '12px', background: 'white',
        border: '1.5px solid rgba(0,0,0,0.08)', cursor: 'pointer', fontFamily: 'inherit',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        minHeight: '80px', transition: 'all 120ms', textAlign: 'left',
      }}
      onMouseEnter={(e) => {
        const b = e.currentTarget as HTMLButtonElement;
        b.style.borderColor = accent; b.style.background = `${accent}0A`; b.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        const b = e.currentTarget as HTMLButtonElement;
        b.style.borderColor = 'rgba(0,0,0,0.08)'; b.style.background = 'white'; b.style.transform = 'scale(1)';
      }}
    >
      <div style={{ display: 'flex', gap: '3px', marginBottom: '6px', flexWrap: 'wrap' }}>
        {product.weighed && <span style={{ fontSize: '10px', background: '#E3F2FD', color: '#1565C0', padding: '1px 5px', borderRadius: '99px', fontWeight: 600 }}>⚖️ Weighed</span>}
        {product.ageRestricted && <span style={{ fontSize: '10px', background: '#FFEBEE', color: '#C4314B', padding: '1px 5px', borderRadius: '99px', fontWeight: 600 }}>🔞 Age</span>}
        {hasVariants && <span style={{ fontSize: '10px', background: `${accent}18`, color: accent, padding: '1px 5px', borderRadius: '99px', fontWeight: 600 }}>{product.variants!.length} types</span>}
      </div>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A1D21', lineHeight: 1.3, flex: 1 }}>{product.name}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '8px' }}>
        <span style={{ fontSize: '16px', fontWeight: 800, color: accent, fontVariantNumeric: 'tabular-nums' }}>
          {hasVariants ? 'from ' : ''}£{product.price.toFixed(2)}
        </span>
        <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: hasVariants ? `${accent}20` : accent, color: hasVariants ? accent : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>
          {hasVariants ? '›' : '+'}
        </span>
      </div>
    </button>
  );
}

// ─── Variant Slide-Up Panel (renders inside browser panel) ────────────────────
function VariantSlidePanel({
  product,
  accent,
  open,
  onClose,
  onSelect,
  onSelectDefault,
}: {
  product: Product | null;
  accent: string;
  open: boolean;
  onClose: () => void;
  onSelect: (v: ProductVariant) => void;
  onSelectDefault: () => void;
}) {
  // Always rendered so the closing animation works (slides out)
  const variants = product?.variants ?? [];

  return (
    <>
      {/* Dim backdrop inside the panel — fades in/out */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.35)',
          opacity: open ? 1 : 0,
          transition: 'opacity 280ms ease',
          pointerEvents: open ? 'auto' : 'none',
          zIndex: 10,
        }}
      />

      {/* The slide panel itself */}
      <div
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          background: 'white',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.22)',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)',
          zIndex: 20,
          maxHeight: '72%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Handle grip */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '99px', background: 'rgba(0,0,0,0.15)' }} />
        </div>

        {/* Header */}
        <div style={{
          padding: '4px 16px 12px',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#1A1D21', lineHeight: 1.2 }}>
              {product?.name}
            </div>
            <div style={{ fontSize: '12px', color: '#8A90A0', marginTop: '3px' }}>
              Select a variety to add to basket
              {product?.ageRestricted && <span style={{ marginLeft: '8px', color: '#C4314B', fontWeight: 700 }}>🔞 Age restricted</span>}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#F0F2F5', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', color: '#5A6072', flexShrink: 0, marginLeft: '12px',
            }}
          >✕</button>
        </div>

        {/* Variant list */}
        <div style={{ overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {variants.map((v, idx) => (
            <button
              key={v.id}
              onClick={() => { onSelect(v); }}
              aria-label={`Add ${v.name}`}
              style={{
                padding: '13px 14px', borderRadius: '12px', background: '#F8F9FA',
                border: `1.5px solid rgba(0,0,0,0.08)`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                transition: 'all 120ms',
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = `${accent}0C`; b.style.borderColor = accent;
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = '#F8F9FA'; b.style.borderColor = 'rgba(0,0,0,0.08)';
              }}
            >
              {/* Number bubble */}
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0, marginRight: '12px',
                background: `${accent}18`, border: `1.5px solid ${accent}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, color: accent,
              }}>{idx + 1}</div>

              {/* Name + note */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A1D21' }}>{v.name}</div>
                {v.note && <div style={{ fontSize: '11px', color: '#8A90A0', marginTop: '1px' }}>{v.note}</div>}
              </div>

              {/* Price + add */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: accent, fontVariantNumeric: 'tabular-nums' }}>
                  £{(v.price ?? product?.price ?? 0).toFixed(2)}
                </span>
                <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: accent, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700 }}>+</span>
              </div>
            </button>
          ))}

          {/* Default / generic price option */}
          <button
            onClick={onSelectDefault}
            aria-label="Add without selecting variety"
            style={{
              padding: '11px 14px', borderRadius: '12px', background: 'transparent',
              border: '1.5px dashed rgba(0,0,0,0.14)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', fontFamily: 'inherit', color: '#8A90A0', marginTop: '2px',
            }}
          >
            <span style={{ fontSize: '13px' }}>Add without selecting variety</span>
            <span style={{ fontSize: '14px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              £{(product?.price ?? 0).toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Product Grid ─────────────────────────────────────────────────────────────
function ProductGrid({
  level,
  onSubcatChange,
  onProductSelect,
}: {
  level: { view: 'products'; category: Category; subcatId: string };
  onSubcatChange: (id: string) => void;
  onProductSelect: (p: Product) => void;
}) {
  const { category, subcatId } = level;
  const subcats = getSubcategories(category.id);
  const products = getProductsByCategory(subcatId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {subcats.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', padding: '8px 12px', overflowX: 'auto', flexShrink: 0, borderBottom: '1px solid rgba(0,0,0,0.06)', scrollbarWidth: 'none' }}>
          {subcats.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onSubcatChange(sub.id)}
              aria-label={sub.name}
              style={{
                height: '34px', padding: '0 14px', borderRadius: '99px', whiteSpace: 'nowrap',
                background: subcatId === sub.id ? category.colour : 'white',
                border: `1.5px solid ${subcatId === sub.id ? category.colour : 'rgba(0,0,0,0.1)'}`,
                color: subcatId === sub.id ? 'white' : '#5A6072',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 150ms', flexShrink: 0,
              }}
            >{sub.icon} {sub.name}</button>
          ))}
        </div>
      )}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', alignContent: 'start' }}>
        {products.length === 0 ? (
          <div style={{ gridColumn: '1/-1', paddingTop: '32px' }}>
            <EmptyState icon="📦" title="No products here" />
          </div>
        ) : products.map((p) => (
          <ProductTile key={p.id} product={p} accent={category.colour ?? '#1F5FD1'} onSelect={() => onProductSelect(p)} />
        ))}
      </div>
    </div>
  );
}

// ─── Basket Line ──────────────────────────────────────────────────────────────
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
    ? rawTotal - (line.lineDiscount.type === 'percent' ? rawTotal * (line.lineDiscount.value / 100) : line.lineDiscount.value)
    : rawTotal;
  const needsAge = line.ageVerified === false;

  return (
    <div style={{
      background: line.isPromotionLine ? 'rgba(16,124,16,0.05)' : needsAge ? 'rgba(240,163,10,0.06)' : 'white',
      border: `1px solid ${line.isPromotionLine ? 'rgba(16,124,16,0.18)' : needsAge ? 'rgba(240,163,10,0.4)' : 'rgba(0,0,0,0.07)'}`,
      borderRadius: '10px', padding: '8px 10px', marginBottom: '5px',
    }}>
      {needsAge && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(240,163,10,0.1)', borderRadius: '6px', padding: '6px 10px', marginBottom: '6px', border: '1px solid rgba(240,163,10,0.3)' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#B8800A' }}>🪪 Challenge 25 — Verify age</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={onVerifyAge} aria-label="Verified" style={{ height: '28px', padding: '0 10px', borderRadius: '6px', background: '#107C10', border: 'none', color: 'white', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>✓ Verified</button>
            <button onClick={onVoid} aria-label="Remove" style={{ height: '28px', padding: '0 10px', borderRadius: '6px', background: 'transparent', border: '1px solid rgba(196,49,75,0.4)', color: '#C4314B', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {line.isPromotionLine && <span style={{ fontSize: '13px' }}>🏷️</span>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: line.isPromotionLine ? 500 : 600, color: line.isPromotionLine ? '#107C10' : '#1A1D21', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{line.productName}</div>
          {line.lineDiscount && <div style={{ fontSize: '10px', color: '#5A6072' }}>{line.lineDiscount.type === 'percent' ? `${line.lineDiscount.value}% off` : `£${line.lineDiscount.value.toFixed(2)} off`}</div>}
        </div>
        {!line.isPromotionLine && (isWeighed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <button onClick={() => onWeightChange(Math.max(0.05, (line.weight ?? 0) - 0.05))} aria-label="-" style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#F0F2F5', border: '1px solid rgba(0,0,0,0.1)', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>−</button>
            <span style={{ fontSize: '12px', fontVariantNumeric: 'tabular-nums', minWidth: '48px', textAlign: 'center', fontWeight: 600 }}>{(line.weight ?? 0).toFixed(2)}kg</span>
            <button onClick={() => onWeightChange((line.weight ?? 0) + 0.05)} aria-label="+" style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#F0F2F5', border: '1px solid rgba(0,0,0,0.1)', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>+</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <button onClick={() => (line.qty ?? 1) > 1 ? onQtyChange((line.qty ?? 1) - 1) : onVoid()} aria-label="-" style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#F0F2F5', border: '1px solid rgba(0,0,0,0.1)', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>−</button>
            <span style={{ fontSize: '15px', fontVariantNumeric: 'tabular-nums', minWidth: '24px', textAlign: 'center', fontWeight: 700 }}>{line.qty ?? 1}</span>
            <button onClick={() => onQtyChange((line.qty ?? 1) + 1)} aria-label="+" style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#F0F2F5', border: '1px solid rgba(0,0,0,0.1)', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>+</button>
          </div>
        ))}
        <div style={{ fontSize: '15px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', minWidth: '56px', textAlign: 'right', color: line.isPromotionLine ? '#107C10' : '#1A1D21' }}>
          {line.isPromotionLine ? '−' : ''}£{Math.abs(finalTotal).toFixed(2)}
        </div>
        {!line.isPromotionLine && (
          <div style={{ position: 'relative' }}>
            <button onClick={() => setMenu(!menu)} aria-label="Options" style={{ width: '26px', height: '26px', borderRadius: '6px', background: menu ? '#E0E4EF' : 'transparent', border: 'none', fontSize: '14px', cursor: 'pointer', color: '#7A8099' }}>⋯</button>
            {menu && (
              <div style={{ position: 'absolute', right: 0, top: '30px', background: 'white', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 100, minWidth: '140px', overflow: 'hidden' }}>
                <button onClick={() => { onDiscount(); setMenu(false); }} style={{ display: 'block', width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>% Discount</button>
                <div style={{ height: '1px', background: 'rgba(0,0,0,0.07)' }} />
                <button onClick={() => { onVoid(); setMenu(false); }} style={{ display: 'block', width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: '13px', color: '#C4314B', cursor: 'pointer', fontFamily: 'inherit' }}>✕ Void Line</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN SALE PAGE ───────────────────────────────────────────────────────────
export default function SalePage() {
  const { state, dispatch, totals } = useBasket();
  const { session } = useSession();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  // Browser state
  const [level, setLevel] = useState<BrowserLevel>({ view: 'categories' });

  // Variant slide panel (lives inside browser panel)
  const [variantProduct, setVariantProduct] = useState<Product | null>(null);
  const [variantOpen, setVariantOpen] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '' });

  // Overlays
  const [keypadFor, setKeypadFor] = useState<{ lineId: string; mode: 'discount' | 'qty' | 'weight' } | null>(null);
  const [keypadValue, setKeypadValue] = useState('0');
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');
  const [elevationFor, setElevationFor] = useState<{ type: ApprovalType } | null>(null);
  const [showRecall, setShowRecall] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showNoSale, setShowNoSale] = useState(false);
  const [noSaleReason, setNoSaleReason] = useState('');

  function handleSearch(q: string) {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); setShowCreateItem(false); return; }
    const results = searchProducts(q);
    setSearchResults(results); setShowCreateItem(results.length === 0);
  }

  function handleBarcodeEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return;
    const p = getProductByBarcode(searchQuery.trim());
    if (p) { commitProduct(p); setSearchQuery(''); setSearchResults([]); }
  }

  function goToCategories() { setLevel({ view: 'categories' }); closeVariants(); }

  function goToProducts(cat: Category) {
    const subcats = getSubcategories(cat.id);
    const subcatId = subcats.length > 0 ? subcats[0].id : cat.id;
    setLevel({ view: 'products', category: cat, subcatId });
    closeVariants();
  }

  // Open/close variant slide panel
  function openVariants(product: Product) {
    setVariantProduct(product);
    // Tiny delay so React renders the panel with translateY(100%) first, then transitions
    setTimeout(() => setVariantOpen(true), 16);
  }
  function closeVariants() {
    setVariantOpen(false);
    setTimeout(() => setVariantProduct(null), 310); // wait for animation to finish
  }

  function handleProductSelect(product: Product) {
    if (product.variants && product.variants.length > 0) {
      openVariants(product);
    } else {
      commitProduct(product);
    }
  }

  function commitProduct(product: Product, variant?: ProductVariant) {
    const final = variant
      ? { ...product, id: variant.id, name: variant.name, price: variant.price ?? product.price, variants: undefined }
      : product;
    dispatch({ type: 'ADD_PRODUCT', product: final });
    // Auto-return to main category grid — saves cashier a back-navigation tap every time
    closeVariants();
    setLevel({ view: 'categories' });
    setSearchQuery(''); setSearchResults([]); setShowCreateItem(false);
  }

  function openDiscount(lineId: string) {
    setKeypadFor({ lineId, mode: 'discount' }); setKeypadValue('0'); setDiscountType('percent');
  }

  function handleKeypadConfirm(val: string) {
    if (!keypadFor) return;
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) { setKeypadFor(null); return; }
    if (keypadFor.mode === 'qty') dispatch({ type: 'SET_QTY', lineId: keypadFor.lineId, qty: Math.round(num) });
    else if (keypadFor.mode === 'weight') dispatch({ type: 'SET_WEIGHT', lineId: keypadFor.lineId, weight: num });
    else {
      const staff = session.staff;
      if (staff && discountType === 'percent' && num > (staff.discountLimit ?? 100)) {
        setElevationFor({ type: 'discount-limit' }); setKeypadFor(null); return;
      }
      dispatch({ type: 'SET_LINE_DISCOUNT', lineId: keypadFor.lineId, discount: { type: discountType, value: num } });
    }
    setKeypadFor(null);
  }

  const saleLines = state.lines.filter((l) => !l.isPromotionLine);
  const hasUnverifiedAge = state.lines.some((l) => l.ageVerified === false);
  const isSearching = searchQuery.length > 0;
  const accent = level.view !== 'categories' ? (level.category.colour ?? '#1F5FD1') : '#1F5FD1';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#F0F1F4' }}>

      {/* ══ TOP TOOLBAR ══════════════════════════════════════════════════════════ */}
      <div style={{
        height: '56px', flexShrink: 0, background: 'white',
        borderBottom: '1px solid rgba(0,0,0,0.09)',
        display: 'flex', alignItems: 'center', gap: '10px', padding: '0 14px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', pointerEvents: 'none' }}>
            {isSearching ? '🔍' : '📷'}
          </span>
          <input
            ref={searchRef} type="text"
            placeholder="Scan barcode or search product…"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleBarcodeEnter}
            aria-label="Barcode / search"
            style={{ width: '100%', height: '40px', borderRadius: '10px', border: '1.5px solid rgba(0,0,0,0.13)', padding: '0 36px 0 40px', fontSize: '14px', fontFamily: 'inherit', background: '#F8F9FA', outline: 'none', boxSizing: 'border-box', transition: 'border-color 150ms' }}
            onFocus={(e) => { e.target.style.borderColor = '#1F5FD1'; e.target.style.background = 'white'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.13)'; e.target.style.background = '#F8F9FA'; }}
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} aria-label="Clear" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', color: '#8A90A0' }}>✕</button>
          )}
        </div>

        <div style={{ width: '1px', height: '28px', background: 'rgba(0,0,0,0.09)' }} />
        <div style={{ fontSize: '13px', color: '#5A6072', whiteSpace: 'nowrap' }}>
          {saleLines.length > 0 ? <><strong style={{ color: '#1A1D21' }}>{saleLines.length}</strong> item{saleLines.length !== 1 ? 's' : ''}</> : <span style={{ color: '#B0B4C0' }}>Empty basket</span>}
        </div>
        {state.heldSales.length > 0 && (
          <button onClick={() => setShowRecall(true)} aria-label="Held sales" style={{ height: '36px', padding: '0 12px', borderRadius: '8px', background: 'rgba(31,95,209,0.08)', border: '1px solid rgba(31,95,209,0.22)', color: '#1F5FD1', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            📋 {state.heldSales.length} held
          </button>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SyncStatusPill />
          <button onClick={() => router.push('/manager/elevate')} aria-label="Manager" style={{ height: '36px', padding: '0 12px', borderRadius: '8px', background: 'rgba(107,79,204,0.08)', border: '1px solid rgba(107,79,204,0.22)', color: '#6B4FCC', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>🔐 Manager</button>
        </div>
      </div>

      {/* ══ MIDDLE — equal 50/50 split ════════════════════════════════════════ */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── LEFT: Browser (with variant slide-up living inside) ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          borderRight: '1px solid rgba(0,0,0,0.09)', background: '#F8F9FA',
          overflow: 'hidden',
          position: 'relative',   // ← required for absolute positioned variant panel
        }}>
          {isSearching ? (
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
              {searchResults.length > 0 && (
                <>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#8A90A0', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                  </div>
                  {searchResults.map((p) => (
                    <button key={p.id} onClick={() => handleProductSelect(p)} aria-label={`Add ${p.name}`}
                      style={{ width: '100%', marginBottom: '5px', padding: '10px 14px', borderRadius: '10px', background: 'white', border: '1.5px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 120ms' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EEF2FF'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; }}
                    >
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: '#8A90A0' }}>{p.weighed ? '⚖️ · ' : ''}{p.ageRestricted ? '🔞 · ' : ''}{p.variants ? `${p.variants.length} varieties · ` : ''}£{p.price.toFixed(2)}</div>
                      </div>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#1F5FD1', fontVariantNumeric: 'tabular-nums' }}>£{p.price.toFixed(2)}</span>
                    </button>
                  ))}
                </>
              )}
              {showCreateItem && (
                <div style={{ borderRadius: '14px', background: '#EEF2FF', border: '1.5px dashed #1F5FD1', padding: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1F5FD1', marginBottom: '12px' }}>+ Create item</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input placeholder="Product name" value={newItem.name || searchQuery} onChange={(e) => setNewItem((n) => ({ ...n, name: e.target.value }))} aria-label="Name" style={{ height: '40px', borderRadius: '8px', border: '1px solid rgba(31,95,209,0.3)', padding: '0 10px', fontSize: '14px', fontFamily: 'inherit' }} />
                    <input placeholder="Price £" type="number" step="0.01" value={newItem.price} onChange={(e) => setNewItem((n) => ({ ...n, price: e.target.value }))} aria-label="Price" style={{ height: '40px', borderRadius: '8px', border: '1px solid rgba(31,95,209,0.3)', padding: '0 10px', fontSize: '14px', fontFamily: 'inherit' }} />
                    <button onClick={() => {
                      const price = parseFloat(newItem.price); if (!price) return;
                      dispatch({ type: 'ADD_PRODUCT', product: { id: `custom-${Date.now()}`, name: newItem.name || searchQuery, price, categoryId: 'cat-1', vatRate: 0.20 } });
                      setNewItem({ name: '', price: '' }); setSearchQuery(''); setSearchResults([]); setShowCreateItem(false);
                    }} aria-label="Add to basket" style={{ height: '44px', borderRadius: '8px', background: '#1F5FD1', border: 'none', color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Add to Basket</button>
                  </div>
                </div>
              )}
              {!showCreateItem && searchResults.length === 0 && (
                <EmptyState icon="🔍" title={`Nothing found for "${searchQuery}"`} description="Try different words or scan the barcode" />
              )}
            </div>
          ) : (
            <>
              {level.view !== 'categories' && (
                <Breadcrumb level={level} onGoCategories={goToCategories} />
              )}
              {level.view === 'categories' && (
                <>
                  <div style={{ padding: '10px 12px 4px', flexShrink: 0 }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#8A90A0', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Departments</div>
                  </div>
                  <CategoryGrid onSelect={goToProducts} />
                </>
              )}
              {level.view === 'products' && (
                <ProductGrid
                  level={level}
                  onSubcatChange={(id) => setLevel({ ...level, subcatId: id })}
                  onProductSelect={handleProductSelect}
                />
              )}
            </>
          )}

          {/* ── Variant slide-up panel — absolutely positioned inside this panel ── */}
          <VariantSlidePanel
            product={variantProduct}
            accent={accent}
            open={variantOpen}
            onClose={closeVariants}
            onSelect={(v) => variantProduct && commitProduct(variantProduct, v)}
            onSelectDefault={() => variantProduct && commitProduct(variantProduct)}
          />
        </div>

        {/* ── RIGHT: Basket ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid rgba(0,0,0,0.06)', flexShrink: 0 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#8A90A0', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Current Sale</div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
            {state.lines.length === 0 ? (
              <EmptyState icon="🛒" title="Basket is empty" description="Browse a department or scan a barcode" />
            ) : state.lines.map((line) => (
              <BasketLine
                key={line.id} line={line}
                onVoid={() => dispatch({ type: 'REMOVE_LINE', lineId: line.id })}
                onDiscount={() => openDiscount(line.id)}
                onQtyChange={(qty) => dispatch({ type: 'SET_QTY', lineId: line.id, qty })}
                onWeightChange={(w) => dispatch({ type: 'SET_WEIGHT', lineId: line.id, weight: w })}
                onVerifyAge={() => dispatch({ type: 'VERIFY_AGE', lineId: line.id })}
              />
            ))}
          </div>
          {state.lines.length > 0 && (
            <div style={{ borderTop: '2px solid rgba(0,0,0,0.07)', padding: '10px 14px', background: '#FAFAFA', flexShrink: 0 }}>
              {totals.totalDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#107C10', fontWeight: 600, marginBottom: '4px' }}>
                  <span>💚 Savings</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>−£{totals.totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#7A8099' }}>Total</span>
                <span style={{ fontSize: '32px', fontWeight: 900, color: '#1A1D21', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                  £{totals.total.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ BOTTOM ACTION BAR ════════════════════════════════════════════════════
          Layout: [centered group of secondary buttons] [Pay — right-pinned]
      ═══════════════════════════════════════════════════════════════════════════ */}
      <div style={{
        flexShrink: 0, background: 'white',
        borderTop: '1px solid rgba(0,0,0,0.09)',
        padding: '10px 16px',
        display: 'flex', alignItems: 'center',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
        gap: '8px',
      }}>
        {/* ── Centred group (takes remaining space, aligns children to centre) ── */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          {/* Destructive — quiet */}
          <ActionButton tier="quiet" label="Void"
            disabled={saleLines.length === 0}
            onClick={() => { const last = [...saleLines].pop(); if (last) dispatch({ type: 'REMOVE_LINE', lineId: last.id }); }}
          />
          <ActionButton tier="quiet" label="Cancel"
            disabled={state.lines.length === 0}
            onClick={() => setShowCancelConfirm(true)}
          />

          <div style={{ width: '1px', height: '36px', background: 'rgba(0,0,0,0.09)', flexShrink: 0 }} />

          {/* Neutral */}
          <ActionButton tier="neutral" label="Hold"
            disabled={state.lines.length === 0}
            onClick={() => dispatch({ type: 'HOLD_SALE' })}
          />
          <ActionButton tier="neutral" label="Discount"
            disabled={saleLines.length === 0}
            onClick={() => { const last = [...saleLines].pop(); if (last) openDiscount(last.id); }}
          />
          <ActionButton tier="neutral" label="No Sale"
            onClick={() => setShowNoSale(true)}
          />
          <ActionButton tier="neutral" label="History"
            onClick={() => router.push('/cashier/history')}
          />
        </div>

        {/* ── Pay — always right-pinned, unmissable ── */}
        <ActionButton
          tier="primary"
          label={saleLines.length > 0 ? `Pay  £${totals.total.toFixed(2)}` : 'Pay'}
          size="large"
          disabled={saleLines.length === 0 || hasUnverifiedAge}
          onClick={() => router.push('/cashier/tender')}
          style={{ minWidth: '180px', flexShrink: 0 }}
        />
      </div>

      {/* ══ OVERLAYS ═════════════════════════════════════════════════════════════ */}

      {keypadFor && (
        <NumericKeypadOverlay
          title={keypadFor.mode === 'discount' ? 'Apply Discount' : keypadFor.mode === 'qty' ? 'Set Quantity' : 'Set Weight (kg)'}
          value={keypadValue} onChange={setKeypadValue}
          onConfirm={handleKeypadConfirm} onCancel={() => setKeypadFor(null)}
          isCurrency={keypadFor.mode === 'discount' && discountType === 'amount'}
          confirmLabel={keypadFor.mode === 'discount' ? 'Apply' : 'Set'}
          toggle={keypadFor.mode === 'discount' ? (
            <div style={{ display: 'flex', background: '#F0F2F5', borderRadius: '8px', padding: '3px', gap: '3px' }}>
              {(['percent', 'amount'] as const).map((t) => (
                <button key={t} onClick={() => setDiscountType(t)} aria-label={t} style={{ flex: 1, height: '36px', borderRadius: '6px', background: discountType === t ? 'white' : 'transparent', border: discountType === t ? '1px solid rgba(0,0,0,0.12)' : 'none', fontWeight: 700, fontSize: '18px', cursor: 'pointer', color: discountType === t ? '#1F5FD1' : '#7A8099', fontFamily: 'inherit', transition: 'all 150ms' }}>
                  {t === 'percent' ? '%' : '£'}
                </button>
              ))}
            </div>
          ) : undefined}
        />
      )}

      {elevationFor && (
        <ManagerElevationModal type={elevationFor.type} onApprove={() => setElevationFor(null)} onDeny={() => setElevationFor(null)} />
      )}

      {showRecall && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '380px', maxHeight: '480px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '18px 20px 12px', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>📋 Held Sales</div>
              <button onClick={() => setShowRecall(false)} aria-label="Close" style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#7A8099' }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', maxHeight: '360px', padding: '12px' }}>
              {state.heldSales.map((held) => (
                <button key={held.id} onClick={() => { dispatch({ type: 'RECALL_SALE', heldId: held.id }); setShowRecall(false); }} aria-label="Recall" style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', background: '#F8F9FA', border: '1.5px solid rgba(0,0,0,0.08)', cursor: 'pointer', textAlign: 'left', marginBottom: '8px', fontFamily: 'inherit' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>Held at {new Date(held.heldAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                  <div style={{ fontSize: '12px', color: '#7A8099', marginTop: '2px' }}>{held.lines.filter((l) => !l.isPromotionLine).length} items</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showCancelConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', width: '340px', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}>
            <div style={{ fontSize: '24px', marginBottom: '12px', textAlign: 'center' }}>⚠️</div>
            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Cancel Sale?</div>
            <div style={{ fontSize: '14px', color: '#5A6072', textAlign: 'center', marginBottom: '24px', lineHeight: 1.5 }}>This will remove all {saleLines.length} item{saleLines.length !== 1 ? 's' : ''} from the basket.</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowCancelConfirm(false)} aria-label="Keep" style={{ flex: 1, height: '52px', borderRadius: '10px', background: 'transparent', border: '1.5px solid rgba(0,0,0,0.15)', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Keep Sale</button>
              <button onClick={() => { dispatch({ type: 'CANCEL_SALE' }); setShowCancelConfirm(false); }} aria-label="Cancel" style={{ flex: 1, height: '52px', borderRadius: '10px', background: '#C4314B', border: 'none', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel Sale</button>
            </div>
          </div>
        </div>
      )}

      {showNoSale && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', width: '320px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>🗄️ Open Cash Drawer</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
              {['Get Change', 'Check Drawer', 'Manager Request', 'Other'].map((r) => (
                <button key={r} onClick={() => setNoSaleReason(r)} aria-label={r} style={{ height: '44px', borderRadius: '8px', textAlign: 'left', padding: '0 14px', background: noSaleReason === r ? '#EEF2FF' : '#F8F9FA', border: `1.5px solid ${noSaleReason === r ? '#1F5FD1' : 'rgba(0,0,0,0.1)'}`, fontSize: '14px', fontWeight: noSaleReason === r ? 600 : 400, color: noSaleReason === r ? '#1F5FD1' : '#1A1D21', cursor: 'pointer', fontFamily: 'inherit' }}>{r}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setShowNoSale(false); setNoSaleReason(''); }} aria-label="Cancel" style={{ flex: 1, height: '48px', borderRadius: '10px', background: 'transparent', border: '1.5px solid rgba(0,0,0,0.12)', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={() => { setShowNoSale(false); setNoSaleReason(''); }} disabled={!noSaleReason} aria-label="Open drawer" style={{ flex: 1, height: '48px', borderRadius: '10px', background: noSaleReason ? '#1F5FD1' : '#C0C4CC', border: 'none', color: 'white', fontSize: '14px', fontWeight: 700, cursor: noSaleReason ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>Open Drawer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
