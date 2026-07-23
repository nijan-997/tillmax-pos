'use client';

import React from 'react';

/**
 * Cashier shell — just a full-height flex column.
 * StatusBar is rendered inline in each cashier screen
 * so it can adapt its controls per page.
 * Height is 100% of the parent 1024×768 POS frame — NOT 100vh.
 */
export default function CashierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {children}
    </div>
  );
}
