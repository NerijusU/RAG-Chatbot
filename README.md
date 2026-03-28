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

### Chosen domain / use case (hair salon — NK Studio)

The assistant covers service and pricing questions, booking guidance (online booking not live — contact studio), stylist info (Natallia Khatsei), and care / FAQ topics from ingested markdown under `data/hair-salon/`.

**Implemented tool calling (domain-relevant):**

- `check_stylist_availability` — `src/lib/tools/checkStylistAvailability.ts`
- `get_service_price` — `src/lib/tools/getServicePrice.ts` (reads `data/hair-salon/pricing/pricing.md`)
- `suggest_appointment_slots` — `src/lib/tools/suggestAppointmentSlots.ts` (policy/hours from `booking-policy.md`)

**Knowledge sources (RAG):**

- `data/hair-salon/services/services.md`
- `data/hair-salon/pricing/pricing.md`
- `data/hair-salon/faq/faq.md`
- `data/hair-salon/care/hair-care.md`
- `data/hair-salon/hair-types/hair-types.md`
- `data/hair-salon/policies/booking-policy.md`
- Plus `about/` docs (stylist profile, booking links), etc.

### Deployment model (single salon per deployment)

- One salon per deployed instance; one Supabase project per salon.
- Ingestion reads markdown from `data/`; convert PDF/Word/web to markdown before ingest.
- **Vercel:** set `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `INGEST_API_KEY` (for ingest route). `.env.local` is not deployed.

### Scope / current status (summary)

- Implemented: UI (`/`, `/chat`, `/history`, `/config`), wired chat to `/api/chat`, citations and tool blocks in transcript.
- Implemented: Supabase health (`GET /api/health/supabase`), RAG ingest (`POST /api/rag/ingest`), `pnpm ingest:local`.
- Implemented: LangChain pipeline, query rewrite, three Zod tools, basic telemetry logs, OpenAI timeouts.
- Not implemented / stretch: multi-turn memory, moderation API, automated tests, token/cost UI, conversation export.

## Task requirements

### Core requirements

- ✅ 1. **RAG Implementation:**
  - ✅ Create a knowledge base relevant to your domain
    - Created a domain knowledge base under `data/hair-salon/`
  - ✅ Implement standard document retrieval with embeddings
    - Implemented secure ingestion (`POST /api/rag/ingest`) with chunking and OpenAI embeddings
  - ✅ Use chunking strategies and similarity search
    - Vector retrieval via `match_rag_chunks` in `retrieveRelevantChunks`; query rewrite in `runSalonPipeline` (`src/lib/rag/queryRewrite.ts`); citations in API and `ChatView`

    <details>
      <summary>See source snippet from <code>src/lib/rag/retrieval.ts</code></summary>

    ```ts
    const queryEmbedding = await embedQueryText(query, options.embeddingModel);
    const { data, error } = await supabase.rpc("match_rag_chunks", {
      query_embedding: queryEmbedding,
      match_count: options.matchCount,
    });
    ```

    </details>

- ✅ 2. **Tool Calling:**
  - ✅ Implement at least 3 different tool calls
    - `checkStylistAvailability`, `getServicePrice`, `suggestAppointmentSlots` in `src/lib/tools/`; orchestration in `salonToolRound.ts`
  - ✅ Functions should be relevant to your domain
    - Availability, pricing (reads `pricing.md`), suggested slots (reads `booking-policy.md`)
  - ✅ Schema validation and UI integration
    - Zod schemas per tool; tool results in `POST /api/chat` response and dedicated section in `ChatView`

- ✅ 3. **Domain Specialisation:**
  - ✅ Choose a specific domain or use case
    - Hair salon domain is defined and documented
  - ✅ Create a focused knowledge base
    - Domain-focused knowledge base exists under `data/hair-salon/`
  - ✅ Implement domain-specific prompts and responses
    - `src/lib/llm/chat.ts` — `buildGroundedInstructions`, grounded XML blocks (`<retrieved_context>`, `<tool_results>`, `<user_message>`), basic injection guardrails
  - ✅ Add relevant security measures for your domain
    - Ingest auth, path traversal protection, input validation, chat rate limiting

- ✅ 4. **Technical Implementation:**
  - ✅ Use LangChain for OpenAI API integration
    - `RunnableSequence` in `src/lib/llm/salonPipeline.ts`; `createSalonChatModel`; tool round with LangChain messages
  - ✅ Implement proper error handling
    - Typed/safe JSON error responses from API routes
  - ✅ Add logging and monitoring
    - Privacy-safe JSON telemetry in `src/lib/logging/chatTelemetry.ts` (latency, counts; no full user message content)
  - ✅ Include user input validation
    - Zod on `POST /api/rag/ingest` and `POST /api/chat`
  - ✅ Implement rate limiting and API key management
    - In-memory chat rate limiting; server secrets via `.env.local` (local) and Vercel env (production)
  - ✅ OpenAI client resilience
    - Timeout and limited retries in `src/lib/llm/openaiClient.ts` / `modelConfig.ts`

    <details>
      <summary>See source snippet from <code>src/app/api/chat/route.ts</code></summary>

    ```ts
    const requestSchema = z.object({
      message: z.string().trim().min(1).max(2000),
      topK: z.number().int().min(1).max(8).default(4),
    });

    const RATE_LIMIT_WINDOW_MS = 60_000;
    const RATE_LIMIT_MAX_REQUESTS = 20;
    ```

    </details>

- ✅ 5. **User Interface:**
  - ✅ Create an intuitive interface using Streamlit or Next.js
    - Responsive Next.js chat UI: routes, shell, `ChatComposer`, `ChatView`
  - ✅ Show relevant context and sources
    - Citations from retriever metadata in `ChatView`
  - ✅ Display tool call results
    - Tool block (before assistant reply) in `ChatView`
  - ✅ Include progress indicators for long operations
    - Loading state while `/api/chat` request is in flight

## Optional tasks

### Easy

- [ ] 1. Add conversation history and export functionality
  - _TODO:_ Persist session chat history locally. Add export options (JSON first, then CSV/PDF if time allows)

- ✅ 3. Include source citations in responses
  - Implemented: citations from API rendered in `ChatView` (sources / similarity)

### Medium

- [ ] 1. Implement multi-model support (OpenAI, Anthropic, etc.)
  - _TODO:_ Add provider/model selector in UI and validate server-side

- [ ] 5. Calculate and display token usage and costs
  - _TODO:_ Collect usage metadata from model responses. Show totals per message/session

### Hard

- ✅ 1. Deploy to cloud with proper scaling
  - Deployed on Vercel with env var configuration; deeper scaling/hardening still optional

- [ ] 6. Add multi-language support
  - _TODO:_ Add language detection, localized prompts, and translated response templates for core salon flows
