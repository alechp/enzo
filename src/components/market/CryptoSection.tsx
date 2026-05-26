import type { Component } from 'solid-js';
import CandlestickChart from './CandlestickChart';

interface TokenCard {
  name: string;
  url?: string;
  ticker?: string;
  description: string;
  price: string;
  tokenKey?: string;
  marketCap?: string;
  athDrop?: string;
  date: string;
  noToken?: boolean;
}

const tokens: TokenCard[] = [
  {
    name: 'imgnAI',
    url: 'https://imgnai.com',
    ticker: '$IMGNAI',
    description:
      'AI image/video generation on Ethereum. Launched token for community access; low liquidity, thin order books.',
    price: '~$0.004–0.005',
    tokenKey: 'IMGNAI',
    marketCap: '~$3.5M',
    athDrop: '−96% from ATH',
    date: 'Snapshot: May 2025',
  },
  {
    name: 'Render',
    url: 'https://rendernetwork.com',
    ticker: '$RNDR',
    description:
      'Decentralized GPU rendering network. Migrated to Solana. Used for rendering compute tasks including AI video.',
    price: '~$2.07',
    tokenKey: 'RNDR',
    marketCap: '~$1.08B',
    athDrop: '−85% from ATH',
    date: 'Snapshot: May 2025',
  },
  {
    name: 'Virtuals Protocol',
    url: 'https://virtuals.io',
    ticker: '$VIRTUAL',
    description:
      'AI agent protocol on Base. Enables creation of co-owned AI characters with tokenized revenue sharing.',
    price: '~$0.72',
    tokenKey: 'VIRTUAL',
    marketCap: '~$473M',
    athDrop: '−82% from ATH',
    date: 'Snapshot: May 2025',
  },
  {
    name: 'Charms.ai',
    description:
      'AI avatar and video platform. No tradable token issued — operating as a traditional SaaS/web3 hybrid.',
    price: '—',
    noToken: true,
    date: 'As of May 2025',
  },
  {
    name: 'Bittensor',
    url: 'https://bittensor.com',
    ticker: '$TAO',
    description:
      'Decentralized machine-learning network. Subnets compete to provide AI services; miners earn TAO for compute.',
    price: '~$347',
    tokenKey: 'TAO',
    marketCap: '~$3.3B',
    date: 'Snapshot: May 2025',
  },
  {
    name: 'Meme coins',
    ticker: 'various',
    description:
      'Assorted meme tokens loosely themed around AI video. Sub-cent prices, micro-cap, extremely high volatility.',
    price: '<$0.001',
    tokenKey: 'MEME',
    marketCap: 'sub-cent micro-caps',
    date: 'Snapshot: May 2025',
  },
];

const CryptoSection: Component = () => {
  return (
    <div>
      {/* Warning */}
      <div
        class="border border-crypto/30 bg-crypto/[.04] rounded-sm p-4 mb-8"
        style={{ 'border-left-width': '3px', 'border-left-color': 'var(--color-crypto)' }}
      >
        <div class="font-mono text-[10px] uppercase tracking-[.12em] text-crypto mb-1">
          Caution
        </div>
        <p class="text-[.88rem] text-ink-dim">
          The tokens listed below are <strong class="text-ink">speculative</strong> and highly
          volatile. Prices can move 50%+ in a single day. Many have thin liquidity. This section is
          included for completeness — it is <em>not</em> investment advice. Always DYOR.
        </p>
      </div>

      {/* Token grid */}
      <div class="grid grid-cols-3 max-[880px]:grid-cols-1 gap-px bg-line border border-line">
        {tokens.map((token) => (
          <div class="bg-panel p-5 hover:bg-panel-2 transition-colors flex flex-col">
            {/* Name + ticker */}
            <div class="flex items-center gap-2 mb-2">
              {token.url ? (
                <a
                  href={token.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-display text-[1.1rem] font-semibold text-ink hover:text-acid transition-colors"
                >
                  {token.name}
                </a>
              ) : (
                <span class="font-display text-[1.1rem] font-semibold text-ink">
                  {token.name}
                </span>
              )}
              {token.ticker && (
                <span class="font-mono text-[9px] uppercase tracking-[.06em] px-2 py-[2px] rounded-sm bg-crypto/10 text-crypto border border-crypto/30">
                  {token.ticker}
                </span>
              )}
            </div>

            {/* Description */}
            <p class="text-[.82rem] text-ink-dim mb-3 flex-grow">{token.description}</p>

            {/* Price */}
            <div class="font-display font-black text-[1.5rem] text-ink mb-3">{token.price}</div>

            {/* Chart or placeholder */}
            {token.noToken ? (
              <div class="h-[132px] border border-line rounded-sm bg-panel-2 flex items-center justify-center mb-3">
                <span class="font-mono text-[10px] text-ink-faint text-center px-4">
                  No tradable token — no price chart available
                </span>
              </div>
            ) : token.tokenKey ? (
              <div class="mb-3">
                <CandlestickChart token={token.tokenKey} />
              </div>
            ) : null}

            {/* Market meta */}
            {(token.marketCap || token.athDrop) && (
              <div class="flex items-center gap-3 font-mono text-[10px] text-ink-faint mb-2">
                {token.marketCap && <span>Mkt cap: {token.marketCap}</span>}
                {token.athDrop && <span class="text-down">{token.athDrop}</span>}
              </div>
            )}

            {/* Date */}
            <div class="font-mono text-[9px] text-ink-faint mt-auto">{token.date}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div class="font-mono text-[10.5px] text-ink-faint mt-4">
        Prices are approximate snapshots; actual prices may differ. Charts show 1-week candles over
        trailing ~6 months where data is available.
      </div>
    </div>
  );
};

export default CryptoSection;
