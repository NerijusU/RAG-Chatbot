# Domain-Focused RAG Chatbot

A specialised chatbot project for Sprint 2 using Next.js, LangChain, advanced RAG, and tool calling.  
The goal is to provide context-aware, domain-specific answers with practical tool integrations.

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

❗ - 5. **User Interface**: Build intuitive Next.js chat UI with context, sources, tool outputs, and progress indicators.

🛠️ - **Plan**:

- Chat interface in `src/app/page.tsx`.
- Show citations/tool results in dedicated UI blocks.
- Add loading/progress states for long operations.

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
