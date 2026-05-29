# Enzo Presentation Site — v3 Polish & Fix Spec

## Overview

Four workstreams: visual QA fixes, mobile responsiveness, content consistency, and a polish pass. Plus two targeted comp slider changes. Based on a full audit of every source file.

---

## Change A: Comp Slider — Default to Floor Position

### Problem

`CompSlider.tsx` line 6 initializes `packageT` to `50` (the middle of the slider). The intended default is the floor position: $240k base / 4.0% equity (far left, `packageT = 0`).

### File to Change

#### `src/components/costs/CompSlider.tsx`

- Line 6: change `createSignal(50)` to `createSignal(0)`

That's it — one character change. The initial KPI cards will show $240k / 4.0% on page load.

---

## Change B: Milestone Bonus — Show Addition + New Total

### Problem

The "Customer Milestone Bonus" slider currently shows three summary cards: Effective Base, Equity Grant, and Milestone Bonus. The bonus card shows `+$40k` but doesn't clearly communicate the math: *base + bonus = new total*. The bonus should read as an addition expression.

### What to Build

Redesign the summary row below both sliders. Replace the current 3-card layout with a **visual addition expression**:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Base Salary  │  +  │   Milestone   │  =  │  Effective    │
│    $240k      │     │    Bonus      │     │    Base       │
│               │     │   +$40k       │     │   $280k       │
└──────────────┘     └──────────────┘     └──────────────┘

┌──────────────┐
│ Equity Grant  │
│    4.0%       │
└──────────────┘
```

Top row: 3 cards connected by `+` and `=` operators in the gaps. Shows the additive math clearly.
Bottom row: Equity grant card (full width or left-aligned), visually separated since equity is independent of milestones.

### File to Change

#### `src/components/costs/CompSlider.tsx`

Replace the summary row (lines 122–148). New structure:

```tsx
{/* Summary: addition expression */}
<div class="flex items-center gap-3 flex-wrap max-[880px]:flex-col max-[880px]:items-stretch">
  <div class="bg-panel border border-line p-5 flex-1 min-w-[140px]">
    <div class="font-mono uppercase text-ink-faint mb-2" style="font-size:10.5px">
      Base Salary
    </div>
    <div class="font-display font-black text-[1.5rem] text-ink leading-none">
      {formatCurrency(initialComp().base, true)}
    </div>
  </div>

  <span class="font-display font-black text-[1.5rem] text-ink-faint max-[880px]:text-center">+</span>

  <div class="bg-panel border border-line p-5 flex-1 min-w-[140px]">
    <div class="font-mono uppercase text-ink-faint mb-2" style="font-size:10.5px">
      Milestone Bonus
    </div>
    <div class="font-display font-black text-[1.5rem] text-acid leading-none">
      +{formatCurrency(milestoneBump(), true)}
    </div>
  </div>

  <span class="font-display font-black text-[1.5rem] text-ink-faint max-[880px]:text-center">=</span>

  <div class="bg-panel border border-acid/40 p-5 flex-1 min-w-[140px]">
    <div class="font-mono uppercase text-ink-faint mb-2" style="font-size:10.5px">
      Effective Base
    </div>
    <div class="font-display font-black text-[1.5rem] text-acid leading-none">
      {formatCurrency(effectiveBase(), true)}
    </div>
  </div>
</div>

{/* Equity — separate row, independent of milestones */}
<div class="mt-4">
  <div class="bg-panel border border-line p-5 max-w-[240px]">
    <div class="font-mono uppercase text-ink-faint mb-2" style="font-size:10.5px">
      Equity Grant
    </div>
    <div class="font-display font-black text-[1.5rem] text-wrapper leading-none">
      {formatPercent(initialComp().equity)}
    </div>
  </div>
</div>
```

The `=` result card gets a subtle acid border (`border-acid/40`) to visually distinguish it as the output.

On mobile (`max-[880px]`), the flex row stacks vertically and the `+` / `=` operators center between cards.

---

## Workstream 1: Visual QA Fixes

Issues found in the audit that affect correctness or visual integrity.

### 1.1 — Inline `<style>` Duplication

**Problem**: `CompSlider.tsx` and every instance of `EditableValue.tsx` inject identical `<style>` blocks. On the CostAnalysis page, ~16+ duplicate style blocks are injected for `.editable-slider` alone.

**Fix**: Move all custom range slider CSS into `src/styles/global.css`. Remove inline `<style>` tags from both components.

#### `src/styles/global.css` — append:

```css
/* Range slider styles */
input[type="range"].comp-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 12px;
  background: var(--color-panel-2);
  border: 1px solid var(--color-line);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}
input[type="range"].comp-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: var(--color-acid);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 12px var(--color-acid);
}
input[type="range"].comp-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--color-acid);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 12px var(--color-acid);
}

input[type="range"].editable-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background: var(--color-panel-2);
  border: 1px solid var(--color-line);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}
input[type="range"].editable-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: var(--color-acid);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 6px var(--color-acid);
}
input[type="range"].editable-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: var(--color-acid);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 6px var(--color-acid);
}

/* AccessGate animations */
@keyframes gate-shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}
@keyframes gate-fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
.gate-shake { animation: gate-shake 0.5s ease-in-out; }
.gate-fade-out { animation: gate-fade-out 0.4s ease-out forwards; }
```

#### Files to strip `<style>` tags from:

- `src/components/costs/CompSlider.tsx` — remove lines 18–47 (the entire `<style>` block)
- `src/components/costs/EditableValue.tsx` — remove the inline `<style>` block
- `src/components/layout/AccessGate.tsx` — remove lines 31–47 (the `<style>` block)

### 1.2 — Hardcoded Hex Colors

**Problem**: Several components hardcode `#0a0a0c` and `#d6ff3f` instead of using CSS variables.

**Fix**:

| File | Current | Replace With |
|------|---------|-------------|
| `src/components/layout/Nav.tsx` | `bg-[#0a0a0c]/95` | `bg-bg/95` |
| `src/components/costs/MilestoneTrack.tsx` | `style="box-shadow: 0 0 8px #d6ff3f"` | `style={{ 'box-shadow': '0 0 8px var(--color-acid)' }}` |
| `src/components/layout/AccessGate.tsx` | Duplicate grid pattern inline | Remove — the gate overlay sits on `<body>` which already has the grid |

### 1.3 — EditableValue Event Listener Leak

**Problem**: `EditableValue.tsx` adds `mousedown` and `keydown` listeners when the slider opens but only removes them on component unmount, not on close. Opening/closing 10 times creates 10 listener pairs.

**Fix**: In `EditableValue.tsx`, move the `removeEventListener` calls into the `setOpen(false)` branches (Escape handler, click-outside handler, toggle-off click), not just `onCleanup`.

### 1.4 — EditableValue Accessibility

**Problem**: The trigger is a `<span>`, not keyboard-focusable, no ARIA role.

**Fix**: Change the trigger from `<span>` to `<button>` with `role="spinbutton"` or keep as `<button>` (implicit role). Add `aria-label={format(value)}` and `tabindex={0}`. Style the button to remove default appearance.

### 1.5 — Negative Margin / Breakeven Guard

**Problem**: In `UnitEconomics.tsx`, if a user cranks up `avgVideos` and lowers `pricePoint`, gross margin can go negative, making the breakeven display nonsensical (negative or Infinity).

**Fix**: Add a guard to the breakeven display:

```tsx
const breakeven = () => {
  const gm = grossMargin();
  if (gm <= 0) return Infinity;
  return Math.ceil(totalFixedMonthly() / (pricePoint() * gm));
};
```

Display: if `breakeven() === Infinity`, show `"N/A"` with a subtitle `"Negative margin — pricing below COGS"` in `text-down`.

---

## Workstream 2: Mobile Responsiveness

### 2.1 — Normalize Breakpoints

**Problem**: Three different breakpoint systems are used across the same page:
- `max-[880px]` — most components (correct, this is the project standard)
- `max-md` (767px) — CostAnalysis scenarios grid
- `md:` (768px) — MilestoneTrack desktop/mobile swap

Between 768px and 880px, some grids are single-column while others are still multi-column.

**Fix**: Standardize everything on `max-[880px]`.

| File | Current | Replace With |
|------|---------|-------------|
| `src/pages/CostAnalysis.tsx` | `max-md:grid-cols-1` | `max-[880px]:grid-cols-1` |
| `src/components/costs/MilestoneTrack.tsx` | `hidden md:block` / `md:hidden` | `hidden min-[881px]:block` / `min-[881px]:hidden` |

### 2.2 — Nav Responsive Handling

**Problem**: Nav has no collapse behavior. At ~320px, the logo + two links compete for one flex row.

**Fix**: At `max-[480px]`, shrink the nav link font size and spacing:

```tsx
<nav class="flex gap-5 max-[480px]:gap-3">
  <A ... class="... text-[.82rem] max-[480px]:text-[.72rem]">Market Analysis</A>
  <A ... class="... text-[.82rem] max-[480px]:text-[.72rem]">Cost Analysis</A>
</nav>
```

Not a hamburger menu (only 2 links, not worth the complexity) — just tighter spacing.

### 2.3 — TeamDiagram Responsive

**Problem**: No responsive breakpoints at all. Role rows have a flex layout that can compress on narrow screens.

**Fix**: On each role row, stack the content vertically on narrow screens:

```tsx
<div class="flex items-center gap-3 flex-wrap max-[640px]:flex-col max-[640px]:items-start">
```

The cost value (`ml-auto`) should drop below the role name on mobile instead of fighting for the same row.

### 2.4 — CommentThread Touch Support

**Problem**: Delete button uses `group-hover:opacity-100` which doesn't work on touch devices.

**Fix**: Add a long-press or always-visible delete. Simplest: make the `×` button always visible at low opacity (`opacity-40`) and brighter on hover (`hover:opacity-100`). This works on both touch and mouse.

### 2.5 — EditableValue Touch Support

**Problem**: No `touch-action` CSS, 14px thumb is small for touch.

**Fix**: Add `touch-action: none` to the slider wrapper and increase thumb size on touch via media query in `global.css`:

```css
@media (pointer: coarse) {
  input[type="range"].editable-slider::-webkit-slider-thumb {
    width: 22px;
    height: 22px;
  }
  input[type="range"].editable-slider::-moz-range-thumb {
    width: 22px;
    height: 22px;
  }
}
```

### 2.6 — CommentThread Word Break

**Problem**: Very long words in comments can overflow their container.

**Fix**: Add `break-words` (Tailwind class for `overflow-wrap: break-word`) to the comment text element.

---

## Workstream 3: Content Consistency

### 3.1 — Market Revenue Figure Inconsistency

**Problem**: The 2025 AI video market revenue appears as three different numbers:
- `src/pages/MarketAnalysis.tsx` bar chart: `$0.72B`
- `src/pages/MarketAnalysis.tsx` prose: `$670M`
- `src/data/kpis.ts` note: `up from ~$717M in 2025`

These are $670M, $717M, and $720M — three different values for the same metric.

**Fix**: Standardize on `$0.72B` / `$720M` (the bar chart value, which was corrected in the v1 data fix):

| File | Line(s) | Current | Replace With |
|------|---------|---------|-------------|
| `src/pages/MarketAnalysis.tsx` | Prose paragraph in Section 01 | `$670M in 2025` | `$720M in 2025` |
| `src/data/kpis.ts` | `marketSizeKpis[0].note` | `up from ~$717M in 2025` | `up from ~$720M in 2025` |

### 3.2 — CostAnalysis Footnote Hardcoded Values

**Problem**: The scenarios footnote says `$177k/mo fixed costs` which is correct now but will become stale if the user edits fixed costs via the editable sliders.

**Fix**: Make the footnote reactive. In `CostAnalysis.tsx`, import `fixedCosts` and compute the total:

```tsx
import { scenarios, fixedCosts } from '../data/costs';

// Inside the component:
const totalFixed = () => fixedCosts.reduce((sum, f) => sum + f.monthly, 0);
```

Then in the footnote:
```tsx
Scenarios assume $99/mo mid-tier pricing, ~82% gross margin, {formatCurrency(totalFixed(), true)}/mo fixed costs.
```

**Note**: This footnote uses the static `fixedCosts` from `costs.ts`, not the user-adjusted values from UnitEconomics. That's acceptable — the scenarios themselves are also static. Making both fully reactive would require lifting state to CostAnalysis, which is scope for a future change.

### 3.3 — EquityBreakdown Hardcoded Equity Range

**Problem**: `EquityBreakdown.tsx` hardcodes `"2.0%–4.0% equity (depends on initial package)"`. If the comp formula changes, this string won't update.

**Fix**: Low priority, note only. The formula is unlikely to change, and deriving it would add unnecessary complexity for a presentation site.

---

## Workstream 4: Polish Pass

### 4.1 — Transition on Nav Links

**Problem**: Nav link hover color change is instant (no `transition-colors`).

**Fix**: In `Nav.tsx`, add `transition-colors` to each `<A>` element.

### 4.2 — Hover States on EquityBreakdown

**Problem**: No interactive feedback on the equity terms or trigger blocks.

**Fix**: Add `hover:bg-panel-2 transition-colors` to each trigger block (`border-l-[3px]` divs) and to each term row in the left column.

### 4.3 — Reduced Motion

**Problem**: No `prefers-reduced-motion` handling. The gate shake, fade-out, and any future transitions will play for users who prefer reduced motion.

**Fix**: In `global.css`:

```css
@media (prefers-reduced-motion: reduce) {
  .gate-shake { animation: none; }
  .gate-fade-out { animation: none; opacity: 0; }
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
  }
}
```

### 4.4 — Scroll to Top on Route Change

**Problem**: Navigating between `/` and `/costs` doesn't reset scroll position.

**Fix**: In `src/index.tsx`, add a scroll reset. SolidJS Router supports this via a `root` prop or manual `useNavigate` effect. Simplest approach — add to the Router config:

```tsx
import { useLocation } from '@solidjs/router';
import { createEffect } from 'solid-js';

// Inside Shell or a top-level layout component:
const location = useLocation();
createEffect(() => {
  location.pathname; // track
  window.scrollTo(0, 0);
});
```

### 4.5 — 404 Catch-All Route

**Problem**: Navigating to an unknown path shows the Shell with empty content.

**Fix**: Add a catch-all route in `src/index.tsx`:

```tsx
<Route path="*" component={() => (
  <div class="py-20 text-center">
    <h1 class="font-display font-black text-[3rem] text-ink mb-4">404</h1>
    <p class="text-ink-dim">Page not found.</p>
    <A href="/" class="text-acid mt-4 inline-block font-mono text-sm">← Market Analysis</A>
  </div>
)} />
```

### 4.6 — Favicon + Meta Tags

**Problem**: No favicon, no meta description, no OG tags.

**Fix**: In `index.html`:
- Add `<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><circle cx='5' cy='5' r='4' fill='%23d6ff3f'/></svg>">` (acid green dot, matching the logo)
- Add `<meta name="description" content="AI video market analysis and cost modeling for Enzo.ai">`

---

## Files Summary

| File | Changes |
|------|---------|
| `src/styles/global.css` | Add slider CSS, gate animations, reduced motion, touch coarse thumb |
| `src/components/costs/CompSlider.tsx` | Default `packageT=0`, new summary row layout, remove `<style>` tag |
| `src/components/costs/EditableValue.tsx` | Fix event listener leak, accessibility (`<button>`), remove `<style>` tag |
| `src/components/costs/CommentThread.tsx` | Touch-friendly delete, word-break |
| `src/components/costs/TeamDiagram.tsx` | Add `max-[640px]` responsive stacking |
| `src/components/costs/UnitEconomics.tsx` | Breakeven guard for negative margin |
| `src/components/costs/EquityBreakdown.tsx` | Hover states on trigger blocks |
| `src/components/costs/MilestoneTrack.tsx` | Normalize breakpoint to 881px, use CSS var for box-shadow |
| `src/components/layout/AccessGate.tsx` | Remove `<style>` tag and duplicate grid pattern |
| `src/components/layout/Nav.tsx` | Use `bg-bg/95`, add `transition-colors`, responsive text sizing |
| `src/pages/CostAnalysis.tsx` | Normalize breakpoint, reactive footnote |
| `src/pages/MarketAnalysis.tsx` | Fix revenue figure: `$670M` → `$720M` |
| `src/data/kpis.ts` | Fix note: `~$717M` → `~$720M` |
| `src/index.tsx` | Scroll-to-top on route change, 404 route |
| `index.html` | Favicon (acid green dot SVG), meta description |

---

## Implementation Order & Parallelization

These changes have minimal overlap. Recommended parallel grouping:

**Agent 1 — CSS & Global (Workstream 1.1 + 4.3 + 2.5)**
- `src/styles/global.css` — all slider CSS, gate animations, reduced motion, touch thumb
- `src/components/costs/CompSlider.tsx` — remove `<style>`, Change A (default to 0), Change B (summary row redesign)
- `src/components/costs/EditableValue.tsx` — remove `<style>`, fix listener leak, accessibility
- `src/components/layout/AccessGate.tsx` — remove `<style>` and duplicate grid bg

**Agent 2 — Responsiveness & Content (Workstream 2 + 3)**
- `src/pages/CostAnalysis.tsx` — normalize breakpoint, reactive footnote
- `src/components/costs/MilestoneTrack.tsx` — normalize breakpoint, CSS var
- `src/components/costs/TeamDiagram.tsx` — responsive stacking
- `src/components/costs/CommentThread.tsx` — touch delete, word-break
- `src/components/costs/UnitEconomics.tsx` — breakeven guard
- `src/pages/MarketAnalysis.tsx` — fix revenue figure
- `src/data/kpis.ts` — fix note

**Agent 3 — Polish (Workstream 4)**
- `src/components/layout/Nav.tsx` — bg-bg/95, transitions, responsive text
- `src/components/costs/EquityBreakdown.tsx` — hover states
- `src/index.tsx` — scroll-to-top, 404 route
- `index.html` — favicon, meta

All three agents have **zero file overlap** and can run in parallel.
