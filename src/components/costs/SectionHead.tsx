interface SectionHeadProps {
  number: string;
  title: string;
  subtitle?: string;
}

export default function SectionHead(props: SectionHeadProps) {
  return (
    <div class="flex items-baseline gap-4 mb-8 flex-wrap">
      <span class="font-mono text-xs text-frontier tracking-[.1em]">{props.number}</span>
      <h2 class="font-display font-semibold text-[clamp(1.5rem,3vw,2.1rem)]">{props.title}</h2>
      {props.subtitle && (
        <span class="font-mono text-ink-faint text-sm ml-auto">{props.subtitle}</span>
      )}
    </div>
  );
}
