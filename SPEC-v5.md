# Enzo — v5 Spec: Contrast, CTO Active, Save Profiles, Trend Dates

## Overview

Five targeted fixes based on visual QA of the live site. Addresses unreadable status badges, CTO status, dual salary/loaded-cost display, a "Save Scenario" system with usernames, editable unit economics, and date labels on the trend chart.

---

## Change 1: Fix Color Contrast on Status Badges

### Problem

In `TeamDiagram.tsx`, the "ACTIVE" badge uses `bg-up/20 text-up` and the "PLANNED — M{n}" badge uses `bg-ink-faint/20 text-ink-faint`. Both are nearly invisible against the dark row backgrounds — the text blends into its own translucent background.

### Fix

#### `src/components/costs/TeamDiagram.tsx`

Replace the badge `classList` (lines 67–70):

Current:
```tsx
classList={{
  'bg-up/20 text-up': role.status === 'active',
  'bg-ink-faint/20 text-ink-faint': role.status === 'future',
}}
```

New:
```tsx
classList={{
  'bg-up/20 text-up font-semibold': role.status === 'active',
  'bg-public/15 text-public': role.status === 'future',
}}
```

The "PLANNED" badge switches to `--color-public` (#ffd166, warm yellow) which provides much better contrast on dark backgrounds. The "ACTIVE" badge adds `font-semibold` for slightly better readability.

Also update the "Tax detail" / "Hide taxes" button — it's using `text-ink-faint` which is barely visible:

Current (line 101):
```tsx
class="ml-auto text-[9px] font-mono text-ink-faint border border-line px-1.5 py-0.5 hover:border-acid hover:text-ink transition-colors"
```

New:
```tsx
class="ml-auto text-[9px] font-mono text-ink-dim border border-line px-1.5 py-0.5 hover:border-acid hover:text-ink transition-colors"
```

Change `text-ink-faint` → `text-ink-dim` for the tax detail button.

---

## Change 2: Make CTO an Active Role

### Problem

CTO is listed as `status: 'future', startMonth: 3` in `costs.ts`. The user wants CTO to be an active (launch) role alongside CEO and BD.

### Files to Change

#### `src/data/costs.ts` (line 78)

Change:
```ts
{ role: 'CTO', headcount: 1, annualSalary: 240000, color: 'var(--color-frontier)', status: 'future', startMonth: 3 },
```

To:
```ts
{ role: 'CTO', headcount: 1, annualSalary: 240000, color: 'var(--color-frontier)', status: 'active' },
```

Remove `startMonth: 3` and change `status` from `'future'` to `'active'`.

This automatically propagates to:
- TeamDiagram: CTO shows "ACTIVE" badge, full opacity, counted in active headcount
- teamStore: `activeRoles()` and `activeMonthlyBurn()` now include CTO
- UnitEconomics: breakeven calculation includes CTO's fully loaded cost
- FinancialProjections: `teamCostAtMonth(0)` now includes CTO from M0 instead of M3

---

## Change 3: Show Both Salary and Fully Loaded Cost

### Problem

The salary column in TeamDiagram only shows the base annual salary (e.g., "$240k/yr"). Users want to see both the base salary AND the fully loaded cost (with taxes) in one glance.

### Fix

#### `src/components/costs/TeamDiagram.tsx`

Replace the salary `<span>` (lines 80–90) with a stacked display:

Current:
```tsx
<span class="font-mono text-[.86rem] text-ink-dim ml-auto max-[640px]:ml-0">
  <EditableValue
    value={role.annualSalary}
    onChange={(v) => updateRole(i(), 'annualSalary', v)}
    min={range().min}
    max={range().max}
    step={range().step}
    format={(v) => `${formatCurrency(v, true)}/yr`}
  />
</span>
```

New:
```tsx
<div class="ml-auto max-[640px]:ml-0 text-right">
  <div class="font-mono text-[.86rem] text-ink">
    <EditableValue
      value={role.annualSalary}
      onChange={(v) => updateRole(i(), 'annualSalary', v)}
      min={range().min}
      max={range().max}
      step={range().step}
      format={(v) => `${formatCurrency(v, true)}/yr`}
    />
  </div>
  <div class="font-mono text-[10px] text-ink-faint">
    {formatCurrency(taxes().fullyLoaded, true)}/yr loaded
  </div>
</div>
```

The base salary is the primary number (brighter `text-ink`), and the fully loaded cost sits below it in smaller muted text. The `taxes()` accessor is already defined per-row.

---

## Change 4: Save Scenario with Username + Editable Unit Economics

### Problem

Users want to:
1. Adjust all cost/projection values across the site
2. Save their configuration as a named scenario
3. Have their username visible to show who configured it
4. Persist everything to localStorage

### What to Build

#### A) Global Settings Store: `src/data/settingsStore.ts` (NEW FILE)

A lightweight store that manages the active user profile:

```ts
import { createSignal } from 'solid-js';

const STORAGE_KEY = 'enzo-user-profile';

interface UserProfile {
  username: string;
  savedAt: number;
}

function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

const initial = loadProfile();
const [username, setUsernameSignal] = createSignal(initial?.username ?? '');
const [savedAt, setSavedAt] = createSignal(initial?.savedAt ?? 0);

export function getUsername() { return username(); }
export function getSavedAt() { return savedAt(); }

export function saveProfile(name: string) {
  const now = Date.now();
  setUsernameSignal(name);
  setSavedAt(now);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ username: name, savedAt: now }));
}

export function clearProfile() {
  setUsernameSignal('');
  setSavedAt(0);
  localStorage.removeItem(STORAGE_KEY);
}
```

#### B) Save Scenario Button: `src/components/costs/SaveScenario.tsx` (NEW FILE)

A floating save bar or inline component placed at the bottom of the Cost Analysis page.

**Behavior:**
1. A "Save Scenario" button in a fixed bar or at the bottom of the page
2. When clicked: if no username is set, show a modal/inline prompt asking for a username
3. After username is entered: save all current values to localStorage and display a confirmation
4. Show "Saved by {username} — {relative time}" badge at the top of the page when a saved scenario exists
5. A "Clear Saved" button to reset everything to defaults

**Username prompt** (inline, not a modal):
```
┌──────────────────────────────────────────────────────────────────────┐
│  Before saving, enter a name so others know who configured this:    │
│  ┌──────────────────────────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Enter your name...           │  │ Save     │  │ Cancel   │      │
│  └──────────────────────────────┘  └──────────┘  └──────────┘      │
└──────────────────────────────────────────────────────────────────────┘
```

**Save action** triggers:
- `saveProfile(username)` from settingsStore
- All existing localStorage keys (`enzo-adjusted-team`, `enzo-adjusted-economics`, `enzo-projection-inputs`) are already being saved by their respective components — no additional work needed
- The save button just captures the username and timestamp

**Saved state display** at the top of CostAnalysis, below the header:
```tsx
<Show when={getUsername()}>
  <div class="bg-panel border border-acid/20 px-4 py-2 mt-4 flex items-center gap-3 font-mono text-[11px]">
    <span class="text-acid">Scenario by {getUsername()}</span>
    <span class="text-ink-faint">{relativeTime(getSavedAt())}</span>
    <button class="ml-auto text-ink-faint hover:text-ink" onClick={handleClearAll}>
      Clear saved
    </button>
  </div>
</Show>
```

**"Clear saved" action** must:
1. `clearProfile()` — remove username
2. Reset team: `resetTeamDefaults()`
3. Clear economics: `localStorage.removeItem('enzo-adjusted-economics')`
4. Clear projections: `localStorage.removeItem('enzo-projection-inputs')`
5. Reload the page (simplest way to reset all component states)

### Files to Create

- `src/data/settingsStore.ts`
- `src/components/costs/SaveScenario.tsx`

### Files to Change

#### `src/pages/CostAnalysis.tsx`

- Import `SaveScenario` and `getUsername`, `getSavedAt` from settingsStore
- Add the saved scenario badge below the header
- Add `<SaveScenario />` at the bottom of the page (after the last section)

---

## Change 5: Add Date Labels to Trend Chart

### Problem

The SVG trend chart in `FinancialProjections.tsx` shows 3 lines but has no X-axis labels — users can't tell which month is which.

### Fix

#### `src/components/costs/FinancialProjections.tsx`

Add X-axis date labels to the SVG chart. Compute dates starting from the current month:

```ts
const startDate = new Date();
const monthLabels = Array.from({ length: 24 }, (_, i) => {
  const d = new Date(startDate);
  d.setMonth(d.getMonth() + i);
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
});
```

In the SVG, after the three `<path>` elements, add tick marks and labels for every 3rd month (M0, M3, M6, M9, M12, M15, M18, M21, M23):

```tsx
{[0, 3, 6, 9, 12, 15, 18, 21, 23].map((i) => {
  const x = chartPadding + ((chartWidth - 2 * chartPadding) / 23) * i;
  return (
    <>
      <line x1={x} y1={chartHeight - chartPadding} x2={x} y2={chartHeight - chartPadding + 6} stroke="var(--color-line-bright)" stroke-width="1" />
      <text x={x} y={chartHeight + 14} text-anchor="middle" fill="var(--color-ink-faint)" font-size="9" font-family="var(--font-mono)">
        {monthLabels[i]}
      </text>
    </>
  );
})}
```

Increase the SVG viewBox height to accommodate labels:
- Current: `viewBox={`0 0 ${chartWidth} ${chartHeight}`}` with `chartHeight = 200`
- New: `viewBox={`0 0 ${chartWidth} ${chartHeight + 24}`}` — add 24px below for labels

Also add a subtle zero line if the Y range spans negative to positive:
```tsx
{/* Zero line */}
<Show when={chartData().zeroY !== null}>
  <line x1={chartPadding} y1={chartData().zeroY} x2={chartWidth - chartPadding} y2={chartData().zeroY} stroke="var(--color-line)" stroke-width="1" stroke-dasharray="4,4" />
</Show>
```

Update the `chartData` memo to compute `zeroY`:
```ts
const zeroY = (minVal <= 0 && maxVal >= 0) ? toY(0) : null;
return { mrrPath, expPath, cashPath, zeroY };
```

Also update the month-by-month table's Month column to show the date alongside M{n}:

Current:
```tsx
<td class="py-2 pr-3 text-ink-dim sticky left-0 bg-bg z-10">
  M{row.month}
</td>
```

New:
```tsx
<td class="py-2 pr-3 text-ink-dim sticky left-0 bg-bg z-10">
  M{row.month} <span class="text-ink-faint text-[10px]">{monthLabels[row.month]}</span>
</td>
```

---

## Files Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/costs/TeamDiagram.tsx` | MODIFY | Fix badge contrast, show salary + loaded cost, use `text-ink-dim` for tax button |
| `src/data/costs.ts` | MODIFY | CTO status: 'future' → 'active', remove startMonth |
| `src/data/settingsStore.ts` | CREATE | Username + saved timestamp store |
| `src/components/costs/SaveScenario.tsx` | CREATE | Save/clear scenario component with username prompt |
| `src/pages/CostAnalysis.tsx` | MODIFY | Add saved scenario badge, SaveScenario component |
| `src/components/costs/FinancialProjections.tsx` | MODIFY | Add date X-axis labels, zero line, dates in table |

---

## Implementation Order & Parallelization

### Phase 1 (parallel, 2 agents)

**Agent A — Team fixes (Changes 1, 2, 3):**
- `src/data/costs.ts` — CTO → active
- `src/components/costs/TeamDiagram.tsx` — contrast fixes, dual salary display

**Agent B — Chart dates (Change 5):**
- `src/components/costs/FinancialProjections.tsx` — date labels, zero line, table dates

### Phase 2 (sequential, after merge)

**Agent C — Save scenario system (Change 4):**
- `src/data/settingsStore.ts` — create
- `src/components/costs/SaveScenario.tsx` — create
- `src/pages/CostAnalysis.tsx` — wire in

Agent C depends on Phase 1 because CostAnalysis.tsx is modified by the merge resolution, and the save system needs to know the final set of localStorage keys.
