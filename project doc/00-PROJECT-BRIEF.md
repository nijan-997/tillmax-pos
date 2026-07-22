# RetailMAX POS — Interactive Prototype Build Brief

## What you're building

A **clickable, functionally interactive prototype** of RetailMAX POS — the Windows touchscreen till application for TILLMAX's retail EPOS ecosystem. This is **not** the production application. Production will be a native WinUI 3 (XAML/C#) Windows desktop app. This prototype exists to let the client (TILLMAX / Rivin) and the design team **see and click through the full Information Architecture** we've designed, validate the flows, and hand developers (Zone) a working reference for interaction behaviour before native build begins.

Treat this as: **"what it should feel like," built fast, in a stack suited for rapid iteration and easy sharing (a browser link), not "how it will ultimately be built."**

## Who this is for

- **Primary reviewer:** Rivin (Director, TILLMAX) — needs to click through the whole till experience and recognise it as a real, usable retail POS.
- **Secondary reviewer:** Pasindu / Zone (dev team) — needs to see interaction states and logic clearly enough to scope native implementation later.
- **You (the build agent):** treat every screen and flow described here as a real product requirement, not a suggestion. Where something is ambiguous, make the most retail-sensible choice and note the assumption in code comments — don't silently skip it.

## Non-negotiable constraints

1. **This is a retail-only POS.** Do not build, reference, or leave stubs for hospitality features: no table/floor plan, no kitchen display, no course firing, no split-by-seat, no tips, no menu modifiers, no self-checkout, no delivery/takeaway. If you find yourself building any of these, stop — it's out of scope.
2. **Offline-first is the single most important product behaviour.** The till must visually communicate that it works with or without connectivity, at all times, via a persistent, non-blocking status indicator. Never design a flow that appears to require a live connection to complete a sale.
3. **Risk-tiered actions.** Destructive actions (Void, Cancel Sale) must be visually de-emphasised (quiet/outlined, muted colour) relative to routine actions (Hold, Discount). Payment is the **one** bold, unmistakable primary action on the sale screen. Do not style every button the same weight — this was the single biggest usability failure in the legacy system this redesign replaces, and getting it right here is a key demonstration point for the client.
4. **One action, one control.** Where the IA shows a single action with variants (e.g. "Line discount" with a %/£ toggle), build **one** button opening **one** panel with the toggle inside — never two separate buttons for the same concept.
5. **Manager elevation is in-line, not a separate app.** Approvals, cash management, and reporting happen by entering an elevated mode from within the same application shell (PIN-gated), never by navigating to an entirely different, disconnected UI.

## How the other files in this spec work together

Read them in this order:

1. **`01-DESIGN-SYSTEM.md`** — the visual language: Fluent 2 tokens, WinUI 3 principles, how both get adapted for a large touchscreen retail till. Read this before writing any component.
2. **`02-INFORMATION-ARCHITECTURE.md`** — the complete structural spec of every screen and action in the system, written out in full text. **A diagram image of this same IA will also be provided separately** (a Miro export) — use the image for the big-picture spatial relationships and this document for the exact wording, grouping, and behavioural notes on each item. If the two ever conflict on a small detail, this text document is authoritative since it's the most current version.
3. **`03-SCREENS-AND-COMPONENTS.md`** — screen-by-screen UI specification (layout, states, what's on screen) and the reusable component library you'll need to build them from.
4. **`04-TECH-STACK-AND-BUILD-PLAN.md`** — the concrete Next.js project setup, folder structure, data/state model, and a suggested build order.

## Definition of done

A person should be able to:
- Sign in as a Cashier (PIN) and land on a working sale screen
- Scan/search/browse to add items, including a weighed item and an item that requires "Create Item" because it's not found
- Adjust a line (quantity, discount, void)
- Trigger the age-restriction check on a flagged item and Mix & Match auto-discount on a qualifying basket
- Hold a sale and recall it later
- Complete a sale with cash, card, or mixed tender, print or skip a receipt
- Attempt an action requiring manager approval (e.g. price override) and see it correctly gate on a manager PIN, then return control to the sale in progress
- Look up a past transaction in History (repeat, refund, reprint) using the unified filter
- Toggle the sync status indicator between online and "X sales waiting to sync" and see it reflected persistently in the status bar
- Sign in as Manager and navigate the Manager Workspace: approve a pending action, do float/pay-in/pay-out/cash-drop, view an X Report and End of Day report, and browse (not necessarily fully wire up every field of) Store Configuration — Catalog & Promotions, Payment Methods, People & Access, Hardware, Connectivity, Store Identity

Everything above should be genuinely clickable with realistic mock data — not static images of screens.
