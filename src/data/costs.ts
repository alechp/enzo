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

export const TAX_CONSTANTS = {
  socialSecurityRate: 0.062,
  socialSecurityCap: 168600,
  medicareRate: 0.0145,
  futaRate: 0.006,
  futaCap: 7000,
  sutaRate: 0.034,
  sutaCap: 7000,
  workersCompRate: 0.0025,
  healthInsuranceAnnual: 7200,
};

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

export function computeEmployerTaxes(annualSalary: number): EmployerTaxBreakdown {
  const c = TAX_CONSTANTS;
  const socialSecurity = Math.min(annualSalary, c.socialSecurityCap) * c.socialSecurityRate;
  const medicare = annualSalary * c.medicareRate;
  const futa = Math.min(annualSalary, c.futaCap) * c.futaRate;
  const suta = Math.min(annualSalary, c.sutaCap) * c.sutaRate;
  const workersComp = annualSalary * c.workersCompRate;
  const healthInsurance = annualSalary > 0 ? c.healthInsuranceAnnual : 0;
  const total = socialSecurity + medicare + futa + suta + workersComp + healthInsurance;
  return {
    socialSecurity,
    medicare,
    futa,
    suta,
    workersComp,
    healthInsurance,
    total,
    fullyLoaded: annualSalary + total,
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
  annualSalary: number;
  color: string;
  status: 'active' | 'future';
  startMonth?: number;
}

export const teamRoles: TeamRole[] = [
  { role: 'CEO', headcount: 1, annualSalary: 0, color: 'var(--color-ink)', status: 'active' },
  { role: 'BD', headcount: 1, annualSalary: 100000, color: 'var(--color-ancillary)', status: 'active' },
  { role: 'CTO', headcount: 1, annualSalary: 190000, color: 'var(--color-acid)', status: 'future', startMonth: 3 },
  { role: 'ML Engineer', headcount: 1, annualSalary: 175000, color: 'var(--color-frontier)', status: 'future', startMonth: 6 },
  { role: 'TPM', headcount: 1, annualSalary: 145000, color: 'var(--color-wrapper)', status: 'future', startMonth: 6 },
  { role: 'Support', headcount: 1, annualSalary: 55000, color: 'var(--color-public)', status: 'future', startMonth: 9 },
];

export interface FixedCost {
  category: string;
  monthly: number;
  annual: number;
}

export const fixedCosts: FixedCost[] = [
  { category: 'Infrastructure (non-COGS)', monthly: 15000, annual: 180000 },
  { category: 'Tools & SaaS', monthly: 5000, annual: 60000 },
  { category: 'Legal / compliance', monthly: 3000, annual: 36000 },
  { category: 'Office / misc', monthly: 2000, annual: 24000 },
];
