import SectionHead from '../components/costs/SectionHead';
import CompSlider from '../components/costs/CompSlider';
import EquityBreakdown from '../components/costs/EquityBreakdown';
import TeamDiagram from '../components/costs/TeamDiagram';
import UnitEconomics from '../components/costs/UnitEconomics';
import FinancialProjections from '../components/costs/FinancialProjections';
import CommentThread from '../components/costs/CommentThread';

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
        <SectionHead number="01 /" title="Compensation Structure" subtitle="CEO · CTO · BD" />
        <CompSlider />
      </section>

      {/* 02: Equity */}
      <section class="py-[54px] border-b border-line">
        <SectionHead number="02 /" title="Equity & Acceleration" subtitle="double trigger" />
        <EquityBreakdown />
      </section>

      {/* 03: Team */}
      <section class="py-[54px] border-b border-line">
        <SectionHead
          number="03 /"
          title="Team Distribution & Fixed Costs"
          subtitle="tax-adjusted staffing"
        />
        <TeamDiagram />
        <CommentThread sectionId="team-distribution" />
      </section>

      {/* 04: Unit Economics */}
      <section class="py-[54px] border-b border-line">
        <SectionHead
          number="04 /"
          title="Unit Economics"
          subtitle="per-video · per-customer"
        />
        <UnitEconomics />
        <CommentThread sectionId="unit-economics" />
      </section>

      {/* 05: Financial Projections */}
      <section class="py-[54px]">
        <SectionHead number="05 /" title="Financial Projections" subtitle="24-month model" />
        <FinancialProjections />
        <CommentThread sectionId="financial-projections" />
      </section>
    </>
  );
}
