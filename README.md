# Domain-Focused RAG Chatbot

A specialised chatbot project for Sprint 2 using Next.js, LangChain, advanced RAG, and tool calling.  
The goal is to provide context-aware, domain-specific answers with practical tool integrations.

**Live demo:** [https://rag-chatbot-nu-woad.vercel.app/](https://rag-chatbot-nu-woad.vercel.app/)

---

## For reviewers

### Task requirements

❗ - 1. **RAG Implementation**: Create a domain knowledge base and implement retrieval with embeddings.

🛠️ - **Plan**:

- Build ingestion/chunking pipeline in `src/lib/rag/`.
- Add vector retrieval and source metadata return in `src/app/api/chat/route.ts`.

❗ - 2. **Tool Calling**: Implement at least 3 domain-relevant tools.

🛠️ - **Plan**:

- Implement tools in `src/lib/tools/` with schema validation (`zod`).
- Expose results in chat responses and UI.

❗ - 3. **Domain Specialisation**: Focus on one clear use case.

🛠️ - **Plan**:

- Define domain prompt strategy and guardrails.
- Build domain-focused knowledge base in `data/`.

❗ - 4. **Technical Implementation**: Use LangChain with error handling, logging, validation, rate limiting, and API key management.

🛠️ - **Plan**:

- Keep LLM/retrieval logic server-side only.
- Add request validation and safe error responses.
- Add lightweight rate limiting and structured logs.

🛠️ - 5. **User Interface**: Build intuitive Next.js chat UI with context, sources, tool outputs, and progress indicators.

✅ - **Implementation**: Responsive Next.js chat UI frame with route-based views and an autosizing prompt composer (tool outputs/citations are mocked for now).

- Home `/` -> `/chat` routing in `src/app/page.tsx`, with chat/history/config routes rendered via `src/components/chatbot/ChatAppShell.tsx`.
- Chat body (messages/progress/citations) in `src/components/chatbot/views/ChatView.tsx`.
- Input/composer in `src/components/chatbot/ChatComposer.tsx` (includes autosize up to `50vh`).
- Tool-call outputs and citations are **currently mocked** in `ChatView.tsx` (with TODOs for replacement by real backend tool results).

<details>
  <summary>See source snippet from <code>src/components/chatbot/ChatComposer.tsx</code></summary>

```tsx
import { useRef } from "react";

const textareaRef = useRef<HTMLTextAreaElement | null>(null);

function autosize(el: HTMLTextAreaElement) {
  // Reset to allow shrinking when content is removed.
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

<textarea
  ref={textareaRef}
  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-2 resize-none text-[#e7e5e8] placeholder:text-[#767578] font-body max-h-[50vh] overflow-y-auto"
  placeholder="Ask a question..."
  rows={1}
  onChange={(e) => autosize(e.currentTarget)}
/>;
```

</details>

<details>
  <summary>See source snippet from <code>src/app/page.tsx</code></summary>

```ts
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/chat");
}
```

</details>

### Optional tasks

### Easy

❗ - Add conversation history and export functionality.

🛠️ - **Plan**:

- Persist session chat history locally.
- Add export options (JSON first, then CSV/PDF if time allows).

❗ - Include source citations in responses.

🛠️ - **Plan**:

- Render citations from retriever metadata.

### Medium

❗ - Implement multi-model support (OpenAI, Anthropic, etc.).

🛠️ - **Plan**:

- Add provider/model selector in UI and validate server-side.

❗ - Calculate and display token usage and costs.

🛠️ - **Plan**:

- Collect usage metadata from model responses.
- Show totals per message/session.

### Hard

❗ - Deploy to cloud with proper scaling.

🛠️ - **Plan**:

- Deploy on Vercel with env var management and production checks.

❗ - Implement evaluation of the RAG system.

🛠️ - **Plan**:

- Add small evaluation set and report retrieval/answer quality metrics.
