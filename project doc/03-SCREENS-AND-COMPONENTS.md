# Screens & Components

Read `02-INFORMATION-ARCHITECTURE.md` first — this file describes *how* to build each part of that structure as an actual screen.

## Shared layout shell

Every Cashier Workspace and Manager Workspace screen sits inside one persistent shell:

```
┌─────────────────────────────────────────────────────────────┐
│ StatusBar: Store/Till id · Staff name · SyncStatusPill · [Manager Mode] btn │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                     (screen content)                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

- `StatusBar` is a single component, rendered once in the root layout, never re-implemented per screen.
- `SyncStatusPill` is clickable in the prototype (to let a reviewer toggle online/offline and see the effect) — in production this would just reflect real state, but for demo purposes, make it interactive.
- The `[Manager Mode]` button in the status bar is the **only** entry point into the Manager Workspace from the Cashier side (aside from in-line approval prompts). Style it distinctly (the manager accent colour) and keep it visually separate from the cashier's own action buttons.

## Reusable component library

Build these once, use everywhere:

| Component | Used for |
|---|---|
| `CategoryTile` | Departments/categories grid. Supports an "expanded" state that reveals subcategory chips + quick-key items inline underneath, without navigating away. |
| `QuickKeyButton` | An individual product quick-key. Shows a small scale icon if the item is weighed. |
| `BasketLine` | One line in the basket: name, qty/weight stepper, per-line "…" menu (discount/void), computed amount in tabular-figure styling. |
| `BasketTotal` | The subtotal/discount/total block anchored at the bottom of the basket — total is the single largest, boldest number on the screen. |
| `ActionButton` | Takes a `tier` prop: `"primary"` (Payment — bold, filled, brand colour), `"neutral"` (Hold, Discount — outlined/filled neutral), `"quiet"` (Void, Cancel — text-only or subtle outline, muted). Never let a "quiet" and "primary" button look visually similar. |
| `NumericKeypadOverlay` | Acrylic-style translucent overlay for quantity/multiply/discount value entry. Appears above the current screen, doesn't navigate away from it. |
| `ManagerElevationModal` | Reusable approval modal: shows what's being approved (void/refund/override/discount), a manager PIN pad, approve/deny buttons. Used identically across all four approval types. |
| `SyncStatusPill` | Green "Synced" or amber "N sales waiting to sync," clickable to toggle in this prototype. |
| `EmptyState` | Used for the Ready screen and any empty list (basket, history results) — always has helpful guidance text, never a bare blank area. |
| `FilterBar` | The single unified filter control used in History (type, cashier, payment method, keyword, customer) — build as one composable bar, not five separate filter widgets. |

## Cashier Workspace screens

### 1. Sign-On
- Clerk PIN pad, large numeric buttons (72×72px), staff name buttons if "show on sign-on screen" is enabled for them.
- A separate, clearly distinct **Clock In/Out** action — not combined with the PIN field.
- Manager login accessible from here too (for opening-of-day manager tasks before any cashier signs in).

### 2. Ready / Sale screen (the main screen — most time is spent here)
Layout: category browser (left/top, ~35% width) + basket panel (right, ~45-50% width, dominant) + action row (bottom).
- Empty state: basket empty, `EmptyState` component with a prompt like "Scan or tap an item to start."
- Price check accessible from here without needing an active sale.
- As items are added: `BasketLine` components populate, `BasketTotal` updates live.
- Action row: Hold, Discount as `"neutral"` tier; Void, Cancel as `"quiet"` tier; Payment as the one `"primary"` tier button, sized larger than the rest.
- Age-restriction and Mix & Match are **not** separate screens — they're inline behaviours triggered from this same screen (a confirm/decline mini-prompt for age check; an automatically-appearing discount line for Mix & Match).

### 3. Item not found / Create Item
- Triggered inline from a zero-result search, not a separate destination. A lightweight form: name, price, department — submits and immediately adds the new item to the current basket.

### 4. Hold / Recall
- Recall is a simple list (each entry: time held, item count, total) — tapping restores the basket and returns to the Sale screen.

### 5. Tender screens
- Cash: numeric entry for tendered amount, then a clear change-due display.
- Card: a simulated "processing → approved/declined" state sequence (a short timeout is fine for the prototype — don't wire a real payment gateway).
- Mixed: two amount entries (cash portion, remainder auto-calculated to card).
- Receipt: print / no receipt choice, with a simple visual receipt preview.

### 6. History (Look Back)
- `FilterBar` at top.
- Results list of past transactions.
- Selecting one surfaces Repeat / Refund / Reprint actions for that transaction.

## Manager Workspace screens

### 1. Manager elevation entry
- PIN pad (can reuse the same component as Sign-On's PIN pad, styled with the manager accent).

### 2. Approvals (when triggered in-line)
- `ManagerElevationModal` overlaying the cashier's sale screen — never a full navigation away from the sale in progress.

### 3. Shift screens
- Opening float, Pay-in/Pay-out (with a reason dropdown sourced from configurable reasons), Cash drop — simple forms with a numeric keypad.
- X Report / Financial by period / End of Shift report / Till Journal — simple report-style screens (a summary card + a data table is sufficient fidelity here; these don't need deep interactivity).

### 4. Store Configuration
- A settings-style navigation (a left-hand list of the six groups: Catalog & Promotions, Payment Methods, People & Access, Hardware, Connectivity, Store Identity) with the corresponding form/list content on the right.
- **Item & Menu setup must be visibly one combined form** (name + price + department/VAT + menu placement together) — this is a specific, demonstrable fix worth calling out clearly in the UI (e.g., it should be obvious this is *not* a two-step wizard).
- Staff accounts: a table of staff with role badges (Administrator/Manager/Supervisor/Till Staff) and a way to override an individual's permission level.

## Visual proof points to get right (these are the moments the client will specifically check)

1. The status bar's sync indicator is visible and correctly styled on every single screen, cashier and manager side.
2. Void and Cancel Sale visually read as lower-emphasis than Hold/Discount, which in turn read as lower-emphasis than Payment.
3. Tapping a category expands it in place — no page navigation, no loading spinner.
4. The Discount action opens one panel with a %/£ toggle — never two separate discount buttons.
5. An age-restricted item triggers a check without needing to navigate off the sale screen.
6. Item & Menu setup in Store Configuration is visibly a single combined step, not two.
