export type Segment = 'frontier' | 'wrapper' | 'ancillary';
export type Status = 'private' | 'public';
export type TagVariant = 'frontier' | 'wrapper' | 'ancillary' | 'public' | 'private' | 'crypto' | 'ugc' | 'dead';

export interface Company {
  name: string;
  url: string;
  segment: Segment;
  status: Status;
  statusLabel: string;
  capitalRaised: string;
  valuation: string;
  position: string;
  tags: TagVariant[];
}

export const companies: Company[] = [
  { name: 'Runway', url: 'https://runwayml.com', segment: 'frontier', status: 'private', statusLabel: 'Private', capitalRaised: '$0.86–1.05B', valuation: '$5.3B', position: 'Quality / world-models leader (Gen-4.5)', tags: ['frontier', 'private'] },
  { name: 'Luma AI', url: 'https://lumalabs.ai', segment: 'frontier', status: 'private', statusLabel: 'Private', capitalRaised: '$1.07B', valuation: '$4.0B', position: 'Dream Machine / Ray3; 30M+ users', tags: ['frontier', 'private'] },
  { name: 'MiniMax (Hailuo)', url: 'https://hailuoai.video', segment: 'frontier', status: 'public', statusLabel: 'Public · HK', capitalRaised: '~$850M pre-IPO', valuation: '~$9.3B', position: "IPO'd Jan 2026, +109% day one; speed/value pick", tags: ['frontier', 'public'] },
  { name: 'Kling (Kuaishou)', url: 'https://klingai.com', segment: 'frontier', status: 'public', statusLabel: 'Parent public', capitalRaised: 'Parent-funded', valuation: '~$20B (spinoff rumor)', position: 'Cinematic quality; $240M run-rate', tags: ['frontier', 'public'] },
  { name: 'Seedance 2.0 (ByteDance)', url: 'https://seed.bytedance.com', segment: 'frontier', status: 'private', statusLabel: 'Parent private', capitalRaised: 'Parent-funded', valuation: 'n/a (within ByteDance)', position: "Native audio-visual; global launch paused Mar '26; ships via BytePlus API", tags: ['frontier', 'private'] },
  { name: 'Veo (Google DeepMind)', url: 'https://deepmind.google/models/veo/', segment: 'frontier', status: 'public', statusLabel: 'Public · GOOG', capitalRaised: 'Parent-funded', valuation: 'within Alphabet', position: 'Native-audio + 4K; #2 on I2V leaderboards; ecosystem play', tags: ['frontier', 'public'] },
  { name: 'Grok Imagine (xAI)', url: 'https://x.ai', segment: 'frontier', status: 'private', statusLabel: 'Parent private', capitalRaised: 'Parent-funded', valuation: 'within xAI', position: 'New #1 on some I2V leaderboards; distributed via Higgsfield + xAI API', tags: ['frontier', 'private'] },
  { name: 'Sora (OpenAI)', url: 'https://openai.com/sora', segment: 'frontier', status: 'public', statusLabel: 'Shut down', capitalRaised: 'Parent-funded', valuation: "app retired Apr '26", position: 'Pivoting to enterprise world-model "Spud"', tags: ['frontier', 'dead'] },
  { name: 'Wan (Alibaba)', url: 'https://wan.video', segment: 'frontier', status: 'public', statusLabel: 'Parent public', capitalRaised: 'Parent-funded', valuation: 'within Alibaba', position: 'Best open-source value; style-preservation leader', tags: ['frontier', 'public'] },
  { name: 'PixVerse (AISphere)', url: 'https://pixverse.ai', segment: 'frontier', status: 'private', statusLabel: 'Private', capitalRaised: '~$415M', valuation: '$1B+ (unicorn)', position: '100M+ users; real-time R1 model; Alibaba-backed', tags: ['frontier', 'private'] },
  { name: 'Vidu (ShengShu)', url: 'https://vidu.com', segment: 'frontier', status: 'private', statusLabel: 'Private', capitalRaised: '~$880M+', valuation: 'undisclosed', position: 'Top-10 model; world-model pivot; Alibaba/Baidu-backed', tags: ['frontier', 'private'] },
  { name: 'Hunyuan Video (Tencent)', url: 'https://hunyuan.tencent.com', segment: 'frontier', status: 'public', statusLabel: 'Parent public', capitalRaised: 'Parent-funded', valuation: 'within Tencent', position: 'Open-weights; runs on a single RTX 4090', tags: ['frontier', 'public'] },
  { name: 'LTX-Video (Lightricks)', url: 'https://www.lightricks.com', segment: 'frontier', status: 'private', statusLabel: 'Private', capitalRaised: '~$380M (co. total)', valuation: '~$1.8B (co.)', position: 'Leading open-source; 4K+audio on consumer GPUs', tags: ['frontier', 'private'] },
  { name: 'Synthesia', url: 'https://www.synthesia.io', segment: 'wrapper', status: 'private', statusLabel: 'Private', capitalRaised: '~$530M+', valuation: '$4.0B', position: 'Enterprise avatar leader; 70% of FTSE 100', tags: ['wrapper', 'private'] },
  { name: 'HeyGen', url: 'https://www.heygen.com', segment: 'wrapper', status: 'private', statusLabel: 'Private', capitalRaised: '~$74M', valuation: '$500M', position: 'Creator-economy avatars; Avatar IV realism', tags: ['wrapper', 'private'] },
  { name: 'Pika Labs', url: 'https://pika.art', segment: 'wrapper', status: 'private', statusLabel: 'Private', capitalRaised: '~$135M', valuation: '~$700M (est.)', position: 'Consumer-social; Meta acq. talks 2025', tags: ['wrapper', 'private'] },
  { name: 'Higgsfield', url: 'https://higgsfield.ai', segment: 'wrapper', status: 'private', statusLabel: 'Private', capitalRaised: '~$138M', valuation: '$1.3B', position: 'Reasoning engine chaining 3rd-party models; ~$300M ARR run-rate; social-ad focus', tags: ['wrapper', 'private'] },
  { name: 'Captions / Mirage', url: 'https://www.captions.ai', segment: 'wrapper', status: 'private', statusLabel: 'Private', capitalRaised: '~$100M', valuation: '$500M', position: 'Talking-head avatars + editing; NYC; a16z/Index/Sequoia', tags: ['wrapper', 'ugc', 'private'] },
  { name: 'Creatify', url: 'https://creatify.ai', segment: 'wrapper', status: 'private', statusLabel: 'Private', capitalRaised: '~$23M', valuation: 'private ($9M+ ARR)', position: 'URL-to-ad-video at volume; Katzenberg/WndrCo-backed', tags: ['wrapper', 'ugc', 'private'] },
  { name: 'Arcads', url: 'https://www.arcads.ai', segment: 'wrapper', status: 'private', statusLabel: 'Private', capitalRaised: '~$16M seed', valuation: 'private (~$10–15M ARR)', position: 'Realistic AI actors for ads; French; Eurazeo-led', tags: ['wrapper', 'ugc', 'private'] },
  { name: 'Fastlane', url: 'https://www.usefastlane.ai', segment: 'wrapper', status: 'private', statusLabel: 'Private', capitalRaised: 'Seed (undisclosed)', valuation: 'early-stage', position: 'URL→viral AI-influencer remix + scheduling; Australia', tags: ['wrapper', 'ugc', 'private'] },
  { name: 'Enzo.ai', url: 'https://enzo.ai', segment: 'wrapper', status: 'private', statusLabel: 'Private', capitalRaised: 'Pre-seed / early', valuation: 'early-stage', position: 'Persistent ownable AI personas + strategy "bible" + daily pipeline', tags: ['wrapper', 'ugc', 'private'] },
  { name: 'Reactor', url: 'https://reactor.ai', segment: 'wrapper', status: 'private', statusLabel: 'Private', capitalRaised: '~$59M', valuation: 'private', position: 'Real-time AI video; ex-Apple team; Lightspeed/WndrCo-backed', tags: ['wrapper', 'private'] },
  { name: 'Colossyan', url: 'https://www.colossyan.com', segment: 'wrapper', status: 'private', statusLabel: 'Private', capitalRaised: '~$27M', valuation: 'private', position: 'L&D-focused avatar video', tags: ['wrapper', 'private'] },
  { name: 'InVideo', url: 'https://invideo.io', segment: 'wrapper', status: 'private', statusLabel: 'Private', capitalRaised: '~$50M', valuation: 'private', position: 'Text-to-video for SMB marketers', tags: ['wrapper', 'private'] },
  { name: 'OpusClip', url: 'https://www.opus.pro', segment: 'wrapper', status: 'private', statusLabel: 'Private', capitalRaised: '~$30M', valuation: '~$215M', position: 'Long-to-short repurposing', tags: ['wrapper', 'private'] },
  { name: 'revid.ai', url: 'https://www.revid.ai', segment: 'wrapper', status: 'private', statusLabel: 'Private', capitalRaised: 'Bootstrapped', valuation: 'private', position: 'Viral short-form / "brainrot" gen; Paris; no disclosed VC', tags: ['wrapper', 'private'] },
  { name: 'Charms.ai', url: 'https://charms.ai', segment: 'wrapper', status: 'private', statusLabel: 'Private', capitalRaised: '~$1.5M pre-seed', valuation: 'on-chain assets', position: 'AI-character economy (video = visual identity); on-chain, no live token yet', tags: ['wrapper', 'crypto', 'private'] },
  { name: 'ElevenLabs', url: 'https://elevenlabs.io', segment: 'ancillary', status: 'private', statusLabel: 'Private', capitalRaised: '~$780M+', valuation: '~$11B', position: 'Voice/audio layer for video pipelines; ~$500M ARR; eyeing IPO', tags: ['ancillary', 'private'] },
  { name: 'CoreWeave', url: 'https://www.coreweave.com', segment: 'ancillary', status: 'public', statusLabel: 'Public · CRWV', capitalRaised: 'n/a (public)', valuation: 'public', position: 'GPU compute powering Runway et al.', tags: ['ancillary', 'public'] },
  { name: 'Adobe (Firefly)', url: 'https://www.adobe.com/products/firefly.html', segment: 'ancillary', status: 'public', statusLabel: 'Public · ADBE', capitalRaised: 'n/a (public)', valuation: 'public', position: 'Distribution layer; bundles Pika/Runway', tags: ['ancillary', 'public'] },
  { name: 'Getty / stock incumbents', url: 'https://www.gettyimages.com', segment: 'ancillary', status: 'public', statusLabel: 'Public · GETY', capitalRaised: 'n/a (public)', valuation: '"going concern" flag', position: 'Licensing/data; disrupted by gen-video', tags: ['ancillary', 'public'] },
];
