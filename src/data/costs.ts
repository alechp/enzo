export interface CompTier {
  customers: number;
  bump: number;
  expectedMrr: number;
  teamSize: [number, number];
  label: string;
}

export const compTiers: CompTier[] = [
  { customers: 0, bump: 0, expectedMrr: 0, teamSize: [2, 3], label: 'Launch' },
  { customers: 1000, bump: 10000, expectedMrr: 30000, teamSize: [3, 4], label: 'Seed validation' },
  { customers: 2500, bump: 25000, expectedMrr: 75000, teamSize: [4, 5], label: 'Series A ready' },
  { customers: 5000, bump: 40000, expectedMrr: 150000, teamSize: [5, 7], label: 'Breakeven' },
  { customers: 7500, bump: 55000, expectedMrr: 250000, teamSize: [6, 7], label: 'Growth stage' },
  { customers: 10000, bump: 70000, expectedMrr: 350000, teamSize: [7, 7], label: 'Scale target' },
];

export function getInitialComp(t: number): { base: number; equity: number } {
  // t = 0 (floor/max equity) to 1 (ceiling/max cash)
  return {
    base: 240000 + t * 120000,      // $240k → $360k
    equity: 4 - t * 2,              // 4.0% → 2.0% (INVERSE)
  };
}

export function getMilestoneBump(customers: number): number {
  const t = Math.min(Math.max(customers, 0) / 10000, 1);
  return t * 70000; // $0 → $70k linear
}

export function getTotalBase(initialT: number, customers: number): number {
  return getInitialComp(initialT).base + getMilestoneBump(customers);
}

export interface VideoCost {
  component: string;
  min: number;
  max: number;
  notes: string;
  color: string;
}

export const videoCosts: VideoCost[] = [
  { component: 'Frontier model API (generation)', min: 0.45, max: 1.20, notes: 'Depends on length (15–60s), model choice', color: 'var(--color-frontier)' },
  { component: 'Voice synthesis (ElevenLabs tier)', min: 0.08, max: 0.15, notes: 'Per 30s of speech', color: 'var(--color-ancillary)' },
  { component: 'Compute / rendering overhead', min: 0.05, max: 0.10, notes: 'Post-processing, format conversion', color: 'var(--color-wrapper)' },
  { component: 'Storage & CDN delivery', min: 0.02, max: 0.04, notes: 'Per video served', color: 'var(--color-acid)' },
];

export interface TeamRole {
  role: string;
  headcount: number;
  monthlyCost: number;
  color: string;
}

export const teamRoles: TeamRole[] = [
  { role: 'Engineering', headcount: 3, monthlyCost: 60000, color: 'var(--color-acid)' },
  { role: 'ML / Video Pipeline', headcount: 1, monthlyCost: 25000, color: 'var(--color-frontier)' },
  { role: 'Design / Creative', headcount: 1, monthlyCost: 12000, color: 'var(--color-wrapper)' },
  { role: 'GTM / Sales', headcount: 1, monthlyCost: 15000, color: 'var(--color-ancillary)' },
  { role: 'Leadership', headcount: 1, monthlyCost: 20000, color: 'var(--color-ink)' },
];

export interface FixedCost {
  category: string;
  monthly: number;
  annual: number;
}

export const fixedCosts: FixedCost[] = [
  { category: 'Team (salaries + benefits)', monthly: 132000, annual: 1584000 },
  { category: 'Infrastructure (non-COGS)', monthly: 25000, annual: 300000 },
  { category: 'Tools & SaaS', monthly: 8000, annual: 96000 },
  { category: 'Legal / compliance', monthly: 5000, annual: 60000 },
  { category: 'Office / misc', monthly: 7000, annual: 84000 },
];

export interface Scenario {
  name: string;
  customers: number;
  mrr: number;
  grossProfit: number;
  net: number;
  salaryBump: number;
}

export const scenarios: Scenario[] = [
  { name: 'Conservative', customers: 2500, mrr: 248000, grossProfit: 203000, net: 26000, salaryBump: 25000 },
  { name: 'Target', customers: 5000, mrr: 495000, grossProfit: 406000, net: 229000, salaryBump: 40000 },
  { name: 'Stretch', customers: 10000, mrr: 990000, grossProfit: 812000, net: 635000, salaryBump: 70000 },
];
