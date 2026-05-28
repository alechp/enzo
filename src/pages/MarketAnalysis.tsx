import type { Component } from 'solid-js';
import SectionHead from '../components/market/SectionHead';
import KpiStrip from '../components/market/KpiStrip';
import BarChart from '../components/market/BarChart';
import SplitBar from '../components/market/SplitBar';
import CompanyTable from '../components/market/CompanyTable';
import ExitsTimeline from '../components/market/ExitsTimeline';
import VsGrid from '../components/market/VsGrid';
import CategoryGrid from '../components/market/CategoryGrid';
import CryptoSection from '../components/market/CryptoSection';
import { marketSizeKpis, capitalKpis } from '../data/kpis';

const revenueTrajectoryBars = [
  { label: '2024', width: 11, value: '~$0.55B', color: 'var(--color-ink-faint)' },
  { label: '2025', width: 15, value: '$0.72B', color: 'var(--color-wrapper)' },
  { label: '2026', width: 19, value: '$0.85B', color: 'var(--color-acid)' },
  { label: '2030', width: 46, value: '~$2.1B', color: 'var(--color-frontier)' },
  { label: '2034 (low)', width: 74, value: '$3.4B', color: 'var(--color-frontier)' },
  { label: '2034 (high)', width: 100, value: '$21.6B', color: 'linear-gradient(90deg, #ff5e3a, #d6ff3f)' },
];

const arrLeaderBars = [
  { label: 'Higgsfield', width: 100, value: '~$300M*', color: 'linear-gradient(90deg, var(--color-wrapper), var(--color-acid))' },
  { label: 'Kling (run-rate)', width: 80, value: '~$240M', color: 'var(--color-frontier)' },
  { label: 'Synthesia', width: 50, value: '$150M+', color: 'var(--color-wrapper)' },
  { label: 'Pika (est.)', width: 43, value: '~$130M', color: 'var(--color-frontier)' },
  { label: 'HeyGen', width: 33, value: '$100M+', color: 'var(--color-wrapper)' },
];

const valueCaptureSegments = [
  { label: 'Frontier', percentage: 46, bg: 'var(--color-frontier)', textColor: '#fff' },
  { label: 'Wrappers', percentage: 33, bg: 'var(--color-wrapper)', textColor: '#fff' },
  { label: 'Ancillary', percentage: 21, bg: 'var(--color-ancillary)', textColor: '#fff' },
];

const MarketAnalysis: Component = () => {
  return (
    <>
      {/* ──────── HEADER ──────── */}
      <header class="py-14 border-b border-line">
        {/* Kicker */}
        <div class="flex items-center gap-2 mb-4">
          <span class="w-[9px] h-[9px] rounded-full bg-acid inline-block" style={{ 'box-shadow': '0 0 8px rgba(214,255,63,.5)' }} />
          <span class="font-mono text-[10.5px] uppercase tracking-[.2em] text-acid">
            Enzo.ai &mdash; Market Intelligence
          </span>
        </div>

        {/* Title */}
        <h1 class="font-display font-semibold text-[clamp(2rem,5vw,3.4rem)] text-ink leading-[1.1] mb-4">
          The AI Video Generation{' '}
          <em class="text-acid not-italic">Market</em>, Mapped.
        </h1>

        {/* Lede */}
        <p class="text-[1.08rem] text-ink-dim max-w-[720px] mb-8 leading-relaxed">
          A comprehensive analysis of the generative video landscape — market size, competitive
          positioning, capital flows, crypto-linked projects, and strategic differentiation between
          frontier model labs and application-layer wrappers. Built to inform Enzo.ai's go-to-market
          strategy and investor narrative.
        </p>

        {/* Meta row */}
        <div class="flex flex-wrap gap-8 font-mono text-[10.5px] text-ink-faint uppercase tracking-[.12em]">
          <div>
            <span class="text-ink-dim mr-1">Scope</span> AI video generation
          </div>
          <div>
            <span class="text-ink-dim mr-1">Geography</span> Global
          </div>
          <div>
            <span class="text-ink-dim mr-1">Capital tracked</span> $7.5B+
          </div>
          <div>
            <span class="text-ink-dim mr-1">Companies</span> 32
          </div>
        </div>
      </header>

      {/* ──────── 01 · MARKET SIZE ──────── */}
      <section class="py-[54px] border-b border-line">
        <SectionHead number="01 /" title="Market Size & Trajectory" subtitle="USD · revenue basis" />
        <KpiStrip items={marketSizeKpis} />

        <div class="grid grid-cols-[1.15fr_.85fr] max-[880px]:grid-cols-1 gap-[34px]">
          {/* Prose */}
          <div>
            <p class="text-[.94rem] text-ink-dim leading-relaxed mb-4">
              The AI-powered video generation market is growing at a{' '}
              <strong class="text-ink">45–55% CAGR</strong> across all credible forecasts. In 2024
              the sector generated roughly <strong class="text-ink">$480M</strong> in revenue,
              rising to an estimated <strong class="text-ink">$720M</strong> in 2025 and{' '}
              <strong class="text-ink">$850M</strong> by 2026. Longer-range projections diverge: a
              consensus midpoint puts the market at <strong class="text-ink">$3.4B by 2030</strong>,
              while more aggressive models reach{' '}
              <strong class="text-ink">$11–21B by 2034</strong>.
            </p>
            <p class="text-[.94rem] text-ink-dim leading-relaxed mb-4">
              Key tailwinds include collapsing generation costs (down 60%+ year-over-year), rising
              enterprise adoption of avatar and dubbing tools, and the explosive growth of short-form
              video marketing. Headwinds center on model commoditization, lingering quality gaps for
              long-form content, and regulatory uncertainty around deepfakes and copyright.
            </p>
            <p class="text-[.94rem] text-ink-dim leading-relaxed mb-4">
              Monthly active users across all platforms already exceed{' '}
              <strong class="text-ink">124M</strong>, dominated by CapCut's AI features, followed by
              Pika, Runway, and HeyGen's freemium tiers.
            </p>

            {/* Callout */}
            <div class="border-l-[3px] border-frontier bg-panel p-4 text-[.92rem] text-ink-dim mt-[18px]">
              <strong class="text-ink">Definitional caveat:</strong> The figures above cover
              AI-native video generation — text-to-video, image-to-video, avatar synthesis, and
              AI-powered editing. They exclude broader categories like traditional VFX, cloud video
              infrastructure, and general-purpose video hosting (Vimeo, Wistia), which would inflate
              the TAM to $15–30B+ but distort the competitive picture.
            </div>
          </div>

          {/* Bar chart */}
          <div>
            <BarChart
              bars={revenueTrajectoryBars}
              title="Revenue Trajectory (Consensus)"
              legend="Sources: Grand View Research, Mordor Intelligence, MarketsAndMarkets, internal synthesis. High-end 2034 reflects bull-case scenarios assuming rapid enterprise adoption."
            />
          </div>
        </div>
      </section>

      {/* ──────── 02 · VALUE CAPTURE ──────── */}
      <section class="py-[54px] border-b border-line">
        <SectionHead number="02 /" title="Relative Value Capture" subtitle="who holds the market" />
        <SplitBar segments={valueCaptureSegments} />

        <div class="grid grid-cols-[1.15fr_.85fr] max-[880px]:grid-cols-1 gap-[34px]">
          {/* Prose */}
          <div>
            <p class="text-[.94rem] text-ink-dim leading-relaxed mb-4">
              <strong class="text-ink">Frontier model labs</strong> currently capture roughly{' '}
              <strong class="text-ink">46%</strong> of sector revenue, driven by API pricing and
              direct-consumer subscription tiers. But their share is eroding — as model quality
              converges, pricing power shifts to the application layer.
            </p>
            <p class="text-[.94rem] text-ink-dim leading-relaxed mb-4">
              <strong class="text-ink">Wrappers / application-layer players</strong> hold{' '}
              <strong class="text-ink">33%</strong> and growing. Companies like Synthesia ($150M+ ARR)
              and HeyGen have proven that enterprise distribution, compliance, and workflow
              integration create durable revenue independent of which model sits underneath.
            </p>
            <p class="text-[.94rem] text-ink-dim leading-relaxed mb-4">
              <strong class="text-ink">Ancillary / infrastructure</strong> takes{' '}
              <strong class="text-ink">21%</strong> — compute providers (CoreWeave, NVIDIA via
              inference cloud), voice synthesis (ElevenLabs), and data/distribution platforms (Getty,
              Adobe Firefly). These are less exposed to model-layer commoditization.
            </p>

            {/* Callout */}
            <div class="border-l-[3px] border-frontier bg-panel p-4 text-[.92rem] text-ink-dim mt-[18px]">
              <strong class="text-ink">The Sora lesson:</strong> OpenAI's Sora reportedly burns{' '}
              <strong class="text-ink">~$15M/day</strong> on inference costs as of early 2025, a
              structural problem that persists across frontier labs. Application-layer companies
              avoid this trap by routing to the cheapest adequate model — switching costs are low
              when you own the customer relationship and the workflow, not the weights.
            </div>
          </div>

          {/* ARR Bar chart */}
          <div>
            <BarChart
              bars={arrLeaderBars}
              title="Estimated ARR Leaders (2025)"
              legend="ARR figures are estimates based on public disclosures, investor reports, and industry sources. Actual figures may vary."
            />
          </div>
        </div>
      </section>

      {/* ──────── 03 · COMPANY LANDSCAPE ──────── */}
      <section class="py-[54px] border-b border-line">
        <SectionHead number="03 /" title="Company Landscape" subtitle="public · private · capital" />
        <CompanyTable />
      </section>

      {/* ──────── 04 · CAPITAL & EXITS ──────── */}
      <section class="py-[54px] border-b border-line">
        <SectionHead number="04 /" title="Capital Invested & Exits" subtitle="the funding picture" />
        <KpiStrip items={capitalKpis} />

        <div class="mb-8">
          <p class="text-[.94rem] text-ink-dim leading-relaxed mb-4">
            Over <strong class="text-ink">$5.3B in venture capital</strong> has been deployed into
            AI video generation startups since 2021, with total capital (including public-market
            investments, grants, and debt) exceeding{' '}
            <strong class="text-ink">$7.5B</strong>. The largest rounds have gone to frontier labs
            — Runway ($241M Series C at $4B valuation), and Kling's parent Kuaishou (public, HK:1024).
          </p>
          <p class="text-[.94rem] text-ink-dim leading-relaxed mb-4">
            Exit activity has been muted. Only <strong class="text-ink">one IPO</strong> (Kuaishou,
            HK listing) and <strong class="text-ink">zero M&amp;A exits</strong> of meaningful
            scale in the pure-play AI video space. This is typical for a sector still in the
            rapid-growth phase — acquirers are watching, not buying, and founders are choosing to
            raise rather than sell.
          </p>
          <p class="text-[.94rem] text-ink-dim leading-relaxed">
            The timeline below captures the most significant funding events and the sole public
            listing. Expect M&amp;A to accelerate in 2026–2027 as model commoditization forces
            consolidation among wrappers, and as big-tech platforms (Adobe, Google, Meta) build vs.
            buy decisions tip toward acquisition.
          </p>
        </div>

        <ExitsTimeline />
      </section>

      {/* ──────── 05 · WRAPPERS VS FRONTIER ──────── */}
      <section class="py-[54px] border-b border-line">
        <SectionHead number="05 /" title="Wrappers vs. Frontier Models" subtitle="feature differentiation" />

        <p class="text-[.94rem] text-ink-dim leading-relaxed mb-8">
          The AI video generation stack bifurcates into two distinct business models with different
          economics, moats, and risk profiles. Understanding this split is essential for positioning
          Enzo.ai — we operate at the <strong class="text-ink">application layer</strong>, routing
          to frontier models while owning the workflow, the customer, and the creative output.
        </p>

        <VsGrid />

        {/* Callout boxes */}
        <div class="grid grid-cols-2 max-[880px]:grid-cols-1 gap-[34px] mt-8">
          <div class="border-l-[3px] border-frontier bg-panel p-4 text-[.92rem] text-ink-dim">
            <strong class="text-ink">Convergence thesis:</strong> Within 12–18 months, the quality
            gap between frontier and open-weight models will narrow to the point where most
            end-users cannot distinguish them in blind tests. When that happens, the
            model layer commoditizes and value accrues to whoever owns the distribution and the
            workflow — the wrapper position.
          </div>
          <div class="border-l-[3px] border-acid bg-panel p-4 text-[.92rem] text-ink-dim">
            <strong class="text-ink">AI-UGC is the hottest sub-vertical:</strong> Synthetic
            influencer content and AI-generated user-created ads represent the fastest-growing
            segment. Brands want volume, personalization, and speed — exactly what AI-UGC delivers.
            Enzo.ai is positioned here: high-volume, persona-driven, performance-marketing content.
          </div>
        </div>
      </section>

      {/* ──────── 06 · FULL STACK ──────── */}
      <section class="py-[54px] border-b border-line">
        <SectionHead number="06 /" title="The Full Generative-Video Stack" subtitle="all video-AI verticals" />

        <p class="text-[.94rem] text-ink-dim leading-relaxed mb-8">
          The generative video ecosystem spans seven distinct verticals — from raw model training
          at the frontier to data and distribution platforms that feed and amplify the output. Each
          layer has different competitive dynamics, margin structures, and defensibility. Below is
          the full map, with key players in each category.
        </p>

        <CategoryGrid />
      </section>

      {/* ──────── 07 · CRYPTO ──────── */}
      <section class="py-[54px]">
        <SectionHead number="07 /" title="Crypto-Token-Linked Projects" subtitle="live prices · high volatility" />
        <CryptoSection />
      </section>
    </>
  );
};

export default MarketAnalysis;
