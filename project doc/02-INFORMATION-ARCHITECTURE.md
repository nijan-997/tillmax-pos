# RetailMAX POS — Information Architecture (v3, persona-first)

This is the authoritative structure for every screen, action, and grouping in the prototype. A visual diagram of this same structure (a Miro board export) is provided alongside this file — use the image for spatial/relationship context, use this document for exact wording and behavioural notes.

This IA was deliberately **not** copied from the legacy system TILLMAX currently resells (an ICRTouch-based product). It is organised around **when and why a person actually reaches for something**, not around how the old system's engineers grouped its settings menus. Two personas: **Cashier** (default, always-on workspace) and **Manager** (entered via PIN elevation from the same shell — never a separate app).

---

## Sign-On (shared entry point)

- **Clerk PIN entry** — numeric PIN pad. States: incorrect PIN → retry; repeated failures → lockout requiring manager unlock.
- **Manager login** — elevated PIN/credential entry. This is the *same* mechanism used for in-line approvals mid-sale (see Manager Workspace → In-the-Moment Approvals) — don't build two separate login components for this.
- **Clock in / Clock out** — **new capability, no legacy reference to copy.** Kept deliberately separate from till sign-on (the legacy system's original login screen incorrectly conflated the two — do not repeat that mistake). Build a simple, clearly separate action from PIN sign-on.

---

## Cashier Workspace

### Start of Interaction
- **Ready / idle screen** — the resting state between customers: empty basket, prominent search/scan affordance, quick access to Recall (held sales) and History. This is the screen a cashier sits on most of the day — it needs to feel calm, not empty/broken.
- **Price check** — a lightweight lookup (scan or search an item to see its price) that does **not** add anything to the basket. A common real-world need ("how much is this?") that has no dedicated legacy equivalent — build it as genuinely separate from "add item."

### Add Items
- **Scan barcode** — primary input method. Unrecognised scan falls through to Search.
- **Search product** — search by name/partial match → results list. **Zero results → "+ Create Item"** inline action (confirmed cashier behaviour from live system observation) — do not build a dead-end empty state here.
- **Browse categories** — Departments → Categories, **deduplicated** (the legacy system had literal duplicate categories like "Fruit" and "Fruits" as separate tiles — do not reproduce that). Tapping a category **expands its subcategories/quick-keys in place**, not as a full-screen navigation — this was a specific fix from the heuristic audit of the legacy system.
- **Weighed item** — item flagged as sold-by-weight captures its weight inline on the basket line (a small stepper/scale reading), not via a separate full-screen flow.

### Adjust Line & Exceptions
- **Quantity / multiply** — increment/decrement, or type a number then multiply against a scan (works in either order: quantity-first-then-scan, or scan-first-then-quantity).
- **Line discount** — **one action**, opening one panel with a %/£ toggle inside it. Never build this as two separate buttons ("Discount %" and "Discount Amount") — that was a legacy complexity the redesign explicitly collapses.
- **Price override** — always requires manager authorisation (see In-the-Moment Approvals).
- **Void line** — **one unified action.** The legacy system had two redundant paths to void a line (a dedicated button, and select-then-void) — build exactly one.
- **Age-restricted check** — when a flagged item (e.g. alcohol) is added, prompt an age verification step (visual/ID check confirmed by the cashier, in the UK "Challenge 25" pattern). Confirm/decline outcome: confirmed → continue; declined → remove that line, continue the rest of the sale. This should not block the entire basket, only gate that line.
- **Mix & Match** — an automatic, system-evaluated discount (e.g. "3 for £5" style combo pricing) that applies itself when the basket qualifies. This is **not** cashier-triggered — it should appear as an automatically-added discount line whenever qualifying items are present, re-evaluated as the basket changes. Configuration for these rules lives in Manager Workspace → Store Configuration → Catalog & Promotions.

### Interruptions (can happen at any point in a sale)
- **Hold sale** — saves the current basket state and returns the till to the Ready screen.
- **Recall sale** — a list of held sales; selecting one restores it as the active basket.
- **Cancel sale** — clears the *entire* basket and returns to Ready. Requires a confirmation step (this is a full sale wipe, treat with the same visual caution as other destructive actions).
- **Clear** — **distinct from Cancel Sale.** Clears only the current numeric input field (e.g. mid-multiply entry, mid-discount entry) — like a backspace, not a basket wipe. These are two different actions and must not be merged or confused in the UI.
- **No-sale** — opens the cash drawer without a transaction. Requires selecting/entering a reason (e.g. "Get change"). **Confirmed: does not require manager authorisation**, but is logged for audit/reporting visibility (a manager can review no-sale events later — see Manager Workspace).

### Completing the Sale
- **Customer & loyalty** — optional, non-blocking. Simple lookup/attach by phone, card, or name (deliberately minimal — this is for attaching a loyalty account, not full CRM data entry).
- **Tender: Cash** — enter/select tendered amount → show change due.
- **Tender: Card** — hand off to (simulated) card terminal → approved / declined / cancelled states.
- **Tender: Mixed** — split payment across cash and card.
- **Tender: Loyalty redeem** — loyalty balance/points as a payment method.
- **Receipt** — print or skip. (Email/SMS receipt is a modern convenience worth having in the prototype as a visual option, but flag it in code comments as "not yet confirmed in scope" — don't assume it's a final requirement.)

### Look Back (cashier utility — explicitly *not* part of the linear sale flow)
This was deliberately pulled out of the transactional steps above, because it's something a cashier dips into *between* sales, not a step *within* one.
- **Repeat sale** — re-run a past transaction.
- **Refund** — process a refund against a specific past receipt, item-level.
- **Reprint receipt.**
- **Unified filter** — a single filter control across: transaction type (sale/refund/void), cashier, payment method, free-text keyword (e.g. product name), and customer. The legacy system had this scattered across many separate checkboxes — build it as one coherent filter UI.

---

## Manager Workspace (entered via PIN elevation)

### In-the-Moment Approvals (interrupt-driven, triggered *from* a cashier's in-progress sale — not a destination someone navigates to on purpose)
- **Void**, **Refund**, **Price override**, **Discount above limit** — each follows the same pattern: manager PIN entry → approve or deny → control returns to the cashier's sale exactly where it left off. Build one reusable "elevation" component for all four rather than four separate flows.

### Start & During Shift
- **Opening float** — record starting cash in the drawer.
- **Pay-in / Pay-out** — cash movements outside a sale (e.g. paying out a lottery win, or paying in change). **Reasons are admin-configurable** (a manager can define custom pay-out/pay-in reasons in Store Configuration — don't hard-code a fixed reason list).
- **Cash drop** — removing excess cash from the drawer to a safe.
- **No-sale audit visibility** — a manager-facing view of no-sale/drawer-open events logged by cashiers (read-only review, not a duplicate of the cashier's No-sale action itself).

### End of Shift
- **X Report** — mid-shift snapshot, non-resetting. Confirmed as needed on-till.
- **Financial by period (End of Day)** — day/week/month/custom range. Confirmed as needed on-till.
- **End of Shift report** — new, tied to the Clock in/Clock out capability — build as a simple placeholder screen if clock in/out itself isn't fully modelled yet.
- **Till Journal** — a full chronological log of every receipt/transaction on this till (distinct from cashier-facing History — this is the manager's audit-grade version).

> **Note for the build agent:** several more granular reports (Z Report, payment-type breakdowns, VAT summary, sales-by-department/category/product, a full manager dashboard) exist in earlier IA drafts but are flagged as **likely moving entirely to Cloud Back Office** rather than living on the till — build these as low-fidelity placeholder screens only, don't invest significant interaction detail here, and note in comments that this boundary is still pending final client confirmation.

### Store Configuration (infrequent, planned tasks — not urgent/interrupt-driven)

**Catalog & Promotions**
- **Item & Menu setup** — creating a new product **is one single step**: name, price, department/category assignment, VAT rate, and its position in the quick-key menu are all set together. (The legacy system required two entirely separate steps — create the item, then separately build a menu page and import the item into it. Do not reproduce that split.)
- **Promotions / Mix & Match rules** — this is where the automatic Mix & Match discounts (see Cashier Workspace → Adjust Line & Exceptions) are configured.
- **Discount & offer types** — general discount type configuration (distinct from the rules engine above).

**Payment Methods**
- **Configure payment buttons** — which tender types appear and in what order (cash/card/loyalty/mixed). Note: this is a *configuration* screen, distinctly named from the cashier's live "Tender" action, to avoid confusing the two in conversation or documentation.

**People & Access**
- **Staff accounts & roles** — predefined role levels: **Administrator, Manager, Supervisor, Till Staff**, each with a sensible default permission set, but **individually overridable per user** (a specific Till Staff account can be granted higher access than their role default).
- **Discount limits** — per-user/role ceiling on discounts a cashier can apply without escalating to a manager.
- **Show on sign-on screen** — toggle controlling whether a given staff member's name/button appears on the Sign-On screen.

**Hardware**
- Receipt printer, Cash drawer, Barcode scanner, Weighing scale, Card terminal, Customer display, Label printer — each a simple connection-status + test/reconnect screen. Low interaction depth needed; these can be relatively simple in the prototype.

**Connectivity**
- **Sync / connection status** — detailed view behind the persistent status-bar indicator (see System Status below).
- **Manual sync trigger** — force a sync attempt.
- **Licence status** — **read-only.** The actual licence is managed from TILLMAX's separate Admin Portal (a different application entirely, outside this prototype's scope) and reaches this till directly — this screen only displays current status, it does not let anyone edit or renew a licence.

**Store Identity**
- VAT/tax rates, Store & till identity, Receipt header/footer text.

---

## System Status (cross-cutting — not a navigable destination)

A persistent, quiet status indicator, visible on **every** screen in the Cashier Workspace (and ideally Manager Workspace too): online/synced, or offline with a count ("3 sales waiting to sync"). This is the single most important piece of ambient UI in the whole application — build it once, as a shared layout element, not per-screen. Sync itself is a background, non-blocking process; never design a screen that appears to freeze or require connectivity to keep functioning.

---

## Explicitly out of scope — do not build

This is a **retail-only** MVP. The legacy system this replaces also serves hospitality clients, and TILLMAX's contract explicitly excludes those features here. If any of the following seem implied by a real-world POS reference you're drawing on, exclude them anyway:

- Table / floor plan management
- Kitchen display / course firing
- Split bill by seat / covers
- Tips / gratuity
- Menu modifiers (e.g. "no onions," spice level)
- Self-checkout mode
- Delivery / takeaway order types

---

## Known open questions (build reasonable placeholders, don't block on these)

- Exact on-till vs. Cloud-Back-Office boundary for deeper reporting (see End of Shift note above)
- Whether email/SMS receipt delivery is in final scope
- Clock in/out UX specifics (genuinely new, no reference implementation exists yet)
