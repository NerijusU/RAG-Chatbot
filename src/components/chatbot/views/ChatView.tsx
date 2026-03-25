"use client";

export default function ChatView() {
  return (
    <section className="flex-1 h-full">
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-10 space-y-12">
        {/* TODO: Replace this static "user message" with dynamic conversation state
            driven by the chat API (store messages and render the latest turn). */}
        <div className="max-w-3xl mx-auto flex flex-col items-end gap-2">
          <div className="bg-[#1f1f22] px-6 py-4 rounded-xl rounded-tr-none text-[#e0e3e5] max-w-[85%] shadow-[0_0_40px_-20px_rgba(173,198,255,0.06)]">
            <p className="text-sm leading-relaxed">
              Analyze the volatility of Tier 1 banking stocks relative to the S&amp;P 500 over the last 48 hours. Focus on liquidity shifts and SEC
              filings from JP Morgan and Goldman Sachs.
            </p>
          </div>
          <span className="text-[10px] font-label font-semibold text-[#c6c6cd] uppercase tracking-widest mr-1 mt-2">Advisor Identity • 09:42 AM</span>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {/* TODO: Replace this static "tool scanning" step with real progress/status
              coming from the backend tool-calling + RAG pipeline. */}
          <div className="flex items-center gap-4 bg-[#131315]/60 p-4 rounded-lg border border-[#48484b]/10">
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 border-2 border-[#4edea3]/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-[#4edea3] border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-label uppercase tracking-widest font-bold text-[#e0e3e5]">Scanning SEC Filings...</p>
              <p className="text-[10px] text-on-surface-variant">Cross-referencing 13F-HR disclosures for institutional shifts.</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* TODO: Replace this static assistant response with the dynamic response:
                - retrieved context (RAG)
                - tool-call results (at least 3 tools)
                - generated final answer
                - citations/source metadata */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#454747] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#adc6ff] text-sm" data-icon="token">
                  token
                </span>
              </div>

              <div className="space-y-6 flex-1">
                <h2 className="font-headline text-xl font-bold text-[#e0e3e5]">Volatility &amp; Liquidity Analysis: T1 Banks</h2>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Recent volatility in JP Morgan (JPM) and Goldman Sachs (GS) shows a divergent trend. While JPM remains anchored by strong retail inflows, GS is
                  exhibiting a <span className="text-[#4edea3] font-semibold">12% uptick</span> in derivatives-driven volatility over the trailing 48-hour window.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#1d2022] p-5 rounded-lg border border-[#48484b]/10">
                    <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-2">Beta Correlation</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-headline font-extrabold text-[#e0e3e5]">1.24</span>
                      <span className="text-[10px] font-bold flex items-center text-[#ee7d77]">
                        <span className="material-symbols-outlined text-xs" data-icon="trending_up">
                          trending_up
                        </span>
                        +0.05
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant mt-2">vs. S&amp;P 500 Composite</p>
                  </div>

                  <div className="bg-[#1d2022] p-5 rounded-lg border border-[#48484b]/10">
                    <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-2">Liquidity Delta</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-headline font-extrabold text-[#e0e3e5]">-$2.1B</span>
                      <span className="text-[10px] font-bold flex items-center text-[#4edea3]">
                        <span className="material-symbols-outlined text-xs" data-icon="trending_down">
                          trending_down
                        </span>
                        STABLE
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant mt-2">Institutional Outflow (48h)</p>
                  </div>
                </div>

                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Our architectural model suggests a consolidation phase before the next earnings cycle. The widening spread in CDS contracts indicates that fixed-income
                  desks are pricing in higher-for-longer risk premiums more aggressively than the equity market.
                </p>

                <div className="flex flex-wrap gap-2 pt-4">
                  <span className="text-[10px] font-label font-bold text-on-surface-variant mr-2 py-1">SOURCES:</span>
                  <div className="bg-[#00452b] px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-[#e0e3e5]" data-icon="description">
                      description
                    </span>
                    <span className="text-[10px] font-semibold">SEC-13F-JPM-Q3</span>
                  </div>
                  <div className="bg-[#00452b] px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-[#e0e3e5]" data-icon="bar_chart">
                      bar_chart
                    </span>
                    <span className="text-[10px] font-semibold">BLOOMBERG-TERM-2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-24" />
        </div>
      </div>
    </section>
  );
}

