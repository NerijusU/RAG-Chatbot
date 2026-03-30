"use client";

import { useEffect, useMemo, useRef } from "react";

import type { ChatMessage } from "@/types/chat";

type ChatViewProps = {
  messages: ChatMessage[];
  isLoading: boolean;
};

/**
 * Scrollable transcript: user bubbles, assistant replies (sources and tools before the answer), and loading state.
 * Scrolls so the latest turn stays in view.
 *
 * @param props - Conversation messages and loading flag for the latest turn.
 * @returns Chat transcript section.
 */
export default function ChatView({ messages, isLoading }: ChatViewProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  const lastMessageId = useMemo(
    () => (messages.length > 0 ? messages[messages.length - 1].id : null),
    [messages],
  );
  const sessionUsage = useMemo(() => {
    return messages.reduce(
      (acc, message) => {
        if (message.role !== "assistant" || !message.usage) {
          return acc;
        }

        return {
          inputTokens: acc.inputTokens + message.usage.inputTokens,
          outputTokens: acc.outputTokens + message.usage.outputTokens,
          totalTokens: acc.totalTokens + message.usage.totalTokens,
          estimatedCostUsd: acc.estimatedCostUsd + message.usage.estimatedCostUsd,
        };
      },
      { inputTokens: 0, outputTokens: 0, totalTokens: 0, estimatedCostUsd: 0 },
    );
  }, [messages]);

  /**
   * Keeps the transcript scrolled to the latest content (user message, loading row, or assistant reply).
   *
   * @returns Nothing.
   */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  return (
    <section className="w-full" aria-label="Chat conversation">
      <div className="overflow-y-auto overflow-x-hidden px-6 md:px-12 py-8 space-y-10 h-[calc(100dvh-13rem)] md:h-[calc(100dvh-11rem)] scroll-smooth">
        {messages.length === 0 ? (
          <div className="max-w-3xl mx-auto text-center space-y-3 pt-8">
            <p className="text-on-surface-variant text-sm">
              Ask about services, pricing, or availability. Answers use your ingested salon knowledge base plus optional
              booking tools.
            </p>
          </div>
        ) : null}
        {messages.length > 0 ? (
          <div className="max-w-3xl mx-auto rounded-xl border border-[#48484b]/25 bg-[#131315]/90 p-4 space-y-2">
            <p className="text-[10px] font-label uppercase tracking-widest text-[#c6c6cd] font-bold">
              Session usage
            </p>
            <p className="text-xs text-on-surface-variant">
              Input {sessionUsage.inputTokens.toLocaleString()} · Output{" "}
              {sessionUsage.outputTokens.toLocaleString()} · Total{" "}
              {sessionUsage.totalTokens.toLocaleString()}
            </p>
            <p className="text-xs text-on-surface-variant">
              Estimated cost ${sessionUsage.estimatedCostUsd.toFixed(6)}
            </p>
          </div>
        ) : null}

        {messages.map((msg) => {
          const isLatest = msg.id === lastMessageId;

          return (
            <div key={msg.id} className="max-w-3xl mx-auto space-y-4">
              {msg.role === "user" ? (
                <div className="flex flex-col items-end gap-2">
                  <div
                    className={`bg-[#1f1f22] px-6 py-4 rounded-xl rounded-tr-none text-[#e0e3e5] max-w-[85%] shadow-[0_12px_48px_-16px_rgba(0,0,0,0.55)] ring-1 ${
                      isLatest ? "ring-[#4edea3]/25" : "ring-white/[0.06]"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className="text-[10px] font-label font-semibold text-[#c6c6cd] uppercase tracking-widest mr-1">
                    You
                  </span>
                </div>
              ) : (
                <div
                  className={`rounded-2xl border border-[#48484b]/20 bg-[#131315]/90 p-4 md:p-5 shadow-[0_16px_56px_-20px_rgba(0,0,0,0.65)] ring-1 ${
                    isLatest ? "ring-[#4edea3]/20" : "ring-transparent"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#454747] flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element -- local static SVG */}
                      <img
                        src="/brand/nk-studio-logo.svg"
                        alt=""
                        width={22}
                        height={22}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="space-y-4 flex-1 min-w-0">
                      {msg.citations && msg.citations.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-[10px] font-label uppercase tracking-widest text-[#c6c6cd] font-bold">
                            Sources (retrieval)
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {msg.citations.map((c) => (
                              <div
                                key={`${msg.id}-${c.source}-${c.similarity}`}
                                className="bg-[#00452b]/90 px-3 py-1.5 rounded-full flex items-center gap-2 max-w-full ring-1 ring-white/5"
                                title={c.excerpt}
                              >
                                <span
                                  className="material-symbols-outlined text-[14px] text-[#e0e3e5]"
                                  data-icon="description"
                                >
                                  description
                                </span>
                                <span className="text-[10px] font-semibold truncate max-w-[200px]">{c.source}</span>
                                <span className="text-[9px] text-[#c6c6cd]">{(c.similarity * 100).toFixed(0)}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {msg.toolResults && msg.toolResults.length > 0 ? (
                        <div className="rounded-xl border border-[#48484b]/25 bg-[#0e0e0f]/80 p-4 space-y-2 shadow-inner">
                          <p className="text-[10px] font-label uppercase tracking-widest text-[#c6c6cd] font-bold">
                            Tool calls (metadata)
                          </p>
                          <ul className="space-y-2 text-xs text-on-surface-variant font-mono break-words">
                            {msg.toolResults.map((t, idx) => (
                              <li key={`${msg.id}-tool-${idx}`}>
                                <span className={t.ok ? "text-[#4edea3]" : "text-[#ee7d77]"}>{t.name}</span>
                                <pre className="mt-1 text-[11px] whitespace-pre-wrap opacity-90">{t.output}</pre>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      <div className="pt-1 border-t border-[#48484b]/15">
                        <p className="text-[10px] font-label uppercase tracking-widest text-[#8f9194] font-bold mb-2">
                          Reply
                        </p>
                        <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {msg.usage ? (
                        <div className="rounded-xl border border-[#48484b]/25 bg-[#0e0e0f]/80 p-3 space-y-1">
                          <p className="text-[10px] font-label uppercase tracking-widest text-[#c6c6cd] font-bold">
                            Token usage
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            Model: {msg.usage.modelId}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            Input {msg.usage.inputTokens.toLocaleString()} ·
                            Output {msg.usage.outputTokens.toLocaleString()} ·
                            Total {msg.usage.totalTokens.toLocaleString()}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            Estimated cost ${msg.usage.estimatedCostUsd.toFixed(6)}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isLoading ? (
          <div className="max-w-3xl mx-auto flex items-center gap-4 rounded-xl border border-[#48484b]/20 bg-[#131315]/90 p-4 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.04]">
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 border-2 border-[#4edea3]/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-[#4edea3] border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-label uppercase tracking-widest font-bold text-[#e0e3e5]">
                Retrieving &amp; thinking…
              </p>
              <p className="text-[10px] text-on-surface-variant">Searching the knowledge base and salon tools.</p>
            </div>
          </div>
        ) : null}

        <div ref={endRef} className="h-px w-full shrink-0" aria-hidden />
        <div className="h-16 shrink-0" />
      </div>
    </section>
  );
}
