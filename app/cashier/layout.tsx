'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { StatusBar } from '@/components/shared/StatusBar';

export default function CashierLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <StatusBar isManagerMode={false} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Side navigation */}
        <nav style={{
          width: '64px', flexShrink: 0, background: '#1A1D21',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '8px 0', gap: '4px', borderRight: '1px solid rgba(255,255,255,0.06)',
        }}>
          {[
            { href: '/cashier/sale', icon: '🛒', label: 'Sale' },
            { href: '/cashier/history', icon: '📋', label: 'History' },
          ].map(({ href, icon, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href} aria-label={label} style={{ textDecoration: 'none' }}>
                <div style={{
                  width: '48px', height: '52px', borderRadius: '10px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: '2px',
                  background: active ? 'rgba(31,95,209,0.25)' : 'transparent',
                  border: active ? '1px solid rgba(31,95,209,0.4)' : '1px solid transparent',
                  cursor: 'pointer', transition: 'all 150ms',
                }}>
                  <span style={{ fontSize: '20px' }}>{icon}</span>
                  <span style={{ fontSize: '9px', color: active ? '#7AAAF8' : 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.03em' }}>{label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
