import { For, Show, onMount, createMemo } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import { fixedCosts } from '../../data/costs';
import { teamCostAtMonth } from '../../data/teamStore';
import { formatCurrency, formatNumber, formatPercent } from '../../lib/format';
import EditableValue from './EditableValue';

const STORAGE_KEY = 'enzo-projection-inputs';

interface ProjectionInputs {
  startingCustomers: number;
  arpu: number;
  growthRate: number;
  churnRate: number;
  grossMargin: number;
  cac: number;
  seedFunding: number;
}

interface MonthRow {
  month: number;
  newCustomers: number;
  churnedCustomers: number;
  endCustomers: number;
  mrr: number;
  grossProfit: number;
  cacSpend: number;
  teamCost: number;
  fixedCosts: number;
  totalExpenses: number;
  netIncome: number;
  cashBalance: number;
}

function makeDefaults(): ProjectionInputs {
  return {
    startingCustomers: 0,
    arpu: 99,
    growthRate: 15,
    churnRate: 5,
    grossMargin: 82,
    cac: 160,
    seedFunding: 500000,
  };
}

function loadSaved(): ProjectionInputs | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function saveToDisk(inputs: ProjectionInputs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
}

export default function FinancialProjections() {
  const defaults = makeDefaults();
  const [inputs, setInputs] = createStore<ProjectionInputs>(makeDefaults());

  onMount(() => {
    const saved = loadSaved();
    if (saved) setInputs(reconcile(saved));
  });

  const startDate = new Date();
  const monthLabels = Array.from({ length: 24 }, (_, i) => {
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + i);
    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  });

  const persist = () => saveToDisk({ ...inputs });

  const update = <K extends keyof ProjectionInputs>(key: K, value: ProjectionInputs[K]) => {
    setInputs(key, value);
    persist();
  };

  const isModified = () => {
    return (Object.keys(defaults) as (keyof ProjectionInputs)[]).some(
      (k) => inputs[k] !== defaults[k]
    );
  };

  const resetDefaults = () => {
    setInputs(reconcile(makeDefaults()));
    localStorage.removeItem(STORAGE_KEY);
  };

  // Fixed costs total (from data)
  const totalFixedCosts = () => fixedCosts.reduce((sum, f) => sum + f.monthly, 0);

  // Compute 24-month projection
  const rows = createMemo((): MonthRow[] => {
    const result: MonthRow[] = [];
    const gr = inputs.growthRate / 100;
    const cr = inputs.churnRate / 100;
    const gm = inputs.grossMargin / 100;

    for (let m = 0; m < 24; m++) {
      const prev = m > 0 ? result[m - 1] : null;

      let newCust: number;
      let churned: number;
      let endCust: number;

      if (m === 0) {
        newCust = inputs.startingCustomers;
        churned = 0;
        endCust = inputs.startingCustomers;
      } else {
        newCust = Math.floor(prev!.endCustomers * gr);
        churned = Math.floor(prev!.endCustomers * cr);
        endCust = prev!.endCustomers + newCust - churned;
      }

      const mrr = endCust * inputs.arpu;
      const grossProfit = mrr * gm;
      const cacSpend = newCust * inputs.cac;
      const teamCost = teamCostAtMonth(m);
      const fc = totalFixedCosts();
      const totalExpenses = teamCost + fc + cacSpend;
      const netIncome = grossProfit - totalExpenses;
      const cashBalance = m === 0
        ? inputs.seedFunding + netIncome
        : prev!.cashBalance + netIncome;

      result.push({
        month: m,
        newCustomers: newCust,
        churnedCustomers: churned,
        endCustomers: endCust,
        mrr,
        grossProfit,
        cacSpend,
        teamCost,
        fixedCosts: fc,
        totalExpenses,
        netIncome,
        cashBalance,
      });
    }

    return result;
  });

  // Summary KPIs
  const breakEvenMonth = createMemo(() => {
    const r = rows();
    const idx = r.findIndex((row) => row.netIncome >= 0);
    return idx >= 0 ? idx : -1;
  });

  const m24Mrr = () => rows()[23]?.mrr ?? 0;
  const m24Customers = () => rows()[23]?.endCustomers ?? 0;
  const m24Cash = () => rows()[23]?.cashBalance ?? 0;

  // SVG chart helpers
  const chartWidth = 720;
  const chartHeight = 200;
  const chartPadding = 4;

  const chartData = createMemo(() => {
    const r = rows();
    const mrrVals = r.map((row) => row.mrr);
    const expVals = r.map((row) => row.totalExpenses);
    const cashVals = r.map((row) => row.cashBalance);

    const allVals = [...mrrVals, ...expVals, ...cashVals];
    const minVal = Math.min(...allVals);
    const maxVal = Math.max(...allVals);
    const range = maxVal - minVal || 1;

    const toY = (v: number) =>
      chartPadding + (chartHeight - 2 * chartPadding) * (1 - (v - minVal) / range);
    const toX = (i: number) =>
      chartPadding + ((chartWidth - 2 * chartPadding) / 23) * i;

    const makePath = (vals: number[]) =>
      vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');

    const zeroY = (minVal <= 0 && maxVal >= 0) ? toY(0) : null;
    return {
      mrrPath: makePath(mrrVals),
      expPath: makePath(expVals),
      cashPath: makePath(cashVals),
      zeroY,
    };
  });

  return (
    <div class="mt-6 space-y-10">
      {/* Editable Inputs */}
      <div>
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-display font-semibold text-[1.2rem]">24-Month P&L Projection</h3>
          <Show when={isModified()}>
            <button
              class="text-[11px] font-mono text-ink-faint border border-line px-3 py-1.5 hover:border-acid hover:text-ink transition-colors"
              onClick={resetDefaults}
            >
              Reset to defaults
            </button>
          </Show>
        </div>

        <div class="grid grid-cols-4 gap-4 max-[1024px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
          <div class="bg-panel border border-line p-4">
            <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
              Starting Customers (M0)
            </div>
            <div class="font-display font-black text-[1.4rem] leading-none text-ink">
              <EditableValue
                value={inputs.startingCustomers}
                onChange={(v) => update('startingCustomers', v)}
                min={0}
                max={1000}
                step={10}
                format={(v) => formatNumber(v)}
              />
            </div>
          </div>

          <div class="bg-panel border border-line p-4">
            <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
              Monthly Price (ARPU)
            </div>
            <div class="font-display font-black text-[1.4rem] leading-none text-ink">
              <EditableValue
                value={inputs.arpu}
                onChange={(v) => update('arpu', v)}
                min={29}
                max={299}
                step={1}
                format={(v) => `$${v}/mo`}
              />
            </div>
          </div>

          <div class="bg-panel border border-line p-4">
            <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
              Monthly Growth Rate
            </div>
            <div class="font-display font-black text-[1.4rem] leading-none text-ink">
              <EditableValue
                value={inputs.growthRate}
                onChange={(v) => update('growthRate', v)}
                min={0}
                max={50}
                step={1}
                format={(v) => formatPercent(v, 0)}
              />
            </div>
          </div>

          <div class="bg-panel border border-line p-4">
            <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
              Monthly Churn Rate
            </div>
            <div class="font-display font-black text-[1.4rem] leading-none text-ink">
              <EditableValue
                value={inputs.churnRate}
                onChange={(v) => update('churnRate', v)}
                min={0}
                max={20}
                step={0.5}
                format={(v) => formatPercent(v, 1)}
              />
            </div>
          </div>

          <div class="bg-panel border border-line p-4">
            <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
              Gross Margin
            </div>
            <div class="font-display font-black text-[1.4rem] leading-none text-ink">
              <EditableValue
                value={inputs.grossMargin}
                onChange={(v) => update('grossMargin', v)}
                min={50}
                max={95}
                step={1}
                format={(v) => formatPercent(v, 0)}
              />
            </div>
          </div>

          <div class="bg-panel border border-line p-4">
            <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
              CAC
            </div>
            <div class="font-display font-black text-[1.4rem] leading-none text-ink">
              <EditableValue
                value={inputs.cac}
                onChange={(v) => update('cac', v)}
                min={50}
                max={500}
                step={10}
                format={(v) => `$${v}`}
              />
            </div>
          </div>

          <div class="bg-panel border border-line p-4">
            <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
              Seed Funding
            </div>
            <div class="font-display font-black text-[1.4rem] leading-none text-ink">
              <EditableValue
                value={inputs.seedFunding}
                onChange={(v) => update('seedFunding', v)}
                min={0}
                max={5000000}
                step={50000}
                format={(v) => formatCurrency(v, true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div>
        <h3 class="font-display font-semibold text-[1.2rem] mb-5">Key Metrics</h3>
        <div class="grid grid-cols-4 gap-4 max-[1024px]:grid-cols-2 max-[480px]:grid-cols-1">
          <div class="bg-panel border border-line p-4">
            <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
              Break-even Month
            </div>
            <div class="font-display font-black text-[1.8rem] leading-none text-acid">
              {breakEvenMonth() >= 0 ? `M${breakEvenMonth()}` : 'N/A'}
            </div>
          </div>

          <div class="bg-panel border border-line p-4">
            <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
              M24 MRR
            </div>
            <div class="font-display font-black text-[1.8rem] leading-none text-ink">
              {formatCurrency(m24Mrr(), true)}
            </div>
          </div>

          <div class="bg-panel border border-line p-4">
            <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
              M24 Customers
            </div>
            <div class="font-display font-black text-[1.8rem] leading-none text-ink">
              {formatNumber(m24Customers())}
            </div>
          </div>

          <div class="bg-panel border border-line p-4">
            <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
              Cash at M24
            </div>
            <div
              class="font-display font-black text-[1.8rem] leading-none"
              classList={{ 'text-up': m24Cash() >= 0, 'text-down': m24Cash() < 0 }}
            >
              {formatCurrency(m24Cash(), true)}
            </div>
          </div>
        </div>
      </div>

      {/* SVG Mini Chart */}
      <div>
        <h3 class="font-display font-semibold text-[1.2rem] mb-5">Trend</h3>
        <div class="bg-panel border border-line p-4">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight + 24}`}
            class="w-full h-auto"
            preserveAspectRatio="none"
          >
            {chartData().zeroY !== null && (
              <line x1={chartPadding} y1={chartData().zeroY!} x2={chartWidth - chartPadding} y2={chartData().zeroY!} stroke="var(--color-line)" stroke-width="1" stroke-dasharray="4,4" />
            )}
            <path d={chartData().cashPath} fill="none" stroke="var(--color-wrapper)" stroke-width="2" />
            <path d={chartData().expPath} fill="none" stroke="var(--color-down)" stroke-width="2" />
            <path d={chartData().mrrPath} fill="none" stroke="var(--color-acid)" stroke-width="2" />
            {[0, 3, 6, 9, 12, 15, 18, 21, 23].map((i) => {
              const x = chartPadding + ((chartWidth - 2 * chartPadding) / 23) * i;
              return (
                <>
                  <line x1={x} y1={chartHeight - chartPadding} x2={x} y2={chartHeight - chartPadding + 6} stroke="var(--color-line-bright)" stroke-width="1" />
                  <text x={x} y={chartHeight + 14} text-anchor="middle" fill="var(--color-ink-faint)" font-size="9" font-family="var(--font-mono)">
                    {monthLabels[i]}
                  </text>
                </>
              );
            })}
          </svg>
          <div class="flex gap-6 mt-3 justify-center">
            <div class="flex items-center gap-2">
              <div class="w-4 h-[2px] bg-acid" />
              <span class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint">MRR</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-[2px] bg-down" />
              <span class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint">Total Expenses</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-[2px] bg-wrapper" />
              <span class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint">Cash Balance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Month-by-Month Table */}
      <div>
        <h3 class="font-display font-semibold text-[1.2rem] mb-5">Month-by-Month Breakdown</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left min-w-[1000px]">
            <thead>
              <tr class="border-b border-line">
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-3 sticky left-0 bg-bg z-10">Month</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-3">Customers</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-3">+New</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-3">-Churned</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-3">MRR</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-3">Gross Profit</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-3">Team Cost</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-3">Fixed Costs</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-3">CAC Spend</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2 pr-3">Net Income</th>
                <th class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint py-2">Cash Balance</th>
              </tr>
            </thead>
            <tbody>
              <For each={rows()}>
                {(row) => {
                  const isHireMonth = () =>
                    row.month > 0 && teamCostAtMonth(row.month) > teamCostAtMonth(row.month - 1);
                  const isBreakEven = () => breakEvenMonth() === row.month;
                  const isNegativeCash = () => row.cashBalance < 0;

                  return (
                    <tr
                      class="border-b border-line font-mono text-[.84rem]"
                      classList={{
                        'border-l-2 border-l-wrapper': isHireMonth() && !isBreakEven(),
                        'border-l-2 border-l-acid': isBreakEven(),
                        'bg-down/5': isNegativeCash(),
                      }}
                    >
                      <td class="py-2 pr-3 text-ink-dim sticky left-0 bg-bg z-10">
                        M{row.month} <span class="text-ink-faint text-[10px]">{monthLabels[row.month]}</span>
                      </td>
                      <td class="py-2 pr-3 text-ink">
                        {formatNumber(row.endCustomers)}
                      </td>
                      <td class="py-2 pr-3 text-up">
                        +{formatNumber(row.newCustomers)}
                      </td>
                      <td class="py-2 pr-3 text-down">
                        -{formatNumber(row.churnedCustomers)}
                      </td>
                      <td class="py-2 pr-3 text-ink">
                        {formatCurrency(row.mrr, true)}
                      </td>
                      <td class="py-2 pr-3 text-ink">
                        {formatCurrency(row.grossProfit, true)}
                      </td>
                      <td class="py-2 pr-3 text-ink-dim">
                        {formatCurrency(row.teamCost, true)}
                      </td>
                      <td class="py-2 pr-3 text-ink-dim">
                        {formatCurrency(row.fixedCosts, true)}
                      </td>
                      <td class="py-2 pr-3 text-ink-dim">
                        {formatCurrency(row.cacSpend, true)}
                      </td>
                      <td
                        class="py-2 pr-3"
                        classList={{ 'text-up': row.netIncome >= 0, 'text-down': row.netIncome < 0 }}
                      >
                        {formatCurrency(row.netIncome, true)}
                      </td>
                      <td
                        class="py-2"
                        classList={{ 'text-up': row.cashBalance >= 0, 'text-down': row.cashBalance < 0 }}
                      >
                        {formatCurrency(row.cashBalance, true)}
                      </td>
                    </tr>
                  );
                }}
              </For>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
