# Grounded Knowledge Base & RAG Architecture

> **Path**: `/docs/RAG.md`  
> **Version**: Rine Forge Systems V5  
> **Component**: `backend/app/knowledge/`

---

## 1. Overview

Rine Forge Systems implements a strictly grounded Retrieval-Augmented Generation (RAG) architecture. The engine guarantees that AI Employees (e.g. Elena, Marcus) only provide verified factual responses sourced directly from tenant-specific knowledge chunks.

---

## 2. Document Ingestion Pipeline

The ingestion pipeline handles multi-format file processing via `backend/app/knowledge/document_parser.py`:
- **Supported Formats**: `.txt`, `.md`, `.csv`, `.json`, `.docx`, `.pdf`
- **Security Validations**:
  - Maximum upload size capped at 10 MB.
  - Path traversal and malicious extension filtering.
  - Pure Python DOCX/XML and PDF parsing without insecure binary executors.

```
Document Upload (PDF, DOCX, CSV, TXT)
  ↓
DocumentParser (MIME & Size Check, Text Extraction)
  ↓
KnowledgeService.chunk_text (Recursive window: 500 chars, 80 char overlap)
  ↓
AI Provider Embeddings (text-embedding-3-small or Gemini Embeddings)
  ↓
PostgreSQL pgvector / Float Vector Array (Indexed by business_id)
```

---

## 3. Anti-Hallucination & Grounded Retrieval

### Cosine Similarity Thresholds
- High confidence threshold: `similarity >= 0.70`
- Minimum acceptable threshold: `similarity >= 0.35`
- Low/Uncertain threshold: `similarity < 0.35`

### Invariant Response Rule
When zero retrieved chunks exceed the confidence threshold, the AI agent is strictly constrained by prompt boundary rules:
> *"I don't have verified information about that in the practice knowledge base. Let me connect you with our front desk staff to confirm those details."*

The model is explicitly forbidden from speculating on pricing, doctor credentials, or clinical hours.
