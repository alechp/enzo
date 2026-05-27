import { createSignal, type ParentProps } from 'solid-js';

export default function AccessGate(props: ParentProps) {
  const ACCESS_CODE = "BILLYORBUST";
  const [granted, setGranted] = createSignal(
    sessionStorage.getItem("enzo-access-granted") === "true"
  );
  const [input, setInput] = createSignal("");
  const [error, setError] = createSignal(false);
  const [fading, setFading] = createSignal(false);

  function submit() {
    if (input().toUpperCase() === ACCESS_CODE) {
      sessionStorage.setItem("enzo-access-granted", "true");
      setFading(true);
      setTimeout(() => setGranted(true), 400);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') submit();
  }

  if (granted()) return <>{props.children}</>;

  return (
    <>
      <style>{`
        @keyframes gate-shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes gate-fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .gate-shake {
          animation: gate-shake 0.5s ease-in-out;
        }
        .gate-fade-out {
          animation: gate-fade-out 0.4s ease-out forwards;
        }
      `}</style>

      <div
        class={`fixed inset-0 z-50 flex items-center justify-center bg-bg ${fading() ? 'gate-fade-out' : ''}`}
        style={{
          'background-image':
            'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
          'background-size': '54px 54px',
        }}
      >
        <div
          class={`flex flex-col items-center gap-6 p-10 rounded-sm border border-line bg-panel ${error() ? 'gate-shake' : ''}`}
          style={{ 'min-width': '340px', 'max-width': '400px' }}
        >
          {/* Logo */}
          <div class="flex items-center gap-3">
            <span
              class="w-[7px] h-[7px] rounded-full bg-acid"
              style={{ 'box-shadow': '0 0 10px #d6ff3f' }}
            />
            <span class="font-body font-bold text-ink tracking-wide text-sm">ENZO</span>
          </div>

          {/* Prompt */}
          <p class="font-mono text-[11px] uppercase text-ink-faint tracking-[.12em] text-center">
            Enter access code to continue
          </p>

          {/* Input */}
          <input
            type="text"
            value={input()}
            onInput={(e) => setInput(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            autofocus
            class="w-full px-4 py-3 rounded-sm font-mono text-sm text-center uppercase tracking-[.16em] bg-bg text-ink outline-none transition-colors"
            classList={{
              'border border-line focus:border-acid': !error(),
              'border-2 border-down': error(),
            }}
            placeholder="ACCESS CODE"
          />

          {/* Error message */}
          <div class="h-4 flex items-center justify-center">
            {error() && (
              <span class="font-mono text-[11px] text-down tracking-wide">Invalid code</span>
            )}
          </div>

          {/* Submit button */}
          <button
            onClick={submit}
            class="w-full px-4 py-[10px] rounded-sm text-[.82rem] font-mono font-semibold bg-acid text-black transition-opacity hover:opacity-90 cursor-pointer"
          >
            ENTER
          </button>
        </div>
      </div>
    </>
  );
}
