import { createSignal, Show } from 'solid-js';
import { getUsername, getSavedAt, saveProfile, clearProfile } from '../../data/settingsStore';
import { resetTeamDefaults } from '../../data/teamStore';

function relativeTime(ts: number): string {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function SavedBanner() {
  const handleClear = () => {
    clearProfile();
    resetTeamDefaults();
    localStorage.removeItem('enzo-adjusted-economics');
    localStorage.removeItem('enzo-projection-inputs');
    window.location.reload();
  };

  return (
    <Show when={getUsername()}>
      <div class="bg-panel border border-acid/20 px-4 py-2 mt-4 flex items-center gap-3 font-mono text-[11px]">
        <span class="w-[6px] h-[6px] rounded-full bg-acid inline-block" style="box-shadow:0 0 6px var(--color-acid)" />
        <span class="text-acid">Scenario by {getUsername()}</span>
        <span class="text-ink-faint">saved {relativeTime(getSavedAt())}</span>
        <button
          class="ml-auto text-ink-faint hover:text-down transition-colors"
          onClick={handleClear}
        >
          Clear saved
        </button>
      </div>
    </Show>
  );
}

export default function SaveScenario() {
  const [prompting, setPrompting] = createSignal(false);
  const [nameInput, setNameInput] = createSignal(getUsername());
  const [saved, setSaved] = createSignal(false);

  const handleSave = () => {
    if (!getUsername()) {
      setPrompting(true);
      return;
    }
    saveProfile(getUsername());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSubmitName = () => {
    const name = nameInput().trim();
    if (!name) return;
    saveProfile(name);
    setPrompting(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmitName();
    if (e.key === 'Escape') setPrompting(false);
  };

  return (
    <div class="mt-10 border border-line bg-panel p-6">
      <Show when={prompting()}>
        <div class="mb-4">
          <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-3">
            Before saving, enter a name so others know who configured this:
          </div>
          <div class="flex gap-2">
            <input
              type="text"
              class="flex-1 bg-panel border border-line text-ink font-mono text-sm px-3 py-2 outline-none focus:border-acid transition-colors"
              placeholder="Enter your name..."
              value={nameInput()}
              onInput={(e) => setNameInput(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              autofocus
            />
            <button
              class="px-4 py-2 text-sm font-mono bg-acid text-black border border-acid hover:brightness-110 transition-colors"
              onClick={handleSubmitName}
            >
              Save
            </button>
            <button
              class="px-4 py-2 text-sm font-mono bg-panel-2 border border-line text-ink-faint hover:text-ink hover:border-acid transition-colors"
              onClick={() => setPrompting(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Show>

      <Show when={!prompting()}>
        <div class="flex items-center gap-4">
          <button
            class={`px-5 py-2.5 text-sm font-mono border transition-colors ${
              saved()
                ? 'bg-up/20 border-up text-up'
                : 'bg-panel-2 border-line text-ink hover:border-acid hover:text-acid'
            }`}
            onClick={handleSave}
          >
            {saved() ? 'Saved!' : 'Save Scenario'}
          </button>
          <span class="font-mono text-[10px] text-ink-faint">
            Saves all current team, economics, and projection settings to this browser
          </span>
        </div>
      </Show>
    </div>
  );
}
