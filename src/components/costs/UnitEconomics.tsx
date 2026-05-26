import { For } from 'solid-js';
import { videoCosts, fixedCosts, type VideoCost, type FixedCost } from '../../data/costs';
import { formatCurrency } from '../../lib/format';

export default function UnitEconomics() {
  const totalVideoMin = () => videoCosts.reduce((sum: number, v: VideoCost) => sum + v.min, 0);
  const totalVideoMax = () => videoCosts.reduce((sum: number, v: VideoCost) => sum + v.max, 0);
  const totalFixedMonthly = () => fixedCosts.reduce((sum: number, f: FixedCost) => sum + f.monthly, 0);
  const totalFixedAnnual = () => fixedCosts.reduce((sum: number, f: FixedCost) => sum + f.annual, 0);

  const barColors = ['#ff5e3a', '#3aa0ff', '#b18cff', '#ffd166'];

  const perCustomerMetrics = [
    { label: 'Avg videos/customer/month', value: '12', note: '' },
    { label: 'COGS per customer/month', value: '$7.20–$17.88', note: '' },
    { label: 'Target price point', value: '$49–$149/mo', note: '' },
    { label: 'Gross margin', value: '76%–88%', colorClass: 'text-up' },
    { label: 'CAC (blended)', value: '$120–$200', note: '' },
    { label: 'LTV:CAC ratio', value: '5.9–9.9x', colorClass: 'text-up' },
  ];

  return (
    <div class="mt-6 space-y-12">
      {/* Section A: Per-Video Cost Breakdown */}
      <div>
        <h3 class="font-display font-semibold text-[1.2rem] mb-5">Per-Video Cost Breakdown</h3>

        {/* Stacked bar */}
        <div class="flex h-10 border border-line rounded-sm overflow-hidden mb-5">
          <For each={videoCosts}>
            {(cost, i) => {
              const pct = () => (cost.max / totalVideoMax()) * 100;
              return (
                <div
                  style={{
                    width: `${pct()}%`,
                    'background-color': cost.color || barColors[i() % barColors.length],
                  }}
                  class="flex items-center justify-center text-[9px] font-mono text-bg font-semibold overflow-hidden whitespace-nowrap px-1"
                  title={`${cost.component}: $${cost.min}–$${cost.max}`}
                >
                  {pct() > 12 ? cost.component : ''}
                </div>
              );
            }}
          </For>
        </div>

        {/* Cost table */}
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-line">
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-4">Component</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-4">Min</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-4">Max</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              <For each={videoCosts}>
                {(cost) => (
                  <tr class="border-b border-line">
                    <td class="py-2 pr-4 text-[.88rem] text-ink">{cost.component}</td>
                    <td class="py-2 pr-4 font-mono text-[.84rem] text-ink-dim">${cost.min.toFixed(2)}</td>
                    <td class="py-2 pr-4 font-mono text-[.84rem] text-ink-dim">${cost.max.toFixed(2)}</td>
                    <td class="py-2 text-[.84rem] text-ink-faint">{cost.notes}</td>
                  </tr>
                )}
              </For>
              <tr class="font-semibold">
                <td class="py-2 pr-4 text-[.88rem] text-ink">Total COGS</td>
                <td class="py-2 pr-4 font-mono text-[.84rem] text-ink">${totalVideoMin().toFixed(2)}</td>
                <td class="py-2 pr-4 font-mono text-[.84rem] text-ink">${totalVideoMax().toFixed(2)}</td>
                <td class="py-2 text-[.84rem] text-ink-faint" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section B: Per-Customer Monthly Economics */}
      <div>
        <h3 class="font-display font-semibold text-[1.2rem] mb-5">Per-Customer Monthly Economics</h3>
        <div class="grid grid-cols-3 gap-4 max-[880px]:grid-cols-2 max-[640px]:grid-cols-1">
          <For each={perCustomerMetrics}>
            {(metric) => (
              <div class="bg-panel border border-line p-4">
                <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
                  {metric.label}
                </div>
                <div
                  class={`font-display font-black text-[1.4rem] leading-none ${metric.colorClass || 'text-ink'}`}
                >
                  {metric.value}
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Section C: Fixed Costs */}
      <div>
        <h3 class="font-display font-semibold text-[1.2rem] mb-5">Fixed Costs (Monthly, at Scale)</h3>

        <div class="overflow-x-auto mb-8">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-line">
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-4">Category</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-4">Monthly</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2">Annual</th>
              </tr>
            </thead>
            <tbody>
              <For each={fixedCosts}>
                {(cost) => (
                  <tr class="border-b border-line">
                    <td class="py-2 pr-4 text-[.88rem] text-ink">{cost.category}</td>
                    <td class="py-2 pr-4 font-mono text-[.84rem] text-ink-dim">
                      {formatCurrency(cost.monthly, true)}
                    </td>
                    <td class="py-2 font-mono text-[.84rem] text-ink-dim">
                      {formatCurrency(cost.annual, true)}
                    </td>
                  </tr>
                )}
              </For>
              <tr class="font-semibold">
                <td class="py-2 pr-4 text-[.88rem] text-ink">Total Fixed</td>
                <td class="py-2 pr-4 font-mono text-[.84rem] text-ink">
                  {formatCurrency(totalFixedMonthly(), true)}
                </td>
                <td class="py-2 font-mono text-[.84rem] text-ink">
                  {formatCurrency(totalFixedAnnual(), true)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Breakeven KPI */}
        <div class="bg-panel border border-line p-8 text-center">
          <div class="font-display font-black text-[2.7rem] text-acid leading-none mb-2">
            ~5,500
          </div>
          <div class="text-ink-dim text-[.95rem] mb-3">
            customers to cover fixed burn at $99/mo mid-tier
          </div>
          <div class="font-mono text-[10px] text-ink-faint tracking-wide">
            $445k / ($99 &times; 0.82) &asymp; 5,482
          </div>
        </div>
      </div>
    </div>
  );
}
