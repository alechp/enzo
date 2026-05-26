import { createSignal, createMemo, For } from 'solid-js';
import type { Component } from 'solid-js';
import { series } from '../../data/candlestick-series';
import type { TokenSeries } from '../../data/candlestick-series';
import { formatTokenPrice, addWeeks } from '../../lib/format';

interface CandlestickChartProps {
  token: string;
}

const CandlestickChart: Component<CandlestickChartProps> = (props) => {
  const [tooltip, setTooltip] = createSignal<{
    visible: boolean;
    x: number;
    y: number;
    index: number;
  }>({ visible: false, x: 0, y: 0, index: 0 });

  const tokenData = createMemo(() => {
    const s = series[props.token] as TokenSeries | undefined;
    return s ?? null;
  });

  const chartMetrics = createMemo(() => {
    const data = tokenData();
    if (!data) return null;

    const candles = data.data;
    const n = candles.length;

    let minLow = Infinity;
    let maxHigh = -Infinity;
    for (const c of candles) {
      if (c.l < minLow) minLow = c.l;
      if (c.h > maxHigh) maxHigh = c.h;
    }

    const headroom = (maxHigh - minLow) * 0.04;
    const lo = minLow - headroom;
    const hi = maxHigh + headroom;

    const padT = 8;
    const padB = 16;
    const padL = 4;
    const padR = 4;
    const plotH = 132 - padT - padB; // 108
    const plotW = 300 - padL - padR; // 292

    const y = (v: number) => padT + plotH - ((v - lo) / (hi - lo)) * plotH;

    const slot = plotW / n;
    const bodyWidth = Math.max(2, slot * 0.6);

    const firstClose = candles[0].c;
    const lastClose = candles[n - 1].c;
    const pctChange = ((lastClose - firstClose) / firstClose) * 100;

    return { candles, n, lo, hi, padT, padB, padL, padR, plotH, plotW, y, slot, bodyWidth, pctChange };
  });

  const gridLines = createMemo(() => {
    const m = chartMetrics();
    if (!m) return [];
    const lines = [];
    for (let i = 1; i <= 3; i++) {
      const price = m.lo + ((m.hi - m.lo) * i) / 4;
      lines.push({ y: m.y(price), price });
    }
    return lines;
  });

  function handleMouseMove(e: MouseEvent, index: number) {
    setTooltip({ visible: true, x: e.clientX, y: e.clientY, index });
  }

  function handleMouseLeave() {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }

  const data = tokenData();
  if (!data) return null;

  const m = chartMetrics();
  if (!m) return null;

  return (
    <div class="relative">
      {/* Header */}
      <div class="flex items-center justify-between mb-1">
        <span class="font-mono text-[9px] text-ink-faint">1W candles &middot; trailing ~6mo</span>
        <span
          class={`font-mono text-[10px] font-semibold ${m.pctChange >= 0 ? 'text-up' : 'text-down'}`}
        >
          {m.pctChange >= 0 ? '+' : ''}
          {m.pctChange.toFixed(1)}%
        </span>
      </div>

      {/* SVG Chart */}
      <svg viewBox="0 0 300 132" class="w-full" role="img" aria-label={`Price chart for ${props.token}`}>
        {/* Grid lines */}
        <For each={gridLines()}>
          {(line) => (
            <>
              <line
                x1={m.padL}
                y1={line.y}
                x2={300 - m.padR}
                y2={line.y}
                stroke="var(--color-line)"
                stroke-width="0.5"
                stroke-dasharray="3,3"
              />
            </>
          )}
        </For>

        {/* Hi/Lo labels */}
        <text
          x={300 - m.padR}
          y={m.y(m.hi) + 3}
          text-anchor="end"
          class="font-mono"
          fill="var(--color-ink-faint)"
          font-size="8"
        >
          {formatTokenPrice(m.hi, data.dec)}
        </text>
        <text
          x={300 - m.padR}
          y={m.y(m.lo) - 1}
          text-anchor="end"
          class="font-mono"
          fill="var(--color-ink-faint)"
          font-size="8"
        >
          {formatTokenPrice(m.lo, data.dec)}
        </text>

        {/* Candles */}
        <For each={m.candles}>
          {(candle, i) => {
            const cx = () => m.padL + m.slot * i() + m.slot / 2;
            const isUp = () => candle.c >= candle.o;
            const color = () => (isUp() ? '#36d1a4' : '#ff5e3a');
            const bodyTop = () => m.y(Math.max(candle.o, candle.c));
            const bodyBot = () => m.y(Math.min(candle.o, candle.c));
            const bodyH = () => Math.max(1, bodyBot() - bodyTop());

            return (
              <>
                {/* Wick */}
                <line
                  x1={cx()}
                  y1={m.y(candle.h)}
                  x2={cx()}
                  y2={m.y(candle.l)}
                  stroke={color()}
                  stroke-width="1"
                />
                {/* Body */}
                <rect
                  x={cx() - m.bodyWidth / 2}
                  y={bodyTop()}
                  width={m.bodyWidth}
                  height={bodyH()}
                  fill={color()}
                />
                {/* Hit area */}
                <rect
                  x={m.padL + m.slot * i()}
                  y={m.padT}
                  width={m.slot}
                  height={m.plotH}
                  fill="transparent"
                  onMouseMove={(e) => handleMouseMove(e, i())}
                  onMouseLeave={handleMouseLeave}
                />
              </>
            );
          }}
        </For>
      </svg>

      {/* Tooltip */}
      {tooltip().visible && (() => {
        const t = tooltip();
        const candle = m.candles[t.index];
        if (!candle) return null;
        const weekDate = addWeeks(data.start, t.index);
        return (
          <div
            class="fixed z-50 bg-[#040406] border border-line-bright rounded p-2 font-mono text-[10px] pointer-events-none"
            style={{
              left: `${t.x + 12}px`,
              top: `${t.y - 60}px`,
              opacity: 1,
              transition: 'opacity 0.1s',
            }}
          >
            <div class="text-ink-faint mb-1">Week of {weekDate}</div>
            <div class="text-ink">
              O {formatTokenPrice(candle.o, data.dec)} &nbsp;
              H {formatTokenPrice(candle.h, data.dec)}
            </div>
            <div class="text-ink">
              L {formatTokenPrice(candle.l, data.dec)} &nbsp;
              C {formatTokenPrice(candle.c, data.dec)}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default CandlestickChart;
