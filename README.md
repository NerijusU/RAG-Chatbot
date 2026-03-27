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
    - Created a domain knowledge base under `data/hair-salon/`
  - [x] Implement standard document retrieval with embeddings
    - Implemented secure ingestion (`POST /api/rag/ingest`) with chunking and OpenAI embeddings
  - [x] Use chunking strategies and similarity search
    - Implemented vector retrieval (`match_rag_chunks`) used by `POST /api/chat` with citations

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

- [ ] 2. **Tool Calling:**
  - [ ] Implement at least 3 different tool calls
    - _TODO:_ Implement tools in `src/lib/tools/` with schema validation (`zod`)
  - [ ] Functions should be relevant to your domain
    - _TODO:_ Define salon-relevant tools such as availability, booking, and pricing
  - [ ] Examples: data analysis, calculations, API integrations
    - _TODO:_ Add at least 3 implemented tool modules and connect them to chat responses

- [ ] 3. **Domain Specialisation:**
  - [x] Choose a specific domain or use case
    - Hair salon domain is defined and documented
  - [x] Create a focused knowledge base
    - Domain-focused knowledge base exists under `data/hair-salon/`
  - [ ] Implement domain-specific prompts and responses
    - _TODO:_ Prompt guardrails/safety can be strengthened further
  - [x] Add relevant security measures for your domain
    - Added ingest auth, path traversal protection, and input validation/rate limiting

- [ ] 4. **Technical Implementation:**
  - [ ] Use LangChain for OpenAI API integration
    - _TODO:_ Replace direct provider orchestration with LangChain workflow
  - [ ] Implement proper error handling
    - _In progress:_ Typed/safe API error responses are already implemented in routes
  - [ ] Add logging and monitoring
    - _TODO:_ Add structured, privacy-safe logs for retrieval/tool/model usage
  - [x] Include user input validation
    - Added Zod request validation in `POST /api/rag/ingest` and `POST /api/chat`
  - [x] Implement rate limiting and API key management
    - Added in-memory chat rate limiting and server-side env-based secrets (`.env.local`)

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

- [x] 5. **User Interface:**
  - [x] Create an intuitive interface using Streamlit or Next.js
    - Responsive Next.js chat UI frame with route-based views and an autosizing prompt composer (tool outputs/citations are mocked for now).
  - [x] Show relevant context and sources
    - _TODO:_
  - [x] Display tool call results
    - _TODO:_
  - [x] Include progress indicators for long operations
    - _TODO:_


## Optional tasks

### Easy

- [ ] 1. Add conversation history and export functionality
  - _TODO:_ Persist session chat history locally. Add export options (JSON first, then CSV/PDF if time allows)

- [ ] 3. Include source citations in responses
  - _TODO:_ Render citations from retriever metadata

### Medium

- [ ] 1. Implement multi-model support (OpenAI, Anthropic, etc.)
  - _TODO:_ Add provider/model selector in UI and validate server-side

- [ ] 5. Calculate and display token usage and costs
  - _TODO:_ Collect usage metadata from model responses. Show totals per message/session

### Hard

- [ ] 1. Deploy to cloud with proper scaling
  - _TODO:_ Deploy on Vercel with env var management and production checks

- [ ] 6. Add multi-language support
  - _TODO:_ Add language detection, localized prompts, and translated response templates for core salon flows
