import { For, Show, createSignal } from 'solid-js';
import { roles, defaults, updateRole, resetTeamDefaults, activeMonthlyBurn } from '../../data/teamStore';
import { computeEmployerTaxes, type TeamRole } from '../../data/costs';
import EditableValue from './EditableValue';
import { formatCurrency } from '../../lib/format';

export default function TeamDiagram() {
  const isModified = () =>
    roles.some(
      (r, i) =>
        r.annualSalary !== defaults[i].annualSalary ||
        r.headcount !== defaults[i].headcount,
    );

  const maxFullyLoaded = () =>
    Math.max(...roles.map((r) => computeEmployerTaxes(r.annualSalary).fullyLoaded), 1);

  const activeHeadcount = () =>
    roles.filter((r) => r.status === 'active').reduce((sum, r) => sum + r.headcount, 0);

  const totalHeadcount = () =>
    roles.reduce((sum, r) => sum + r.headcount, 0);

  function salaryRange(role: TeamRole): { min: number; max: number; step: number } {
    if (role.role === 'CEO') return { min: 0, max: 300000, step: 5000 };
    if (role.role === 'BD') return { min: 50000, max: 200000, step: 5000 };
    // future roles
    return { min: 50000, max: 300000, step: 5000 };
  }

  return (
    <div class="mt-6">
      {/* Proportional block visualization */}
      <div class="border border-line flex flex-col gap-px bg-line">
        <For each={roles}>
          {(role, i) => {
            const [expanded, setExpanded] = createSignal(false);
            const taxes = () => computeEmployerTaxes(role.annualSalary);
            const range = () => salaryRange(role);

            return (
              <div
                class="transition-colors hover:brightness-110"
                classList={{ 'opacity-60': role.status === 'future' }}
                style={{
                  'background-color': `color-mix(in srgb, ${role.color} 10%, var(--color-panel))`,
                  'border-left': `3px solid ${role.color}`,
                  'min-height': '60px',
                  'flex-grow': Math.max(taxes().fullyLoaded / maxFullyLoaded(), 0.08),
                }}
              >
                <div class="p-4">
                  <div class="flex items-center gap-3 flex-wrap max-[640px]:flex-col max-[640px]:items-start">
                    {/* Role name + special label */}
                    <div class="flex flex-col">
                      <span class="font-body font-semibold text-ink">
                        {role.role === 'CEO' ? 'CEO Salary' : role.role}
                      </span>
                      <Show when={role.role === 'CEO'}>
                        <span class="font-mono text-[9px] text-ink-faint">(deferred comp -- editable)</span>
                      </Show>
                    </div>

                    {/* Status badge */}
                    <span
                      class="font-mono text-[9px] uppercase tracking-[.1em] px-2 py-0.5 rounded"
                      classList={{
                        'bg-up/20 text-up font-semibold': role.status === 'active',
                        'bg-public/15 text-public': role.status === 'future',
                      }}
                    >
                      {role.status === 'active' ? 'Active' : `Planned — M${role.startMonth}`}
                    </span>

                    {/* Headcount */}
                    <span class="font-mono text-[10px] bg-panel-2 px-2 py-0.5 rounded text-ink-faint">
                      {role.headcount} {role.headcount === 1 ? 'person' : 'people'}
                    </span>

                    {/* Annual salary (editable) */}
                    <div class="ml-auto max-[640px]:ml-0 text-right">
                      <div class="font-mono text-[.86rem] text-ink">
                        <EditableValue
                          value={role.annualSalary}
                          onChange={(v) => updateRole(i(), 'annualSalary', v)}
                          min={range().min}
                          max={range().max}
                          step={range().step}
                          format={(v) => `${formatCurrency(v, true)}/yr`}
                        />
                      </div>
                      <div class="font-mono text-[10px] text-ink-faint">
                        {formatCurrency(taxes().fullyLoaded, true)}/yr loaded
                      </div>
                    </div>
                  </div>

                  {/* Tax / loaded cost summary row */}
                  <div class="flex items-center gap-4 mt-2 flex-wrap font-mono text-[10px] text-ink-faint">
                    <span>Tax burden: <span class="text-ink-dim">{formatCurrency(taxes().total, true)}</span></span>
                    <span>Fully loaded: <span class="text-ink">{formatCurrency(taxes().fullyLoaded, true)}/yr</span></span>
                    <span>Monthly: <span class="text-ink-dim">{formatCurrency(taxes().fullyLoaded / 12, true)}/mo</span></span>

                    {/* Tax breakdown toggle */}
                    <button
                      class="ml-auto text-[9px] font-mono text-ink-dim border border-line px-1.5 py-0.5 hover:border-acid hover:text-ink transition-colors"
                      onClick={() => setExpanded(!expanded())}
                    >
                      {expanded() ? 'Hide taxes' : 'Tax detail'}
                    </button>
                  </div>

                  {/* Expanded tax breakdown */}
                  <Show when={expanded()}>
                    <div class="mt-3 ml-1 border-l-2 border-line pl-3">
                      <table class="text-[11px] font-mono">
                        <tbody>
                          <tr><td class="pr-4 py-0.5 text-ink-faint">Social Security</td><td class="text-ink-dim">{formatCurrency(taxes().socialSecurity)}</td></tr>
                          <tr><td class="pr-4 py-0.5 text-ink-faint">Medicare</td><td class="text-ink-dim">{formatCurrency(taxes().medicare)}</td></tr>
                          <tr><td class="pr-4 py-0.5 text-ink-faint">FUTA</td><td class="text-ink-dim">{formatCurrency(taxes().futa)}</td></tr>
                          <tr><td class="pr-4 py-0.5 text-ink-faint">SUTA</td><td class="text-ink-dim">{formatCurrency(taxes().suta)}</td></tr>
                          <tr><td class="pr-4 py-0.5 text-ink-faint">Workers' Comp</td><td class="text-ink-dim">{formatCurrency(taxes().workersComp)}</td></tr>
                          <tr><td class="pr-4 py-0.5 text-ink-faint">Health Insurance</td><td class="text-ink-dim">{formatCurrency(taxes().healthInsurance)}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </Show>
                </div>
              </div>
            );
          }}
        </For>
      </div>

      {/* Summary bar */}
      <div class="bg-panel border border-line p-4 mt-0">
        <div class="flex gap-6 flex-wrap font-mono text-sm items-center">
          <span class="text-ink-faint">
            <span class="text-ink font-semibold">{activeHeadcount()}</span> / <span class="text-ink font-semibold">{totalHeadcount()}</span> headcount
          </span>
          <span class="text-ink-faint">
            Active burn <span class="text-ink font-semibold">{formatCurrency(activeMonthlyBurn(), true)}</span>/mo
          </span>
          <span class="text-ink-faint">
            <span class="text-ink font-semibold">{formatCurrency(activeMonthlyBurn() * 12, true)}</span>/yr
          </span>
          <Show when={isModified()}>
            <button
              class="ml-auto text-[11px] font-mono text-ink-faint border border-line px-2 py-1 hover:border-acid hover:text-ink transition-colors"
              onClick={resetTeamDefaults}
            >
              Reset to defaults
            </button>
          </Show>
        </div>
      </div>
    </div>
  );
}
