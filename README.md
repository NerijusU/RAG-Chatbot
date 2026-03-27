# Domain-Focused RAG Chatbot

A specialised chatbot project for Sprint 2 using Next.js, LangChain, advanced RAG, and tool calling.  
The goal is to provide context-aware, domain-specific answers with practical tool integrations.

**Live demo:** [https://rag-chatbot-nu-woad.vercel.app/](https://rag-chatbot-nu-woad.vercel.app/)

---

## For reviewers

### Chosen Domain / Use Case (Hair Salon - chatbot)

This project's domain is a hair salon assistant that helps users with:

- Service questions (what's included, typical duration, what to expect)
- Pricing questions (prices and how final price can depend on hair length/density)
- Appointment planning (checking availability and booking an appointment)
- Hairstyle recommendations (based on hair type and desired outcome)
- Aftercare / hair care guidance and basic DUK (common "how long / how to prepare" questions)

**Intended tool calling (domain-relevant, planned for the next implementation step):**

- `check_availability`: returns available time slots for a requested service window
- `calculate_price`: calculates price breakdown based on chosen services and hair parameters
- `book_appointment`: confirms a reservation for a chosen time slot
- `get_hairstyle_recommendations` (optional): recommends hairstyles using hair-type guidance from the knowledge base

**Knowledge sources used for RAG (current placeholders / content in `data/`):**

- `data/hair-salon/services/services.md`
- `data/hair-salon/pricing/pricing.md`
- `data/hair-salon/faq/faq.md`
- `data/hair-salon/care/hair-care.md`
- `data/hair-salon/hair-types/hair-types.md`
- `data/hair-salon/policies/booking-policy.md`

### Deployment model (single salon per deployment)

- This project is currently designed for one salon per deployed instance.
- Each salon should use its own Supabase project for clean data isolation.
- The current ingestion flow reads markdown files from the app-local `data/` directory.
- Multi-tenant shared deployment can be added later if needed.

### Knowledge source formats (operator workflow)

Salon knowledge may come as PDFs, Word documents, website pages, or URLs.
For this Sprint implementation, ingestion accepts markdown files under `data/hair-salon/**`.
Operationally, convert external source formats into clean markdown first, then run ingestion.

**Scope / current status:**

- Implemented: UI frame + route wiring (`/`, `/chat`, `/history`, `/config`).
- Implemented: Supabase connectivity and health check endpoint (`GET /api/health/supabase`).
- Implemented: RAG ingestion endpoint (`POST /api/rag/ingest`) with validation, auth, and safe path handling.
- Implemented: Retrieval-augmented chat endpoint (`POST /api/chat`) with rate limiting and citation payloads.
- Implemented: local ingestion helper script (`pnpm ingest:local`) for manual operator workflow.
- Pending: LangChain-based orchestration, query rewriting, and domain tool-calling integration in UI/backend.

## Task requirements

### Core requirements

- [x] 1. **RAG Implementation:**
  - [x] Create a knowledge base relevant to your domain
    - Created a domain knowledge base under `data/hair-salon/`.
  - [x] Implement standard document retrieval with embeddings
    - Implemented secure ingestion (`POST /api/rag/ingest`) with chunking and OpenAI embeddings.
  - [x] Use chunking strategies and similarity search
    - Implemented vector retrieval (`match_rag_chunks`) used by `POST /api/chat` with citations.

- ❗2. **Tool Calling:**
  - Implement at least 3 different tool calls
- Functions should be relevant to your domain
- Examples: data analysis, calculations, API integrations

  <details>
    <summary>🛠️ - **Implementation**: </summary>

  ```
  🛠️ Plan:
  - Implement tools in `src/lib/tools/` with schema validation (`zod`).
  - Expose results in chat responses and UI.
  ```

  </details>

🟡 - 3. **Domain Specialisation:**

- Choose a specific domain or use case
- Create a focused knowledge base
- Implement domain-specific prompts and responses
- Add relevant security measures for your domain

  <details>
    <summary>🛠️ - **Implementation**: </summary>

  ```
  ✅ - Hair salon domain is defined and documented.
  ✅- Domain-focused knowledge base exists under `data/hair-salon/`.
  🛠️ - Prompt guardrails/safety can be strengthened further.
  ```

  </details>

🟡 - 4. **Technical Implementation:**

- Use LangChain for OpenAI API integration
- Implement proper error handling
- Add logging and monitoring
- Include user input validation
- Implement rate limiting and API key management

  <details>
    <summary>🛠️ - **Implementation**: </summary>

  ```
  - Implemented: validation, safe errors, rate limiting, env-based key management.
  - Pending: LangChain orchestration and deeper structured observability.
  ```

  </details>

✅ - 5. **User Interface:**

- Create an intuitive interface using Streamlit or Next.js
- Show relevant context and sources
- Display tool call results
- Include progress indicators for long operations

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

## Optional tasks

### Easy

❗ - 1. Add conversation history and export functionality.

🛠️ - **Plan**:

- Persist session chat history locally.
- Add export options (JSON first, then CSV/PDF if time allows).

❗ - 3. Include source citations in responses.

🛠️ - **Plan**:

- Render citations from retriever metadata.

### Medium

❗ - 1. Implement multi-model support (OpenAI, Anthropic, etc.).

🛠️ - **Plan**:

- Add provider/model selector in UI and validate server-side.

❗ - 5. Calculate and display token usage and costs.

🛠️ - **Plan**:

- Collect usage metadata from model responses.
- Show totals per message/session.

### Hard

❗ - 1. Deploy to cloud with proper scaling.

🛠️ - **Plan**:

- Deploy on Vercel with env var management and production checks.

❗ - 9. Implement evaluation of the RAG system.

🛠️ - **Plan**:

- Add small evaluation set and report retrieval/answer quality metrics.
