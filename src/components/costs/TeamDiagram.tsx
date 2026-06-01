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

  const totalMonthlyLoaded = () =>
    roles.reduce((sum, r) => sum + computeEmployerTaxes(r.annualSalary).fullyLoaded * r.headcount / 12, 0);

  const totalAnnualLoaded = () =>
    roles.reduce((sum, r) => sum + computeEmployerTaxes(r.annualSalary).fullyLoaded * r.headcount, 0);

  const totalBaseSalary = () =>
    roles.reduce((sum, r) => sum + r.annualSalary * r.headcount, 0);

  const totalTaxBurden = () => totalAnnualLoaded() - totalBaseSalary();

  function salaryRange(role: TeamRole): { min: number; max: number; step: number } {
    if (role.role === 'CEO') return { min: 0, max: 300000, step: 5000 };
    if (role.role === 'BD') return { min: 50000, max: 200000, step: 5000 };
    return { min: 50000, max: 300000, step: 5000 };
  }

  return (
    <div class="mt-6">
      {/* Tax-adjusted callout */}
      <div class="bg-panel border border-acid/20 p-5 mb-6">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-[6px] h-[6px] rounded-full bg-acid" style="box-shadow:0 0 6px var(--color-acid)" />
          <span class="font-mono text-[11px] uppercase tracking-[.14em] text-acid font-semibold">Tax-Adjusted Costs</span>
        </div>
        <p class="text-ink-dim text-[.94rem] leading-relaxed">
          All figures below include full US employer tax burden: Social Security (6.2%, capped at $170k), Medicare (1.45%), FUTA, SUTA, workers' comp, and $600/mo health insurance per employee. The "fully loaded" cost is what the company actually pays.
        </p>
      </div>

      {/* Role rows */}
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
                  'min-height': '70px',
                  'flex-grow': Math.max(taxes().fullyLoaded / maxFullyLoaded(), 0.08),
                }}
              >
                <div class="p-5">
                  <div class="flex items-center gap-4 flex-wrap max-[640px]:flex-col max-[640px]:items-start">
                    {/* Role name */}
                    <div class="flex flex-col">
                      <span class="font-body font-semibold text-ink text-[1.1rem]">
                        {role.role === 'CEO' ? 'CEO Salary' : role.role}
                      </span>
                      <Show when={role.role === 'CEO'}>
                        <span class="font-mono text-[.8rem] text-ink-faint">(deferred comp — editable)</span>
                      </Show>
                    </div>

                    {/* Status badge */}
                    <span
                      class="font-mono text-[.75rem] uppercase tracking-[.1em] px-2.5 py-1 rounded"
                      classList={{
                        'bg-up/20 text-up font-semibold': role.status === 'active',
                        'bg-public/15 text-public': role.status === 'future',
                      }}
                    >
                      {role.status === 'active' ? 'Active' : `Planned — M${role.startMonth}`}
                    </span>

                    {/* Headcount */}
                    <span class="font-mono text-[.8rem] bg-panel-2 px-2.5 py-1 rounded text-ink-faint">
                      {role.headcount} {role.headcount === 1 ? 'person' : 'people'}
                    </span>

                    {/* Salary + loaded cost */}
                    <div class="ml-auto max-[640px]:ml-0 text-right">
                      <div class="font-mono text-[1rem] text-ink">
                        <EditableValue
                          value={role.annualSalary}
                          onChange={(v) => updateRole(i(), 'annualSalary', v)}
                          min={range().min}
                          max={range().max}
                          step={range().step}
                          format={(v) => `${formatCurrency(v, true)}/yr`}
                        />
                      </div>
                      <div class="font-mono text-[.88rem] text-acid">
                        {formatCurrency(taxes().fullyLoaded, true)}/yr loaded
                      </div>
                    </div>
                  </div>

                  {/* Tax summary row */}
                  <div class="flex items-center gap-5 mt-3 flex-wrap font-mono text-[.88rem]">
                    <span class="text-ink-faint">Tax burden: <span class="text-ink">{formatCurrency(taxes().total, true)}</span></span>
                    <span class="text-ink-faint">Monthly: <span class="text-ink">{formatCurrency(taxes().fullyLoaded / 12, true)}/mo</span></span>

                    <button
                      class="ml-auto text-[.8rem] font-mono text-ink-dim border border-line px-2.5 py-1 hover:border-acid hover:text-ink transition-colors"
                      onClick={() => setExpanded(!expanded())}
                    >
                      {expanded() ? 'Hide taxes' : 'Tax detail'}
                    </button>
                  </div>

                  {/* Expanded tax breakdown */}
                  <Show when={expanded()}>
                    <div class="mt-4 ml-1 border-l-2 border-line pl-4">
                      <table class="text-[.85rem] font-mono">
                        <tbody>
                          <tr><td class="pr-6 py-1 text-ink-faint">Social Security</td><td class="text-ink">{formatCurrency(taxes().socialSecurity)}</td></tr>
                          <tr><td class="pr-6 py-1 text-ink-faint">Medicare</td><td class="text-ink">{formatCurrency(taxes().medicare)}</td></tr>
                          <tr><td class="pr-6 py-1 text-ink-faint">FUTA</td><td class="text-ink">{formatCurrency(taxes().futa)}</td></tr>
                          <tr><td class="pr-6 py-1 text-ink-faint">SUTA</td><td class="text-ink">{formatCurrency(taxes().suta)}</td></tr>
                          <tr><td class="pr-6 py-1 text-ink-faint">Workers' Comp</td><td class="text-ink">{formatCurrency(taxes().workersComp)}</td></tr>
                          <tr><td class="pr-6 py-1 text-ink-faint">Health Insurance</td><td class="text-ink">{formatCurrency(taxes().healthInsurance)}</td></tr>
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
      <div class="bg-panel border border-line p-5 mt-0">
        <div class="flex gap-6 flex-wrap font-mono text-[.92rem] items-center">
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

      {/* Team Cost Breakdown Table */}
      <div class="mt-8">
        <h3 class="font-display font-semibold text-[1.2rem] mb-5">Team Cost Breakdown</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-line">
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-4">Role</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-4">Status</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-4">Base Salary</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-4">Tax Burden</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-4">Monthly (loaded)</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2">Annual (loaded)</th>
              </tr>
            </thead>
            <tbody>
              <For each={roles}>
                {(role) => {
                  const taxes = () => computeEmployerTaxes(role.annualSalary);
                  return (
                    <tr
                      class="border-b border-line"
                      classList={{ 'opacity-60': role.status === 'future' }}
                    >
                      <td class="py-2.5 pr-4 text-[.92rem] text-ink font-semibold">{role.role}</td>
                      <td class="py-2.5 pr-4">
                        <span
                          class="font-mono text-[9px] uppercase tracking-[.08em] px-2 py-0.5 rounded"
                          classList={{
                            'bg-up/20 text-up': role.status === 'active',
                            'bg-public/15 text-public': role.status === 'future',
                          }}
                        >
                          {role.status === 'active' ? 'Active' : `M${role.startMonth}`}
                        </span>
                      </td>
                      <td class="py-2.5 pr-4 font-mono text-[.88rem] text-ink">{formatCurrency(role.annualSalary, true)}</td>
                      <td class="py-2.5 pr-4 font-mono text-[.88rem] text-ink-dim">{formatCurrency(taxes().total, true)}</td>
                      <td class="py-2.5 pr-4 font-mono text-[.88rem] text-ink">{formatCurrency(taxes().fullyLoaded / 12, true)}</td>
                      <td class="py-2.5 font-mono text-[.88rem] text-acid">{formatCurrency(taxes().fullyLoaded, true)}</td>
                    </tr>
                  );
                }}
              </For>
              {/* Totals row */}
              <tr class="font-semibold border-t-2 border-line">
                <td class="py-3 pr-4 text-[.92rem] text-ink" colSpan={2}>Total</td>
                <td class="py-3 pr-4 font-mono text-[.88rem] text-ink">{formatCurrency(totalBaseSalary(), true)}</td>
                <td class="py-3 pr-4 font-mono text-[.88rem] text-ink-dim">{formatCurrency(totalTaxBurden(), true)}</td>
                <td class="py-3 pr-4 font-mono text-[.88rem] text-ink">{formatCurrency(totalMonthlyLoaded(), true)}</td>
                <td class="py-3 font-mono text-[.88rem] text-acid">{formatCurrency(totalAnnualLoaded(), true)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
