import { A, useLocation } from '@solidjs/router';

export default function Nav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav class="sticky top-0 z-40 flex items-center justify-between py-4 bg-[#0a0a0c]/95 backdrop-blur-sm border-b border-line">
      <A href="/" class="flex items-center gap-3 no-underline">
        <span class="w-[7px] h-[7px] rounded-full bg-acid" style="box-shadow: 0 0 10px #d6ff3f" />
        <span class="font-body font-bold text-ink tracking-wide text-sm">ENZO</span>
      </A>
      <div class="flex gap-6">
        <A
          href="/"
          class="font-mono text-[11px] uppercase no-underline"
          classList={{
            'text-acid': isActive('/'),
            'text-ink-faint hover:text-ink-dim': !isActive('/'),
          }}
          style="letter-spacing: .12em"
        >
          Market Analysis
        </A>
        <A
          href="/costs"
          class="font-mono text-[11px] uppercase no-underline"
          classList={{
            'text-acid': isActive('/costs'),
            'text-ink-faint hover:text-ink-dim': !isActive('/costs'),
          }}
          style="letter-spacing: .12em"
        >
          Cost Analysis
        </A>
      </div>
    </nav>
  );
}
