'use client';

import { FluentProvider } from '@fluentui/react-components';
import { tillmaxLightTheme } from '@/lib/theme';
import { SessionProvider } from '@/lib/session-context';
import { BasketProvider } from '@/lib/basket-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FluentProvider theme={tillmaxLightTheme}>
      <SessionProvider>
        <BasketProvider>
          {children}
        </BasketProvider>
      </SessionProvider>
    </FluentProvider>
  );
}
