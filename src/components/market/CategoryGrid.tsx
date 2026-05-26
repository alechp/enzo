import { For } from 'solid-js';
import type { Component } from 'solid-js';

interface Category {
  chip: string;
  chipColor: string;
  title: string;
  description: string;
  players: string;
}

const categories: Category[] = [
  {
    chip: 'LAYER · MODEL',
    chipColor: 'text-frontier',
    title: 'Frontier Generation',
    description:
      'Closed: Runway, Luma, Kling, Seedance, Veo, Hailuo, Grok Imagine, PixVerse, Vidu. Open-weights: Wan, Hunyuan, LTX.',
    players:
      'Runway, Luma, Kling, Seedance, Veo, Hailuo, Grok Imagine, PixVerse, Vidu, Wan, Hunyuan, LTX',
  },
  {
    chip: 'LAYER · APP',
    chipColor: 'text-wrapper',
    title: 'Avatar & Enterprise',
    description:
      'Talking-head and avatar platforms targeting enterprise L&D, sales enablement, and internal comms at scale.',
    players: 'Synthesia, HeyGen, Colossyan, Hedra, Vidnoz',
  },
  {
    chip: 'LAYER · APP',
    chipColor: 'text-wrapper',
    title: 'Creator & Social',
    description:
      'Consumer-facing tools for short-form generation, social-first editing, and viral content creation.',
    players: 'Higgsfield, Pika, InVideo, Captions, Kaiber, Genmo',
  },
  {
    chip: 'LAYER · APP',
    chipColor: 'text-wrapper',
    title: 'Editing & Repurposing',
    description:
      'AI-augmented video editing, auto-clipping, and long-to-short repurposing workflows for creators and marketers.',
    players: 'OpusClip, Descript, Clippie, Veed, ClipMake',
  },
  {
    chip: 'LAYER · APP',
    chipColor: 'text-wrapper',
    title: 'AI-UGC & Influencer / Persona',
    description:
      'Synthetic influencers, AI-generated user content, and persona-driven ad creative at volume.',
    players:
      'Captions/Mirage, Creatify, Arcads, Higgsfield, Fastlane, Enzo.ai, APOB AI, OpenArt, Argil, Zoice',
  },
  {
    chip: 'LAYER · INFRA',
    chipColor: 'text-ancillary',
    title: 'Compute & Voice',
    description:
      'GPU cloud providers and voice synthesis powering the generation layer’s inference and audio needs.',
    players: 'CoreWeave, NVIDIA, ElevenLabs, AMD',
  },
  {
    chip: 'LAYER · DATA/DIST',
    chipColor: 'text-ancillary',
    title: 'Data & Distribution',
    description:
      'Platforms supplying training data, licensed media, and distribution channels for generated video.',
    players: 'Adobe Firefly, Getty, YouTube, CapCut',
  },
];

const CategoryGrid: Component = () => {
  return (
    <div class="grid grid-cols-3 max-[880px]:grid-cols-1 gap-px bg-line border border-line">
      <For each={categories}>
        {(cat) => (
          <div class="bg-panel p-6 hover:bg-panel-2 transition-colors">
            <div
              class={`font-mono text-[10px] uppercase tracking-[.14em] mb-3 ${cat.chipColor}`}
            >
              {cat.chip}
            </div>
            <h3 class="font-display text-[1.18rem] font-semibold text-ink mb-2">
              {cat.title}
            </h3>
            <p class="text-[.84rem] text-ink-dim mb-3">{cat.description}</p>
            <div class="font-mono text-[11px] text-ink-faint">
              <For each={cat.players.split(', ')}>
                {(name, i) => (
                  <>
                    {i() > 0 && <span class="text-ink-faint"> &middot; </span>}
                    <span class="text-ink-dim">{name}</span>
                  </>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export default CategoryGrid;
