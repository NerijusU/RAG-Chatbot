"use client";

import { useCallback, useState } from "react";

import ChatAppShell from "@/components/chatbot/ChatAppShell";
import ChatComposer from "@/components/chatbot/ChatComposer";
import ChatView from "@/components/chatbot/views/ChatView";
import type { ChatApiError, ChatApiSuccess, ChatMessage } from "@/types/chat";

/**
 * Client chat page: manages transcript state, calls `/api/chat`, and passes data to the shell and views.
 *
 * @param none - This component does not accept props.
 * @returns Full chat layout with wired composer and transcript.
 */
export default function ChatPageClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    setError(null);
    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, topK: 4 }),
      });

      const data = (await response.json()) as ChatApiSuccess | ChatApiError;

      if (!response.ok || !data.ok) {
        const msg = !data.ok ? data.error : "Request failed.";
        setError(msg);
        return;
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
        citations: data.citations,
        toolResults: data.toolResults,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ChatAppShell
      activeView="chat"
      composer={<ChatComposer onSend={sendMessage} disabled={isLoading} error={error} />}
    >
      <ChatView messages={messages} isLoading={isLoading} />
    </ChatAppShell>
  );
}
