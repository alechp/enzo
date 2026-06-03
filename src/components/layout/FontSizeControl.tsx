import { createSignal, onMount } from 'solid-js';

const STORAGE_KEY = 'enzo-font-size';
const DEFAULT_SIZE = 24;
const MIN_SIZE = 12;
const MAX_SIZE = 32;
const STEP = 2;

export default function FontSizeControl() {
  const [size, setSize] = createSignal(DEFAULT_SIZE);

  onMount(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved);
      if (!isNaN(parsed) && parsed >= MIN_SIZE && parsed <= MAX_SIZE) {
        setSize(parsed);
        document.documentElement.style.fontSize = `${parsed}px`;
        return;
      }
    }
    document.documentElement.style.fontSize = `${DEFAULT_SIZE}px`;
  });

  const update = (newSize: number) => {
    const clamped = Math.min(Math.max(newSize, MIN_SIZE), MAX_SIZE);
    setSize(clamped);
    document.documentElement.style.fontSize = `${clamped}px`;
    localStorage.setItem(STORAGE_KEY, String(clamped));
  };

  return (
    <div class="flex items-center gap-1.5 font-mono text-[10px] border border-line rounded-sm px-1.5 py-1 bg-panel no-print">
      <span class="text-[9px] text-ink-faint uppercase tracking-[.08em] mr-0.5">Font</span>
      <button
        class="w-6 h-6 flex items-center justify-center text-ink-dim hover:text-ink hover:bg-panel-2 rounded-sm transition-colors disabled:opacity-30 disabled:pointer-events-none"
        onClick={() => update(size() - STEP)}
        disabled={size() <= MIN_SIZE}
        title="Decrease font size"
      >
        <span class="text-[9px]">A</span>
      </button>
      <button
        class="px-1 text-ink-faint hover:text-acid transition-colors tabular-nums"
        onClick={() => update(DEFAULT_SIZE)}
        title="Reset to default (24px)"
      >
        {size()}px
      </button>
      <button
        class="w-6 h-6 flex items-center justify-center text-ink-dim hover:text-ink hover:bg-panel-2 rounded-sm transition-colors disabled:opacity-30 disabled:pointer-events-none"
        onClick={() => update(size() + STEP)}
        disabled={size() >= MAX_SIZE}
        title="Increase font size"
      >
        <span class="text-[13px] font-bold">A</span>
      </button>
    </div>
  );
}
