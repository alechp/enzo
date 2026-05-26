import { For } from 'solid-js';
import { teamRoles, type TeamRole } from '../../data/costs';
import { formatCurrency } from '../../lib/format';

export default function TeamDiagram() {
  const totalHeadcount = () => teamRoles.reduce((sum: number, r: TeamRole) => sum + r.headcount, 0);
  const totalMonthly = () => teamRoles.reduce((sum: number, r: TeamRole) => sum + r.monthlyCost, 0);
  const totalAnnual = () => totalMonthly() * 12;
  const maxCost = () => Math.max(...teamRoles.map((r: TeamRole) => r.monthlyCost));

  return (
    <div class="mt-6">
      {/* Proportional block visualization */}
      <div class="border border-line flex flex-col gap-px bg-line">
        <For each={teamRoles}>
          {(role) => (
            <div
              class="p-4 transition-colors hover:brightness-110"
              style={{
                'background-color': `color-mix(in srgb, ${role.color} 10%, var(--color-panel))`,
                'border-left': `3px solid ${role.color}`,
                'min-height': '60px',
                'flex-grow': role.monthlyCost / maxCost(),
              }}
            >
              <div class="flex items-center gap-3 flex-wrap">
                <span class="font-body font-semibold text-ink">{role.role}</span>
                <span class="font-mono text-[10px] bg-panel-2 px-2 py-0.5 rounded text-ink-faint">
                  {role.headcount} {role.headcount === 1 ? 'person' : 'people'}
                </span>
                <span class="font-mono text-[.86rem] text-ink-dim ml-auto">
                  {formatCurrency(role.monthlyCost, true)}/mo
                </span>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Summary bar */}
      <div class="bg-panel border border-line p-4 mt-0">
        <div class="flex gap-6 flex-wrap font-mono text-sm">
          <span class="text-ink-faint">
            Total <span class="text-ink font-semibold">{totalHeadcount()}</span> headcount
          </span>
          <span class="text-ink-faint">
            <span class="text-ink font-semibold">{formatCurrency(totalMonthly(), true)}</span>/mo
          </span>
          <span class="text-ink-faint">
            <span class="text-ink font-semibold">{formatCurrency(totalAnnual(), true)}</span>/yr
          </span>
        </div>
      </div>
    </div>
  );
}
