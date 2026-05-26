export interface CompTier {
  customers: number;
  base: number;
  equity: number;
  expectedMrr: number;
  teamSize: [number, number];
  label: string;
}

export const compTiers: CompTier[] = [
  { customers: 0, base: 240000, equity: 4.0, expectedMrr: 0, teamSize: [2, 3], label: 'Launch' },
  { customers: 1000, base: 252000, equity: 4.6, expectedMrr: 30000, teamSize: [4, 5], label: 'Seed validation' },
  { customers: 2500, base: 270000, equity: 5.5, expectedMrr: 75000, teamSize: [6, 8], label: 'Series A ready' },
  { customers: 5000, base: 300000, equity: 7.0, expectedMrr: 150000, teamSize: [10, 12], label: 'Breakeven' },
  { customers: 7500, base: 330000, equity: 8.5, expectedMrr: 250000, teamSize: [14, 16], label: 'Growth stage' },
  { customers: 10000, base: 360000, equity: 10.0, expectedMrr: 350000, teamSize: [18, 20], label: 'Scale target' },
];

export function getComp(customers: number): { base: number; equity: number } {
  const t = Math.min(Math.max(customers, 0) / 10000, 1);
  return {
    base: 240000 + t * 120000,
    equity: 4 + t * 6,
  };
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
  { role: 'Engineering', headcount: 7, monthlyCost: 140000, color: 'var(--color-acid)' },
  { role: 'ML / Video Pipeline', headcount: 4, monthlyCost: 100000, color: 'var(--color-frontier)' },
  { role: 'Design / Creative', headcount: 2, monthlyCost: 30000, color: 'var(--color-wrapper)' },
  { role: 'GTM / Sales', headcount: 3, monthlyCost: 45000, color: 'var(--color-ancillary)' },
  { role: 'Ops / Finance', headcount: 2, monthlyCost: 25000, color: 'var(--color-public)' },
  { role: 'Leadership', headcount: 2, monthlyCost: 60000, color: 'var(--color-ink)' },
];

export interface FixedCost {
  category: string;
  monthly: number;
  annual: number;
}

export const fixedCosts: FixedCost[] = [
  { category: 'Team (salaries + benefits)', monthly: 400000, annual: 4800000 },
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
  compBase: number;
  compEquity: number;
}

export const scenarios: Scenario[] = [
  { name: 'Conservative', customers: 2500, mrr: 248000, grossProfit: 203000, net: -242000, compBase: 270000, compEquity: 5.5 },
  { name: 'Target', customers: 5000, mrr: 495000, grossProfit: 406000, net: -39000, compBase: 300000, compEquity: 7.0 },
  { name: 'Stretch', customers: 10000, mrr: 990000, grossProfit: 812000, net: 367000, compBase: 360000, compEquity: 10.0 },
];
