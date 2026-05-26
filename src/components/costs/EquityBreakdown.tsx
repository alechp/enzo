export default function EquityBreakdown() {
  const terms = [
    { label: 'Vesting Schedule', value: '4-year standard, 1-year cliff' },
    { label: 'Starting Grant', value: '4.0% equity' },
    { label: 'Cap Grant', value: '10.0% (at 10,000 customers)' },
    { label: 'Exercise Window', value: '10 years post-departure' },
  ];

  return (
    <div class="grid grid-cols-2 gap-[34px] max-[880px]:grid-cols-1">
      {/* Left column — Equity Structure */}
      <div class="bg-panel border border-line p-6">
        <h3 class="font-display font-semibold text-[1.4rem] mb-5">Equity Structure</h3>
        <div>
          {terms.map((term) => (
            <div class="flex justify-between items-baseline border-b border-line py-3">
              <span class="font-mono text-[10px] uppercase tracking-[.14em] text-ink-faint">
                {term.label}
              </span>
              <span class="text-ink text-[.9rem]">{term.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right column — Double Trigger Acceleration */}
      <div class="bg-panel border border-line p-6">
        <h3 class="font-display font-semibold text-[1.4rem] mb-5">Double Trigger Acceleration</h3>

        {/* Trigger 1 */}
        <div class="border-l-[3px] border-frontier bg-panel-2 p-4 mb-0">
          <div class="font-mono text-[10px] uppercase text-frontier mb-1">
            Trigger 1: Change of Control
          </div>
          <div class="text-[.88rem] text-ink-dim">Acquisition, merger, or IPO</div>
        </div>

        {/* Connector */}
        <div class="w-px h-6 bg-line-bright ml-5" />

        {/* Trigger 2 */}
        <div class="border-l-[3px] border-wrapper bg-panel-2 p-4 mb-0">
          <div class="font-mono text-[10px] uppercase text-wrapper mb-1">
            Trigger 2: Involuntary Termination
          </div>
          <div class="text-[.88rem] text-ink-dim">
            Involuntary termination or constructive dismissal within 12 months of Trigger 1
          </div>
        </div>

        {/* Connector */}
        <div class="w-px h-6 bg-line-bright ml-5" />

        {/* Result */}
        <div class="border-l-[3px] border-acid bg-panel-2 p-4">
          <div class="font-mono text-[10px] uppercase text-acid mb-1">
            Result: Full Acceleration
          </div>
          <div class="text-[.88rem] text-ink font-semibold">
            100% of unvested shares accelerate immediately
          </div>
        </div>

        {/* Callout */}
        <div class="border-l-[3px] border-up bg-panel p-4 mt-5 text-[.92rem] text-ink-dim">
          Double trigger protects the employee in acquisition scenarios while aligning with standard
          institutional investor expectations.
        </div>
      </div>
    </div>
  );
}
