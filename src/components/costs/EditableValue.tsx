import { createSignal, Show, onCleanup } from 'solid-js';

interface EditableValueProps {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}

export default function EditableValue(props: EditableValueProps) {
  const [open, setOpen] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;

  const close = () => {
    setOpen(false);
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('keydown', handleKeyDown);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      close();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };

  const toggle = () => {
    if (!open()) {
      setOpen(true);
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    } else {
      close();
    }
  };

  onCleanup(() => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div ref={containerRef} class="inline-block">
      <button
        class="editable-value-trigger bg-transparent border-none p-0 font-inherit text-inherit text-left"
        onClick={toggle}
        aria-label={props.format(props.value)}
      >
        {props.format(props.value)}
      </button>
      <Show when={open()}>
        <div class="mt-1 w-[140px]">
          <input
            type="range"
            class="editable-slider"
            min={props.min}
            max={props.max}
            step={props.step}
            value={props.value}
            onInput={(e) => props.onChange(parseFloat(e.currentTarget.value))}
          />
        </div>
      </Show>
    </div>
  );
}
