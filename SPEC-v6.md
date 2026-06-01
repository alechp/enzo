# Enzo — v6 Spec: Port, Comp Simplification, Always-Visible Sliders, Row Selection

## Overview

Five changes: fix dev server port conflict, simplify the compensation section (remove equity slider, add CEO/BD salary sliders), redesign the editable input component to always show sliders with text-editable values, increase step sizes for discrete values, and add row highlighting to the projection table.

---

## Change 1: Fix Dev Server Port

### Problem

Port 5173 (Vite default) conflicts with other local dev servers. The port sometimes auto-increments to 5174, 5175, etc., which is confusing.

### Fix

#### `vite.config.ts`

```ts
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [solid(), tailwindcss()],
  server: {
    port: 5333,
    strictPort: true,
  },
});
```

Port `5333` — unlikely to conflict. `strictPort: true` means Vite will error instead of auto-incrementing if the port is taken.

---

## Change 2: Simplify Compensation Section

### Problem

The CompSlider currently has:
- A CTO base/equity tradeoff slider ($240k–$360k base ↔ 4.0%–2.0% equity)
- Two large KPI cards (CTO Base Salary + CTO Equity Grant)
- A summary row of 3 cards (CEO $0, CTO slider-controlled, BD $100k)
- The slider syncs CTO salary to teamStore

The equity negotiation is being removed. The section should just show salary sliders for all three initial hires (CEO, CTO, BD) — no equity discussion.

### What to Build

Replace CompSlider with a simpler component that shows 3 salary cards, each with an always-visible slider (using the new `SliderInput` component from Change 3).

#### `src/components/costs/CompSlider.tsx` — Complete Rewrite

```tsx
import { roles, updateRole } from '../../data/teamStore';
import { computeEmployerTaxes } from '../../data/costs';
import { formatCurrency } from '../../lib/format';
import SliderInput from './SliderInput';

export default function CompSlider() {
  const ceoIdx = () => roles.findIndex((r) => r.role === 'CEO');
  const ctoIdx = () => roles.findIndex((r) => r.role === 'CTO');
  const bdIdx = () => roles.findIndex((r) => r.role === 'Business Development');

  const cards = [
    { label: 'CEO', sublabel: 'Deferred comp — set to $0 if unpaid', idx: ceoIdx, min: 0, max: 300000, step: 5000 },
    { label: 'CTO', sublabel: 'Technical co-founder', idx: ctoIdx, min: 100000, max: 400000, step: 5000 },
    { label: 'Business Development', sublabel: 'First sales hire', idx: bdIdx, min: 50000, max: 200000, step: 5000 },
  ];

  return (
    <div class="mt-6">
      <div class="font-mono text-[10.5px] text-ink-faint mb-6" style="letter-spacing:.06em">
        Set base salaries for the three initial hires. Fully loaded costs (with employer taxes) update automatically in the Team section below.
      </div>

      <div class="grid grid-cols-3 gap-6 max-[880px]:grid-cols-1">
        {cards.map((card) => {
          const idx = card.idx();
          if (idx < 0) return null;
          const role = roles[idx];
          const taxes = () => computeEmployerTaxes(role.annualSalary);

          return (
            <div class="bg-panel border border-line p-5">
              <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-1">
                {card.label}
              </div>
              <div class="font-mono text-[9px] text-ink-faint mb-4">{card.sublabel}</div>

              <div class="font-display font-black text-[2rem] text-acid leading-none mb-1">
                {formatCurrency(role.annualSalary, true)}<span class="text-[.8rem] text-ink-faint font-mono font-normal">/yr</span>
              </div>
              <div class="font-mono text-[10px] text-ink-faint mb-4">
                {formatCurrency(taxes().fullyLoaded, true)}/yr fully loaded
              </div>

              <SliderInput
                value={role.annualSalary}
                onChange={(v) => updateRole(idx, 'annualSalary', v)}
                min={card.min}
                max={card.max}
                step={card.step}
                format={(v) => formatCurrency(v, true)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### Also Remove

#### `src/pages/CostAnalysis.tsx`

- Remove the Equity & Acceleration section (Section 02) entirely — both the `<section>` block and the `EquityBreakdown` import
- Renumber: 01 Comp, 02 Team, 03 Unit Economics, 04 Financial Projections

#### `src/components/costs/EquityBreakdown.tsx`

- Delete this file entirely (no longer referenced)

---

## Change 3: New `SliderInput` Component — Always-Visible Slider + Text Editing

### Problem

The current `EditableValue` component requires clicking to reveal a hidden slider. Users want:
1. Sliders always visible
2. Click the displayed number to type a value directly
3. When typing numbers, don't enforce min/max on every keystroke — only on Enter/blur (otherwise erasing to empty is impossible)

### What to Build

#### `src/components/costs/SliderInput.tsx` (NEW FILE)

A component that shows:
- The formatted value as a clickable text (clicking switches to a text input)
- A range slider always visible below the text
- Text input: on Enter or blur, parse the number, clamp to min/max, call onChange. On Escape, revert. Allow empty intermediate state while typing.

```tsx
import { createSignal, Show } from 'solid-js';

interface SliderInputProps {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  parse?: (text: string) => number;
}

export default function SliderInput(props: SliderInputProps) {
  const [editing, setEditing] = createSignal(false);
  const [textValue, setTextValue] = createSignal('');

  const defaultParse = (text: string): number => {
    const stripped = text.replace(/[^0-9.\-]/g, '');
    return parseFloat(stripped) || 0;
  };

  const parse = () => props.parse ?? defaultParse;

  const startEditing = () => {
    setTextValue(String(props.value));
    setEditing(true);
  };

  const commitEdit = () => {
    const parsed = parse()(textValue());
    const clamped = Math.min(Math.max(parsed, props.min), props.max);
    const stepped = Math.round(clamped / props.step) * props.step;
    props.onChange(stepped);
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <div>
      {/* Clickable value / text input */}
      <Show
        when={editing()}
        fallback={
          <button
            class="font-mono text-[.86rem] text-ink bg-transparent border-none p-0 text-left editable-value-trigger"
            onClick={startEditing}
          >
            {props.format(props.value)}
          </button>
        }
      >
        <input
          type="text"
          class="font-mono text-[.86rem] text-ink bg-panel border border-acid px-2 py-0.5 outline-none w-[120px]"
          value={textValue()}
          onInput={(e) => setTextValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitEdit}
          autofocus
        />
      </Show>

      {/* Always-visible slider */}
      <input
        type="range"
        class="editable-slider w-full mt-2"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onInput={(e) => props.onChange(parseFloat(e.currentTarget.value))}
      />
    </div>
  );
}
```

**Key UX detail**: The text input does NOT enforce min/max on every keystroke. Users can type freely (including clearing to empty). Validation only happens on Enter or blur. This avoids the "can't erase to retype" anti-pattern.

### Migrate Existing `EditableValue` Usage

`EditableValue` stays for inline values in tables where a slider would be too large (video cost cells, headcount). But `SliderInput` replaces it everywhere a slider should be always visible:

- `FinancialProjections.tsx` — all 7 input cards switch from `EditableValue` to `SliderInput`
- `CompSlider.tsx` — already uses `SliderInput` in the rewrite above

---

## Change 4: Higher Step Sizes for Discrete Values

### Problem

With `step={10}` on "Starting Customers" (max 1000), it takes 100 slider positions to traverse the range. For "Seed Funding" (step $50k, max $5M), that's also 100 positions. The user sees a "slow, gradual climb." Discrete count values need bigger jumps.

### Fix

Update step sizes and ranges in `FinancialProjections.tsx` `makeDefaults` usage and the input cards:

| Input | Current step | New step | Current max | New max | Default |
|-------|-------------|----------|------------|---------|---------|
| Starting Customers | 10 | 50 | 1,000 | 5,000 | 50 |
| ARPU | 1 | 5 | 299 | 499 | 99 |
| Growth Rate | 1 | 1 | 50 | 50 | 15 |
| Churn Rate | 0.5 | 0.5 | 20 | 20 | 5 |
| Gross Margin | 1 | 1 | 95 | 95 | 82 |
| CAC | 10 | 25 | 500 | 1000 | 160 |
| Seed Funding | 50,000 | 100,000 | 5,000,000 | 10,000,000 | 500,000 |

The key changes: Starting Customers jumps by 50 (not 10), ARPU by $5 (not $1), CAC by $25 (not $10), Seed Funding by $100k (not $50k). Ranges also expand.

---

## Change 5: Row Selection in Month-by-Month Table

### Problem

The 24-row projection table is dense. Users want to click a row to highlight it for focus/discussion.

### Fix

#### `src/components/costs/FinancialProjections.tsx`

Add a `selectedMonth` signal:

```ts
const [selectedMonth, setSelectedMonth] = createSignal<number | null>(null);
```

On each `<tr>`, add:
```tsx
onClick={() => setSelectedMonth(selectedMonth() === row.month ? null : row.month)}
style={{ cursor: 'pointer' }}
classList={{
  ...existing classList,
  'ring-1 ring-acid bg-acid/5': selectedMonth() === row.month,
}}
```

Clicking a row highlights it with a subtle acid ring + tint. Clicking again deselects.

The sticky month column should also get the highlight background when selected, overriding its `bg-bg`:

```tsx
<td
  class="py-2 pr-3 text-ink-dim sticky left-0 z-10"
  classList={{ 'bg-bg': selectedMonth() !== row.month, 'bg-acid/5': selectedMonth() === row.month }}
>
```

---

## Files Summary

| File | Action | Description |
|------|--------|-------------|
| `vite.config.ts` | MODIFY | Port 5333, strictPort |
| `src/components/costs/SliderInput.tsx` | CREATE | Always-visible slider + click-to-edit text input |
| `src/components/costs/CompSlider.tsx` | REWRITE | 3 salary cards (CEO/CTO/BD) with SliderInput, no equity |
| `src/components/costs/EquityBreakdown.tsx` | DELETE | No longer needed |
| `src/pages/CostAnalysis.tsx` | MODIFY | Remove equity section, renumber |
| `src/components/costs/FinancialProjections.tsx` | MODIFY | SliderInput for all inputs, bigger step sizes, row selection |

---

## Implementation Order & Parallelization

### Phase 1 (parallel, 3 agents)

**Agent A — Port + SliderInput (Changes 1, 3):**
- `vite.config.ts` — port fix
- `src/components/costs/SliderInput.tsx` — create new component

No overlap with other agents — these are new/config files only.

**Agent B — Comp simplification (Change 2):**
- `src/components/costs/CompSlider.tsx` — rewrite (imports SliderInput but doesn't create it)
- `src/components/costs/EquityBreakdown.tsx` — delete
- `src/pages/CostAnalysis.tsx` — remove equity section, renumber

Note: Agent B creates the CompSlider rewrite that imports `SliderInput`. Since Agent A creates SliderInput in the same phase, the worktree won't have it yet — but the import will resolve after merge. The build in Agent B's worktree will fail on the import; that's acceptable since both merge before verification.

**Agent C — Projections (Changes 4, 5):**
- `src/components/costs/FinancialProjections.tsx` — swap EditableValue → SliderInput, bigger steps, row selection

Same import caveat as Agent B — SliderInput won't exist in the worktree.

### Post-merge

Build verification after all 3 branches merge. SliderInput will exist, all imports resolve.
