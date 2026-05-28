import { A, useLocation } from '@solidjs/router';

export default function Nav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav class="sticky top-0 z-40 flex items-center justify-between py-4 bg-bg/95 backdrop-blur-sm border-b border-line">
      <A href="/" class="flex items-center gap-3 no-underline">
        <span class="w-[7px] h-[7px] rounded-full bg-acid" style={{ 'box-shadow': '0 0 10px var(--color-acid)' }} />
        <span class="font-body font-bold text-ink tracking-wide text-sm">ENZO</span>
      </A>
      <div class="flex gap-5 max-[480px]:gap-3">
        <A
          href="/"
          class="font-mono text-[11px] max-[480px]:text-[9px] uppercase no-underline transition-colors"
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
          class="font-mono text-[11px] max-[480px]:text-[9px] uppercase no-underline transition-colors"
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
