import { For } from 'solid-js';
import type { Component } from 'solid-js';

interface FeatureRow {
  icon: string;
  text: string;
}

const frontierFeatures: FeatureRow[] = [
  {
    icon: 'OWNS',
    text: '<strong>The model.</strong> Pre-trains diffusion / world models on massive video corpora; the scarce, defensible asset.',
  },
  {
    icon: 'SELLS',
    text: '<strong>Generation primitives.</strong> Text/image-to-video, API access at $0.01–0.15/sec, raw clips of 4–20s.',
  },
  {
    icon: 'EDGE',
    text: '<strong>Capability frontier</strong> — temporal consistency, physics, native audio (Veo), 4K, character persistence.',
  },
  {
    icon: 'COST',
    text: '<strong>Compute-heavy &amp; margin-fragile.</strong> Sora’s ~$15M/day burn shows the failure mode.',
  },
  {
    icon: 'MOAT',
    text: '<strong>R&amp;D + compute access.</strong> Eroding as quality converges and prices fall 60%+ YoY.',
  },
  {
    icon: 'RISK',
    text: '<strong>Commoditization;</strong> “good enough” open weights (Wan) undercut the premium tier.',
  },
];

const wrapperFeatures: FeatureRow[] = [
  {
    icon: 'OWNS',
    text: '<strong>The workflow &amp; customer.</strong> Often route to 3rd-party or in-house models behind a product.',
  },
  {
    icon: 'SELLS',
    text: '<strong>Outcomes.</strong> Avatars, dubbing in 140–175 languages, templates, brand kits, SCORM, collaboration.',
  },
  {
    icon: 'EDGE',
    text: '<strong>Distribution &amp; retention.</strong> Synthesia: 70% of FTSE 100; HeyGen: creator-economy reach.',
  },
  {
    icon: 'COST',
    text: '<strong>Lighter compute, SaaS margins.</strong> Profitability path is clearer than the labs’.',
  },
  {
    icon: 'MOAT',
    text: '<strong>Enterprise procurement, compliance, integrations</strong> — sticky, switching-cost-heavy.',
  },
  {
    icon: 'RISK',
    text: '<strong>Labs moving up-stack</strong> (Runway adding editing); <strong>platform absorption</strong> (Adobe, Meta).',
  },
];

const VsGrid: Component = () => {
  return (
    <div class="grid grid-cols-2 max-[880px]:grid-cols-1 gap-px bg-line border border-line">
      {/* Frontier Column */}
      <div class="bg-panel">
        <div class="p-6 border-b border-line">
          <div class="flex items-center gap-3 mb-1">
            <div
              class="w-[11px] h-[11px] rounded-full bg-frontier"
              style={{ 'box-shadow': '0 0 8px rgba(255,94,58,.5)' }}
            />
            <h3 class="font-display text-[1.4rem] text-ink">Frontier Model Labs</h3>
          </div>
          <div class="font-mono text-[10px] uppercase text-ink-faint tracking-[.08em]">
            Runway &middot; Veo &middot; Kling &middot; Seedance &middot; Hailuo &middot; Luma
          </div>
        </div>
        <For each={frontierFeatures}>
          {(row) => (
            <div class="flex items-start gap-4 px-6 py-4 border-b border-line">
              <span class="font-mono text-[11px] text-ink-faint min-w-[78px] shrink-0 pt-[2px]">
                {row.icon}
              </span>
              <span class="text-[.88rem] text-ink-dim" innerHTML={row.text} />
            </div>
          )}
        </For>
      </div>

      {/* Wrappers Column */}
      <div class="bg-panel">
        <div class="p-6 border-b border-line">
          <div class="flex items-center gap-3 mb-1">
            <div
              class="w-[11px] h-[11px] rounded-full bg-wrapper"
              style={{ 'box-shadow': '0 0 8px rgba(58,160,255,.5)' }}
            />
            <h3 class="font-display text-[1.4rem] text-ink">Wrappers / Application Layer</h3>
          </div>
          <div class="font-mono text-[10px] uppercase text-ink-faint tracking-[.08em]">
            Synthesia &middot; HeyGen &middot; Pika &middot; InVideo &middot; OpusClip
          </div>
        </div>
        <For each={wrapperFeatures}>
          {(row) => (
            <div class="flex items-start gap-4 px-6 py-4 border-b border-line">
              <span class="font-mono text-[11px] text-ink-faint min-w-[78px] shrink-0 pt-[2px]">
                {row.icon}
              </span>
              <span class="text-[.88rem] text-ink-dim" innerHTML={row.text} />
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default VsGrid;
