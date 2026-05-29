export function getInitialComp(t: number): { base: number; equity: number } {
  return {
    base: 240000 + t * 120000,
    equity: 4 - t * 2,
  };
}

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

export const TAX_CONSTANTS = {
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
  { role: 'CEO', headcount: 1, annualSalary: 0, color: 'var(--color-acid)', status: 'active' },
  { role: 'Business Development', headcount: 1, annualSalary: 100000, color: 'var(--color-wrapper)', status: 'active' },
  { role: 'CTO', headcount: 1, annualSalary: 240000, color: 'var(--color-frontier)', status: 'active' },
  { role: 'ML / Video Pipeline', headcount: 1, annualSalary: 175000, color: 'var(--color-ancillary)', status: 'future', startMonth: 6 },
  { role: 'Technical PM', headcount: 1, annualSalary: 145000, color: 'var(--color-public)', status: 'future', startMonth: 6 },
  { role: 'Customer Support', headcount: 1, annualSalary: 55000, color: 'var(--color-up)', status: 'future', startMonth: 9 },
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
