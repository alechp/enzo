import { For } from 'solid-js';
import type { Component } from 'solid-js';
import type { Kpi } from '../../data/kpis';

const colorMap: Record<string, string> = {
  acid: 'text-acid',
  frontier: 'text-frontier',
  wrapper: 'text-wrapper',
  ancillary: 'text-ancillary',
};

const KpiStrip: Component<{ items: Kpi[] }> = (props) => {
  return (
    <div class="grid grid-cols-4 max-[880px]:grid-cols-2 gap-px bg-line border border-line mb-10">
      <For each={props.items}>
        {(kpi) => (
          <div class="bg-panel p-6 hover:bg-panel-2 transition-colors">
            <div class="font-mono text-[10.5px] uppercase tracking-[.16em] text-ink-faint mb-2">
              {kpi.label}
            </div>
            <div
              class={`font-display font-black text-[2.7rem] leading-none mb-1 ${colorMap[kpi.color] ?? 'text-ink'}`}
            >
              {kpi.value}
            </div>
            <div class="text-[.78rem] text-ink-dim">{kpi.note}</div>
          </div>
        )}
      </For>
    </div>
  );
};

export default KpiStrip;
