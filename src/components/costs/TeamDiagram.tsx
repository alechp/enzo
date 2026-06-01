import { For, Show, createSignal } from 'solid-js';
import { roles, defaults, updateRole, resetTeamDefaults, activeMonthlyBurn } from '../../data/teamStore';
import { computeEmployerTaxes, computeEmployeeTaxes, type TeamRole } from '../../data/costs';
import EditableValue from './EditableValue';
import { formatCurrency } from '../../lib/format';

const locationLabel: Record<string, string> = {
  PR: 'Puerto Rico',
  CA: 'California',
  'US-default': 'US (default)',
};

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
    if (role.role === 'Business Development') return { min: 50000, max: 200000, step: 5000 };
    return { min: 50000, max: 400000, step: 5000 };
  }

  return (
    <div class="mt-6">
      {/* Tax-adjusted callout */}
      <div class="bg-panel border border-acid/20 p-5 mb-6">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-[6px] h-[6px] rounded-full bg-acid" style="box-shadow:0 0 6px var(--color-acid)" />
          <span class="font-mono text-[.8rem] uppercase tracking-[.14em] text-acid font-semibold">Tax-Adjusted Costs</span>
        </div>
        <p class="text-ink-dim text-[.94rem] leading-relaxed">
          All figures include full US employer tax burden (SS, Medicare, FUTA, SUTA, workers' comp, health insurance).
          Employee take-home is computed per location: <strong class="text-ink">Puerto Rico</strong> (no federal income tax on PR-sourced income, ~6.5% PR tax) and <strong class="text-ink">California</strong> (federal + CA state progressive brackets).
        </p>
      </div>

      {/* Role rows */}
      <div class="border border-line flex flex-col gap-px bg-line">
        <For each={roles}>
          {(role, i) => {
            const [expanded, setExpanded] = createSignal(false);
            const taxes = () => computeEmployerTaxes(role.annualSalary);
            const empTaxes = () => computeEmployeeTaxes(role.annualSalary, role.location);
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
                      <span class="font-mono text-[.75rem] text-ink-faint">{locationLabel[role.location]}</span>
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
                        <span class="text-ink-faint"> (+{formatCurrency(taxes().total, true)} taxes)</span>
                      </div>
                    </div>
                  </div>

                  {/* Monthly breakdown */}
                  <div class="grid grid-cols-3 gap-4 mt-4 max-[640px]:grid-cols-1">
                    <div class="bg-panel-2 border border-line p-3 rounded">
                      <div class="font-mono text-[.7rem] uppercase tracking-[.1em] text-ink-faint mb-1">Monthly cost to business</div>
                      <div class="font-mono text-[.92rem] text-ink font-semibold">{formatCurrency(taxes().fullyLoaded / 12, true)}</div>
                    </div>
                    <div class="bg-panel-2 border border-line p-3 rounded">
                      <div class="font-mono text-[.7rem] uppercase tracking-[.1em] text-ink-faint mb-1">Monthly gross (employee)</div>
                      <div class="font-mono text-[.92rem] text-ink">{formatCurrency(empTaxes().monthlyGross, true)}</div>
                    </div>
                    <div class="bg-panel-2 border border-line p-3 rounded">
                      <div class="font-mono text-[.7rem] uppercase tracking-[.1em] text-ink-faint mb-1">Monthly take-home</div>
                      <div class="font-mono text-[.92rem] text-up font-semibold">{formatCurrency(empTaxes().monthlyTakeHome, true)}</div>
                    </div>
                  </div>

                  {/* Tax detail toggle */}
                  <div class="flex items-center mt-3">
                    <button
                      class="text-[.8rem] font-mono text-ink-dim border border-line px-2.5 py-1 hover:border-acid hover:text-ink transition-colors"
                      onClick={() => setExpanded(!expanded())}
                    >
                      {expanded() ? 'Hide detail' : 'Full tax breakdown'}
                    </button>
                  </div>

                  {/* Expanded breakdown: employer + employee side-by-side */}
                  <Show when={expanded()}>
                    <div class="grid grid-cols-2 gap-6 mt-4 max-[640px]:grid-cols-1">
                      {/* Employer side */}
                      <div class="border-l-2 border-acid/40 pl-4">
                        <div class="font-mono text-[.75rem] uppercase tracking-[.1em] text-acid mb-2">Employer taxes</div>
                        <table class="text-[.85rem] font-mono w-full">
                          <tbody>
                            <tr><td class="pr-4 py-1 text-ink-faint">Social Security</td><td class="text-ink text-right">{formatCurrency(taxes().socialSecurity)}</td></tr>
                            <tr><td class="pr-4 py-1 text-ink-faint">Medicare</td><td class="text-ink text-right">{formatCurrency(taxes().medicare)}</td></tr>
                            <tr><td class="pr-4 py-1 text-ink-faint">FUTA</td><td class="text-ink text-right">{formatCurrency(taxes().futa)}</td></tr>
                            <tr><td class="pr-4 py-1 text-ink-faint">SUTA</td><td class="text-ink text-right">{formatCurrency(taxes().suta)}</td></tr>
                            <tr><td class="pr-4 py-1 text-ink-faint">Workers' Comp</td><td class="text-ink text-right">{formatCurrency(taxes().workersComp)}</td></tr>
                            <tr><td class="pr-4 py-1 text-ink-faint">Health Insurance</td><td class="text-ink text-right">{formatCurrency(taxes().healthInsurance)}</td></tr>
                            <tr class="border-t border-line font-semibold"><td class="pr-4 py-1 text-ink-faint">Total employer</td><td class="text-acid text-right">{formatCurrency(taxes().total)}</td></tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Employee side */}
                      <div class="border-l-2 border-wrapper/40 pl-4">
                        <div class="font-mono text-[.75rem] uppercase tracking-[.1em] text-wrapper mb-2">Employee taxes ({locationLabel[role.location]})</div>
                        <table class="text-[.85rem] font-mono w-full">
                          <tbody>
                            <tr><td class="pr-4 py-1 text-ink-faint">Federal income</td><td class="text-ink text-right">{formatCurrency(empTaxes().federalIncome)}</td></tr>
                            <tr><td class="pr-4 py-1 text-ink-faint">State/local income</td><td class="text-ink text-right">{formatCurrency(empTaxes().stateIncome)}</td></tr>
                            <tr><td class="pr-4 py-1 text-ink-faint">Employee SS</td><td class="text-ink text-right">{formatCurrency(empTaxes().employeeSS)}</td></tr>
                            <tr><td class="pr-4 py-1 text-ink-faint">Employee Medicare</td><td class="text-ink text-right">{formatCurrency(empTaxes().employeeMedicare)}</td></tr>
                            <tr class="border-t border-line font-semibold"><td class="pr-4 py-1 text-ink-faint">Total deductions</td><td class="text-down text-right">{formatCurrency(empTaxes().totalEmployeeTax)}</td></tr>
                            <tr class="font-semibold"><td class="pr-4 py-1 text-ink-faint">Annual take-home</td><td class="text-up text-right">{formatCurrency(empTaxes().annualTakeHome)}</td></tr>
                          </tbody>
                        </table>
                      </div>
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
              class="ml-auto text-[.8rem] font-mono text-ink-faint border border-line px-2 py-1 hover:border-acid hover:text-ink transition-colors"
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
          <table class="w-full text-left min-w-[800px]">
            <thead>
              <tr class="border-b border-line">
                <th class="font-mono text-[.7rem] uppercase tracking-[.14em] text-ink-faint py-2 pr-3">Role</th>
                <th class="font-mono text-[.7rem] uppercase tracking-[.14em] text-ink-faint py-2 pr-3">Location</th>
                <th class="font-mono text-[.7rem] uppercase tracking-[.14em] text-ink-faint py-2 pr-3">Base</th>
                <th class="font-mono text-[.7rem] uppercase tracking-[.14em] text-ink-faint py-2 pr-3">Employer Tax</th>
                <th class="font-mono text-[.7rem] uppercase tracking-[.14em] text-ink-faint py-2 pr-3">Cost/mo</th>
                <th class="font-mono text-[.7rem] uppercase tracking-[.14em] text-ink-faint py-2 pr-3">Cost/yr</th>
                <th class="font-mono text-[.7rem] uppercase tracking-[.14em] text-ink-faint py-2 pr-3">Take-home/mo</th>
              </tr>
            </thead>
            <tbody>
              <For each={roles}>
                {(role) => {
                  const taxes = () => computeEmployerTaxes(role.annualSalary);
                  const empTaxes = () => computeEmployeeTaxes(role.annualSalary, role.location);
                  return (
                    <tr
                      class="border-b border-line"
                      classList={{ 'opacity-60': role.status === 'future' }}
                    >
                      <td class="py-2.5 pr-3 text-[.88rem] text-ink font-semibold">{role.role}</td>
                      <td class="py-2.5 pr-3 font-mono text-[.8rem] text-ink-faint">{locationLabel[role.location]}</td>
                      <td class="py-2.5 pr-3 font-mono text-[.88rem] text-ink">{formatCurrency(role.annualSalary, true)}</td>
                      <td class="py-2.5 pr-3 font-mono text-[.88rem] text-ink-dim">{formatCurrency(taxes().total, true)}</td>
                      <td class="py-2.5 pr-3 font-mono text-[.88rem] text-ink">{formatCurrency(taxes().fullyLoaded / 12, true)}</td>
                      <td class="py-2.5 pr-3 font-mono text-[.88rem] text-acid">{formatCurrency(taxes().fullyLoaded, true)}</td>
                      <td class="py-2.5 font-mono text-[.88rem] text-up">{formatCurrency(empTaxes().monthlyTakeHome, true)}</td>
                    </tr>
                  );
                }}
              </For>
              <tr class="font-semibold border-t-2 border-line">
                <td class="py-3 pr-3 text-[.88rem] text-ink" colSpan={2}>Total</td>
                <td class="py-3 pr-3 font-mono text-[.88rem] text-ink">{formatCurrency(totalBaseSalary(), true)}</td>
                <td class="py-3 pr-3 font-mono text-[.88rem] text-ink-dim">{formatCurrency(totalTaxBurden(), true)}</td>
                <td class="py-3 pr-3 font-mono text-[.88rem] text-ink">{formatCurrency(totalMonthlyLoaded(), true)}</td>
                <td class="py-3 pr-3 font-mono text-[.88rem] text-acid">{formatCurrency(totalAnnualLoaded(), true)}</td>
                <td class="py-3 font-mono text-[.88rem] text-up">
                  {formatCurrency(roles.reduce((sum, r) => sum + computeEmployeeTaxes(r.annualSalary, r.location).monthlyTakeHome * r.headcount, 0), true)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
