# Enzo Presentation Site — Implementation Spec

## Overview

A two-page presentation site for Enzo.ai built with **SolidJS + Tailwind CSS + Vite**. The site presents investor/stakeholder-facing content: a market analysis of the AI video generation space, and a cost analysis page showing compensation structure, team costs, and unit economics at scale.

---

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | SolidJS | Fine-grained reactivity, no virtual DOM |
| Styling | Tailwind CSS v4 | Extended with custom design tokens matching the source theme |
| Build | Vite 6 | SolidJS plugin (`vite-plugin-solid`) |
| Routing | `@solidjs/router` | File-based optional; two static routes |
| Charts | Custom SVG components | Candlestick + bar charts built in SolidJS (no chart lib) |
| Fonts | Google Fonts | Fraunces, IBM Plex Mono, Archivo |
| Deploy | Static (Vercel/Cloudflare Pages) | `vite build` → `dist/` |

---

## Design System

### Color Tokens (Tailwind Extension)

```
--bg:          #0a0a0c
--panel:       #111114
--panel-2:     #16161b
--ink:         #f2f0ea
--ink-dim:     #9d9a93
--ink-faint:   #5f5d58
--line:        #26262d
--line-bright: #36363f
--acid:        #d6ff3f
--frontier:    #ff5e3a
--wrapper:     #3aa0ff
--ancillary:   #b18cff
--public:      #ffd166
--grid-c:      rgba(255,255,255,0.022)
--up:          #36d1a4
--down:        #ff5e3a
--crypto:      #f7931a
--ugc:         #36d1a4
```

### Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display / Numbers | Fraunces (opsz 9–144) | 400, 500, 600, 900 | h1, h2, KPI values, chart numbers |
| Mono / Labels | IBM Plex Mono | 400, 500, 600 | Section numbers, tags, axis labels, meta |
| Body / UI | Archivo | 400, 500, 600, 700, 800 | Prose, table cells, navigation |

### Spacing & Layout

- Max content width: `1280px`
- Horizontal padding: `28px` (mobile), up to `28px` (desktop — no change, content is max-width constrained)
- Section vertical padding: `54px`
- Grid gap standard: `34px` (two-col), `1px` with `bg-line` trick for card grids
- Border: `1px solid var(--line)` between sections

### Background

Body has a subtle grid overlay:
```css
background-image:
  linear-gradient(var(--grid-c) 1px, transparent 1px),
  linear-gradient(90deg, var(--grid-c) 1px, transparent 1px);
background-size: 54px 54px;
```

---

## Project Structure

```
enzo/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── src/
│   ├── index.tsx                  # Entry point, mounts App
│   ├── App.tsx                    # Router setup
│   ├── styles/
│   │   └── global.css            # Tailwind directives + custom props + grid bg
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Shell.tsx         # Wrap + nav + footer
│   │   │   ├── Nav.tsx           # Top navigation between pages
│   │   │   └── Footer.tsx        # Sources + disclaimer
│   │   ├── market/
│   │   │   ├── Header.tsx        # Kicker + h1 + lede + meta-row
│   │   │   ├── KpiStrip.tsx      # 4-up KPI grid (reusable)
│   │   │   ├── SectionHead.tsx   # Sec-num + title + subtitle
│   │   │   ├── BarChart.tsx      # Animated horizontal bar chart
│   │   │   ├── SplitBar.tsx      # Stacked segment bar (value capture)
│   │   │   ├── CompanyTable.tsx  # Filterable company table
│   │   │   ├── ExitsTimeline.tsx # Capital & exits timeline
│   │   │   ├── VsGrid.tsx       # Wrapper vs Frontier comparison
│   │   │   ├── CategoryGrid.tsx # Full-stack category cards
│   │   │   ├── CryptoSection.tsx # Token cards + candlestick charts
│   │   │   └── CandlestickChart.tsx # SVG candlestick w/ tooltip
│   │   └── costs/
│   │       ├── CompSlider.tsx    # Interactive comp slider (240k–360k)
│   │       ├── EquityBreakdown.tsx # Equity + acceleration details
│   │       ├── TeamDiagram.tsx   # Team distribution visualization
│   │       ├── UnitEconomics.tsx # Per-customer, per-video costs
│   │       └── MilestoneTrack.tsx # Customer milestone markers
│   ├── pages/
│   │   ├── MarketAnalysis.tsx    # Composes market/ components
│   │   └── CostAnalysis.tsx     # Composes costs/ components
│   ├── data/
│   │   ├── companies.ts         # Company table data
│   │   ├── kpis.ts              # KPI figures
│   │   ├── candlestick-series.ts # Token OHLC data
│   │   ├── exits.ts             # Funding/exit timeline events
│   │   └── costs.ts             # Comp tiers, team roles, unit costs
│   └── lib/
│       ├── format.ts            # Number/currency formatting utils
│       └── intersect.ts         # IntersectionObserver directive for animations
└── public/
    └── (empty — no static assets beyond fonts from CDN)
```

---

## Page 1: Market Analysis

Faithful recreation of the provided HTML. Each section maps 1:1:

### Section 01 — Market Size & Trajectory

- **KpiStrip**: 4 KPIs (2026 Market $0.85B, 2030–34 Projection $3.4B, High-end Forecast $21.6B, MAU 124M+)
- **Two-column layout** (1.15fr / 0.85fr):
  - Left: Prose with callout box (definitional caveat)
  - Right: `BarChart` — 6 horizontal bars (2024→2034 high), animated on scroll via IntersectionObserver
- Bars use `data-w` percentage width, animated with CSS transition on visibility

### Section 02 — Relative Value Capture

- **SplitBar**: Three colored segments (Frontier 46%, Wrappers 33%, Ancillary 21%)
- **Two-column**:
  - Left: Prose with Sora lesson callout
  - Right: `BarChart` — ARR leaders (Higgsfield, Kling, Synthesia, Pika, HeyGen)

### Section 03 — Company Landscape

- **Filter controls**: Buttons (All, Frontier Models, Wrappers, Ancillary, Public only) — toggle `.on` class, filter table rows by `data-seg` / `data-status`
- **CompanyTable**: Sticky header, hover rows, responsive overflow-x scroll
  - Columns: Company (linked), Segment (tag), Status (tag), Capital Raised, Valuation, Position
  - Tags color-coded: `.t-fr` `.t-wr` `.t-an` `.t-pub` `.t-priv` `.t-cr` `.t-ugc` `.t-dead`
  - 32 rows of data (from `companies.ts`)

### Section 04 — Capital & Exits

- **KpiStrip**: 4 KPIs (VC $5.3B, Total $7.5B+, IPO exits: 1, M&A exits: 0)
- **Prose** paragraph
- **ExitsTimeline**: List of 10 events, each row = date | event description | amount

### Section 05 — Wrappers vs. Frontier Models

- **VsGrid**: Two equal columns, each with header + 6 feature rows (OWNS, SELLS, EDGE, COST, MOAT, RISK)
- Two callout boxes below (convergence + AI-UGC hottest sub-vertical)

### Section 06 — Full Generative-Video Stack

- **Prose** intro paragraph
- **CategoryGrid**: 3-column grid of 7 category cards, each with:
  - Colored chip (LAYER · MODEL / APP / INFRA / DATA/DIST)
  - Title, description paragraph, player links

### Section 07 — Crypto-Token-Linked Projects

- **Warning box** (orange border)
- **Token grid**: 3-column, 6 token cards, each with:
  - Name (linked) + ticker badge
  - Description
  - Price
  - `CandlestickChart` (SVG, 26 weekly candles, hover tooltip with OHLC)
  - Market cap / change meta
  - Snapshot date
- Legend note below

### Candlestick Chart Component

```tsx
interface CandlestickChartProps {
  token: string;           // key into SERIES data
  width?: number;          // default 300
  height?: number;         // default 132
}
```

- Renders SVG with gridlines, wick lines, colored body rects
- Tooltip: `position: fixed`, follows mouse, shows week-of date + OHLC
- Green (#36d1a4) for up candles, red (#ff5e3a) for down
- Invisible hit-area rects for hover targets
- Header line shows "1W candles · trailing ~6mo" + % change

---

## Page 2: Cost Analysis

### URL: `/costs`

### Layout

Same Shell (nav, footer, grid background) as market page. Sections use same visual language (sec-num, sec-title, KPI strips, panel cards).

---

### Section 01 — Compensation Structure (Interactive Slider)

#### CompSlider Component

A full-width interactive slider mapping **customer count → compensation package**.

| Customer Count | Base Salary | Equity | Notes |
|---------------|-------------|--------|-------|
| 0 (start) | $240,000 | 4.0% | Floor package |
| 2,500 | $270,000 | 5.5% | First milestone |
| 5,000 | $300,000 | 7.0% | Mid milestone |
| 7,500 | $330,000 | 8.5% | |
| 10,000 | $360,000 | 10.0% | Cap package |

**Visual**: 
- Full-width slider track styled like the split-bar (gradient fill acid→frontier as customer count increases)
- Above the slider: large Fraunces-font display of current Base + Equity values
- Below: customer count with milestone markers (vertical ticks at 0, 2.5k, 5k, 7.5k, 10k)
- Smooth interpolation between milestones (linear)
- KPI cards flanking: Total Comp (base + equity value estimate), Effective Rate per Customer

#### Interpolation Logic

```ts
function getComp(customers: number): { base: number; equity: number } {
  const t = Math.min(customers / 10000, 1);
  return {
    base: 240000 + t * 120000,      // $240k → $360k linear
    equity: 4 + t * 6,              // 4% → 10% linear
  };
}
```

---

### Section 02 — Equity & Acceleration

#### EquityBreakdown Component

**Panel card** layout (2-column):

**Left column — Equity Terms:**
- Vesting: 4-year standard, 1-year cliff
- Starting grant: 4.0% (at floor customer count)
- Cap grant: 10.0% (at 10,000 customers)
- Exercise window: 10 years post-departure

**Right column — Double Trigger Acceleration:**

Explanation of double-trigger:
1. **Trigger 1**: Change of control (acquisition, merger, IPO)
2. **Trigger 2**: Involuntary termination or constructive dismissal within 12 months of Trigger 1

**Result**: 100% of unvested shares accelerate immediately upon both triggers firing.

Visual: Two-node diagram (Trigger 1 → Trigger 2 → Full Acceleration) with connecting line, styled like the exits timeline.

**Callout box**: "Double trigger protects the employee in acquisition scenarios while aligning with standard institutional investor expectations."

---

### Section 03 — Customer Milestones

#### MilestoneTrack Component

Horizontal milestone track (like a funding timeline rotated to horizontal) showing customer-count gates and what unlocks at each:

```
0 ──── 1,000 ──── 2,500 ──── 5,000 ──── 7,500 ──── 10,000
│        │          │          │          │           │
Launch   Seed       Series A   Break-     Growth     Scale
         metrics    ready      even       stage      target
```

Each milestone shows:
- Customer count (large number, Fraunces)
- Label / stage name
- Comp unlocked at that tier (from slider mapping)
- Key business metric expected (MRR, team size, etc.)

| Milestone | Customers | Base | Equity | Expected MRR | Team Size |
|-----------|-----------|------|--------|--------------|-----------|
| Launch | 0 | $240k | 4.0% | $0 | 2–3 |
| Seed validation | 1,000 | $252k | 4.6% | ~$30k | 4–5 |
| Series A ready | 2,500 | $270k | 5.5% | ~$75k | 6–8 |
| Breakeven | 5,000 | $300k | 7.0% | ~$150k | 10–12 |
| Growth stage | 7,500 | $330k | 8.5% | ~$250k | 14–16 |
| Scale target | 10,000 | $360k | 10.0% | ~$350k | 18–20 |

---

### Section 04 — Team Distribution & Fixed Costs

#### TeamDiagram Component

**Treemap or proportional-area diagram** showing team composition at the 10,000-customer scale target. Styled as colored rectangles (like the split-bar but as a 2D area chart):

| Role | Headcount | Monthly Cost | Color |
|------|-----------|--------------|-------|
| Engineering | 7 | $140k | `--acid` |
| ML / Video Pipeline | 4 | $100k | `--frontier` |
| Design / Creative | 2 | $30k | `--wrapper` |
| GTM / Sales | 3 | $45k | `--ancillary` |
| Ops / Finance | 2 | $25k | `--public` |
| Leadership | 2 | $60k | `--ink` |
| **Total** | **20** | **$400k/mo** | |

**Visual**: 
- Proportional block grid (similar to `cat-grid` style) where each block's area represents relative cost
- Each block shows: role name, headcount, monthly burn
- Total bar at bottom: "$400k/mo · $4.8M/yr burn at scale"

---

### Section 05 — Unit Economics (Per-Customer, Per-Video)

#### UnitEconomics Component

**Two sub-sections**:

#### A) Per-Video Generation Cost Breakdown

Table/card showing what it costs Enzo to produce one AI-generated video:

| Cost Component | Per Video | Notes |
|---------------|-----------|-------|
| Frontier model API (generation) | $0.45–$1.20 | Depends on length (15–60s), model choice |
| Voice synthesis (ElevenLabs tier) | $0.08–$0.15 | Per 30s of speech |
| Compute / rendering overhead | $0.05–$0.10 | Post-processing, format conversion |
| Storage & CDN delivery | $0.02–$0.04 | Per video served |
| **Total COGS per video** | **$0.60–$1.49** | |

Visual: Stacked bar (like the split-bar) showing proportional cost per component.

#### B) Per-Customer Economics (Monthly)

| Metric | Value | Formula |
|--------|-------|---------|
| Avg videos/customer/month | 12 | Based on daily-pipeline use case |
| COGS per customer/month | $7.20–$17.88 | 12 × per-video cost |
| Target price point | $49–$149/mo | Tiered (starter/pro/enterprise) |
| Gross margin | 76%–88% | (Price - COGS) / Price |
| CAC (blended) | $120–$200 | Paid + organic |
| LTV (12-mo, mid-tier) | $1,188 | $99 × 12 |
| LTV:CAC ratio | 5.9–9.9x | Healthy at >3x |

Visual: KPI strip (4 cards) showing Gross Margin, LTV:CAC, Payback Period, Break-even Customers.

#### C) Fixed Costs (Monthly, at Scale)

| Category | Monthly | Annual |
|----------|---------|--------|
| Team (salaries + benefits) | $400k | $4.8M |
| Infrastructure (non-COGS) | $25k | $300k |
| Tools & SaaS | $8k | $96k |
| Legal / compliance | $5k | $60k |
| Office / misc | $7k | $84k |
| **Total fixed** | **$445k** | **$5.34M** |

Break-even calculation displayed prominently:
- At $99/mo mid-tier, gross margin ~82%: need ~$445k / ($99 × 0.82) ≈ **5,482 customers to break even on fixed costs**
- Displayed as a single large KPI: "~5,500 customers to cover fixed burn"

---

### Section 06 — Scaling Scenarios

A responsive comparison panel (like vs-grid) showing three scenarios:

| Scenario | Customers | MRR | Gross Profit | Net (after fixed) | Comp Tier |
|----------|-----------|-----|--------------|-------------------|-----------|
| Conservative | 2,500 | $248k | $203k | −$242k/mo | $270k + 5.5% |
| Target | 5,000 | $495k | $406k | −$39k/mo (near break-even) | $300k + 7.0% |
| Stretch | 10,000 | $990k | $812k | +$367k/mo | $360k + 10.0% |

Visual: Three vertical cards with KPIs, color-coded (red for negative, green for positive net).

---

## Shared Components

### KpiStrip

```tsx
interface KpiProps {
  label: string;
  value: string;
  note: string;
  colorClass?: string;  // 'acid' | 'frontier' | 'wrapper' | 'ancillary'
}
```

4-column grid with 1px gap, panel background, hover state.

### SectionHead

```tsx
interface SectionHeadProps {
  number: string;    // "01 /"
  title: string;
  subtitle?: string;
}
```

### Callout

```tsx
interface CalloutProps {
  color?: string;       // border-left color (default: frontier)
  label: string;        // bold prefix
  children: JSX.Element;
}
```

### Tag

```tsx
type TagVariant = 'frontier' | 'wrapper' | 'ancillary' | 'public' | 'private' | 'crypto' | 'ugc' | 'dead';
```

Mono 9px uppercase with colored border + background.

---

## Navigation

Top-level nav (inside Shell, sticky or fixed):

```
[•] ENZO                    Market Analysis    Cost Analysis
```

- Left: Logo/wordmark (dot + "ENZO" in Archivo 700)
- Right: Page links, IBM Plex Mono 11px uppercase
- Active page: `color: var(--acid)` with underline
- Background: `var(--bg)` with slight blur backdrop on scroll

---

## Animations & Interactions

| Element | Trigger | Animation |
|---------|---------|-----------|
| Bar chart fills | IntersectionObserver (threshold 0.3) | Width transitions from 0 → target%, `cubic-bezier(.16,1,.3,1)` 1.1s |
| Table filter | Button click | Rows toggle `display: none` instantly |
| Candlestick tooltip | Mousemove on hit-rect | Fixed-position div, opacity fade 0.1s |
| Comp slider | Input range change | Reactive signal updates displayed values in real-time |
| KPI counters (optional) | Scroll into view | Count-up from 0 to target over 0.8s |
| Milestone track | Slider value | Active milestone highlights (glow + scale) |

---

## Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| ≤ 880px | KPI grid → 2-col; two-col layouts → single col; vs-grid → stack; cat-grid → single col; token grid → single col; table scrolls horizontally; h1 clamps down |
| ≤ 640px | Nav collapses to hamburger or stacks; slider labels shrink; milestone track scrolls horizontally |

---

## Data Files

All data is statically defined in TypeScript files under `src/data/`. No API calls, no dynamic fetching. The site is a static presentation.

### `companies.ts`

Array of 32 company objects:

```ts
interface Company {
  name: string;
  url: string;
  segment: 'frontier' | 'wrapper' | 'ancillary';
  status: 'private' | 'public';
  statusLabel?: string;        // "Public · HK", "Parent public", etc.
  capitalRaised: string;
  valuation: string;
  position: string;
  tags: TagVariant[];
}
```

### `candlestick-series.ts`

Same SERIES object from the source HTML — 5 token keys, each with `unit`, `dec`, `start`, and 26-bar OHLC `data` array.

### `costs.ts`

```ts
interface CompTier {
  customers: number;
  base: number;
  equity: number;
  expectedMrr: number;
  teamSize: [number, number];
  label: string;
}

interface VideoCost {
  component: string;
  min: number;
  max: number;
  notes: string;
}

interface TeamRole {
  role: string;
  headcount: number;
  monthlyCost: number;
  color: string;
}
```

---

## Build & Dev

```bash
# Install
sfw bun install

# Dev server
bun run dev        # → http://localhost:5173

# Build
bun run build      # → dist/

# Preview production build
bun run preview
```

### package.json scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## Tailwind Configuration

Extend the default theme with all custom colors, fonts, and spacing. Use `@theme` in Tailwind v4 or `tailwind.config.ts` extend block:

```ts
// tailwind.config.ts (if v3) or @theme block (if v4)
{
  colors: {
    bg: '#0a0a0c',
    panel: { DEFAULT: '#111114', '2': '#16161b' },
    ink: { DEFAULT: '#f2f0ea', dim: '#9d9a93', faint: '#5f5d58' },
    line: { DEFAULT: '#26262d', bright: '#36363f' },
    acid: '#d6ff3f',
    frontier: '#ff5e3a',
    wrapper: '#3aa0ff',
    ancillary: '#b18cff',
    public: '#ffd166',
    up: '#36d1a4',
    down: '#ff5e3a',
    crypto: '#f7931a',
    ugc: '#36d1a4',
  },
  fontFamily: {
    display: ['Fraunces', 'serif'],
    mono: ['IBM Plex Mono', 'monospace'],
    body: ['Archivo', 'sans-serif'],
  }
}
```

---

## Key Implementation Notes

1. **Style fidelity**: The market analysis page must be pixel-accurate to the source HTML. Use the exact hex values, font sizes, letter-spacing, and layout proportions. Tailwind utilities where they map cleanly; `@apply` or inline styles for one-off values (e.g., `letter-spacing: .32em`).

2. **No external chart library**: Candlestick charts and bar charts are custom SVG rendered via SolidJS JSX. This keeps bundle size minimal and matches the exact visual style.

3. **Reactive slider**: Use SolidJS `createSignal` for the customer-count slider. All derived values (base, equity, effective rate, milestone highlight) are computed reactively.

4. **Static site**: No server, no SSR needed. Pure client-side SPA with hash or history routing.

5. **Accessibility**: All interactive elements need focus states. Charts need `role="img"` + `aria-label`. Slider needs `aria-valuemin/max/now`. Table needs proper `thead`/`tbody` semantics.

6. **Performance**: Intersection observer for scroll-triggered animations (don't animate off-screen). Lazy-render candlestick charts only when token section scrolls into view.

---

## File Checklist (Implementation Order)

1. [ ] Project scaffolding: `vite.config.ts`, `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`
2. [ ] `src/styles/global.css` — Tailwind directives + CSS custom properties + grid background
3. [ ] `src/index.tsx` + `src/App.tsx` — Entry + router with two routes
4. [ ] `src/components/layout/` — Shell, Nav, Footer
5. [ ] `src/data/` — All static data files
6. [ ] `src/lib/` — Utility functions
7. [ ] `src/components/market/` — All market page components
8. [ ] `src/pages/MarketAnalysis.tsx` — Compose market components
9. [ ] `src/components/costs/` — All cost analysis components
10. [ ] `src/pages/CostAnalysis.tsx` — Compose cost components
11. [ ] Visual QA against source HTML
12. [ ] Responsive testing at 880px and 640px breakpoints
