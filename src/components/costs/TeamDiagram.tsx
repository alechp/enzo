import { For, Show, onMount } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import { teamRoles, type TeamRole } from '../../data/costs';
import { formatCurrency } from '../../lib/format';
import EditableValue from './EditableValue';

const STORAGE_KEY = 'enzo-adjusted-team';

function loadSaved(): TeamRole[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function saveToDisk(roles: TeamRole[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(roles));
}

export default function TeamDiagram() {
  const defaults = teamRoles.map((r) => ({ ...r }));
  const [roles, setRoles] = createStore<TeamRole[]>(defaults.map((r) => ({ ...r })));

  onMount(() => {
    const saved = loadSaved();
    if (saved && saved.length === defaults.length) {
      setRoles(reconcile(saved));
    }
  });

  const totalHeadcount = () => roles.reduce((sum, r) => sum + r.headcount, 0);
  const totalMonthly = () => roles.reduce((sum, r) => sum + r.monthlyCost, 0);
  const totalAnnual = () => totalMonthly() * 12;
  const maxCost = () => Math.max(...roles.map((r) => r.monthlyCost));

  const isModified = () =>
    roles.some(
      (r, i) =>
        r.headcount !== defaults[i].headcount ||
        r.monthlyCost !== defaults[i].monthlyCost,
    );

  const updateRole = (index: number, field: 'headcount' | 'monthlyCost', value: number) => {
    setRoles(index, field, value);
    saveToDisk([...roles]);
  };

  const resetDefaults = () => {
    setRoles(reconcile(defaults.map((r) => ({ ...r }))));
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div class="mt-6">
      {/* Proportional block visualization */}
      <div class="border border-line flex flex-col gap-px bg-line">
        <For each={roles}>
          {(role, i) => (
            <div
              class="p-4 transition-colors hover:brightness-110"
              style={{
                'background-color': `color-mix(in srgb, ${role.color} 10%, var(--color-panel))`,
                'border-left': `3px solid ${role.color}`,
                'min-height': '60px',
                'flex-grow': role.monthlyCost / maxCost(),
              }}
            >
              <div class="flex items-center gap-3 flex-wrap max-[640px]:flex-col max-[640px]:items-start">
                <span class="font-body font-semibold text-ink">{role.role}</span>
                <span class="font-mono text-[10px] bg-panel-2 px-2 py-0.5 rounded text-ink-faint">
                  <EditableValue
                    value={role.headcount}
                    onChange={(v) => updateRole(i(), 'headcount', v)}
                    min={0}
                    max={15}
                    step={1}
                    format={(v) => `${v} ${v === 1 ? 'person' : 'people'}`}
                  />
                </span>
                <span class="font-mono text-[.86rem] text-ink-dim ml-auto max-[640px]:ml-0">
                  <EditableValue
                    value={role.monthlyCost}
                    onChange={(v) => updateRole(i(), 'monthlyCost', v)}
                    min={0}
                    max={300000}
                    step={5000}
                    format={(v) => `${formatCurrency(v, true)}/mo`}
                  />
                </span>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Summary bar */}
      <div class="bg-panel border border-line p-4 mt-0">
        <div class="flex gap-6 flex-wrap font-mono text-sm items-center">
          <span class="text-ink-faint">
            Total <span class="text-ink font-semibold">{totalHeadcount()}</span> headcount
          </span>
          <span class="text-ink-faint">
            <span class="text-ink font-semibold">{formatCurrency(totalMonthly(), true)}</span>/mo
          </span>
          <span class="text-ink-faint">
            <span class="text-ink font-semibold">{formatCurrency(totalAnnual(), true)}</span>/yr
          </span>
          <Show when={isModified()}>
            <button
              class="ml-auto text-[11px] font-mono text-ink-faint border border-line px-2 py-1 hover:border-acid hover:text-ink transition-colors"
              onClick={resetDefaults}
            >
              Reset to defaults
            </button>
          </Show>
        </div>
      </div>
    </div>
  );
}
