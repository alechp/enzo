export interface Kpi {
  label: string;
  value: string;
  note: string;
  color?: 'acid' | 'frontier' | 'wrapper' | 'ancillary';
}

export const marketSizeKpis: Kpi[] = [
  { label: '2026 Market (rev.)', value: '$0.85B', note: 'Core AI-video-generator software revenue; up from ~$720M in 2025', color: 'acid' },
  { label: '2030–34 Projection', value: '$3.4B', note: 'Conservative consensus by 2034 at ~19–20% CAGR' },
  { label: 'High-end Forecast', value: '$21.6B', note: 'Aggressive "software" definition by 2034 at 46% CAGR', color: 'frontier' },
  { label: 'Monthly Active Users', value: '124M+', note: 'Across all AI-video platforms globally', color: 'wrapper' },
];

export const capitalKpis: Kpi[] = [
  { label: 'Disclosed VC into pure-plays', value: '~$6.1B', note: 'Runway, Luma, MiniMax, Synthesia, HeyGen, Pika, Higgsfield, PixVerse, Vidu, Reactor', color: 'acid' },
  { label: 'Total tracked (incl. ancillary)', value: '~$9B+', note: 'Adds ElevenLabs ($500M), Lightricks & infra; excludes parent-funded models' },
  { label: 'Confirmed exits (IPO)', value: '1', note: 'MiniMax — Hong Kong IPO, Jan 2026, ~$619M raised', color: 'frontier' },
  { label: 'M&A exits to date', value: '0', note: 'Pika–Meta talks (2025) did not close; no completed acq.', color: 'wrapper' },
];
