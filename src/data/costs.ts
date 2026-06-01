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

export type TaxLocation = 'PR' | 'CA' | 'US-default';

export interface EmployeeTaxBreakdown {
  federalIncome: number;
  stateIncome: number;
  employeeSS: number;
  employeeMedicare: number;
  totalEmployeeTax: number;
  annualTakeHome: number;
  monthlyGross: number;
  monthlyTakeHome: number;
}

export function computeEmployeeTaxes(annualSalary: number, location: TaxLocation): EmployeeTaxBreakdown {
  // Federal income tax (2026 brackets, simplified progressive)
  let federalIncome = 0;
  if (location === 'PR') {
    // PR residents: exempt from federal income tax on PR-sourced income
    federalIncome = 0;
  } else {
    const brackets = [
      { limit: 11600, rate: 0.10 },
      { limit: 47150, rate: 0.12 },
      { limit: 100525, rate: 0.22 },
      { limit: 191950, rate: 0.24 },
      { limit: 243725, rate: 0.32 },
      { limit: 609350, rate: 0.35 },
      { limit: Infinity, rate: 0.37 },
    ];
    let remaining = annualSalary;
    let prev = 0;
    for (const b of brackets) {
      const taxable = Math.min(remaining, b.limit - prev);
      if (taxable <= 0) break;
      federalIncome += taxable * b.rate;
      remaining -= taxable;
      prev = b.limit;
    }
  }

  // State income tax
  let stateIncome = 0;
  if (location === 'PR') {
    // PR has its own tax: ~6.5% effective for $85k-$160k range (simplified flat)
    stateIncome = annualSalary * 0.065;
  } else if (location === 'CA') {
    // CA progressive (simplified): ~9.3% effective for $150k-$250k range
    const caBrackets = [
      { limit: 10412, rate: 0.01 },
      { limit: 24684, rate: 0.02 },
      { limit: 38959, rate: 0.04 },
      { limit: 54081, rate: 0.06 },
      { limit: 68350, rate: 0.08 },
      { limit: 349137, rate: 0.093 },
      { limit: 418961, rate: 0.103 },
      { limit: 698271, rate: 0.113 },
      { limit: Infinity, rate: 0.123 },
    ];
    let remaining = annualSalary;
    let prev = 0;
    for (const b of caBrackets) {
      const taxable = Math.min(remaining, b.limit - prev);
      if (taxable <= 0) break;
      stateIncome += taxable * b.rate;
      remaining -= taxable;
      prev = b.limit;
    }
  }

  // Employee-side FICA
  const employeeSS = Math.min(annualSalary, TAX_CONSTANTS.socialSecurityCap) * TAX_CONSTANTS.socialSecurityRate;
  const employeeMedicare = annualSalary * TAX_CONSTANTS.medicareRate;

  const totalEmployeeTax = federalIncome + stateIncome + employeeSS + employeeMedicare;
  const annualTakeHome = annualSalary - totalEmployeeTax;

  return {
    federalIncome,
    stateIncome,
    employeeSS,
    employeeMedicare,
    totalEmployeeTax,
    annualTakeHome,
    monthlyGross: annualSalary / 12,
    monthlyTakeHome: annualTakeHome / 12,
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
  location: TaxLocation;
}

export const teamRoles: TeamRole[] = [
  { role: 'CEO', headcount: 1, annualSalary: 160000, color: 'var(--color-acid)', status: 'active', location: 'PR' },
  { role: 'Business Development', headcount: 1, annualSalary: 85000, color: 'var(--color-wrapper)', status: 'active', location: 'PR' },
  { role: 'CTO', headcount: 1, annualSalary: 240000, color: 'var(--color-frontier)', status: 'active', location: 'CA' },
  { role: 'ML / Video Pipeline', headcount: 1, annualSalary: 175000, color: 'var(--color-ancillary)', status: 'future', startMonth: 6, location: 'US-default' },
  { role: 'Technical PM', headcount: 1, annualSalary: 145000, color: 'var(--color-public)', status: 'future', startMonth: 6, location: 'US-default' },
  { role: 'Customer Support', headcount: 1, annualSalary: 55000, color: 'var(--color-up)', status: 'future', startMonth: 9, location: 'US-default' },
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
