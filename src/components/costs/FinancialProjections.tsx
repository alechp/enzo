import { For, createSignal } from 'solid-js';
import { teamCostAtMonth } from '../../data/teamStore';
import { fixedCosts } from '../../data/costs';
import { formatCurrency } from '../../lib/format';

interface MonthRow {
  month: number;
  teamCost: number;
  fixedCost: number;
  totalBurn: number;
  cumulativeBurn: number;
}

export default function FinancialProjections() {
  const [months] = createSignal(24);

  const fixedMonthly = () => fixedCosts.reduce((sum, f) => sum + f.monthly, 0);

  const rows = (): MonthRow[] => {
    const result: MonthRow[] = [];
    let cumulative = 0;
    for (let m = 1; m <= months(); m++) {
      const teamCost = teamCostAtMonth(m);
      const fixed = fixedMonthly();
      const totalBurn = teamCost + fixed;
      cumulative += totalBurn;
      result.push({
        month: m,
        teamCost,
        fixedCost: fixed,
        totalBurn,
        cumulativeBurn: cumulative,
      });
    }
    return result;
  };

  const maxBurn = () => Math.max(...rows().map((r) => r.totalBurn));

  return (
    <div class="mt-6 space-y-8">
      {/* Summary KPIs */}
      <div class="grid grid-cols-3 gap-4 max-[880px]:grid-cols-1">
        <div class="bg-panel border border-line p-5">
          <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
            Month 1 Burn
          </div>
          <div class="font-display font-black text-[1.6rem] leading-none text-ink">
            {formatCurrency(rows()[0]?.totalBurn ?? 0, true)}/mo
          </div>
        </div>
        <div class="bg-panel border border-line p-5">
          <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
            Month 24 Burn
          </div>
          <div class="font-display font-black text-[1.6rem] leading-none text-ink">
            {formatCurrency(rows()[23]?.totalBurn ?? 0, true)}/mo
          </div>
        </div>
        <div class="bg-panel border border-line p-5">
          <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
            24-Month Total
          </div>
          <div class="font-display font-black text-[1.6rem] leading-none text-frontier">
            {formatCurrency(rows()[23]?.cumulativeBurn ?? 0, true)}
          </div>
        </div>
      </div>

      {/* Burn chart (horizontal bars) */}
      <div>
        <h3 class="font-display font-semibold text-[1.2rem] mb-5">Monthly Burn Rate</h3>
        <div class="space-y-px">
          <For each={rows()}>
            {(row) => {
              const pct = () => maxBurn() > 0 ? (row.totalBurn / maxBurn()) * 100 : 0;
              return (
                <div class="flex items-center gap-3 group">
                  <span class="font-mono text-[10px] text-ink-faint w-8 text-right shrink-0">
                    M{row.month}
                  </span>
                  <div class="flex-1 h-5 bg-panel border border-line relative overflow-hidden">
                    <div
                      class="h-full transition-all duration-300"
                      style={{
                        width: `${pct()}%`,
                        'background-color': 'var(--color-acid)',
                        opacity: 0.6 + (row.month / 24) * 0.4,
                      }}
                    />
                  </div>
                  <span class="font-mono text-[10px] text-ink-dim w-16 text-right shrink-0">
                    {formatCurrency(row.totalBurn, true)}
                  </span>
                </div>
              );
            }}
          </For>
        </div>
      </div>

      {/* Detailed table */}
      <div>
        <h3 class="font-display font-semibold text-[1.2rem] mb-5">Month-by-Month Breakdown</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-line">
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-4">Month</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-4">Team Cost</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-4">Fixed Costs</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-4">Total Burn</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              <For each={rows()}>
                {(row) => (
                  <tr class="border-b border-line hover:bg-panel-2 transition-colors">
                    <td class="py-2 pr-4 font-mono text-[.84rem] text-ink">M{row.month}</td>
                    <td class="py-2 pr-4 font-mono text-[.84rem] text-ink-dim">{formatCurrency(row.teamCost, true)}</td>
                    <td class="py-2 pr-4 font-mono text-[.84rem] text-ink-dim">{formatCurrency(row.fixedCost, true)}</td>
                    <td class="py-2 pr-4 font-mono text-[.84rem] text-ink">{formatCurrency(row.totalBurn, true)}</td>
                    <td class="py-2 font-mono text-[.84rem] text-frontier">{formatCurrency(row.cumulativeBurn, true)}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
