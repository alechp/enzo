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

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  };

  const toggle = () => {
    if (!open()) {
      setOpen(true);
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    } else {
      setOpen(false);
    }
  };

  onCleanup(() => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div ref={containerRef} class="inline-block editable-value-container">
      <style>{`
        input[type="range"].editable-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: var(--color-panel-2);
          border: 1px solid var(--color-line);
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }
        input[type="range"].editable-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          background: var(--color-acid);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 6px var(--color-acid);
        }
        input[type="range"].editable-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: var(--color-acid);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 6px var(--color-acid);
        }
        .editable-value-trigger {
          border-bottom: 1px dashed var(--color-line-bright);
          cursor: pointer;
          transition: border-color 0.15s;
        }
        .editable-value-trigger:hover {
          border-bottom-color: rgba(214, 255, 63, 0.4);
        }
      `}</style>
      <span class="editable-value-trigger" onClick={toggle}>
        {props.format(props.value)}
      </span>
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
