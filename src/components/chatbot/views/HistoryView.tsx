"use client";

export default function HistoryView() {
  return (
    <section className="px-6 md:px-12 pt-10">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="space-y-2">
          <span className="font-label text-xs text-[#00ffab] tracking-[0.2em] uppercase opacity-90">
            History
          </span>
          <h2 className="font-headline text-4xl font-extrabold text-[#e0e3e5] tracking-tight">
            Conversation Ledger
          </h2>
          <p className="font-body text-on-surface-variant max-w-2xl leading-relaxed">
            Browse previous salon chat sessions. Placeholder UI until history is connected to the backend.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* TODO: Replace this hardcoded session list with real history fetched from the backend
              (e.g., per-user sessions + message summaries + token usage). */}
          {[
            {
              title: "Balayage pricing & timing",
              model: "RAG + salon tools",
              status: "Active",
            },
            {
              title: "Booking options & studio hours",
              model: "RAG + salon tools",
              status: "Archived",
            },
            {
              title: "Men’s cut — Natallia availability",
              model: "RAG + salon tools",
              status: "Archived",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="bg-[#1d2022] rounded-xl p-6 border border-[#48484b]/10 hover:bg-[#272a2c] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="material-symbols-outlined text-[#00ffab]"
                      data-icon="monitoring"
                    >
                      monitoring
                    </span>
                    <span className="bg-[#00ffab]/10 text-[#00ffab] text-[10px] font-label font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {s.status}
                    </span>
                  </div>
                  <h3 className="font-body font-semibold text-[#e0e3e5] text-lg">
                    {s.title}
                  </h3>
                </div>
                <span className="material-symbols-outlined text-[#c6c6cd]">
                  more_vert
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="hidden sm:block">
                  <span className="block font-label text-xs text-outline uppercase">
                    TOKENS USED
                  </span>
                  <span className="font-body text-sm font-medium">12.4k</span>
                </div>
                <div className="text-right sm:hidden">
                  <span className="font-label text-xs text-outline uppercase block">
                    TOKENS
                  </span>
                  <span className="font-body text-sm font-medium">12.4k</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center opacity-40">
          <div className="text-center">
            {/* TODO: Replace with empty-state based on real history availability (instead of static text). */}
            <p className="font-label text-xs uppercase tracking-widest mb-2">
              End of active ledger
            </p>
            <div className="h-px w-24 bg-[#48484b] mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
