export interface ExitEvent {
  date: string;
  event: string;
  company: string;
  amount: string;
}

export const exits: ExitEvent[] = [
  { date: 'JAN 2026', company: 'MiniMax', event: 'IPO — Hong Kong debut, shares +109% day one', amount: '$619M raised · ~$9.3B val' },
  { date: 'FEB 2026', company: 'Runway', event: 'Series E led by General Atlantic (NVIDIA, Fidelity, AMD, Adobe Ventures)', amount: '$315M · $5.3B val' },
  { date: 'JAN 2026', company: 'Synthesia', event: "Series E led by Google Ventures + NVIDIA's NVentures", amount: '$200M · $4.0B val' },
  { date: 'NOV 2025', company: 'Luma AI', event: 'Series C led by HUMAIN (Saudi PIF), a16z, AMD, Amplify', amount: '$900M · $4.0B val' },
  { date: 'APR 2026', company: 'Vidu (ShengShu)', event: 'Series B led by Alibaba Cloud; world-model pivot', amount: '~$293M' },
  { date: 'MAR 2026', company: 'PixVerse (AISphere)', event: 'Series C led by CDH; crosses unicorn line', amount: '~$300M · $1B+ val' },
  { date: 'JAN 2026', company: 'Higgsfield', event: 'Series A extension led by Accel; launch-to-unicorn in <1yr', amount: '$80M · $1.3B val' },
  { date: '2025', company: 'Pika Labs', event: 'Series B (consumer-social pivot)', amount: '~$80M' },
  { date: 'FEB 2026', company: 'ElevenLabs', event: 'Series D led by Sequoia; ~$500M ARR; eyeing IPO', amount: '$500M · $11B val' },
  { date: 'MAR 2026', company: 'Reactor', event: 'Series A led by Lightspeed; real-time AI video from ex-Apple team', amount: '$59M' },
  { date: 'MAY 2026', company: 'Kling (Kuaishou)', event: 'assessing spinoff/restructure + ~$2B raise', amount: '~$20B rumored val' },
  { date: 'MAR 2026', company: 'Sora (OpenAI)', event: 'app shutdown; ≠ exit, a strategic retreat', amount: 'retired' },
];
