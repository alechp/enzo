import SectionHead from '../components/costs/SectionHead';
import CTOProfile from '../components/team/CTOProfile';

export default function TeamPage() {
  return (
    <>
      <header class="py-14 border-b border-line">
        <div
          class="flex items-center gap-[14px] flex-wrap font-mono text-[11px] uppercase text-acid"
          style="letter-spacing:.32em"
        >
          <span
            class="w-[7px] h-[7px] rounded-full bg-acid inline-block"
            style="box-shadow:0 0 10px #d6ff3f"
          />
          Team &middot; Enzo.ai &middot; 2026
        </div>
        <h1
          class="font-display font-black text-[clamp(2.6rem,6.4vw,5.4rem)] leading-[.96] mt-5 mb-4"
          style="letter-spacing:-.02em"
        >
          The <em class="italic text-wrapper">Team</em>
        </h1>
        <p class="text-ink-dim max-w-[62ch] text-[1.06rem]">
          The people building Enzo — their backgrounds, what they bring, and why this team is
          uniquely positioned to execute in the AI video space.
        </p>
      </header>

      <section class="py-[54px] border-b border-line">
        <SectionHead number="01 /" title="Alec Hale-Pletka" subtitle="CTO" />
        <CTOProfile />
      </section>
    </>
  );
}
