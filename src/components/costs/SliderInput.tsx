import { createSignal, Show } from 'solid-js';

interface SliderInputProps {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}

export default function SliderInput(props: SliderInputProps) {
  const [editing, setEditing] = createSignal(false);
  const [textValue, setTextValue] = createSignal('');

  const startEditing = () => {
    setTextValue(String(props.value));
    setEditing(true);
  };

  const commitEdit = () => {
    const stripped = textValue().replace(/[^0-9.\-]/g, '');
    const parsed = parseFloat(stripped);
    if (!isNaN(parsed)) {
      const clamped = Math.min(Math.max(parsed, props.min), props.max);
      const stepped = Math.round(clamped / props.step) * props.step;
      props.onChange(stepped);
    }
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <div>
      <Show
        when={editing()}
        fallback={
          <button
            class="font-mono text-[.86rem] text-ink bg-transparent border-none p-0 text-left editable-value-trigger cursor-pointer"
            onClick={startEditing}
          >
            {props.format(props.value)}
          </button>
        }
      >
        <input
          type="text"
          class="font-mono text-[.86rem] text-ink bg-panel border border-acid px-2 py-0.5 outline-none w-[120px]"
          value={textValue()}
          onInput={(e) => setTextValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitEdit}
          autofocus
        />
      </Show>

      <input
        type="range"
        class="editable-slider w-full mt-2"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onInput={(e) => props.onChange(parseFloat(e.currentTarget.value))}
      />
    </div>
  );
}
