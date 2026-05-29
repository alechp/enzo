import { createSignal } from 'solid-js';
import { getInitialComp } from '../../data/costs';
import { formatCurrency, formatPercent } from '../../lib/format';

export default function CompSlider() {
  const [packageT, setPackageT] = createSignal(0);

  const t = () => packageT() / 100;
  const initialComp = () => getInitialComp(t());

  return (
    <div class="mt-6">
      <div class="mb-10">
        <div class="font-mono uppercase text-ink-faint mb-4" style="font-size:10.5px;letter-spacing:.14em">
          Initial Package Selection
        </div>

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

        <input
          type="range"
          class="comp-slider"
          min="0"
          max="100"
          step="1"
          value={packageT()}
          onInput={(e) => setPackageT(parseInt(e.currentTarget.value))}
        />

        <div class="flex justify-between mt-2 mb-0">
          <span class="font-mono text-[9px] text-ink-faint">$240k base / 4.0% equity</span>
          <span class="font-mono text-[9px] text-ink-faint">$360k base / 2.0% equity</span>
        </div>
      </div>

      <div class="mt-6">
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
