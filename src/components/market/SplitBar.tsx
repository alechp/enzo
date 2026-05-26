import { For } from 'solid-js';
import type { Component } from 'solid-js';

interface Segment {
  label: string;
  percentage: number;
  bg: string;
  textColor: string;
}

const SplitBar: Component<{ segments: Segment[] }> = (props) => {
  return (
    <div class="flex h-16 border border-line overflow-hidden rounded-sm mb-10">
      <For each={props.segments}>
        {(seg) => (
          <div
            class="flex items-center px-4"
            style={{ flex: seg.percentage, background: seg.bg, color: seg.textColor }}
          >
            <div class="flex items-baseline gap-2">
              <span class="font-display font-black text-[1.3rem]">
                {seg.percentage}%
              </span>
              <span class="font-mono text-[9.5px] uppercase">
                {seg.label}
              </span>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export default SplitBar;
