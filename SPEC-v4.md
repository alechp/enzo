# Enzo Presentation Site — v4 Spec: Tax-Adjusted Team Model & Financial Projections

## Overview

Major restructuring of the Cost Analysis page: realistic US employer tax burden on all salaries, simplified team composition (CEO + BD at launch, future hires planned), removal of milestone-based comp, and a new 24-month financial projection sheet with editable growth/churn/revenue modeling.

---

## Change 1: Remove Milestone-Based Compensation

### What to Remove

The milestone-based comp system (slider B, summary row, milestone track section) is too complex for this stage. Strip it out entirely.

### Files to Delete

- `src/components/costs/MilestoneTrack.tsx` — delete the file

### Files to Change

#### `src/data/costs.ts`

Remove:
- `CompTier` interface and `compTiers` array
- `getMilestoneBump()` function
- `getTotalBase()` function
- `Scenario` interface and `scenarios` array (the scaling scenarios section is being replaced by the new 24-month projection sheet)

Keep:
- `getInitialComp()` — still used for the CEO base/equity slider
- `TeamRole`, `teamRoles`, `VideoCost`, `videoCosts`, `FixedCost`, `fixedCosts` (all updated in Change 2)

#### `src/components/costs/CompSlider.tsx`

Complete simplification. Remove:
- Slider B (Customer Milestone Bonus) — the entire block (lines 62-89)
- Summary row with Base + Bonus = Effective expression (lines 91-123)
- All milestone-related imports and signals (`getMilestoneBump`, `getTotalBase`, `customers`, `milestoneBump`, `effectiveBase`)

Keep:
- Slider A (Initial Package Selection) with the two KPI cards (Base Salary + Equity Grant)
- The range labels ($240k/4% ↔ $360k/2%)

After removal, the Equity Grant card below the summary should remain:

```tsx
{/* Equity — below slider */}
<div class="mt-6">
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

#### `src/pages/CostAnalysis.tsx`

- Remove `MilestoneTrack` import and Section 03 (Customer Milestones)
- Remove Section 06 (Scaling Scenarios) — replaced by the new Financial Projections sheet (Change 3)
- Remove `scenarios` import
- Renumber sections: 01 Comp, 02 Equity, 03 Team, 04 Unit Economics, 05 Financial Projections

---

## Change 2: Tax-Adjusted Team Model

### US Employer Tax Burden

Every salary must show the **fully loaded cost** — base salary plus all mandatory US employer taxes and typical benefits. This is the real cost to the company.

#### Tax Rates (2026 US employer-side)

| Component | Rate | Cap / Notes |
|-----------|------|-------------|
| Social Security (OASDI) | 6.2% | On first $168,600 of wages (2025 cap; assume ~$170k for 2026) |
| Medicare | 1.45% | No cap |
| FUTA (Federal Unemployment) | 0.6% | On first $7,000 of wages (effectively ~$42/yr per employee) |
| SUTA (State Unemployment) | ~2.5% | On first ~$12,000 of wages (varies by state; use CA average) |
| Workers' Comp Insurance | ~0.5% | Of total wages (low-risk office/tech) |
| Health Insurance | flat | ~$600/mo per employee ($7,200/yr) — employer portion of group plan |
| 401(k) match | 0% | Not offered at this stage |

**Simplified all-in multiplier** for a $100k salary:

```
Social Security: $100,000 × 6.2% = $6,200  (capped at ~$10,540 for wages above $170k)
Medicare:         $100,000 × 1.45% = $1,450
FUTA:             $7,000 × 0.6% = $42
SUTA:             $12,000 × 2.5% = $300
Workers' Comp:    $100,000 × 0.5% = $500
Health Insurance: $7,200 (flat)
─────────────────────────────────────────
Total tax/benefit burden: $15,692
Fully loaded cost: $115,692
Effective multiplier: ~1.157x
```

For a $200k salary:
```
Social Security: $170,000 × 6.2% = $10,540  (capped)
Medicare:         $200,000 × 1.45% = $2,900
FUTA:             $42
SUTA:             $300
Workers' Comp:    $200,000 × 0.5% = $1,000
Health Insurance: $7,200
─────────────────────────────────────────
Total burden: $21,982
Fully loaded: $221,982
Multiplier: ~1.11x
```

The multiplier is NOT a flat percentage — it varies by salary because SS has a cap and health insurance is flat. The system must compute it per-employee.

#### Tax Computation Function

Add to `src/data/costs.ts`:

```ts
export interface EmployerTaxBreakdown {
  socialSecurity: number;
  medicare: number;
  futa: number;
  suta: number;
  workersComp: number;
  healthInsurance: number;
  total: number;
  fullyLoaded: number;
}

const TAX_CONSTANTS = {
  socialSecurityRate: 0.062,
  socialSecurityCap: 170000,
  medicareRate: 0.0145,
  futaRate: 0.006,
  futaWageCap: 7000,
  sutaRate: 0.025,
  sutaWageCap: 12000,
  workersCompRate: 0.005,
  healthInsuranceMonthly: 600,
};

export function computeEmployerTaxes(annualSalary: number): EmployerTaxBreakdown {
  const ss = Math.min(annualSalary, TAX_CONSTANTS.socialSecurityCap) * TAX_CONSTANTS.socialSecurityRate;
  const medicare = annualSalary * TAX_CONSTANTS.medicareRate;
  const futa = Math.min(annualSalary, TAX_CONSTANTS.futaWageCap) * TAX_CONSTANTS.futaRate;
  const suta = Math.min(annualSalary, TAX_CONSTANTS.sutaWageCap) * TAX_CONSTANTS.sutaRate;
  const wc = annualSalary * TAX_CONSTANTS.workersCompRate;
  const health = TAX_CONSTANTS.healthInsuranceMonthly * 12;
  const total = ss + medicare + futa + suta + wc + health;
  return {
    socialSecurity: ss,
    medicare,
    futa,
    suta,
    workersComp: wc,
    healthInsurance: health,
    total,
    fullyLoaded: annualSalary + total,
  };
}

export { TAX_CONSTANTS };
```

### New Team Composition

Replace the current `teamRoles` with a model that distinguishes between active hires and planned future positions.

```ts
export interface TeamRole {
  role: string;
  headcount: number;
  annualSalary: number;  // base salary per person (CHANGED from monthlyCost)
  color: string;
  status: 'active' | 'future';
  startMonth?: number;   // month 0-23 when this role starts (for projection sheet)
}

export const teamRoles: TeamRole[] = [
  // Active at launch
  { role: 'CEO', headcount: 1, annualSalary: 0, color: 'var(--color-acid)', status: 'active' },
  { role: 'Business Development', headcount: 1, annualSalary: 100000, color: 'var(--color-wrapper)', status: 'active' },

  // Future positions (grayed out, not counted in current burn)
  { role: 'CTO', headcount: 1, annualSalary: 190000, color: 'var(--color-frontier)', status: 'future', startMonth: 3 },
  { role: 'ML / Video Pipeline', headcount: 1, annualSalary: 175000, color: 'var(--color-ancillary)', status: 'future', startMonth: 6 },
  { role: 'Technical PM', headcount: 1, annualSalary: 145000, color: 'var(--color-public)', status: 'future', startMonth: 6 },
  { role: 'Customer Support', headcount: 1, annualSalary: 55000, color: 'var(--color-up)', status: 'future', startMonth: 9 },
];
```

**Salary sources (US median, 2025 data):**

| Role | Median Base | Source |
|------|------------|--------|
| CEO | User-editable (default $0 — deferred comp) | — |
| Business Development | $100,000 | User-specified |
| CTO | $190,000 | Levels.fyi / Glassdoor median for startup CTO |
| ML Engineer | $175,000 | Levels.fyi median ML Eng |
| Technical PM | $145,000 | Glassdoor median Technical Program Manager |
| Customer Support | $55,000 | BLS median Customer Service Rep + tech uplift |

**CEO salary is special**: it defaults to $0 (founders often defer salary early on) but is editable via a dedicated text input or slider at the top of the TeamDiagram, with a label like "CEO Salary (editable)". This lets the user model deferred vs. paid scenarios.

**Leadership = CEO + CTO**: There is no separate "Leadership" category. CEO and CTO are listed as individual roles.

### Updated TeamDiagram Component

#### `src/components/costs/TeamDiagram.tsx`

Major changes:
1. Salary is now annual, not monthly — display both `annualSalary` and the computed `fullyLoaded` cost
2. Each role row shows: Role name, headcount, annual salary, tax burden, fully loaded cost
3. Future roles are visually distinct: dimmed (`opacity-60`), with a "Planned — Month X" badge instead of headcount
4. CEO row has an editable salary input (slider or inline EditableValue, range $0–$300k, step $5k)
5. Summary bar shows:
   - Active headcount / Total planned headcount
   - Monthly burn (active only): sum of `fullyLoaded / 12` for active roles
   - Annual burn (active only)
   - Monthly burn (all planned): what it'll be when future hires join

Each role row layout:

```
┌──────────────────────────────────────────────────────────────────────┐
│ CEO (editable salary)          1 person    $0/yr → $7k loaded/yr   │
│                                            $0/mo fully loaded       │
├──────────────────────────────────────────────────────────────────────┤
│ Business Development           1 person    $100k/yr → $116k loaded │
│                                            $9.6k/mo fully loaded    │
├──────────────────────────────────────────────────────────────────────┤
│ CTO                           Planned M3   $190k/yr → $212k loaded │
│   (future — dimmed)                        $17.7k/mo fully loaded   │
├──────────────────────────────────────────────────────────────────────┤
│ ...                                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

Tax breakdown expandable: clicking a "tax detail" toggle on any row should show the breakdown (SS, Medicare, FUTA, SUTA, WC, Health) — use a `<Show>` conditional with a per-row `expanded` signal.

### Updated Fixed Costs

#### `src/data/costs.ts`

`fixedCosts` should be recalculated. The "Team" line item is now derived from active roles' fully loaded costs, not a hardcoded number. Remove it from `fixedCosts` (it's computed from `teamRoles`).

```ts
export const fixedCosts: FixedCost[] = [
  { category: 'Infrastructure (non-COGS)', monthly: 15000, annual: 180000 },
  { category: 'Tools & SaaS', monthly: 5000, annual: 60000 },
  { category: 'Legal / compliance', monthly: 3000, annual: 36000 },
  { category: 'Office / misc', monthly: 2000, annual: 24000 },
];
```

Note: reduced from previous values since we're now a 2-person team at launch.

The UnitEconomics component should compute total fixed costs as: `sum(fixedCosts.monthly) + sum(activeRoles.fullyLoaded / 12)`. This means UnitEconomics needs access to the team data — pass it as a prop or use a shared store.

---

## Change 3: 24-Month Financial Projection Sheet

### What to Build

A new component `FinancialProjections.tsx` that replaces the Scaling Scenarios section. This is the most complex new feature — a full month-by-month P&L model for months 0–23.

### Editable Inputs (at the top of the section)

| Input | Default | Range | Step | Notes |
|-------|---------|-------|------|-------|
| Starting customers (M0) | 0 | 0–1,000 | 10 | Customers at launch |
| Monthly price (ARPU) | $99 | $29–$299 | $1 | Revenue per customer per month |
| Monthly growth rate | 15% | 0–50% | 1% | New customer acquisition rate (compounds) |
| Monthly churn rate | 5% | 0–20% | 0.5% | Customer loss rate |
| Gross margin | 82% | 50–95% | 1% | After COGS |
| CAC | $160 | $50–$500 | $10 | Cost to acquire one customer |
| Seed funding | $500,000 | $0–$5M | $50k | Initial cash on hand |

### Projection Formula (per month)

```ts
interface MonthRow {
  month: number;             // 0–23
  newCustomers: number;      // month 0: starting, then: prev.endCustomers * growthRate
  churnedCustomers: number;  // prev.endCustomers * churnRate
  endCustomers: number;      // prev.endCustomers + new - churned
  mrr: number;               // endCustomers * arpu
  grossProfit: number;       // mrr * grossMargin
  cacSpend: number;          // newCustomers * cac
  teamCost: number;          // sum of fullyLoaded/12 for roles active in this month
  fixedCosts: number;        // sum of non-team fixed costs
  totalExpenses: number;     // teamCost + fixedCosts + cacSpend
  netIncome: number;         // grossProfit - totalExpenses
  cashBalance: number;       // prev.cashBalance + netIncome
}
```

**Team cost varies by month**: roles with `status: 'future'` and `startMonth <= currentMonth` become active that month. The projection table should show team cost stepping up as new hires join.

### Display

#### A) Input Controls

A grid of editable values at the top, using the existing `EditableValue` component:

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Starting     │ │ ARPU        │ │ Growth Rate │ │ Churn Rate  │
│ Customers    │ │ $99/mo      │ │ 15%         │ │ 5%          │
│ 0            │ │             │ │             │ │             │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Gross Margin│ │ CAC         │ │ Seed Funding│
│ 82%         │ │ $160        │ │ $500k       │
└─────────────┘ └─────────────┘ └─────────────┘
```

#### B) Summary KPIs (derived, not editable)

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Break-even   │ │ M24 MRR      │ │ M24 Customers│ │ Cash at M24  │
│ Month        │ │ (projected)  │ │ (projected)  │ │ (projected)  │
│ Month 14     │ │ $156k        │ │ 1,576        │ │ $234k        │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

Break-even month = first month where `netIncome >= 0`. If never reached, show "N/A".

#### C) Month-by-Month Table

A scrollable table with 24 rows (M0–M23). Columns:

| Column | Format |
|--------|--------|
| Month | M0, M1, ... M23 |
| Customers | integer |
| New | +integer |
| Churned | -integer |
| MRR | currency |
| Gross Profit | currency |
| Team Cost | currency (steps up when future hires start) |
| Fixed Costs | currency |
| CAC Spend | currency |
| Net Income | currency (green if positive, red if negative) |
| Cash Balance | currency (green if positive, red if negative) |

**Conditional row highlighting**:
- Months where a new hire starts: subtle border-left or background tint
- The break-even month: acid green left border
- Negative cash balance months: red-tinted background

#### D) Chart Visualization (optional but recommended)

A simple line chart or area chart above the table showing:
- MRR (green line)
- Total expenses (red line)
- Cash balance (blue area)

This could use CSS-only bar representation (like the existing `BarChart` component pattern) or a simple SVG line chart. No external charting library — keep it lightweight.

### Files to Create

- `src/components/costs/FinancialProjections.tsx` — the full projection sheet

### Files to Change

- `src/pages/CostAnalysis.tsx` — replace Scaling Scenarios section with FinancialProjections
- Import the new component and add Section 05

---

## Change 4: Shared State Between Team and Projections

### Problem

The team data (roles, salaries, tax-loaded costs) is needed by three components: `TeamDiagram`, `UnitEconomics`, and `FinancialProjections`. Currently TeamDiagram manages its own store. This needs to be lifted.

### Solution

Create a shared team store in `src/data/teamStore.ts`:

```ts
import { createStore, reconcile } from 'solid-js/store';
import { teamRoles, computeEmployerTaxes, type TeamRole } from './costs';

const STORAGE_KEY = 'enzo-adjusted-team';

function loadSaved(): TeamRole[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

const defaults = teamRoles.map((r) => ({ ...r }));
const [roles, setRoles] = createStore<TeamRole[]>(defaults.map((r) => ({ ...r })));

// Load saved on module init
const saved = loadSaved();
if (saved && saved.length === defaults.length) {
  setRoles(reconcile(saved));
}

export function updateRole(index: number, field: keyof TeamRole, value: any) {
  setRoles(index, field as any, value);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...roles]));
}

export function resetTeamDefaults() {
  setRoles(reconcile(defaults.map((r) => ({ ...r }))));
  localStorage.removeItem(STORAGE_KEY);
}

export function activeRoles() {
  return roles.filter((r) => r.status === 'active');
}

export function futureRoles() {
  return roles.filter((r) => r.status === 'future');
}

export function activeMonthlyBurn() {
  return activeRoles().reduce((sum, r) => {
    const loaded = computeEmployerTaxes(r.annualSalary).fullyLoaded;
    return sum + (loaded * r.headcount) / 12;
  }, 0);
}

export function teamCostAtMonth(month: number) {
  return roles
    .filter((r) => r.status === 'active' || (r.status === 'future' && (r.startMonth ?? 99) <= month))
    .reduce((sum, r) => {
      const loaded = computeEmployerTaxes(r.annualSalary).fullyLoaded;
      return sum + (loaded * r.headcount) / 12;
    }, 0);
}

export { roles, defaults };
```

### Files to Change

- `src/components/costs/TeamDiagram.tsx` — import from `teamStore` instead of managing its own store
- `src/components/costs/UnitEconomics.tsx` — import `activeMonthlyBurn` from `teamStore` to replace the static team fixed cost line
- `src/components/costs/FinancialProjections.tsx` — import `teamCostAtMonth` from `teamStore`

---

## Files Summary

| File | Action | Description |
|------|--------|-------------|
| `src/data/costs.ts` | MODIFY | Remove milestone comp, add tax computation, update team roles + fixed costs |
| `src/data/teamStore.ts` | CREATE | Shared reactive team store with tax-loaded cost helpers |
| `src/components/costs/CompSlider.tsx` | MODIFY | Remove milestone slider + summary row, keep package selection only |
| `src/components/costs/MilestoneTrack.tsx` | DELETE | No longer needed |
| `src/components/costs/TeamDiagram.tsx` | MODIFY | Rewrite: annual salaries, tax breakdown, future roles, CEO editable salary |
| `src/components/costs/UnitEconomics.tsx` | MODIFY | Team cost from shared store instead of static fixedCosts line |
| `src/components/costs/FinancialProjections.tsx` | CREATE | 24-month P&L projection sheet with editable inputs |
| `src/pages/CostAnalysis.tsx` | MODIFY | Remove milestones + scenarios sections, add projections, renumber |

---

## Implementation Order & Parallelization

### Phase 1 (parallel, 2 agents)

**Agent A — Data layer + comp simplification:**
- `src/data/costs.ts` — all data model changes (remove milestone comp, add tax functions, update team + fixed costs)
- `src/data/teamStore.ts` — create shared store
- `src/components/costs/CompSlider.tsx` — remove milestone slider
- Delete `src/components/costs/MilestoneTrack.tsx`

**Agent B — Financial Projections (new file, no overlap):**
- `src/components/costs/FinancialProjections.tsx` — create entire component
- This agent needs to know the data interfaces from `costs.ts` and `teamStore.ts` but doesn't modify them

### Phase 2 (sequential, after merge)

**Agent C — Wire everything together:**
- `src/components/costs/TeamDiagram.tsx` — rewrite to use teamStore, show tax breakdown
- `src/components/costs/UnitEconomics.tsx` — integrate team cost from teamStore
- `src/pages/CostAnalysis.tsx` — remove old sections, add new ones, renumber
