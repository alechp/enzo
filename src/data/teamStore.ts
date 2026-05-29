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
