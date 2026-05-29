import { createSignal, createEffect } from 'solid-js';
import { getInitialComp } from '../../data/costs';
import { roles, updateRole } from '../../data/teamStore';
import { formatCurrency, formatPercent } from '../../lib/format';

export default function CompSlider() {
  const [packageT, setPackageT] = createSignal(0);

  const t = () => packageT() / 100;
  const initialComp = () => getInitialComp(t());

  const ctoIndex = () => roles.findIndex((r) => r.role === 'CTO');

  createEffect(() => {
    const idx = ctoIndex();
    if (idx >= 0) {
      updateRole(idx, 'annualSalary', initialComp().base);
    }
  });

  return (
    <div class="mt-6">
      {/* Context: which roles this applies to */}
      <div class="font-mono text-[10.5px] text-ink-faint mb-8" style="letter-spacing:.06em">
        Applies to the three initial hires: <span class="text-ink">CEO</span> (salary deferred),{' '}
        <span class="text-ink">CTO</span> (base / equity slider below), and{' '}
        <span class="text-ink">Business Development</span> ($100k fixed).
      </div>

      {/* CTO Package slider */}
      <div class="mb-8">
        <div class="font-mono uppercase text-ink-faint mb-4" style="font-size:10.5px;letter-spacing:.14em">
          CTO Package — Base / Equity Tradeoff
        </div>

        <div class="grid grid-cols-2 gap-[34px] mb-6 max-[880px]:grid-cols-1">
          <div class="bg-panel border border-line p-6">
            <div class="font-mono uppercase text-ink-faint mb-2" style="font-size:10.5px">
              CTO Base Salary
            </div>
            <div class="font-display font-black text-[2.7rem] text-acid leading-none">
              {formatCurrency(initialComp().base, true)}
            </div>
          </div>
          <div class="bg-panel border border-line p-6">
            <div class="font-mono uppercase text-ink-faint mb-2" style="font-size:10.5px">
              CTO Equity Grant
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

      {/* Summary: all three initial hires */}
      <div class="grid grid-cols-3 gap-4 max-[880px]:grid-cols-1">
        <div class="bg-panel border border-line p-4">
          <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">CEO</div>
          <div class="font-display font-black text-[1.2rem] text-ink-dim leading-none">$0 deferred</div>
          <div class="font-mono text-[9px] text-ink-faint mt-1">Salary set in Team section</div>
        </div>
        <div class="bg-panel border border-acid/40 p-4">
          <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">CTO</div>
          <div class="font-display font-black text-[1.2rem] text-acid leading-none">
            {formatCurrency(initialComp().base, true)} + {formatPercent(initialComp().equity)}
          </div>
          <div class="font-mono text-[9px] text-ink-faint mt-1">Controlled by slider above</div>
        </div>
        <div class="bg-panel border border-line p-4">
          <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-2">Business Development</div>
          <div class="font-display font-black text-[1.2rem] text-ink leading-none">$100k</div>
          <div class="font-mono text-[9px] text-ink-faint mt-1">Fixed base salary</div>
        </div>
      </div>
    </div>
  );
}
