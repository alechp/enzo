# Enzo — v7 Spec: Team Page

## Overview

Add a new `/team` page to the site showcasing the founding team. The first section is the CTO profile (Alec Hale-Pletka) with a full career timeline extracted from LinkedIn screenshots. The page follows the same dark theme and design language as the existing Market Analysis and Cost Analysis pages.

---

## Change 1: Route, Nav, and Page Shell

### Files to Change

#### `src/index.tsx`

Add a lazy import and route:

```tsx
const TeamPage = lazy(() => import('./pages/TeamPage'));

// In the Router:
<Route path="/team" component={TeamPage} />
```

#### `src/components/layout/Nav.tsx`

Add a third nav link for "Team" between "Cost Analysis" and the end of the nav div:

```tsx
<A
  href="/team"
  class="font-mono text-[11px] max-[480px]:text-[9px] uppercase no-underline transition-colors"
  classList={{
    'text-acid': isActive('/team'),
    'text-ink-faint hover:text-ink-dim': !isActive('/team'),
  }}
  style="letter-spacing: .12em"
>
  Team
</A>
```

---

## Change 2: Team Page

### File to Create

#### `src/pages/TeamPage.tsx`

A new page with the same structure as MarketAnalysis/CostAnalysis: header section, then content sections.

```tsx
import SectionHead from '../components/costs/SectionHead';

export default function TeamPage() {
  return (
    <>
      {/* HEADER */}
      <header class="py-14 border-b border-line">
        <div
          class="flex items-center gap-[14px] flex-wrap font-mono text-[11px] uppercase text-acid"
          style="letter-spacing:.32em"
        >
          <span
            class="w-[7px] h-[7px] rounded-full bg-acid inline-block"
            style="box-shadow:0 0 10px #d6ff3f"
          />
          Team &middot; Enzo.ai &middot; 2026
        </div>
        <h1
          class="font-display font-black text-[clamp(2.6rem,6.4vw,5.4rem)] leading-[.96] mt-5 mb-4"
          style="letter-spacing:-.02em"
        >
          The <em class="italic text-wrapper">Team</em>
        </h1>
        <p class="text-ink-dim max-w-[62ch] text-[1.06rem]">
          The people building Enzo — their backgrounds, what they bring, and why this team is
          uniquely positioned to execute in the AI video space.
        </p>
      </header>

      {/* 01: CTO */}
      <section class="py-[54px] border-b border-line">
        <SectionHead number="01 /" title="Alec Hale-Pletka" subtitle="CTO" />
        <CTOProfile />
      </section>

      {/* Future sections: CEO, BD, advisors */}
    </>
  );
}
```

The `CTOProfile` component is defined below and imported.

---

## Change 3: CTO Profile Component

### File to Create

#### `src/components/team/CTOProfile.tsx`

A component that renders the CTO's profile with:
- A brief executive summary at the top
- A career timeline showing all positions chronologically

### Career Data (from LinkedIn screenshots)

```ts
const career = [
  {
    title: 'CTO',
    company: 'Enzo.ai',
    period: '2026 – Present',
    location: 'Remote',
    description: 'Technical co-founder. Building the AI video generation platform — architecture, ML pipeline integration, and full-stack product development.',
    tags: ['current'],
  },
  {
    title: 'Program Manager',
    company: 'GoGuardian',
    period: 'Dec 2014 – Apr 2016 · 1 yr 5 mos',
    location: 'Los Angeles',
    description: 'Transitioned across three roles (product manager, project manager, program manager) as the company scaled from apartment-startup to 70+ person SMB. Product manager: engaged with the product development lifecycle from customer feedback to UI/UX to engineering implementation. Project manager: execution-focused, working heavily with the engineering team. Program manager: cross-functional "glue" across all products and departments.',
    tags: ['product', 'engineering', 'leadership'],
  },
  {
    title: 'Brain (Tech Ops)',
    company: 'Multibrain',
    period: 'Feb 2014 – Jul 2014 · 6 mos',
    location: 'Los Angeles, CA',
    description: 'Programming, account management, client project implementation, dashboard management, development of Multibrain solutions, content management, business development, procedures and documentation — all in the context of growing the company.',
    tags: ['fullstack', 'ops'],
  },
  {
    title: 'Freelancer',
    company: 'AlecHP Design',
    period: 'Aug 2013 – Jan 2014 · 6 mos',
    location: 'Orange County, CA',
    description: 'Graphic design (mockups and high-fidelity prototypes), web development (WordPress, Bootstrap, HTML/CSS/JS), project management, content management, and business development.',
    tags: ['design', 'frontend'],
  },
  {
    title: 'General Manager in Training',
    company: 'Spireon, Inc.',
    period: 'Aug 2008 – Aug 2013 · 5 yrs 1 mo',
    location: 'Irvine, CA',
    description: 'Cross-vertical training across technical and business functions: team collaboration, procedural implementation, event coordination, project management, copywriting, vendor management, web design, programming, R&D, IT helpdesk, active directory administration, exchange server management, solutions architecture, strategic software implementation, and demand management.',
    progression: [
      { year: "'13", focus: 'Process control and demand management' },
      { year: "'12", focus: 'Marketing and business development' },
      { year: "'10–'12", focus: 'Network administration' },
      { year: "'09–'10", focus: 'Web Design' },
      { year: "'08–'09", focus: 'Internship' },
    ],
    tags: ['enterprise', 'infrastructure', 'leadership'],
  },
  {
    title: 'Co-Founder & CEO',
    company: 'UnitePeople',
    period: 'Jun 2009 – Nov 2012 · 3 yrs 6 mos',
    location: 'California',
    description: 'Humanitarian company combining sustainability and innovation. Established organic farms to educate and employ local communities while creating sustainable food sources. Sales at farmers\' markets plus Unite Clothing line funded the Love United philanthropic initiative (youth mentoring, poverty outreach). Reached 20,000+ people across Texas, Seattle, San Diego, San Francisco, Santa Ana, Cypress, and more.',
    tags: ['founder', 'social-impact'],
  },
  {
    title: 'Founder',
    company: 'Alec Hale-Pletka WebDesign',
    period: 'Aug 2008 – Dec 2010 · 2 yrs 5 mos',
    location: 'Orange County, CA',
    description: 'Everything from concept design to server management.',
    tags: ['founder', 'fullstack'],
  },
];
```

### Layout

The profile has two sections:

#### A) Executive Summary

A brief card at the top:

```
┌──────────────────────────────────────────────────────────────────┐
│  ALEC HALE-PLETKA · CTO                                         │
│                                                                  │
│  13+ years spanning enterprise infrastructure (Spireon),         │
│  edtech product management (GoGuardian), freelance design,       │
│  and social-impact founding (UnitePeople). Rare combination      │
│  of deep technical ops, product sense, and startup execution.    │
│                                                                  │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │Infra │ │Prod  │ │Design│ │Ops   │ │Founder│                  │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                  │
└──────────────────────────────────────────────────────────────────┘
```

Skill chips: `infrastructure`, `product management`, `design`, `technical ops`, `founding/CEO`

Styling:
- `bg-panel border border-line p-6`
- Name in `font-display font-black text-[1.4rem]`
- Summary in `text-ink-dim text-[.94rem]`
- Chips: `font-mono text-[9px] uppercase bg-panel-2 px-2 py-1 rounded text-ink-faint border border-line`

#### B) Career Timeline

A vertical timeline with a left-side line connecting entries:

```
│
├─── Enzo.ai · CTO · 2026–Present
│    (current role card with acid border)
│
├─── GoGuardian · Program Manager · Dec 2014–Apr 2016
│    (description, tags)
│
├─── Multibrain · Brain (Tech Ops) · Feb 2014–Jul 2014
│    ...
│
├─── AlecHP Design · Freelancer · Aug 2013–Jan 2014
│    ...
│
├─── Spireon · General Manager in Training · Aug 2008–Aug 2013
│    (with year-by-year progression sub-list)
│
├─── UnitePeople · Co-Founder & CEO · Jun 2009–Nov 2012
│    ...
│
└─── Alec Hale-Pletka WebDesign · Founder · Aug 2008–Dec 2010
```

Each timeline entry:
- Left border `3px solid` with color varying by type:
  - Current role: `var(--color-acid)` (green)
  - Leadership/PM roles: `var(--color-wrapper)` (blue)
  - Technical/ops roles: `var(--color-frontier)` (red-orange)
  - Founder roles: `var(--color-ancillary)` (purple)
  - Design/freelance: `var(--color-public)` (yellow)
- Card: `bg-panel p-5 hover:bg-panel-2 transition-colors`
- Title: `font-display font-semibold text-[1.1rem] text-ink`
- Company: `font-mono text-[10px] uppercase text-ink-faint`
- Period/location: `font-mono text-[10px] text-ink-faint`
- Description: `text-[.88rem] text-ink-dim leading-relaxed`
- Tags: small chips like the company table tags

For the Spireon entry with the `progression` array, render it as a sub-timeline:
```tsx
<div class="ml-4 mt-3 border-l border-line pl-4 space-y-1">
  {entry.progression.map((p) => (
    <div class="font-mono text-[11px]">
      <span class="text-ink-faint">{p.year}:</span>
      <span class="text-ink-dim ml-2">{p.focus}</span>
    </div>
  ))}
</div>
```

The vertical line connecting entries should be a continuous `border-left` on the timeline container, with each entry offset with `pl-6` and the dot positioned using `absolute left-[-9px]`.

### File Structure

```
src/
  components/
    team/
      CTOProfile.tsx    ← career data + timeline layout
  pages/
    TeamPage.tsx        ← page wrapper with header + section
```

---

## Files Summary

| File | Action | Description |
|------|--------|-------------|
| `src/index.tsx` | MODIFY | Add lazy import + route for `/team` |
| `src/components/layout/Nav.tsx` | MODIFY | Add "Team" nav link |
| `src/pages/TeamPage.tsx` | CREATE | Team page with header |
| `src/components/team/CTOProfile.tsx` | CREATE | CTO profile with career timeline |

---

## Change 4: Base Font Size Control in Nav

### Problem

Users want to increase/decrease the base font size for the entire app without using browser zoom (which also scales layout, padding, etc.). A simple control in the navbar solves this.

### What to Build

#### `src/components/layout/FontSizeControl.tsx` (NEW FILE)

A small component with `A-` / `A+` buttons and a reset. Controls the `<html>` element's `font-size`, which all `rem`-based values inherit from.

```tsx
import { createSignal, onMount } from 'solid-js';

const STORAGE_KEY = 'enzo-font-size';
const DEFAULT_SIZE = 16;
const MIN_SIZE = 12;
const MAX_SIZE = 24;
const STEP = 2;

export default function FontSizeControl() {
  const [size, setSize] = createSignal(DEFAULT_SIZE);

  onMount(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved);
      if (!isNaN(parsed) && parsed >= MIN_SIZE && parsed <= MAX_SIZE) {
        setSize(parsed);
        document.documentElement.style.fontSize = `${parsed}px`;
      }
    }
  });

  const update = (newSize: number) => {
    const clamped = Math.min(Math.max(newSize, MIN_SIZE), MAX_SIZE);
    setSize(clamped);
    document.documentElement.style.fontSize = `${clamped}px`;
    localStorage.setItem(STORAGE_KEY, String(clamped));
  };

  return (
    <div class="flex items-center gap-1 font-mono text-[10px]">
      <button
        class="px-1.5 py-0.5 text-ink-faint hover:text-ink border border-line hover:border-acid rounded-sm transition-colors"
        onClick={() => update(size() - STEP)}
        disabled={size() <= MIN_SIZE}
        title="Decrease font size"
      >
        A−
      </button>
      <button
        class="px-1.5 py-0.5 text-ink-faint hover:text-ink border border-line hover:border-acid rounded-sm transition-colors"
        onClick={() => update(DEFAULT_SIZE)}
        title="Reset font size"
      >
        {size()}
      </button>
      <button
        class="px-1.5 py-0.5 text-ink-faint hover:text-ink border border-line hover:border-acid rounded-sm transition-colors"
        onClick={() => update(size() + STEP)}
        disabled={size() >= MAX_SIZE}
        title="Increase font size"
      >
        A+
      </button>
    </div>
  );
}
```

Behavior:
- `A−` decreases by 2px (min 12px)
- `A+` increases by 2px (max 24px)
- Middle button shows current size and resets to 16px on click
- Persists to localStorage
- Sets `document.documentElement.style.fontSize` which cascades to all rem-based values

#### `src/components/layout/Nav.tsx`

Import `FontSizeControl` and place it in the nav between the logo and the page links:

```tsx
import FontSizeControl from './FontSizeControl';

// In the nav, after the logo <A> and before the links <div>:
<FontSizeControl />
```

The nav layout becomes: `[Logo] [FontSizeControl] [spacer] [Links]`. The existing `justify-between` handles spacing — just wrap the logo + font control in a `flex items-center gap-4` group.

### Files to Create

- `src/components/layout/FontSizeControl.tsx`

### Files to Change

- `src/components/layout/Nav.tsx` — add FontSizeControl

---

## Files Summary

| File | Action | Description |
|------|--------|-------------|
| `src/index.tsx` | MODIFY | Add lazy import + route for `/team` |
| `src/components/layout/Nav.tsx` | MODIFY | Add "Team" nav link + FontSizeControl |
| `src/components/layout/FontSizeControl.tsx` | CREATE | A−/A+ font size control with localStorage |
| `src/pages/TeamPage.tsx` | CREATE | Team page with header |
| `src/components/team/CTOProfile.tsx` | CREATE | CTO profile with career timeline |

---

## Implementation Order

Single agent — all files are new or minimally modified, no parallelization needed. Total: ~5 files, no overlap risk.
