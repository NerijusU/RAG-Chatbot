"use client";

import { useRef, type KeyboardEvent, type SubmitEvent } from "react";

type ChatComposerProps = {
  /** Called with trimmed user text when they send a message. */
  onSend?: (text: string) => void | Promise<void>;
  /** Disables input and send while a request is in flight. */
  disabled?: boolean;
  /** Optional API or validation error shown under the field. */
  error?: string | null;
};

/**
 * Bottom-fixed composer with autosizing textarea; submits to `onSend` when wired.
 *
 * @param props - Optional send handler, disabled state, and error text.
 * @returns Composer UI for the chat page.
 */
export default function ChatComposer({ onSend, disabled, error }: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  /**
   * Autosizes the textarea to its content height (up to `max-h-[50vh]`).
   *
   * @param el - Textarea element.
   * @returns Nothing.
   */
  function autosize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  /**
   * Submits non-empty trimmed text: clears the textarea immediately, then calls `onSend` (may be async).
   * Clearing before the network round-trip avoids showing the same text in the transcript and in a disabled field.
   *
   * @param e - Submit event from the composer form.
   * @returns Nothing.
   */
  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!onSend || disabled) {
      return;
    }

    const raw = textareaRef.current?.value ?? "";
    const trimmed = raw.trim();
    if (!trimmed) {
      return;
    }

    const el = textareaRef.current;
    if (el) {
      el.value = "";
      autosize(el);
    }

    void Promise.resolve(onSend(trimmed));
  }

  /**
   * Sends on Enter; Shift+Enter inserts a newline.
   *
   * @param e - Native keyboard event from the textarea.
   * @returns Nothing.
   */
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.shiftKey) {
      return;
    }

    e.preventDefault();
    if (!onSend || disabled) {
      return;
    }

    const form = e.currentTarget.form;
    form?.requestSubmit();
  }

  return (
    <div className="fixed bottom-14 left-0 right-0 md:bottom-0 md:left-64 p-4 bg-gradient-to-t from-[#0e0e0f] via-[#0e0e0f]/90 to-transparent pt-10">
      <div className="max-w-4xl mx-auto">
        <form
          className="relative bg-[#1f1f22] rounded-xl p-2 flex items-end gap-2 shadow-2xl ring-1 ring-[#48484b]/10 focus-within:ring-[#48484b]/20 transition-all"
          onSubmit={handleSubmit}
        >
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
            name="message"
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-2 resize-none text-[#e7e5e8] placeholder:text-[#767578] font-body max-h-[50vh] overflow-y-auto disabled:opacity-50"
            placeholder="Ask about services, pricing, or booking…"
            rows={1}
            disabled={disabled}
            onChange={(e) => autosize(e.currentTarget)}
            onKeyDown={handleKeyDown}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "chat-composer-error" : undefined}
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
              type="submit"
              className="bg-[#00ffab] text-[#0e0e0f] p-3 rounded-lg hover:opacity-90 transition-colors flex items-center justify-center active:scale-[0.98] disabled:opacity-50"
              aria-label="send"
              disabled={disabled}
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
        </form>

        {error ? (
          <p id="chat-composer-error" className="text-center text-xs text-[#ee7d77] mt-2" role="alert">
            {error}
          </p>
        ) : null}

        <p className="text-center font-label text-[9px] text-[#767578] mt-3 uppercase tracking-[0.2em] opacity-70">
          Salon assistant uses AI and your knowledge base — confirm bookings and prices at the desk.
        </p>
      </div>
    </div>
  );
}
