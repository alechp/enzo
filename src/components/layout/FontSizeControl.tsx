import { createSignal, onMount } from 'solid-js';

const STORAGE_KEY = 'enzo-font-size';
const DEFAULT_SIZE = 16;
const MIN_SIZE = 12;
const MAX_SIZE = 24;
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
      }
    }
  });

  const update = (newSize: number) => {
    const clamped = Math.min(Math.max(newSize, MIN_SIZE), MAX_SIZE);
    setSize(clamped);
    document.documentElement.style.fontSize = `${clamped}px`;
    localStorage.setItem(STORAGE_KEY, String(clamped));
  };

  return (
    <div class="flex items-center gap-1 font-mono text-[10px]">
      <button
        class="px-1.5 py-0.5 text-ink-faint hover:text-ink border border-line hover:border-acid rounded-sm transition-colors disabled:opacity-30 disabled:pointer-events-none"
        onClick={() => update(size() - STEP)}
        disabled={size() <= MIN_SIZE}
        title="Decrease font size"
      >
        A&minus;
      </button>
      <button
        class="px-1.5 py-0.5 text-ink-faint hover:text-ink border border-line hover:border-acid rounded-sm transition-colors"
        onClick={() => update(DEFAULT_SIZE)}
        title="Reset font size"
      >
        {size()}
      </button>
      <button
        class="px-1.5 py-0.5 text-ink-faint hover:text-ink border border-line hover:border-acid rounded-sm transition-colors disabled:opacity-30 disabled:pointer-events-none"
        onClick={() => update(size() + STEP)}
        disabled={size() >= MAX_SIZE}
        title="Increase font size"
      >
        A+
      </button>
    </div>
  );
}
