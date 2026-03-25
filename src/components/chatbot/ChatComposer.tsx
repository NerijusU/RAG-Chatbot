"use client";

import { useRef } from "react";

export default function ChatComposer() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  /**
   * Autosizes the textarea to its content height (up to `max-h-[50vh]`).
   * @param el - Textarea element.
   */
  function autosize(el: HTMLTextAreaElement) {
    // Reset to allow shrinking when content is removed.
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  return (
    <div className="fixed bottom-14 left-0 right-0 md:bottom-0 md:left-64 p-4 bg-gradient-to-t from-[#0e0e0f] via-[#0e0e0f]/90 to-transparent pt-10">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-[#1f1f22] rounded-xl p-2 flex items-end gap-2 shadow-2xl ring-1 ring-[#48484b]/10 focus-within:ring-[#48484b]/20 transition-all">
          <button
            type="button"
            className="p-3 text-[#c6c6c7] hover:text-[#e7e5e8] transition-colors"
            aria-label="attach"
          >
            <span className="material-symbols-outlined" data-icon="attach_file">
              attach_file
            </span>
          </button>

          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-2 resize-none text-[#e7e5e8] placeholder:text-[#767578] font-body max-h-[50vh] overflow-y-auto"
            placeholder="Ask a question..."
            rows={1}
            onChange={(e) => autosize(e.currentTarget)}
          />

          <div className="flex items-center gap-2 p-1">
            <button
              type="button"
              className="p-3 text-[#c6c6c7] hover:text-[#e7e5e8] transition-colors"
              aria-label="mic"
            >
              <span className="material-symbols-outlined" data-icon="mic">
                mic
              </span>
            </button>
            <button
              type="button"
              className="bg-[#00ffab] text-[#0e0e0f] p-3 rounded-lg hover:opacity-90 transition-colors flex items-center justify-center active:scale-[0.98]"
              aria-label="send"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
                data-icon="send"
              >
                send
              </span>
            </button>
          </div>
        </div>

        {/* TODO: Replace placeholder UI strings and wire this composer to the real chat backend:
            - submit message to `src/app/api/chat/route.ts`
            - trigger RAG retrieval + tool calling
            - append the assistant response to the chat transcript */}
        <p className="text-center font-label text-[9px] text-[#767578] mt-3 uppercase tracking-[0.2em] opacity-70">
          Sentinel AI can make errors. Verify sensitive financial data before
          execution.
        </p>
      </div>
    </div>
  );
}
