'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PRODUCTS, Product } from '@/lib/mock-data/products';
import { CATEGORIES } from '@/lib/mock-data/categories';
import { STAFF, StaffMember } from '@/lib/mock-data/staff';
import { PROMOTIONS } from '@/lib/mock-data/promotions';
import { MANAGER_ACCENT } from '@/lib/theme';

// ─── Catalog & Promotions ────────────────────────────────────────────────────
function CatalogSection() {
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', categoryId: '', vatRate: '0.20', weighed: false, ageRestricted: false });
  const [products, setProducts] = useState(PRODUCTS);
  const [saved, setSaved] = useState(false);
  const topCats = CATEGORIES.filter((c) => !c.parentId);

  function handleSave() {
    const p: Product = {
      id: `custom-${Date.now()}`,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      categoryId: newProduct.categoryId,
      vatRate: parseFloat(newProduct.vatRate),
      weighed: newProduct.weighed,
      ageRestricted: newProduct.ageRestricted,
    };
    setProducts((prev) => [p, ...prev]);
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>🏪 Catalog & Promotions</div>
          <div style={{ fontSize: '13px', color: '#7A8099', marginTop: '4px' }}>{products.length} products · {PROMOTIONS.length} promotion rules</div>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setSaved(false); }}
          aria-label="Add new product"
          style={{
            height: '44px', padding: '0 20px', borderRadius: '10px',
            background: MANAGER_ACCENT, border: 'none',
            color: 'white', fontSize: '14px', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >+ Add Product</button>
      </div>

      {saved && (
        <div style={{ background: 'rgba(16,124,16,0.1)', border: '1px solid rgba(16,124,16,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#107C10', fontWeight: 600, fontSize: '14px' }}>
          ✅ Product created and added to catalogue
        </div>
      )}

      {/* Item & Menu setup — VISIBLY ONE COMBINED FORM per spec */}
      {showForm && (
        <div style={{
          background: '#F0EEFF', border: `2px solid ${MANAGER_ACCENT}44`, borderRadius: '14px',
          padding: '20px', marginBottom: '20px',
        }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: MANAGER_ACCENT, marginBottom: '4px' }}>
            ✚ New Product — Single Step Setup
          </div>
          <div style={{ fontSize: '12px', color: '#7A8099', marginBottom: '16px' }}>
            Name, price, department, VAT rate, and menu placement are all set here in one step.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#5A6072', display: 'block', marginBottom: '6px' }}>Product Name *</label>
              <input value={newProduct.name} onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Heinz Baked Beans 415g" aria-label="Product name" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1.5px solid rgba(107,79,204,0.3)', padding: '0 12px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#5A6072', display: 'block', marginBottom: '6px' }}>Price (£) *</label>
              <input type="number" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))} placeholder="0.00" aria-label="Product price" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1.5px solid rgba(107,79,204,0.3)', padding: '0 12px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#5A6072', display: 'block', marginBottom: '6px' }}>Department / Category *</label>
              <select value={newProduct.categoryId} onChange={(e) => setNewProduct((p) => ({ ...p, categoryId: e.target.value }))} aria-label="Department" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1.5px solid rgba(107,79,204,0.3)', padding: '0 12px', fontSize: '14px', fontFamily: 'inherit', background: 'white', boxSizing: 'border-box' }}>
                <option value="">Select department…</option>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.parentId ? `  ↳ ${c.name}` : c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#5A6072', display: 'block', marginBottom: '6px' }}>VAT Rate</label>
              <select value={newProduct.vatRate} onChange={(e) => setNewProduct((p) => ({ ...p, vatRate: e.target.value }))} aria-label="VAT rate" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1.5px solid rgba(107,79,204,0.3)', padding: '0 12px', fontSize: '14px', fontFamily: 'inherit', background: 'white', boxSizing: 'border-box' }}>
                <option value="0.20">20% Standard</option>
                <option value="0.05">5% Reduced</option>
                <option value="0">0% Zero-rated</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#5A6072', display: 'block', marginBottom: '8px' }}>Quick-Key Menu Placement</label>
              <div style={{ background: 'white', borderRadius: '8px', border: '1.5px solid rgba(107,79,204,0.3)', padding: '10px 12px', fontSize: '13px', color: '#7A8099' }}>
                Automatically placed in selected department's quick-key grid
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#5A6072', display: 'block', marginBottom: '8px' }}>Product Flags</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[{ key: 'weighed', label: '⚖️ Weighed item' }, { key: 'ageRestricted', label: '🔞 Age restricted' }].map(({ key, label }) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                    <input
                      type="checkbox"
                      checked={newProduct[key as 'weighed' | 'ageRestricted']}
                      onChange={(e) => setNewProduct((p) => ({ ...p, [key]: e.target.checked }))}
                      aria-label={label}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button onClick={() => setShowForm(false)} aria-label="Cancel" style={{ flex: 1, height: '48px', borderRadius: '10px', background: 'transparent', border: '1.5px solid rgba(0,0,0,0.12)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px' }}>Cancel</button>
            <button
              onClick={handleSave}
              disabled={!newProduct.name || !newProduct.price || !newProduct.categoryId}
              aria-label="Save product"
              style={{
                flex: 2, height: '48px', borderRadius: '10px',
                background: (!newProduct.name || !newProduct.price || !newProduct.categoryId) ? '#C0C4CC' : MANAGER_ACCENT,
                border: 'none', color: 'white', fontSize: '15px', fontWeight: 700,
                cursor: (!newProduct.name || !newProduct.price || !newProduct.categoryId) ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
              }}
            >Save Product</button>
          </div>
        </div>
      )}

      {/* Promotions */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>🏷️ Mix & Match Rules</div>
        {PROMOTIONS.map((p) => (
          <div key={p.id} style={{ background: 'white', borderRadius: '10px', padding: '12px 16px', border: '1px solid rgba(0,0,0,0.08)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{p.description}</div>
              <div style={{ fontSize: '11px', color: '#8A90A0', marginTop: '2px' }}>
                {p.productIds.length} product{p.productIds.length !== 1 ? 's' : ''} · Qty {p.qualifyingQty}
                {p.forPrice ? ` for £${p.forPrice}` : ''}
                {p.discountPercent ? ` → ${p.discountPercent}% off` : ''}
              </div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', background: 'rgba(16,124,16,0.1)', color: '#107C10' }}>Active</span>
          </div>
        ))}
      </div>

      {/* Product list (truncated) */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', background: '#F8F9FA', borderBottom: '1px solid rgba(0,0,0,0.06)', fontSize: '13px', fontWeight: 700 }}>Products ({products.length})</div>
        {products.slice(0, 10).map((p) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid rgba(0,0,0,0.04)', gap: '12px', fontSize: '13px' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 600 }}>{p.name}</span>
              {p.weighed && <span style={{ marginLeft: '8px', fontSize: '11px', color: '#5A6072' }}>⚖️ Weighed</span>}
              {p.ageRestricted && <span style={{ marginLeft: '8px', fontSize: '11px', color: '#C4314B' }}>🔞 Age restricted</span>}
            </div>
            <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>£{p.price.toFixed(2)}</span>
            <span style={{ fontSize: '11px', color: '#8A90A0' }}>{p.vatRate * 100}% VAT</span>
          </div>
        ))}
        {products.length > 10 && (
          <div style={{ padding: '10px 16px', fontSize: '12px', color: '#8A90A0', textAlign: 'center' }}>
            + {products.length - 10} more products
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Payment Methods ─────────────────────────────────────────────────────────
function PaymentMethodsSection() {
  const [methods, setMethods] = useState([
    { id: 'cash', label: 'Cash', icon: '💵', enabled: true, order: 1 },
    { id: 'card', label: 'Card', icon: '💳', enabled: true, order: 2 },
    { id: 'mixed', label: 'Mixed', icon: '🔀', enabled: true, order: 3 },
    { id: 'loyalty', label: 'Loyalty Points', icon: '⭐', enabled: true, order: 4 },
  ]);

  return (
    <div>
      <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>💳 Payment Methods</div>
      <div style={{ fontSize: '13px', color: '#7A8099', marginBottom: '20px' }}>Configure which tender types appear and in what order on the payment screen</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {methods.sort((a, b) => a.order - b.order).map((m) => (
          <div key={m.id} style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '22px', cursor: 'grab' }}>⠿</span>
            <span style={{ fontSize: '22px' }}>{m.icon}</span>
            <div style={{ flex: 1, fontSize: '15px', fontWeight: 600 }}>{m.label}</div>
            <span style={{ fontSize: '12px', color: '#8A90A0', marginRight: '8px' }}>Order #{m.order}</span>
            <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
              <input type="checkbox" checked={m.enabled} onChange={() => setMethods((prev) => prev.map((x) => x.id === m.id ? { ...x, enabled: !x.enabled } : x))} aria-label={`Toggle ${m.label}`} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', inset: 0, background: m.enabled ? '#1F5FD1' : '#C0C4CC', borderRadius: '99px', transition: 'all 200ms' }} />
              <span style={{ position: 'absolute', top: '3px', left: m.enabled ? '23px' : '3px', width: '18px', height: '18px', background: 'white', borderRadius: '50%', transition: 'all 200ms' }} />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── People & Access ─────────────────────────────────────────────────────────
function PeopleAccessSection() {
  const [staff, setStaff] = useState(STAFF);
  const roleColour: Record<string, { bg: string; text: string }> = {
    Administrator: { bg: 'rgba(196,49,75,0.1)', text: '#C4314B' },
    Manager: { bg: `rgba(107,79,204,0.1)`, text: MANAGER_ACCENT },
    Supervisor: { bg: 'rgba(240,163,10,0.1)', text: '#B8800A' },
    'Till Staff': { bg: 'rgba(31,95,209,0.1)', text: '#1F5FD1' },
  };

  return (
    <div>
      <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>👥 People & Access</div>
      <div style={{ fontSize: '13px', color: '#7A8099', marginBottom: '20px' }}>Staff accounts, roles, discount limits, and sign-on display</div>
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 80px 80px 80px', padding: '10px 16px', background: '#F8F9FA', borderBottom: '1px solid rgba(0,0,0,0.06)', fontSize: '11px', fontWeight: 700, color: '#7A8099', letterSpacing: '0.06em', textTransform: 'uppercase', gap: '12px' }}>
          <span>Staff Member</span>
          <span>Role</span>
          <span>Disc Limit</span>
          <span>On Sign-On</span>
          <span></span>
        </div>
        {staff.map((member) => {
          const { bg, text } = roleColour[member.role] || { bg: '#F0F2F5', text: '#5A6072' };
          return (
            <div key={member.id} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 80px 80px 80px', padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.04)', gap: '12px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{member.name}</div>
                <div style={{ fontSize: '11px', color: '#8A90A0' }}>PIN: {'●'.repeat(member.pin.length)}</div>
              </div>
              <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', background: bg, color: text }}>
                {member.role}
              </span>
              <div style={{ fontSize: '14px', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{member.discountLimit}%</div>
              <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '22px', cursor: 'pointer' }}>
                <input type="checkbox" checked={member.showOnSignOn} onChange={() => setStaff((prev) => prev.map((s) => s.id === member.id ? { ...s, showOnSignOn: !s.showOnSignOn } : s))} aria-label={`Show ${member.name} on sign-on screen`} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', inset: 0, background: member.showOnSignOn ? '#1F5FD1' : '#C0C4CC', borderRadius: '99px', transition: 'all 200ms' }} />
                <span style={{ position: 'absolute', top: '2px', left: member.showOnSignOn ? '20px' : '2px', width: '18px', height: '18px', background: 'white', borderRadius: '50%', transition: 'all 200ms' }} />
              </label>
              <button aria-label={`Edit ${member.name}`} style={{ height: '32px', padding: '0 12px', borderRadius: '8px', background: '#F0F2F5', border: 'none', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', color: '#5A6072' }}>Edit</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Hardware ────────────────────────────────────────────────────────────────
function HardwareSection() {
  const devices = [
    { name: 'Receipt Printer', icon: '🖨️', status: 'Connected', model: 'Epson TM-T88VII' },
    { name: 'Cash Drawer', icon: '🗄️', status: 'Connected', model: 'APG Series 4000' },
    { name: 'Barcode Scanner', icon: '📷', status: 'Connected', model: 'Honeywell Voyager 1202' },
    { name: 'Weighing Scale', icon: '⚖️', status: 'Disconnected', model: 'Mettler Toledo ICS' },
    { name: 'Card Terminal', icon: '💳', status: 'Connected', model: 'Ingenico Move 5000' },
    { name: 'Customer Display', icon: '🖥️', status: 'Connected', model: 'Logic Controls LD9900' },
    { name: 'Label Printer', icon: '🏷️', status: 'Not configured', model: '—' },
  ];

  return (
    <div>
      <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>🖥️ Hardware</div>
      <div style={{ fontSize: '13px', color: '#7A8099', marginBottom: '20px' }}>Device connection status and diagnostics</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {devices.map((d) => (
          <div key={d.name} style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '24px' }}>{d.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{d.name}</div>
              <div style={{ fontSize: '12px', color: '#8A90A0' }}>{d.model}</div>
            </div>
            <span style={{
              fontSize: '12px', fontWeight: 700, padding: '3px 12px', borderRadius: '99px',
              background: d.status === 'Connected' ? 'rgba(16,124,16,0.1)' : d.status === 'Disconnected' ? 'rgba(196,49,75,0.1)' : '#F0F2F5',
              color: d.status === 'Connected' ? '#107C10' : d.status === 'Disconnected' ? '#C4314B' : '#7A8099',
            }}>{d.status}</span>
            <button aria-label={`Test ${d.name}`} style={{ height: '36px', padding: '0 14px', borderRadius: '8px', background: '#F0F2F5', border: 'none', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>Test</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Connectivity ─────────────────────────────────────────────────────────────
function ConnectivitySection() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());

  function triggerSync() {
    setSyncing(true);
    setTimeout(() => { setSyncing(false); setLastSync(new Date()); }, 2000);
  }

  return (
    <div>
      <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>📡 Connectivity</div>
      <div style={{ fontSize: '13px', color: '#7A8099', marginBottom: '20px' }}>Sync status, manual sync trigger, and licence information</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ background: 'rgba(16,124,16,0.06)', borderRadius: '12px', padding: '16px 20px', border: '1px solid rgba(16,124,16,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#107C10' }}>● Online — Synced</div>
            <div style={{ fontSize: '12px', color: '#5A6072', marginTop: '4px' }}>Last sync: {lastSync.toLocaleTimeString('en-GB')}</div>
          </div>
          <button
            onClick={triggerSync}
            disabled={syncing}
            aria-label="Manual sync trigger"
            style={{
              height: '44px', padding: '0 20px', borderRadius: '10px',
              background: syncing ? '#C0C4CC' : '#1F5FD1',
              border: 'none', color: 'white', fontSize: '14px', fontWeight: 600,
              cursor: syncing ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            }}
          >
            {syncing ? '⏳ Syncing…' : '↻ Sync Now'}
          </button>
        </div>

        {/* Licence status — read-only per spec */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', border: '1px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔑 Licence Status
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#8A90A0', background: '#F0F2F5', padding: '2px 8px', borderRadius: '99px' }}>Read-only</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8A90A0', marginBottom: '12px' }}>
            Licence is managed from TILLMAX Admin Portal — this screen is read-only.
          </div>
          {[
            { label: 'Licence Key', value: 'TM-PRO-2026-XXXX-XXXX' },
            { label: 'Status', value: '✅ Active' },
            { label: 'Expires', value: '31 Dec 2026' },
            { label: 'Till Slots', value: '3 / 5 in use' },
          ].map((row) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '13px' }}>
              <span style={{ color: '#5A6072' }}>{row.label}</span>
              <span style={{ fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Store Identity ───────────────────────────────────────────────────────────
function StoreIdentitySection() {
  const [form, setForm] = useState({
    storeName: 'The Corner Shop',
    tillId: 'Till 01',
    storeId: 'Store #001',
    address: '14 High Street, London, EC2A 1AA',
    phone: '020 7946 0000',
    receiptHeader: 'Welcome to The Corner Shop',
    receiptFooter: 'Thank you for your custom. Please retain your receipt.',
    vatNumber: 'GB 123 4567 89',
    vatRate20: true,
    vatRate5: false,
  });
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>🏬 Store Identity</div>
      <div style={{ fontSize: '13px', color: '#7A8099', marginBottom: '20px' }}>VAT/tax rates, store identity, receipt header/footer</div>

      {saved && (
        <div style={{ background: 'rgba(16,124,16,0.1)', border: '1px solid rgba(16,124,16,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#107C10', fontWeight: 600, fontSize: '14px' }}>
          ✅ Store settings saved
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {[
          { key: 'storeName', label: 'Store Name' },
          { key: 'tillId', label: 'Till ID' },
          { key: 'storeId', label: 'Store ID' },
          { key: 'vatNumber', label: 'VAT Registration Number' },
          { key: 'phone', label: 'Phone Number' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#5A6072', display: 'block', marginBottom: '6px' }}>{label}</label>
            <input
              value={form[key as keyof typeof form] as string}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              aria-label={label}
              style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1.5px solid rgba(0,0,0,0.12)', padding: '0 12px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
        ))}
        <div style={{ gridColumn: '1/-1' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#5A6072', display: 'block', marginBottom: '6px' }}>Address</label>
          <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} aria-label="Store address" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1.5px solid rgba(0,0,0,0.12)', padding: '0 12px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#5A6072', display: 'block', marginBottom: '6px' }}>Receipt Header</label>
          <input value={form.receiptHeader} onChange={(e) => setForm((f) => ({ ...f, receiptHeader: e.target.value }))} aria-label="Receipt header" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1.5px solid rgba(0,0,0,0.12)', padding: '0 12px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#5A6072', display: 'block', marginBottom: '6px' }}>Receipt Footer</label>
          <textarea value={form.receiptFooter} onChange={(e) => setForm((f) => ({ ...f, receiptFooter: e.target.value }))} aria-label="Receipt footer" rows={2} style={{ width: '100%', borderRadius: '8px', border: '1.5px solid rgba(0,0,0,0.12)', padding: '10px 12px', fontSize: '14px', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }} />
        </div>
      </div>

      <button
        onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
        aria-label="Save store settings"
        style={{ height: '52px', padding: '0 32px', borderRadius: '12px', background: MANAGER_ACCENT, border: 'none', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
      >
        Save Settings
      </button>
    </div>
  );
}

// ─── Main Config Page ─────────────────────────────────────────────────────────
const CONFIG_SECTIONS = [
  { id: 'catalog', label: 'Catalog & Promotions', icon: '🏪' },
  { id: 'payments', label: 'Payment Methods', icon: '💳' },
  { id: 'people', label: 'People & Access', icon: '👥' },
  { id: 'hardware', label: 'Hardware', icon: '🖥️' },
  { id: 'connectivity', label: 'Connectivity', icon: '📡' },
  { id: 'identity', label: 'Store Identity', icon: '🏬' },
];

export default function ConfigPage() {
  const router = useRouter();
  const [active, setActive] = useState('catalog');

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#F3F4F6' }}>
      {/* Left nav — 6 sections */}
      <div style={{ width: '240px', background: 'white', borderRight: '1px solid rgba(0,0,0,0.08)', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#8A90A0', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px' }}>Store Configuration</div>
        {CONFIG_SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            aria-label={s.label}
            style={{
              height: '52px', borderRadius: '10px', textAlign: 'left', padding: '0 14px',
              background: active === s.id ? `${MANAGER_ACCENT}15` : 'transparent',
              border: `1.5px solid ${active === s.id ? MANAGER_ACCENT : 'transparent'}`,
              display: 'flex', alignItems: 'center', gap: '10px',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms',
            }}
          >
            <span style={{ fontSize: '18px' }}>{s.icon}</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: active === s.id ? MANAGER_ACCENT : '#1A1D21' }}>{s.label}</span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => router.push('/manager/dashboard')} aria-label="Back to manager dashboard" style={{ height: '44px', borderRadius: '10px', background: 'transparent', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', color: '#5A6072' }}>← Dashboard</button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {active === 'catalog' && <CatalogSection />}
        {active === 'payments' && <PaymentMethodsSection />}
        {active === 'people' && <PeopleAccessSection />}
        {active === 'hardware' && <HardwareSection />}
        {active === 'connectivity' && <ConnectivitySection />}
        {active === 'identity' && <StoreIdentitySection />}
      </div>
    </div>
  );
}
