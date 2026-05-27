import { createSignal, For, Show, onMount } from 'solid-js';

interface Comment {
  text: string;
  timestamp: number;
}

interface CommentThreadProps {
  sectionId: string;
}

function relativeTime(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? '' : 's'} ago`;
}

export default function CommentThread(props: CommentThreadProps) {
  const storageKey = () => `enzo-comments-${props.sectionId}`;
  const [comments, setComments] = createSignal<Comment[]>([]);
  const [input, setInput] = createSignal('');

  const load = () => {
    try {
      const raw = localStorage.getItem(storageKey());
      if (raw) setComments(JSON.parse(raw));
    } catch {
      /* ignore parse errors */
    }
  };

  const save = (c: Comment[]) => {
    localStorage.setItem(storageKey(), JSON.stringify(c));
  };

  onMount(load);

  const addComment = () => {
    const text = input().trim();
    if (!text) return;
    const next = [...comments(), { text, timestamp: Date.now() }];
    setComments(next);
    save(next);
    setInput('');
  };

  const removeComment = (index: number) => {
    const next = comments().filter((_, i) => i !== index);
    setComments(next);
    save(next);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') addComment();
  };

  return (
    <div class="mt-6 border border-line bg-panel p-4">
      <div class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint mb-3">
        Comments
      </div>

      <Show
        when={comments().length > 0}
        fallback={
          <div class="text-ink-faint text-sm mb-4 italic">No comments yet</div>
        }
      >
        <div class="space-y-2 mb-4">
          <For each={comments()}>
            {(comment, i) => (
              <div class="group flex items-start gap-2 text-sm">
                <div class="flex-1 min-w-0">
                  <span class="text-ink">{comment.text}</span>
                  <span class="text-ink-faint text-[11px] ml-2">
                    {relativeTime(comment.timestamp)}
                  </span>
                </div>
                <button
                  class="text-ink-faint hover:text-ink opacity-0 group-hover:opacity-100 transition-opacity text-xs px-1 shrink-0"
                  onClick={() => removeComment(i())}
                  title="Delete comment"
                >
                  &times;
                </button>
              </div>
            )}
          </For>
        </div>
      </Show>

      <div class="flex gap-2">
        <input
          type="text"
          class="flex-1 bg-panel border border-line text-ink font-mono text-sm px-3 py-2 outline-none focus:border-acid transition-colors"
          placeholder="Add a note..."
          value={input()}
          onInput={(e) => setInput(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          class={`px-3 py-2 text-sm font-mono border transition-colors ${
            input().trim()
              ? 'bg-acid text-black border-acid'
              : 'bg-panel-2 border-line text-ink hover:border-acid'
          }`}
          onClick={addComment}
        >
          Add
        </button>
      </div>
    </div>
  );
}
