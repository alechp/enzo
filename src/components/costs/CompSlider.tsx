import { For } from 'solid-js';
import { roles, updateRole } from '../../data/teamStore';
import { computeEmployerTaxes } from '../../data/costs';
import { formatCurrency } from '../../lib/format';
import SliderInput from './SliderInput';

export default function CompSlider() {
  const initialHires = [
    { role: 'CEO', sublabel: 'Deferred comp — set to $0 if unpaid', min: 0, max: 300000, step: 5000 },
    { role: 'CTO', sublabel: 'Technical co-founder', min: 100000, max: 400000, step: 5000 },
    { role: 'Business Development', sublabel: 'First sales hire', min: 50000, max: 200000, step: 5000 },
  ];

  return (
    <div class="mt-6">
      <div class="font-mono text-[10.5px] text-ink-faint mb-6" style="letter-spacing:.06em">
        Set base salaries for the three initial hires. Fully loaded costs (with employer taxes) update automatically in the Team section below.
      </div>

      <div class="grid grid-cols-3 gap-6 max-[880px]:grid-cols-1">
        <For each={initialHires}>
          {(card) => {
            const idx = () => roles.findIndex((r) => r.role === card.role);
            const role = () => roles[idx()];
            const taxes = () => {
              const r = role();
              return r ? computeEmployerTaxes(r.annualSalary) : computeEmployerTaxes(0);
            };

            return (
              <div class="bg-panel border border-line p-5">
                <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-1">
                  {card.role}
                </div>
                <div class="font-mono text-[9px] text-ink-faint mb-4">{card.sublabel}</div>

                <div class="font-display font-black text-[2rem] text-acid leading-none mb-1">
                  {formatCurrency(role()?.annualSalary ?? 0, true)}
                  <span class="text-[.8rem] text-ink-faint font-mono font-normal">/yr</span>
                </div>
                <div class="font-mono text-[10px] text-ink-faint mb-4">
                  {formatCurrency(taxes().fullyLoaded, true)}/yr fully loaded
                </div>

                <SliderInput
                  value={role()?.annualSalary ?? 0}
                  onChange={(v) => {
                    const i = idx();
                    if (i >= 0) updateRole(i, 'annualSalary', v);
                  }}
                  min={card.min}
                  max={card.max}
                  step={card.step}
                  format={(v) => formatCurrency(v, true)}
                />
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
