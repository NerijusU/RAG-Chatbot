# Hair Salon Knowledge Base

This folder contains local knowledge-base documents for the hair salon chatbot.

The content is organized into:

- `services/`: what services are available and what they include
- `pricing/`: service pricing tables (normalized for RAG)
- `faq/`: common questions and short answers
- `care/`: hair care guidance
- `hair-types/`: hair-type specific recommendations
- `about/`: studio/stylist identity and external links

When building RAG ingestion, prefer chunking these focused documents rather than mixing identity/contact details into pricing chunks.
