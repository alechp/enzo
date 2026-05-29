import { For, Show, onMount } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import { videoCosts, fixedCosts, type VideoCost, type FixedCost } from '../../data/costs';
import { activeMonthlyBurn } from '../../data/teamStore';
import { formatCurrency } from '../../lib/format';
import EditableValue from './EditableValue';

const STORAGE_KEY = 'enzo-adjusted-economics';

interface EconomicsState {
  videoCosts: VideoCost[];
  fixedCosts: FixedCost[];
  avgVideos: number;
  pricePoint: number;
  cac: number;
}

function makeDefaults(): EconomicsState {
  return {
    videoCosts: videoCosts.map((v) => ({ ...v })),
    fixedCosts: fixedCosts.map((f) => ({ ...f })),
    avgVideos: 12,
    pricePoint: 99,
    cac: 160,
  };
}

function loadSaved(): EconomicsState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function saveToDisk(state: EconomicsState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function UnitEconomics() {
  const defaults = makeDefaults();
  const [state, setState] = createStore<EconomicsState>(makeDefaults());

  onMount(() => {
    const saved = loadSaved();
    if (saved) {
      // Safety: if saved fixedCosts length doesn't match current defaults
      // (e.g., old data had a "Team" line that was removed), ignore saved fixedCosts
      if (saved.fixedCosts && saved.fixedCosts.length !== fixedCosts.length) {
        saved.fixedCosts = fixedCosts.map((f) => ({ ...f }));
      }
      setState(reconcile(saved));
    }
  });

  // Derived values
  const totalVideoMin = () => state.videoCosts.reduce((sum, v) => sum + v.min, 0);
  const totalVideoMax = () => state.videoCosts.reduce((sum, v) => sum + v.max, 0);
  const totalFixedMonthly = () => state.fixedCosts.reduce((sum, f) => sum + f.monthly, 0) + activeMonthlyBurn();
  const totalFixedAnnual = () => totalFixedMonthly() * 12;

  const avgCostPerVideo = () => (totalVideoMin() + totalVideoMax()) / 2;
  const cogsPerCustomer = () => state.avgVideos * avgCostPerVideo();
  const grossMargin = () => 1 - cogsPerCustomer() / state.pricePoint;
  const ltv = () => state.pricePoint * grossMargin() * 24;
  const ltvCacRatio = () => ltv() / state.cac;
  const breakeven = () => {
    const gm = grossMargin();
    if (gm <= 0) return Infinity;
    return Math.ceil(totalFixedMonthly() / (state.pricePoint * gm));
  };

  const barColors = ['#ff5e3a', '#3aa0ff', '#b18cff', '#ffd166'];

  const isModified = () => {
    if (state.avgVideos !== defaults.avgVideos) return true;
    if (state.pricePoint !== defaults.pricePoint) return true;
    if (state.cac !== defaults.cac) return true;
    if (state.videoCosts.some((v, i) => v.min !== defaults.videoCosts[i].min || v.max !== defaults.videoCosts[i].max)) return true;
    if (state.fixedCosts.some((f, i) => f.monthly !== defaults.fixedCosts[i].monthly)) return true;
    return false;
  };

  const resetDefaults = () => {
    setState(reconcile(makeDefaults()));
    localStorage.removeItem(STORAGE_KEY);
  };

  const persist = () => saveToDisk({ ...state, videoCosts: [...state.videoCosts], fixedCosts: [...state.fixedCosts] });

  const updateVideoCost = (index: number, field: 'min' | 'max', value: number) => {
    setState('videoCosts', index, field, value);
    persist();
  };

  const updateFixedCost = (index: number, value: number) => {
    setState('fixedCosts', index, 'monthly', value);
    setState('fixedCosts', index, 'annual', value * 12);
    persist();
  };

  const setAvgVideos = (v: number) => { setState('avgVideos', v); persist(); };
  const setPricePoint = (v: number) => { setState('pricePoint', v); persist(); };
  const setCac = (v: number) => { setState('cac', v); persist(); };

  return (
    <div class="mt-6 space-y-12">
      {/* Section A: Per-Video Cost Breakdown */}
      <div>
        <h3 class="font-display font-semibold text-[1.2rem] mb-5">Per-Video Cost Breakdown</h3>

        {/* Stacked bar */}
        <div class="flex h-10 border border-line rounded-sm overflow-hidden mb-5">
          <For each={state.videoCosts}>
            {(cost, i) => {
              const pct = () => (cost.max / totalVideoMax()) * 100;
              return (
                <div
                  style={{
                    width: `${pct()}%`,
                    'background-color': cost.color || barColors[i() % barColors.length],
                  }}
                  class="flex items-center justify-center text-[9px] font-mono text-bg font-semibold overflow-hidden whitespace-nowrap px-1"
                  title={`${cost.component}: $${cost.min.toFixed(2)}–$${cost.max.toFixed(2)}`}
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
              <For each={state.videoCosts}>
                {(cost, i) => (
                  <tr class="border-b border-line">
                    <td class="py-2 pr-4 text-[.88rem] text-ink">{cost.component}</td>
                    <td class="py-2 pr-4 font-mono text-[.84rem] text-ink-dim">
                      <EditableValue
                        value={cost.min}
                        onChange={(v) => updateVideoCost(i(), 'min', v)}
                        min={0.01}
                        max={5.0}
                        step={0.01}
                        format={(v) => '$' + v.toFixed(2)}
                      />
                    </td>
                    <td class="py-2 pr-4 font-mono text-[.84rem] text-ink-dim">
                      <EditableValue
                        value={cost.max}
                        onChange={(v) => updateVideoCost(i(), 'max', v)}
                        min={0.01}
                        max={5.0}
                        step={0.01}
                        format={(v) => '$' + v.toFixed(2)}
                      />
                    </td>
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
          {/* Editable: Avg videos */}
          <div class="bg-panel border border-line p-4">
            <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
              Avg videos/customer/month
            </div>
            <div class="font-display font-black text-[1.4rem] leading-none text-ink">
              <EditableValue
                value={state.avgVideos}
                onChange={setAvgVideos}
                min={1}
                max={50}
                step={1}
                format={(v) => String(v)}
              />
            </div>
          </div>

          {/* Derived: COGS per customer */}
          <div class="bg-panel border border-line p-4">
            <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
              COGS per customer/month
            </div>
            <div class="font-display font-black text-[1.4rem] leading-none text-ink">
              ${cogsPerCustomer().toFixed(2)}
            </div>
          </div>

          {/* Editable: Price point */}
          <div class="bg-panel border border-line p-4">
            <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
              Target price point
            </div>
            <div class="font-display font-black text-[1.4rem] leading-none text-ink">
              <EditableValue
                value={state.pricePoint}
                onChange={setPricePoint}
                min={29}
                max={299}
                step={1}
                format={(v) => `$${v}/mo`}
              />
            </div>
          </div>

          {/* Derived: Gross margin */}
          <div class="bg-panel border border-line p-4">
            <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
              Gross margin
            </div>
            <div class="font-display font-black text-[1.4rem] leading-none text-up">
              {(grossMargin() * 100).toFixed(1)}%
            </div>
          </div>

          {/* Editable: CAC */}
          <div class="bg-panel border border-line p-4">
            <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
              CAC (blended)
            </div>
            <div class="font-display font-black text-[1.4rem] leading-none text-ink">
              <EditableValue
                value={state.cac}
                onChange={setCac}
                min={50}
                max={500}
                step={10}
                format={(v) => `$${v}`}
              />
            </div>
          </div>

          {/* Derived: LTV:CAC */}
          <div class="bg-panel border border-line p-4">
            <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">
              LTV:CAC ratio
            </div>
            <div class="font-display font-black text-[1.4rem] leading-none text-up">
              {ltvCacRatio().toFixed(1)}x
            </div>
          </div>
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
              <For each={state.fixedCosts}>
                {(cost, i) => (
                  <tr class="border-b border-line">
                    <td class="py-2 pr-4 text-[.88rem] text-ink">{cost.category}</td>
                    <td class="py-2 pr-4 font-mono text-[.84rem] text-ink-dim">
                      <EditableValue
                        value={cost.monthly}
                        onChange={(v) => updateFixedCost(i(), v)}
                        min={0}
                        max={1000000}
                        step={1000}
                        format={(v) => formatCurrency(v, true)}
                      />
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
            {breakeven() === Infinity ? 'N/A' : `~${breakeven().toLocaleString()}`}
          </div>
          <div class="text-ink-dim text-[.95rem] mb-3">
            customers to cover fixed burn at ${state.pricePoint}/mo
          </div>
          {breakeven() === Infinity ? (
            <div class="font-mono text-[10px] text-down tracking-wide">
              Negative margin — pricing below COGS
            </div>
          ) : (
            <div class="font-mono text-[10px] text-ink-faint tracking-wide">
              {formatCurrency(totalFixedMonthly(), true)} / (${state.pricePoint} &times; {(grossMargin() * 100).toFixed(0)}%) &asymp; {breakeven().toLocaleString()}
            </div>
          )}
        </div>

        {/* Reset button */}
        <Show when={isModified()}>
          <div class="mt-4 text-right">
            <button
              class="text-[11px] font-mono text-ink-faint border border-line px-3 py-1.5 hover:border-acid hover:text-ink transition-colors"
              onClick={resetDefaults}
            >
              Reset to defaults
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}
