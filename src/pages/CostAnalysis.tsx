import SectionHead from '../components/costs/SectionHead';
import CompSlider from '../components/costs/CompSlider';
import EquityBreakdown from '../components/costs/EquityBreakdown';
import MilestoneTrack from '../components/costs/MilestoneTrack';
import TeamDiagram from '../components/costs/TeamDiagram';
import UnitEconomics from '../components/costs/UnitEconomics';
import { scenarios } from '../data/costs';
import { formatCurrency, formatPercent } from '../lib/format';

export default function CostAnalysis() {
  return (
    <>
      {/* HEADER */}
      <header class="py-14 border-b border-line">
        <div
          class="flex items-center gap-[14px] flex-wrap font-mono text-[11px] uppercase text-acid"
          style="letter-spacing:.32em"
        >
          <span
            class="w-[7px] h-[7px] rounded-full bg-acid inline-block"
            style="box-shadow:0 0 10px #d6ff3f"
          />
          Cost Analysis &middot; Enzo.ai &middot; 2026
        </div>
        <h1
          class="font-display font-black text-[clamp(2.6rem,6.4vw,5.4rem)] leading-[.96] mt-5 mb-4"
          style="letter-spacing:-.02em"
        >
          Compensation &amp; <em class="italic text-wrapper">Unit Economics</em>
        </h1>
        <p class="text-ink-dim max-w-[62ch] text-[1.06rem]">
          A transparent breakdown of the compensation structure, team costs, and per-unit economics
          that define Enzo's path from launch to scale.
        </p>
      </header>

      {/* 01: Comp Slider */}
      <section class="py-[54px] border-b border-line">
        <SectionHead number="01 /" title="Compensation Structure" subtitle="sliding scale" />
        <CompSlider />
      </section>

      {/* 02: Equity */}
      <section class="py-[54px] border-b border-line">
        <SectionHead number="02 /" title="Equity & Acceleration" subtitle="double trigger" />
        <EquityBreakdown />
      </section>

      {/* 03: Milestones */}
      <section class="py-[54px] border-b border-line">
        <SectionHead number="03 /" title="Customer Milestones" subtitle="gates & unlocks" />
        <MilestoneTrack />
      </section>

      {/* 04: Team */}
      <section class="py-[54px] border-b border-line">
        <SectionHead
          number="04 /"
          title="Team Distribution & Fixed Costs"
          subtitle="at scale target"
        />
        <TeamDiagram />
      </section>

      {/* 05: Unit Economics */}
      <section class="py-[54px] border-b border-line">
        <SectionHead
          number="05 /"
          title="Unit Economics"
          subtitle="per-video · per-customer"
        />
        <UnitEconomics />
      </section>

      {/* 06: Scaling Scenarios */}
      <section class="py-[54px]">
        <SectionHead number="06 /" title="Scaling Scenarios" subtitle="projections" />
        <div class="grid grid-cols-3 gap-px bg-line border border-line max-md:grid-cols-1">
          {scenarios.map((s) => (
            <div class="bg-panel p-6 hover:bg-panel-2 transition-colors">
              <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-3">
                {s.name}
              </div>
              <div
                class="font-display font-black text-[1.8rem] leading-none mb-4"
                classList={{ 'text-up': s.net > 0, 'text-frontier': s.net < 0 }}
              >
                {s.net >= 0 ? '+' : ''}
                {formatCurrency(s.net, true)}
                <span class="text-[.6rem] text-ink-faint font-mono font-normal"> /mo net</span>
              </div>
              <div class="space-y-2 text-[.84rem]">
                <div class="flex justify-between">
                  <span class="text-ink-faint">Customers</span>
                  <span class="font-mono text-ink">{s.customers.toLocaleString()}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-ink-faint">MRR</span>
                  <span class="font-mono text-ink">{formatCurrency(s.mrr, true)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-ink-faint">Gross Profit</span>
                  <span class="font-mono text-ink">{formatCurrency(s.grossProfit, true)}</span>
                </div>
                <div class="flex justify-between border-t border-line pt-2 mt-2">
                  <span class="text-ink-faint">Comp tier</span>
                  <span class="font-mono text-acid">
                    {formatCurrency(s.compBase, true)} + {s.compEquity}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          class="font-mono text-[10.5px] text-ink-faint mt-3.5"
          style="letter-spacing:.06em"
        >
          Scenarios assume $99/mo mid-tier pricing, ~82% gross margin, $445k/mo fixed costs. Net =
          gross profit &minus; fixed costs.
        </div>
      </section>
    </>
  );
}
