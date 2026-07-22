'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MANAGER_ACCENT } from '@/lib/theme';

const NAV_ITEMS = [
  { label: 'Shift & Cash', icon: '💰', href: '/manager/shift', desc: 'Float, pay-in/out, cash drop' },
  { label: 'Reports', icon: '📊', href: '/manager/reports', desc: 'X Report, End of Day, Till Journal' },
  { label: 'Store Configuration', icon: '⚙️', href: '/manager/config', desc: 'Catalog, payments, staff, hardware' },
  { label: 'Transaction History', icon: '📋', href: '/cashier/history', desc: 'Full till journal & audit log' },
];

export default function ManagerDashboardPage() {
  const router = useRouter();

  return (
    <div style={{
      flex: 1, padding: '32px', background: 'linear-gradient(135deg, #F8F7FF 0%, #F3F4F6 100%)',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '24px', fontWeight: 800, color: '#1A1D21', marginBottom: '6px' }}>
          Manager Workspace
        </div>
        <div style={{ fontSize: '14px', color: '#7A8099' }}>
          {new Date().toLocaleString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Quick stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Today\'s Sales', value: '£1,842.50', icon: '💷', colour: '#107C10' },
          { label: 'Transactions', value: '127', icon: '🧾', colour: '#1F5FD1' },
          { label: 'Average Basket', value: '£14.51', icon: '🛒', colour: MANAGER_ACCENT },
          { label: 'Cash in Drawer', value: '£342.00', icon: '🗄️', colour: '#B8800A' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: 'white', borderRadius: '14px', padding: '18px 20px',
            border: '1px solid rgba(0,0,0,0.07)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#7A8099', fontWeight: 600 }}>{stat.label}</div>
              <span style={{ fontSize: '20px' }}>{stat.icon}</span>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: stat.colour, fontVariantNumeric: 'tabular-nums' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            aria-label={item.label}
            style={{
              padding: '24px', borderRadius: '16px', background: 'white',
              border: `1.5px solid rgba(107,79,204,0.12)`,
              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
              transition: 'all 150ms',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = MANAGER_ACCENT;
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(107,79,204,0.04)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(107,79,204,0.15)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(107,79,204,0.12)';
              (e.currentTarget as HTMLButtonElement).style.background = 'white';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>{item.icon}</div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#1A1D21', marginBottom: '6px' }}>{item.label}</div>
            <div style={{ fontSize: '13px', color: '#7A8099' }}>{item.desc}</div>
          </button>
        ))}
      </div>

      {/* Back to cashier */}
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button
          onClick={() => router.push('/cashier/sale')}
          aria-label="Exit manager mode"
          style={{
            height: '48px', padding: '0 32px', borderRadius: '10px',
            background: 'transparent', border: '1.5px solid rgba(0,0,0,0.12)',
            fontSize: '14px', color: '#5A6072', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >← Return to Cashier Screen</button>
      </div>
    </div>
  );
}
