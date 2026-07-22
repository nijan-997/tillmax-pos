# Design System — Fluent 2, WinUI 3 principles, adapted for touchscreen retail

## Why Fluent 2 / WinUI 3

RetailMAX POS's production target is a native **WinUI 3** Windows desktop app. WinUI 3 is Windows' native implementation of **Fluent 2** — Microsoft's current cross-platform design language. TILLMAX's Cloud Back Office and Admin Portal are built with **Fluent UI React v9**, the web implementation of the same design language. Same design tokens (colour, spacing, motion, iconography, corner radius) across every platform; different native code per platform, no shared components.

**For this prototype:** use `@fluentui/react-components` (Fluent UI React v9) as the component and token foundation. This is not a placeholder choice — it is the same library the client's own Back Office/Admin Portal web apps use, so building the POS prototype on it keeps visual language consistent with the rest of the ecosystem and gives you production-accurate tokens for free.

```bash
npm install @fluentui/react-components @fluentui/react-icons
```

Wrap the app in a `FluentProvider` using a **custom theme** (see below) — do not ship the default `webLightTheme` unmodified, since default Fluent 2 web density is built for mouse/keyboard productivity apps (Teams, Office), not a fast-tap retail till.

## The core adaptation: touchscreen density, not desktop density

This is the single most important instruction in this document. Fluent 2's default component sizing assumes a mouse pointer and a seated user at a desk. RetailMAX POS is used standing, at arm's length, often quickly, sometimes by someone wearing gloves or with wet hands. Every interactive control needs to be **touch-first**, while still using Fluent 2's colour/type/spacing *tokens* underneath.

Concretely:

- **Minimum touch target: 56×56px** for any tappable control (buttons, quick-key tiles, list-row tap zones). Fluent 2's default button heights (32/40px) are too small — override them with a custom size variant used throughout, not per-instance.
- **Numeric keypad keys, quick-key tiles, and payment method buttons: 72×72px minimum.**
- **Generous spacing between adjacent destructive and routine actions** — never place Void/Cancel directly adjacent to Payment or Hold with no visual or spatial separation. Give destructive actions their own visually distinct zone (see Risk Tiers below).
- Type scale: bump the base body size up one step from Fluent 2's web defaults (16px minimum body text, 20px+ for anything price/total related) for legibility at arm's length.

## Colour tokens

Use Fluent 2's semantic token *names*, mapped to a custom palette rather than the stock brand palette, so the client sees something that reads as "TILLMAX," not "generic Microsoft app":

| Token role | Purpose | Example |
|---|---|---|
| `colorBrandBackground` / `colorBrandForeground` | Primary actions — the one bold Payment button, primary nav | A confident blue (avoid Microsoft's exact stock blue; pick a distinct brand blue, e.g. `#1F5FD1`) |
| `colorPaletteRedBackground2` / foreground | **Reserved for destructive actions only** (Void, Cancel Sale) — used sparingly, never as a filled block, prefer outlined/quiet button appearance | Muted red, text-only or outline emphasis |
| `colorPaletteYellowBackground2` | Warnings, offline/sync-pending state | Amber |
| `colorPaletteGreenBackground2` | Success, online/synced state, approved payment | Green |
| `colorNeutralBackground1/2/3` | Layered surfaces (Mica-style layering — see below) | Near-white / light grey steps |
| Manager-mode accent | A distinct accent (e.g. purple) used **only** in Manager Workspace surfaces, so a cashier can never mistake an elevated screen for their own | `#6B4FCC`-family |

Ship both a light theme (primary, for well-lit retail floors) and leave the structure open for a dark theme later — don't hard-code light-only values into components.

## Materials: Mica and Acrylic

- **Mica-style layering**: use subtle, flat `colorNeutralBackground1/2/3` steps to differentiate the status bar, main content, and card/panel surfaces. No literal blur/transparency needed in a web prototype — approximate with solid, very close-in-value greys, which is how Mica is used on primary surfaces in Windows 11 anyway.
- **Acrylic (translucency/blur)**: reserve for **transient overlays only** — the numeric keypad overlay, the discount panel, modal confirmations, the manager-PIN prompt. Use `backdrop-filter: blur()` with a semi-transparent background for these, never for primary/persistent surfaces.

## Typography

- UI face: Segoe UI stack (`"Segoe UI Variable", "Segoe UI", system-ui, sans-serif`) to feel native-Windows even in a browser prototype.
- **Numeric/monetary values (prices, totals, quantities) in a tabular-figure treatment** — either a monospace/tabular-nums font-feature setting, so numbers align cleanly as they change. This detail matters: it's what makes the basket total feel authoritative and "till-like" rather than like a generic web list.

## Corner radius, elevation, motion

- Corner radius: consistent small radius (Fluent 2 default ~4-8px for controls, ~8-12px for cards/panels). Don't mix radii arbitrarily.
- Elevation: flat/Mica for persistent surfaces; a subtle shadow only on transient overlays (keypad, modals) to visually signal "this is temporary, sitting above the main screen."
- Motion: keep minimal and fast (150–200ms ease). No decorative animation — every animation should communicate state change (e.g. a line item sliding into the basket, a modal fading in), never purely ornamental. This directly reflects real POS UX research: unnecessary animation slows down a busy cashier and should be avoided.

## Iconography

Use `@fluentui/react-icons` (the official Fluent 2 icon set) throughout — do not mix in a different icon library. Prefer the "Filled" variant for primary/active states and "Regular" for default/inactive, per standard Fluent usage.

## Accessibility baseline

- WCAG 2.1 AA contrast minimum on all text and interactive elements — this is a Fluent 2 baseline, don't regress it with custom colours.
- Every icon-only button needs an accessible label (`aria-label`), since this will eventually be used with assistive input methods and keyboard/switch access even though the primary interaction is touch.
- Focus states must remain visible even though this is primarily a touch interface — some staff or accessibility scenarios may use keyboard/switch navigation.
