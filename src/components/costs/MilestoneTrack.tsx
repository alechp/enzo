import { For } from 'solid-js';
import { compTiers, type CompTier } from '../../data/costs';
import { formatCurrency, formatNumber } from '../../lib/format';

export default function MilestoneTrack() {
  return (
    <div class="mt-6">
      {/* Desktop: horizontal milestone track */}
      <div class="hidden min-[881px]:block">
        <div class="relative">
          {/* Background line */}
          <div class="absolute top-6 left-0 right-0 h-px bg-line-bright" />

          <div class="grid grid-cols-6 gap-2">
            <For each={compTiers}>
              {(tier) => (
                <div class="flex flex-col items-center text-center relative">
                  <div class="font-display font-black text-lg text-ink">
                    {formatNumber(tier.customers)}
                  </div>
                  <div
                    class="w-3 h-3 rounded-full bg-acid my-2 relative z-10"
                    style={{ 'box-shadow': '0 0 8px var(--color-acid)' }}
                  />
                  <div class="font-mono text-[9px] uppercase text-ink-faint tracking-wide">
                    {tier.label}
                  </div>
                  <div class="font-mono text-[11px] text-acid mt-1">
                    +{formatCurrency(tier.bump, true)}
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>

      {/* Mobile: vertical timeline */}
      <div class="min-[881px]:hidden">
        <div class="relative pl-6">
          {/* Vertical line */}
          <div class="absolute left-[5px] top-0 bottom-0 w-px bg-line-bright" />

          <div class="flex flex-col gap-6">
            <For each={compTiers}>
              {(tier) => (
                <div class="relative flex items-start gap-4">
                  <div
                    class="absolute left-[-21px] top-1 w-3 h-3 rounded-full bg-acid z-10 shrink-0"
                    style={{ 'box-shadow': '0 0 8px var(--color-acid)' }}
                  />
                  <div>
                    <div class="font-display font-black text-lg text-ink">
                      {formatNumber(tier.customers)}
                    </div>
                    <div class="font-mono text-[9px] uppercase text-ink-faint tracking-wide">
                      {tier.label}
                    </div>
                    <div class="mt-1">
                      <span class="font-mono text-[11px] text-acid">
                        +{formatCurrency(tier.bump, true)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
}
