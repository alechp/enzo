import { createStore, reconcile } from 'solid-js/store';
import { onMount } from 'solid-js';
import { teamRoles, computeEmployerTaxes, type TeamRole } from './costs';

const STORAGE_KEY = 'enzo-adjusted-team';

export const defaults: TeamRole[] = teamRoles.map((r) => ({ ...r }));

function loadSaved(): TeamRole[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === defaults.length) return parsed;
    }
  } catch { /* ignore */ }
  return null;
}

function saveToDisk(data: TeamRole[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const [roles, setRoles] = createStore<TeamRole[]>(defaults.map((r) => ({ ...r })));

// Load saved data on first import (will run in browser context)
if (typeof window !== 'undefined') {
  const saved = loadSaved();
  if (saved) setRoles(reconcile(saved));
}

function updateRole(index: number, field: keyof TeamRole, value: number | string) {
  (setRoles as any)(index, field, value);
  saveToDisk([...roles]);
}

function resetTeamDefaults() {
  setRoles(reconcile(defaults.map((r) => ({ ...r }))));
  localStorage.removeItem(STORAGE_KEY);
}

function activeRoles(): TeamRole[] {
  return roles.filter((r) => r.status === 'active');
}

function futureRoles(): TeamRole[] {
  return roles.filter((r) => r.status === 'future');
}

function activeMonthlyBurn(): number {
  return activeRoles().reduce((sum, r) => {
    const loaded = computeEmployerTaxes(r.annualSalary).fullyLoaded;
    return sum + loaded / 12;
  }, 0);
}

function teamCostAtMonth(month: number): number {
  return roles
    .filter((r) => r.status === 'active' || (r.status === 'future' && r.startMonth !== undefined && month >= r.startMonth))
    .reduce((sum, r) => {
      const loaded = computeEmployerTaxes(r.annualSalary).fullyLoaded;
      return sum + loaded / 12;
    }, 0);
}

export { roles, updateRole, resetTeamDefaults, activeRoles, futureRoles, activeMonthlyBurn, teamCostAtMonth };
