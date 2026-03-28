"use client";

export default function ConfigurationView() {
  return (
    <section className="px-6 md:px-12 pt-10">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="space-y-2 mb-10">
          <span className="font-label text-xs text-[#00ffab] tracking-[0.2em] uppercase opacity-90">Configuration</span>
          <h2 className="font-headline text-4xl font-extrabold tracking-tight text-[#e0e3e5]">Configuration Console</h2>
          <p className="font-body text-on-surface-variant max-w-2xl leading-relaxed">
            Manage orchestration parameters, model selection, and retrieval protocols. Placeholder UI.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-[#131315] rounded-xl p-8 border border-[#48484b]/10 shadow-sm">
            {/* TODO: Replace the placeholder configuration controls with real, validated settings:
                model choice, RAG chunking/retrieval params, and tool-calling options.
                Persist config per user/session and apply server-side. */}
            <h3 className="font-headline text-xl font-bold flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#00ffab]" data-icon="memory">
                memory
              </span>
              Neural Engine Parameters
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block font-label text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">
                  Core Language Model
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col items-start p-4 rounded-xl border-2 border-[#00ffab] bg-[#272a2c] transition-all">
                    <div className="flex justify-between w-full mb-2">
                      <span className="font-headline font-bold text-[#e0e3e5]">GPT-4 Turbo</span>
                      <span
                        className="material-symbols-outlined text-[#00ffab]"
                        data-icon="check_circle"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </div>
                    <span className="text-xs text-on-surface-variant font-body">Primary reasoning engine</span>
                  </div>

                  <div className="flex flex-col items-start p-4 rounded-xl border border-[#48484b]/30 hover:bg-[#272a2c] transition-all">
                    <div className="flex justify-between w-full mb-2">
                      <span className="font-headline font-bold text-[#e0e3e5] opacity-60">Claude 3 Opus</span>
                      <span className="material-symbols-outlined text-[#909097] group-hover:text-[#00ffab]" data-icon="radio_button_unchecked">
                        radio_button_unchecked
                      </span>
                    </div>
                    <span className="text-xs text-on-surface-variant font-body opacity-60">Optimized for long recall</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                  Secure API Credentials
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-[#1f1f22] border border-[#48484b]/30 rounded-lg px-4 py-3 font-label text-sm text-[#e0e3e5] tracking-widest"
                    readOnly
                    type="password"
                    value="sk-proj-••••••••••••••••••••••••••••••••"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button type="button" className="p-1.5 text-[#c6c6cd] hover:text-[#00ffab] transition-colors">
                      <span className="material-symbols-outlined" data-icon="visibility">
                        visibility
                      </span>
                    </button>
                    <button type="button" className="p-1.5 text-[#c6c6cd] hover:text-[#00ffab] transition-colors">
                      <span className="material-symbols-outlined" data-icon="content_copy">
                        content_copy
                      </span>
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-[#767578] font-label uppercase tracking-widest">
                  Last updated: 14 days ago — Vault: NK_STUDIO_KB
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[#131315] rounded-xl p-8 border border-[#48484b]/10">
            {/* TODO: Replace placeholder token telemetry with real usage/cost data from the
                backend (e.g., per request + aggregated totals). */}
            <span className="font-label text-[10px] uppercase tracking-widest text-[#00ffab] mb-2 block">Token telemetry</span>
            <h3 className="text-xl font-headline font-bold text-[#e0e3e5] mb-8">API Resource Usage</h3>

            <div className="space-y-8">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs text-on-surface-variant uppercase font-semibold">Monthly Quota</span>
                  <span className="text-lg font-headline font-bold text-[#e0e3e5]">78.4%</span>
                </div>
                <div className="w-full bg-[#272a2c] h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-br from-[#adc6ff] to-[#357df1] h-full w-[78.4%]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1f1f22] p-4 rounded">
                  <p className="text-[10px] text-on-surface-variant uppercase mb-1">Total Tokens</p>
                  <p className="text-xl font-headline font-extrabold text-[#e0e3e5]">14.2M</p>
                </div>
                <div className="bg-[#1f1f22] p-4 rounded">
                  <p className="text-[10px] text-on-surface-variant uppercase mb-1">Cost Est.</p>
                  <p className="text-xl font-headline font-extrabold text-[#e0e3e5]">$412.08</p>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3 border border-[#48484b]/20 rounded text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:bg-[#272a2c] transition-colors"
              >
                Set Hard Limits
              </button>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

