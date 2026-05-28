import { createSignal } from 'solid-js';
import { getInitialComp, getMilestoneBump, getTotalBase } from '../../data/costs';
import { formatCurrency, formatPercent, formatNumber } from '../../lib/format';

export default function CompSlider() {
  const [packageT, setPackageT] = createSignal(0);
  const [customers, setCustomers] = createSignal(0);

  const t = () => packageT() / 100;
  const initialComp = () => getInitialComp(t());
  const milestoneBump = () => getMilestoneBump(customers());
  const effectiveBase = () => getTotalBase(t(), customers());

  const milestones = [0, 1000, 2500, 5000, 7500, 10000];

  return (
    <div class="mt-6">
      {/* Slider A — Initial Package Selection */}
      <div class="mb-10">
        <div class="font-mono uppercase text-ink-faint mb-4" style="font-size:10.5px;letter-spacing:.14em">
          Initial Package Selection
        </div>

        {/* Two large KPI cards */}
        <div class="grid grid-cols-2 gap-[34px] mb-6 max-[880px]:grid-cols-1">
          <div class="bg-panel border border-line p-6">
            <div class="font-mono uppercase text-ink-faint mb-2" style="font-size:10.5px">
              Base Salary
            </div>
            <div class="font-display font-black text-[2.7rem] text-acid leading-none">
              {formatCurrency(initialComp().base, true)}
            </div>
          </div>
          <div class="bg-panel border border-line p-6">
            <div class="font-mono uppercase text-ink-faint mb-2" style="font-size:10.5px">
              Equity Grant
            </div>
            <div class="font-display font-black text-[2.7rem] text-wrapper leading-none">
              {formatPercent(initialComp().equity)}
            </div>
          </div>
        </div>

        {/* Slider */}
        <input
          type="range"
          class="comp-slider"
          min="0"
          max="100"
          step="1"
          value={packageT()}
          onInput={(e) => setPackageT(parseInt(e.currentTarget.value))}
        />

        {/* Range labels */}
        <div class="flex justify-between mt-2 mb-0">
          <span class="font-mono text-[9px] text-ink-faint">$240k base / 4.0% equity</span>
          <span class="font-mono text-[9px] text-ink-faint">$360k base / 2.0% equity</span>
        </div>
      </div>

      {/* Slider B — Customer Milestone Bonus */}
      <div class="mb-8">
        <div class="font-mono uppercase text-ink-faint mb-4" style="font-size:10.5px;letter-spacing:.14em">
          Customer Milestone Bonus
        </div>

        <input
          type="range"
          class="comp-slider"
          min="0"
          max="10000"
          step="100"
          value={customers()}
          onInput={(e) => setCustomers(parseInt(e.currentTarget.value))}
        />

        {/* Milestone markers */}
        <div class="flex justify-between mt-2 mb-8">
          {milestones.map((m) => (
            <div class="flex flex-col items-center">
              <div class="w-px h-3 bg-line-bright" />
              <span class="font-mono text-[9px] text-ink-faint mt-1">
                {m === 0 ? '0' : formatNumber(m)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary: Base + Bonus = Effective */}
      <div class="flex items-center gap-3 flex-wrap max-[880px]:flex-col max-[880px]:items-stretch">
        <div class="bg-panel border border-line p-5 flex-1 min-w-[140px]">
          <div class="font-mono uppercase text-ink-faint mb-2" style="font-size:10.5px">
            Base Salary
          </div>
          <div class="font-display font-black text-[1.5rem] text-ink leading-none">
            {formatCurrency(initialComp().base, true)}
          </div>
        </div>

        <span class="font-display font-black text-[1.5rem] text-ink-faint max-[880px]:text-center shrink-0">+</span>

        <div class="bg-panel border border-line p-5 flex-1 min-w-[140px]">
          <div class="font-mono uppercase text-ink-faint mb-2" style="font-size:10.5px">
            Milestone Bonus
          </div>
          <div class="font-display font-black text-[1.5rem] text-acid leading-none">
            +{formatCurrency(milestoneBump(), true)}
          </div>
        </div>

        <span class="font-display font-black text-[1.5rem] text-ink-faint max-[880px]:text-center shrink-0">=</span>

        <div class="bg-panel border border-acid/40 p-5 flex-1 min-w-[140px]">
          <div class="font-mono uppercase text-ink-faint mb-2" style="font-size:10.5px">
            Effective Base
          </div>
          <div class="font-display font-black text-[1.5rem] text-acid leading-none">
            {formatCurrency(effectiveBase(), true)}
          </div>
        </div>
      </div>

      {/* Equity — independent of milestones */}
      <div class="mt-4">
        <div class="bg-panel border border-line p-5 max-w-[240px]">
          <div class="font-mono uppercase text-ink-faint mb-2" style="font-size:10.5px">
            Equity Grant
          </div>
          <div class="font-display font-black text-[1.5rem] text-wrapper leading-none">
            {formatPercent(initialComp().equity)}
          </div>
        </div>
      </div>
    </div>
  );
}
