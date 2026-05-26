import { For } from 'solid-js';
import type { Component } from 'solid-js';
import { exits } from '../../data/exits';
import type { ExitEvent } from '../../data/exits';

const ExitsTimeline: Component = () => {
  return (
    <div class="border border-line overflow-hidden">
      <For each={exits}>
        {(event: ExitEvent, i) => (
          <div
            class={`grid grid-cols-[96px_1fr_auto] items-center px-4 py-3 hover:bg-panel-2 transition-colors ${
              i() > 0 ? 'border-t border-line' : ''
            }`}
          >
            <span class="font-mono text-[11px] text-acid tracking-[.06em]">
              {event.date}
            </span>
            <span class="text-[.9rem] text-ink-dim" innerHTML={event.event} />
            <span class="font-mono text-[.86rem] text-ink whitespace-nowrap pl-4">
              {event.amount}
            </span>
          </div>
        )}
      </For>
    </div>
  );
};

export default ExitsTimeline;
