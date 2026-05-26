import { createSignal, onMount, For } from 'solid-js';
import type { Component } from 'solid-js';

interface Bar {
  label: string;
  width: number;
  value: string;
  color?: string;
}

interface BarChartProps {
  bars: Bar[];
  legend?: string;
  title?: string;
}

const BarChart: Component<BarChartProps> = (props) => {
  const [visible, setVisible] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;

  onMount(() => {
    if (!containerRef) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(containerRef);
  });

  return (
    <div ref={containerRef} class="border border-line bg-panel p-6 rounded-sm">
      {props.title && (
        <div class="font-mono text-[10px] uppercase tracking-[.16em] text-ink-faint mb-5">
          {props.title}
        </div>
      )}
      <div class="flex flex-col gap-[10px]">
        <For each={props.bars}>
          {(bar) => (
            <div class="grid grid-cols-[130px_1fr_86px] items-center gap-2">
              <span class="font-mono text-[11px] text-ink-faint text-right pr-2">
                {bar.label}
              </span>
              <div class="h-[26px] bg-panel-2 border border-line rounded-sm overflow-hidden">
                <div
                  class="h-full rounded-sm"
                  style={{
                    width: visible() ? `${bar.width}%` : '0%',
                    background: bar.color ?? 'var(--color-ink-faint)',
                    transition: 'width 1.1s cubic-bezier(.16,1,.3,1)',
                  }}
                />
              </div>
              <span class="font-mono text-[11px] text-ink">{bar.value}</span>
            </div>
          )}
        </For>
      </div>
      {props.legend && (
        <div class="font-mono text-[10.5px] text-ink-faint mt-4">{props.legend}</div>
      )}
    </div>
  );
};

export default BarChart;
