import { createSignal, For, createMemo } from 'solid-js';
import type { Component } from 'solid-js';
import { companies } from '../../data/companies';
import type { Company, TagVariant } from '../../data/companies';

const tagStyles: Record<string, { background: string; color: string; border: string; extra?: string }> = {
  frontier: { background: 'rgba(255,94,58,.14)', color: '#ff5e3a', border: '1px solid rgba(255,94,58,.3)' },
  wrapper: { background: 'rgba(58,160,255,.14)', color: '#3aa0ff', border: '1px solid rgba(58,160,255,.3)' },
  ancillary: { background: 'rgba(177,140,255,.14)', color: '#b18cff', border: '1px solid rgba(177,140,255,.3)' },
  public: { background: 'rgba(255,209,102,.12)', color: '#ffd166', border: '1px solid rgba(255,209,102,.3)' },
  private: { background: 'rgba(255,255,255,.05)', color: '#5f5d58', border: '1px solid #36363f' },
  crypto: { background: 'rgba(247,147,26,.13)', color: '#f7931a', border: '1px solid rgba(247,147,26,.35)' },
  ugc: { background: 'rgba(54,209,164,.13)', color: '#36d1a4', border: '1px solid rgba(54,209,164,.35)' },
  dead: { background: 'rgba(255,255,255,.03)', color: '#6b6b6b', border: '1px solid #26262d', extra: 'line-through' },
};

const filters = [
  { key: 'all', label: 'All' },
  { key: 'frontier', label: 'Frontier Models' },
  { key: 'wrapper', label: 'Wrappers' },
  { key: 'ancillary', label: 'Ancillary' },
  { key: 'public', label: 'Public only' },
] as const;

function Tag(props: { variant: TagVariant; label: string }) {
  const s = () => tagStyles[props.variant] ?? tagStyles.private;
  return (
    <span
      class="font-mono text-[9px] uppercase tracking-[.08em] px-2 py-[2px] rounded-sm inline-block whitespace-nowrap"
      style={{
        background: s().background,
        color: s().color,
        border: s().border,
        'text-decoration': s().extra ?? 'none',
      }}
    >
      {props.label}
    </span>
  );
}

const CompanyTable: Component = () => {
  const [activeFilter, setActiveFilter] = createSignal<string>('all');

  const filtered = createMemo(() => {
    const f = activeFilter();
    if (f === 'all') return companies;
    if (f === 'public') return companies.filter((c) => c.status === 'public');
    return companies.filter((c) => c.segment === f);
  });

  return (
    <div>
      {/* Filter buttons */}
      <div class="flex flex-wrap gap-2 mb-6">
        <For each={filters}>
          {(f) => (
            <button
              class={`px-4 py-[6px] rounded-sm text-[.82rem] font-mono transition-colors ${
                activeFilter() === f.key
                  ? 'bg-acid text-black font-semibold'
                  : 'bg-panel border border-line-bright text-ink-dim hover:text-ink'
              }`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          )}
        </For>
      </div>

      {/* Table */}
      <div class="overflow-x-auto border border-line">
        <table class="w-full text-[.84rem] border-collapse">
          <thead class="sticky top-0 z-10">
            <tr class="bg-panel border-b border-line">
              <th class="text-left font-mono text-[10px] uppercase tracking-[.12em] text-ink-faint px-4 py-3">
                Company
              </th>
              <th class="text-left font-mono text-[10px] uppercase tracking-[.12em] text-ink-faint px-4 py-3">
                Segment
              </th>
              <th class="text-left font-mono text-[10px] uppercase tracking-[.12em] text-ink-faint px-4 py-3">
                Status
              </th>
              <th class="text-left font-mono text-[10px] uppercase tracking-[.12em] text-ink-faint px-4 py-3">
                Capital Raised
              </th>
              <th class="text-left font-mono text-[10px] uppercase tracking-[.12em] text-ink-faint px-4 py-3">
                Valuation
              </th>
              <th class="text-left font-mono text-[10px] uppercase tracking-[.12em] text-ink-faint px-4 py-3">
                Position
              </th>
            </tr>
          </thead>
          <tbody>
            <For each={filtered()}>
              {(company: Company) => (
                <tr class="border-b border-line hover:bg-panel-2 transition-colors group">
                  <td class="px-4 py-3 whitespace-nowrap">
                    <a
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="font-semibold text-ink hover:text-acid transition-colors"
                    >
                      {company.name}
                      <span class="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-[10px]">
                        ↗
                      </span>
                    </a>
                  </td>
                  <td class="px-4 py-3">
                    <Tag variant={company.segment} label={company.segment} />
                  </td>
                  <td class="px-4 py-3">
                    <For each={company.tags}>
                      {(tag) => (
                        <span class="mr-1">
                          <Tag variant={tag} label={company.statusLabel ?? company.status} />
                        </span>
                      )}
                    </For>
                  </td>
                  <td class="px-4 py-3 font-mono text-[.82rem] text-ink-dim whitespace-nowrap">
                    {company.capitalRaised}
                  </td>
                  <td class="px-4 py-3 font-mono text-[.82rem] text-ink-dim whitespace-nowrap">
                    {company.valuation}
                  </td>
                  <td class="px-4 py-3 text-[.82rem] text-ink-dim">{company.position}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyTable;
