import {
  BrandVariants,
  createDarkTheme,
  createLightTheme,
  Theme,
} from '@fluentui/react-components';

// TILLMAX brand blue — distinct from Microsoft stock blue
const tillmaxBrand: BrandVariants = {
  10: '#020B1A',
  20: '#051733',
  30: '#082452',
  40: '#0B306F',
  50: '#0F3D8C',
  60: '#1549A9',
  70: '#1F5FD1', // Primary brand blue
  80: '#3B74E8',
  90: '#5B8FF5',
  100: '#7AAAF8',
  110: '#98C0FA',
  120: '#B4D2FC',
  130: '#CCE1FD',
  140: '#E2EFFE',
  160: '#F5F9FF',
};

export const tillmaxLightTheme: Theme = {
  ...createLightTheme(tillmaxBrand),
  // Typography
  fontFamilyBase: '"Segoe UI Variable", "Segoe UI", system-ui, sans-serif',
  fontFamilyMonospace: '"Cascadia Code", "Consolas", monospace',
  // Bump base body size for arm's-length legibility
  fontSizeBase300: '16px',
  fontSizeBase400: '18px',
  fontSizeBase500: '20px',
  fontSizeBase600: '24px',
  // Generous corner radius
  borderRadiusMedium: '8px',
  borderRadiusLarge: '12px',
  // Touch-first sizing — override Fluent's mouse defaults
  // Controls globally use larger base
};

export const tillmaxDarkTheme: Theme = {
  ...createDarkTheme(tillmaxBrand),
  fontFamilyBase: '"Segoe UI Variable", "Segoe UI", system-ui, sans-serif',
  fontSizeBase300: '16px',
  fontSizeBase400: '18px',
  fontSizeBase500: '20px',
  fontSizeBase600: '24px',
  borderRadiusMedium: '8px',
  borderRadiusLarge: '12px',
};

// Manager workspace accent — purple, used ONLY on manager surfaces
// so cashier can never mistake an elevated screen for their own
export const MANAGER_ACCENT = '#6B4FCC';
export const MANAGER_ACCENT_LIGHT = '#8B6FE8';
export const MANAGER_ACCENT_BG = 'rgba(107, 79, 204, 0.08)';

// Semantic colours (used in CSS vars / inline styles)
export const COLORS = {
  brand: '#1F5FD1',
  brandDark: '#1748A8',
  destructive: '#C4314B',     // Void, Cancel — outlined only, never filled
  warning: '#F0A30A',         // Offline, pending sync
  success: '#107C10',         // Online, synced, approved
  manager: MANAGER_ACCENT,
};
