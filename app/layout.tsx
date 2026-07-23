import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'RetailMAX POS — TILLMAX',
  description: 'RetailMAX Point of Sale — TILLMAX EPOS · 1024×768',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/*
          POS terminal frame — fixed 1024×768.
          On development the outer body centres this in the browser.
          On the actual terminal the screen IS 1024×768 so it fills perfectly.
        */}
        <div
          id="pos-frame"
          style={{
            width: '1024px',
            height: '768px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Inter', 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif",
            fontSize: '14px',
            background: '#F3F4F6',
            position: 'relative',
            /* Subtle shadow to show the terminal edge when viewing on dev monitor */
            boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 24px 80px rgba(0,0,0,0.6)',
            borderRadius: '6px',
          }}
        >
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
