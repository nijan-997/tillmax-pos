# Tech Stack & Build Plan

## Stack

- **Next.js 14+, App Router, TypeScript.**
- **`@fluentui/react-components`** (Fluent UI React v9) + **`@fluentui/react-icons`** — the component/token foundation (see `01-DESIGN-SYSTEM.md`).
- **Tailwind CSS** — used only for layout utilities (flex/grid, spacing overrides, touch-sizing helpers) *alongside* Fluent components, not as a replacement for Fluent's own styling. Fluent components carry their own theming via `FluentProvider`; Tailwind handles page-level layout.
- **State management:** React Context for global session state (current staff, till session, sync status) + local component state for basket/UI. If the app grows complex enough to need it, `zustand` is an acceptable lightweight addition — don't reach for Redux for a prototype this size.
- **Mock data only.** There is no real backend. All product catalog, promotions, staff, and transaction history data should live in a `mock-data/` module, structured like a real API response so it's trivial to swap for a real API later.
- **Persistence:** it's fine to use `localStorage` in this project to persist basket/session state across a page refresh during demos — this is a standalone Next.js app, not a claude.ai artifact, so browser storage APIs work normally here.

## Suggested folder structure

```
/app
  /sign-on/page.tsx
  /(cashier)/
    layout.tsx              # shell: StatusBar + cashier nav context
    /sale/page.tsx           # the Ready/Sale screen — default route after sign-on
    /history/page.tsx
  /(manager)/
    layout.tsx               # shell: StatusBar (manager accent) + manager nav
    /elevate/page.tsx         # PIN entry to enter Manager Workspace
    /shift/page.tsx
    /reports/page.tsx
    /config/
      page.tsx                # Store Configuration landing (6-group nav)
      /catalog-promotions/page.tsx
      /payment-methods/page.tsx
      /people-access/page.tsx
      /hardware/page.tsx
      /connectivity/page.tsx
      /store-identity/page.tsx
/components
  /shared/          # StatusBar, SyncStatusPill, ActionButton, EmptyState, ManagerElevationModal, NumericKeypadOverlay
  /cashier/         # CategoryTile, QuickKeyButton, BasketLine, BasketTotal, FilterBar
  /manager/         # StaffTable, ReportCard, ReasonSelect
/lib
  /theme.ts          # custom FluentProvider theme (tokens from 01-DESIGN-SYSTEM.md)
  /session-context.tsx
  /basket-context.tsx
  /mock-data/
    products.ts
    categories.ts
    promotions.ts
    staff.ts
    transactions.ts
```

## Data model (mock, but shaped realistically)

```typescript
type Product = {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  weighed?: boolean;          // true → captured by weight, not count
  ageRestricted?: boolean;    // true → triggers age check on add
  vatRate: number;
};

type Category = {
  id: string;
  name: string;
  parentId?: string;          // for subcategories, expand-in-place
};

type PromotionRule = {
  id: string;
  type: 'mix-and-match' | 'discount-offer';
  description: string;
  productIds: string[];
  // e.g. { qualifyingQty: 3, forPrice: 5.00 } for a "3 for £5" rule
};

type BasketLine = {
  id: string;
  productId: string;
  qty?: number;
  weight?: number;
  unitPrice: number;
  lineDiscount?: { type: 'percent' | 'amount'; value: number };
  ageVerified?: boolean;
};

type StaffMember = {
  id: string;
  name: string;
  pin: string;
  role: 'Administrator' | 'Manager' | 'Supervisor' | 'Till Staff';
  permissionOverride?: Partial<Record<string, boolean>>;
  discountLimit: number;
  showOnSignOn: boolean;
};

type TillSession = {
  staff: StaffMember | null;
  clockedIn: boolean;
  syncStatus: { online: boolean; pendingCount: number };
};

type HeldSale = {
  id: string;
  heldAt: string;
  lines: BasketLine[];
};

type PastTransaction = {
  id: string;
  timestamp: string;
  cashier: string;
  paymentMethod: 'cash' | 'card' | 'mixed' | 'loyalty';
  total: number;
  lines: BasketLine[];
  type: 'sale' | 'refund' | 'void';
};
```

Seed `mock-data/` with enough realistic sample data to make every screen feel populated: at least 6-8 categories with subcategories, 25-30 products spanning weighed/non-weighed/age-restricted, 2-3 promotion rules that are actually achievable with the seeded products (so a reviewer can trigger Mix & Match live), 4-5 staff members across different roles, and 10+ past transactions for History to filter meaningfully.

## Suggested build order

1. **Scaffold + theme** — Next.js project, Fluent provider with the custom touchscreen-density theme from `01-DESIGN-SYSTEM.md`, shared layout shell with `StatusBar` + `SyncStatusPill`.
2. **Sign-On** — PIN pad, staff selection, Clock In/Out as a separate action.
3. **Sale screen skeleton** — category browser + empty basket + action row, all non-functional visually first, to validate layout and risk-tiered button styling before wiring logic.
4. **Wire item entry** — scan/search/browse all add to basket; weighed items capture weight; zero-result search surfaces Create Item.
5. **Wire basket adjustments** — quantity, line discount (one panel, %/£ toggle), void, price override (routes to `ManagerElevationModal`).
6. **Wire exceptions** — age-restriction check, Mix & Match auto-discount evaluation on basket change.
7. **Wire interruptions** — Hold/Recall, Cancel, Clear, No-sale (with reason selection).
8. **Wire completing-the-sale** — customer/loyalty attach, all tender types, receipt.
9. **Build History** — unified filter + past transaction list + repeat/refund/reprint actions.
10. **Build Manager Workspace** — elevation entry, shift screens, reports (lower fidelity acceptable), Store Configuration (all six groups, with Item & Menu setup visibly combined into one step).
11. **Polish pass** — confirm every one of the "visual proof points" listed at the end of `03-SCREENS-AND-COMPONENTS.md` is actually true by clicking through the finished build.

## What "good enough" looks like for this prototype

- It's fine for report screens and some Store Configuration sub-screens to be lower-fidelity (a clean form or table, not deeply polished) — the **core sale flow and the risk-tiering/offline-status details are what must be excellent**, since those are the specific things being demonstrated to the client.
- It's fine for card payment to be simulated (a short delay then "approved") rather than integrating a real payment SDK.
- Don't build authentication/security for real — PINs can be simple string matches against the mock staff data.
