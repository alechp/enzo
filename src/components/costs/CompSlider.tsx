import { createSignal } from 'solid-js';
import { getComp } from '../../data/costs';
import { formatCurrency, formatPercent, formatNumber } from '../../lib/format';

export default function CompSlider() {
  const [customers, setCustomers] = createSignal(0);

  const comp = () => getComp(customers());
  const baseSalary = () => comp().base;
  const equityPct = () => comp().equity;
  const costPerCustomer = () => baseSalary() / Math.max(customers(), 1);
  const totalComp = () => baseSalary() + (equityPct() / 100) * 50_000_000;

  const milestones = [0, 1000, 2500, 5000, 7500, 10000];

  return (
    <div class="mt-6">
      <style>{`
        input[type="range"].comp-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 12px;
          background: var(--color-panel-2);
          border: 1px solid var(--color-line);
          border-radius: 3px;
          outline: none;
          cursor: pointer;
        }
        input[type="range"].comp-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: var(--color-acid);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 12px var(--color-acid);
        }
        input[type="range"].comp-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: var(--color-acid);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 12px var(--color-acid);
        }
      `}</style>

      {/* Top row: Two large KPI displays */}
      <div class="grid grid-cols-2 gap-[34px] mb-8 max-[880px]:grid-cols-1">
        <div class="bg-panel border border-line p-6">
          <div class="font-mono uppercase text-ink-faint mb-2" style="font-size:10.5px">
            Base Salary
          </div>
          <div class="font-display font-black text-[2.7rem] text-acid leading-none">
            {formatCurrency(baseSalary(), true)}
          </div>
        </div>
        <div class="bg-panel border border-line p-6">
          <div class="font-mono uppercase text-ink-faint mb-2" style="font-size:10.5px">
            Equity Grant
          </div>
          <div class="font-display font-black text-[2.7rem] text-wrapper leading-none">
            {formatPercent(equityPct())}
          </div>
        </div>
      </div>

      {/* Slider */}
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

      {/* Bottom row: 3 secondary KPI cards */}
      <div class="grid grid-cols-3 gap-[34px] max-[880px]:grid-cols-1">
        <div class="bg-panel border border-line p-6">
          <div class="font-mono uppercase text-ink-faint mb-2" style="font-size:10.5px">
            Customers
          </div>
          <div class="font-display font-black text-[1.6rem] text-ink leading-none">
            {customers().toLocaleString()}
          </div>
        </div>
        <div class="bg-panel border border-line p-6">
          <div class="font-mono uppercase text-ink-faint mb-2" style="font-size:10.5px">
            Cost per Customer
          </div>
          <div class="font-display font-black text-[1.6rem] text-ink leading-none">
            {formatCurrency(costPerCustomer(), true)}
          </div>
        </div>
        <div class="bg-panel border border-line p-6">
          <div class="font-mono uppercase text-ink-faint mb-2" style="font-size:10.5px">
            Total Comp Estimate
          </div>
          <div class="font-display font-black text-[1.6rem] text-ink leading-none">
            {formatCurrency(totalComp(), true)}
          </div>
        </div>
      </div>
    </div>
  );
}
