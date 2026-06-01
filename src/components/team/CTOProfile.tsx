import { For, Show } from 'solid-js';

interface ProgressionStep {
  year: string;
  focus: string;
}

interface CareerEntry {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  progression?: ProgressionStep[];
  tags: string[];
  color: string;
}

const career: CareerEntry[] = [
  {
    title: 'CTO',
    company: 'Enzo.ai',
    period: '2026 – Present',
    location: 'Remote',
    description: 'Technical co-founder. Building the AI video generation platform — architecture, ML pipeline integration, and full-stack product development.',
    tags: ['current'],
    color: 'var(--color-acid)',
  },
  {
    title: 'Program Manager',
    company: 'GoGuardian',
    period: 'Dec 2014 – Apr 2016 · 1 yr 5 mos',
    location: 'Los Angeles',
    description: 'Transitioned across three roles (product manager, project manager, program manager) as the company scaled from apartment-startup to 70+ person SMB. Product manager: engaged with the product development lifecycle from customer feedback to UI/UX to engineering implementation. Project manager: execution-focused, working heavily with the engineering team. Program manager: cross-functional "glue" across all products and departments.',
    tags: ['product', 'engineering', 'leadership'],
    color: 'var(--color-wrapper)',
  },
  {
    title: 'Brain (Tech Ops)',
    company: 'Multibrain',
    period: 'Feb 2014 – Jul 2014 · 6 mos',
    location: 'Los Angeles, CA',
    description: 'Programming, account management, client project implementation, dashboard management, development of Multibrain solutions, content management, business development, procedures and documentation — all in the context of growing the company.',
    tags: ['fullstack', 'ops'],
    color: 'var(--color-frontier)',
  },
  {
    title: 'Freelancer',
    company: 'AlecHP Design',
    period: 'Aug 2013 – Jan 2014 · 6 mos',
    location: 'Orange County, CA',
    description: 'Graphic design (mockups and high-fidelity prototypes), web development (WordPress, Bootstrap, HTML/CSS/JS), project management, content management, and business development.',
    tags: ['design', 'frontend'],
    color: 'var(--color-public)',
  },
  {
    title: 'General Manager in Training',
    company: 'Spireon, Inc.',
    period: 'Aug 2008 – Aug 2013 · 5 yrs 1 mo',
    location: 'Irvine, CA',
    description: 'Cross-vertical training across technical and business functions: team collaboration, procedural implementation, event coordination, project management, copywriting, vendor management, web design, programming, R&D, IT helpdesk, active directory administration, exchange server management, solutions architecture, strategic software implementation, and demand management.',
    progression: [
      { year: "'13", focus: 'Process control and demand management' },
      { year: "'12", focus: 'Marketing and business development' },
      { year: "'10–'12", focus: 'Network administration' },
      { year: "'09–'10", focus: 'Web Design' },
      { year: "'08–'09", focus: 'Internship' },
    ],
    tags: ['enterprise', 'infrastructure', 'leadership'],
    color: 'var(--color-frontier)',
  },
  {
    title: 'Co-Founder & CEO',
    company: 'UnitePeople',
    period: 'Jun 2009 – Nov 2012 · 3 yrs 6 mos',
    location: 'California',
    description: "Humanitarian company combining sustainability and innovation. Established organic farms to educate and employ local communities while creating sustainable food sources. Sales at farmers' markets plus Unite Clothing line funded the Love United philanthropic initiative (youth mentoring, poverty outreach). Reached 20,000+ people across Texas, Seattle, San Diego, San Francisco, Santa Ana, Cypress, and more.",
    tags: ['founder', 'social-impact'],
    color: 'var(--color-ancillary)',
  },
  {
    title: 'Founder',
    company: 'Alec Hale-Pletka WebDesign',
    period: 'Aug 2008 – Dec 2010 · 2 yrs 5 mos',
    location: 'Orange County, CA',
    description: 'Everything from concept design to server management.',
    tags: ['founder', 'fullstack'],
    color: 'var(--color-ancillary)',
  },
];

const skills = [
  'Infrastructure',
  'Product Management',
  'Design',
  'Technical Ops',
  'Founding / CEO',
];

const tagColors: Record<string, string> = {
  current: 'bg-acid/15 text-acid border-acid/30',
  product: 'bg-wrapper/15 text-wrapper border-wrapper/30',
  engineering: 'bg-wrapper/15 text-wrapper border-wrapper/30',
  leadership: 'bg-wrapper/15 text-wrapper border-wrapper/30',
  fullstack: 'bg-frontier/15 text-frontier border-frontier/30',
  ops: 'bg-frontier/15 text-frontier border-frontier/30',
  design: 'bg-public/15 text-public border-public/30',
  frontend: 'bg-public/15 text-public border-public/30',
  enterprise: 'bg-frontier/15 text-frontier border-frontier/30',
  infrastructure: 'bg-frontier/15 text-frontier border-frontier/30',
  founder: 'bg-ancillary/15 text-ancillary border-ancillary/30',
  'social-impact': 'bg-up/15 text-up border-up/30',
};

export default function CTOProfile() {
  return (
    <div class="mt-6">
      {/* Executive Summary */}
      <div class="bg-panel border border-line p-6 mb-10">
        <div class="font-display font-black text-[1.4rem] text-ink mb-3">
          Alec Hale-Pletka
          <span class="text-acid font-mono text-[.7rem] font-normal ml-3 uppercase tracking-[.14em]">CTO</span>
        </div>
        <p class="text-ink-dim text-[.94rem] leading-relaxed mb-5">
          13+ years spanning enterprise infrastructure (Spireon), edtech product management (GoGuardian),
          freelance design, and social-impact founding (UnitePeople). A rare combination of deep technical
          operations, product sense, and startup execution — the kind of breadth that comes from building
          things across every layer of the stack since 2008.
        </p>
        <div class="flex flex-wrap gap-2">
          <For each={skills}>
            {(skill) => (
              <span class="font-mono text-[9px] uppercase bg-panel-2 px-2.5 py-1 rounded text-ink-faint border border-line tracking-[.08em]">
                {skill}
              </span>
            )}
          </For>
        </div>
      </div>

      {/* Career Timeline */}
      <div class="relative pl-6">
        {/* Vertical line */}
        <div class="absolute left-[7px] top-0 bottom-0 w-px bg-line-bright" />

        <div class="flex flex-col gap-4">
          <For each={career}>
            {(entry) => (
              <div class="relative">
                {/* Dot */}
                <div
                  class="absolute left-[-23px] top-5 w-[11px] h-[11px] rounded-full z-10"
                  style={{
                    'background-color': entry.color,
                    'box-shadow': `0 0 8px ${entry.color}`,
                  }}
                />

                {/* Card */}
                <div
                  class="bg-panel p-5 hover:bg-panel-2 transition-colors"
                  style={{ 'border-left': `3px solid ${entry.color}` }}
                >
                  <div class="flex items-start justify-between gap-3 mb-1 flex-wrap">
                    <div>
                      <div class="font-display font-semibold text-[1.1rem] text-ink">
                        {entry.title}
                      </div>
                      <div class="font-mono text-[10px] uppercase tracking-[.1em] text-ink-faint">
                        {entry.company}
                      </div>
                    </div>
                    <div class="font-mono text-[10px] text-ink-faint text-right shrink-0">
                      <div>{entry.period}</div>
                      <div>{entry.location}</div>
                    </div>
                  </div>

                  <p class="text-[.88rem] text-ink-dim leading-relaxed mt-3">
                    {entry.description}
                  </p>

                  {/* Progression sub-timeline (Spireon) */}
                  <Show when={entry.progression}>
                    <div class="ml-4 mt-3 border-l border-line pl-4 space-y-1">
                      <For each={entry.progression}>
                        {(p) => (
                          <div class="font-mono text-[11px]">
                            <span class="text-ink-faint">{p.year}:</span>
                            <span class="text-ink-dim ml-2">{p.focus}</span>
                          </div>
                        )}
                      </For>
                    </div>
                  </Show>

                  {/* Tags */}
                  <div class="flex flex-wrap gap-1.5 mt-3">
                    <For each={entry.tags}>
                      {(tag) => (
                        <span
                          class={`font-mono text-[8px] uppercase tracking-[.08em] px-2 py-0.5 rounded border ${tagColors[tag] || 'bg-panel-2 text-ink-faint border-line'}`}
                        >
                          {tag}
                        </span>
                      )}
                    </For>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
