# Enzo Presentation Site — v2 Changes Spec

## Overview

Five changes to the Cost Analysis page and one site-wide change. All modifications are to existing files — no new pages or routes.

---

## Change 1: Inverse Comp Structure (Base ↔ Equity)

### Problem

The current model treats base salary and equity as scaling together (both increase with customer milestones). The correct model is an **inverse relationship at initial negotiation** plus a **salary bump for customer milestones**.

### Two Dimensions

There are now **two independent dimensions** to compensation:

1. **Initial package selection** — a slider at offer-time where the candidate picks their base/equity tradeoff. Higher base = lower equity grant. This is a one-time negotiation.
2. **Customer milestone bonus** — a salary increase that kicks in as Enzo onboards customers. This applies regardless of where the candidate set their initial base/equity split.

### New Comp Model

#### Dimension 1: Initial Base/Equity Tradeoff (inverse)

The candidate chooses where to land on a continuous slider:

| Position | Base Salary | Equity Grant |
|----------|-------------|--------------|
| Floor (max equity) | $240,000 | 4.0% |
| Mid | $300,000 | 3.0% |
| Ceiling (max cash) | $360,000 | 2.0% |

Formula:
```ts
function getInitialComp(t: number): { base: number; equity: number } {
  // t = 0 (floor/max equity) to 1 (ceiling/max cash)
  return {
    base: 240000 + t * 120000,      // $240k → $360k
    equity: 4 - t * 2,              // 4.0% → 2.0% (INVERSE)
  };
}
```

#### Dimension 2: Customer Milestone Salary Bump

On top of the initial base, salary increases as customers are onboarded. This is additive — it does NOT change equity.

| Customers | Salary Bump | Effective Base (at floor) | Effective Base (at ceiling) |
|-----------|-------------|--------------------------|----------------------------|
| 0 | +$0 | $240k | $360k |
| 1,000 | +$10k | $250k | $370k |
| 2,500 | +$25k | $265k | $385k |
| 5,000 | +$40k | $280k | $400k |
| 7,500 | +$55k | $295k | $415k |
| 10,000 | +$70k | $310k | $430k |

Formula:
```ts
function getMilestoneBump(customers: number): number {
  const t = Math.min(Math.max(customers, 0) / 10000, 1);
  return t * 70000; // $0 → $70k linear
}
```

### Files to Change

#### `src/data/costs.ts`

- Replace `getComp()` with two functions: `getInitialComp(t: number)` and `getMilestoneBump(customers: number)`
- Add a combined helper: `getTotalBase(initialT: number, customers: number): number` → `getInitialComp(t).base + getMilestoneBump(customers)`
- Update `compTiers` to reflect milestone bumps only (equity column removed from tiers since it's set at initial negotiation, not milestones)
- Update `scenarios` to remove hardcoded `compEquity` (equity is fixed at initial selection)

#### `src/components/costs/CompSlider.tsx`

Complete redesign. Now has **two sliders**:

**Slider A — Initial Package (horizontal, top)**
- Label: "Initial Package Selection"
- Left end: "$240k base / 4.0% equity" (max equity)
- Right end: "$360k base / 2.0% equity" (max cash)
- Display: Two KPI cards showing current Base and Equity that move inversely as the slider moves

**Slider B — Customer Milestone (horizontal, below)**
- Label: "Customer Milestone Bonus"
- Range: 0 → 10,000 customers
- Display: Shows the salary bump amount (+$0 → +$70k) and effective total base (initial base + bump)
- Milestone tick marks at 0, 1k, 2.5k, 5k, 7.5k, 10k

**Summary row below both sliders:**
- Effective Base: initial + milestone bump
- Equity Grant: from initial slider (fixed, doesn't change with customers)
- (No "Total Comp Estimate" — see Change 2)

#### `src/components/costs/EquityBreakdown.tsx`

Update left column equity terms:
- Starting grant range: 2.0%–4.0% (depends on initial package selection)
- Remove "Cap grant: 10.0%" — equity doesn't scale with customers anymore

#### `src/components/costs/MilestoneTrack.tsx`

Update to show milestone salary bumps instead of equity changes:
- Each node shows: customer count, stage label, salary bump (+$X), but NOT equity (equity is fixed at initial selection)

#### `src/pages/CostAnalysis.tsx`

Update the scaling scenarios section to reference the new model. Scenarios should show a range (floor initial → ceiling initial) rather than a single comp figure.

---

## Change 2: Remove "Total Comp Estimate"

### Problem

The third KPI card in the CompSlider bottom row shows "Total Comp Estimate" calculated as `base + (equity% × $50M)`. This is speculative and should be removed.

### Files to Change

#### `src/components/costs/CompSlider.tsx`

- Remove the `totalComp` derived signal
- Change the bottom row from 3 cards to 2 cards (or replace with a more useful metric)
- Keep: Effective Base (initial + milestone), Equity Grant
- Add: Milestone Bonus (the delta from milestones alone, e.g., "+$40k")

---

## Change 3: Reduce Team Distribution

### Problem

The current team diagram shows 20 headcount at $400k/mo ($4.8M/yr). This is too aggressive for an early-stage company. Scale it down to a lean team that reflects actual near-term hiring.

### New Team Composition

| Role | Headcount | Monthly Cost | Color |
|------|-----------|--------------|-------|
| Engineering | 3 | $60k | `--color-acid` |
| ML / Video Pipeline | 1 | $25k | `--color-frontier` |
| Design / Creative | 1 | $12k | `--color-wrapper` |
| GTM / Sales | 1 | $15k | `--color-ancillary` |
| Leadership | 1 | $20k | `--color-ink` |
| **Total** | **7** | **$132k/mo** | |

Annual: ~$1.58M/yr

### Files to Change

#### `src/data/costs.ts`

- Update `teamRoles` array with the reduced headcount and costs above
- Remove "Ops / Finance" row (absorbed into Leadership at this stage)
- Update `fixedCosts` to reflect new team cost:
  - Team (salaries + benefits): $132k/mo, $1.58M/yr
  - Adjust total accordingly

#### `src/components/costs/UnitEconomics.tsx`

- Fixed costs table and breakeven calculation will automatically reflect the new data
- Breakeven customer count will decrease significantly (~$177k / ($99 × 0.82) ≈ ~2,180 customers)

#### Scaling scenarios in `src/data/costs.ts`

Recalculate `scenarios` with the new fixed cost base ($177k/mo instead of $445k/mo):

| Scenario | Customers | MRR | Gross Profit | Net (after fixed) |
|----------|-----------|-----|--------------|-------------------|
| Conservative | 2,500 | $248k | $203k | +$26k/mo |
| Target | 5,000 | $495k | $406k | +$229k/mo |
| Stretch | 10,000 | $990k | $812k | +$635k/mo |

---

## Change 4: User Comments & Adjustable Values on Unit Economics / Team Distribution

### Problem

The unit economics and team distribution sections show static numbers. Viewers (potential cofounders, advisors, investors) should be able to leave comments and adjust values to model their own assumptions.

### What to Build

#### A) Sliding Scale on Editable Values

Every numeric value in these sections becomes adjustable via inline controls:

**Team Distribution (TeamDiagram.tsx):**
- Each role's headcount: range slider or +/- stepper (min 0, max 15)
- Each role's monthly cost: range slider (min $0, max $50k per head)
- Totals recalculate reactively

**Unit Economics (UnitEconomics.tsx):**
- Per-video costs (min/max for each component): inline editable
- Avg videos/customer/month: slider (1–50)
- Target price point: slider ($29–$299)
- CAC: slider ($50–$500)
- All derived metrics (gross margin, LTV, LTV:CAC, breakeven) recalculate reactively

#### Implementation Pattern

Use a reusable `EditableValue` component:

```tsx
interface EditableValueProps {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string; // e.g., formatCurrency
  label?: string;
}
```

- Default state: shows the formatted value as text
- On hover: subtle highlight indicating editability (border glow or underline)
- On click: reveals a compact horizontal slider overlaying or adjacent to the value
- Value updates reactively, all dependents recalculate
- Click elsewhere or press Escape to dismiss slider

Visual: the slider should be minimal — a thin track below the value, same styling as CompSlider but smaller (h-[6px] thumb 12px).

#### B) User Comments

A comment system scoped to each section. NO backend — comments are stored in `localStorage` and persist across page reloads.

**CommentThread component:**

```tsx
interface CommentThreadProps {
  sectionId: string; // unique key, e.g., "team-distribution", "unit-economics"
}
```

- Renders at the bottom of each relevant section
- Shows existing comments (from localStorage) as a list
- Each comment: text, timestamp, stored as `{ text: string, timestamp: number }[]`
- Input: a single-line text input + submit button, styled like the filter buttons
- Delete: small × on each comment to remove it
- LocalStorage key: `enzo-comments-${sectionId}`

**Where to add CommentThread:**
- Section 04: Team Distribution & Fixed Costs → `sectionId="team-distribution"`
- Section 05: Unit Economics → `sectionId="unit-economics"`

### Files to Create

- `src/components/costs/EditableValue.tsx` — reusable inline-editable number with slider
- `src/components/costs/CommentThread.tsx` — localStorage-backed comment list

### Files to Change

- `src/components/costs/TeamDiagram.tsx` — convert static `teamRoles` to signals, add EditableValue for headcount and cost per role
- `src/components/costs/UnitEconomics.tsx` — convert static values to signals, add EditableValue for video costs, pricing, CAC, videos/customer
- `src/pages/CostAnalysis.tsx` — add CommentThread to sections 04 and 05

### State Management

Use SolidJS `createSignal` / `createStore` for editable values. Initialize from the static data in `costs.ts`, but allow overrides. Optionally persist user-adjusted values to localStorage so they survive page reloads (key: `enzo-adjusted-${section}`).

A "Reset to defaults" button should appear whenever values differ from the original data.

---

## Change 5: Access Code Gate

### Problem

The site should require an access code before showing any content. Code: `BILLYORBUST`.

### What to Build

A full-page gate that appears before the app renders. Dark background matching the site theme. Centered card with:

- Enzo logo/dot + "ENZO" wordmark
- Text: "Enter access code to continue"
- Single text input (font-mono, uppercase, centered text)
- Submit button (bg-acid text-black, styled like the filter buttons)
- On incorrect code: shake animation + red border flash, text "Invalid code"
- On correct code: fade-out gate, reveal app content beneath

### Persistence

Store the authenticated state in `sessionStorage` (key: `enzo-access-granted`). Re-entering the code is required per browser session but not on every page navigation.

### Implementation

The gate should NOT be a route — it wraps the entire app at the Shell level.

### Files to Create

- `src/components/layout/AccessGate.tsx` — the gate component

### Files to Change

- `src/components/layout/Shell.tsx` — wrap children in `<AccessGate>`, only render content when authenticated

### AccessGate Component

```tsx
export default function AccessGate(props: ParentProps) {
  const ACCESS_CODE = "BILLYORBUST";
  const [granted, setGranted] = createSignal(
    sessionStorage.getItem("enzo-access-granted") === "true"
  );
  const [input, setInput] = createSignal("");
  const [error, setError] = createSignal(false);

  function submit() {
    if (input().toUpperCase() === ACCESS_CODE) {
      sessionStorage.setItem("enzo-access-granted", "true");
      setGranted(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  }

  return granted() ? props.children : (
    // Full-screen centered gate UI
  );
}
```

---

## Implementation Order

These changes have dependencies and should be implemented in this order:

1. **Change 5: Access Gate** — independent of all other changes, touches only layout files
2. **Change 3: Reduce Team Distribution** — data-only change in `costs.ts`, no component API changes
3. **Change 1 + 2: Inverse Comp + Remove Total Comp** — these are intertwined (both modify CompSlider and costs.ts)
4. **Change 4: Editable Values + Comments** — depends on Changes 1–3 being done first since it wraps existing values in signals

### Parallelization Strategy

Changes 5 and 3 can run in parallel (zero file overlap). Changes 1+2 must be sequential after 3 (shared `costs.ts`). Change 4 runs last since it modifies components touched by all prior changes.

---

## Files Summary

| File | Changes |
|------|---------|
| `src/data/costs.ts` | New comp model, reduced team, updated scenarios/fixed costs |
| `src/components/costs/CompSlider.tsx` | Two-slider redesign, remove total comp |
| `src/components/costs/EquityBreakdown.tsx` | Update equity range text |
| `src/components/costs/MilestoneTrack.tsx` | Show bump amounts, not equity |
| `src/components/costs/TeamDiagram.tsx` | Editable headcount/cost, reduced defaults |
| `src/components/costs/UnitEconomics.tsx` | Editable values, recalculating derived metrics |
| `src/components/costs/EditableValue.tsx` | **NEW** — reusable inline-editable slider |
| `src/components/costs/CommentThread.tsx` | **NEW** — localStorage comment thread |
| `src/components/layout/AccessGate.tsx` | **NEW** — access code gate |
| `src/components/layout/Shell.tsx` | Wrap in AccessGate |
| `src/pages/CostAnalysis.tsx` | Add CommentThread, update scenario display |
