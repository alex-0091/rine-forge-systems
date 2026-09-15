import math
import logging
from typing import List, Dict, Any, Optional
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from backend.app.models.v5 import KnowledgeDocument, KnowledgeChunk
from backend.app.ai.provider_abstraction import ai_provider

logger = logging.getLogger("rine_forge_systems.knowledge.rag")

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Computes cosine similarity between two float vectors."""
    if not vec1 or not vec2:
        return 0.0
    min_len = min(len(vec1), len(vec2))
    dot_product = sum(vec1[i] * vec2[i] for i in range(min_len))
    norm1 = math.sqrt(sum(x * x for x in vec1[:min_len]))
    norm2 = math.sqrt(sum(x * x for x in vec2[:min_len]))
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return dot_product / (norm1 * norm2)

class KnowledgeService:
    """
    Retrieval-Augmented Generation (RAG) engine.
    Ingests documents, chunks text, generates dense vector embeddings,
    and performs semantic similarity search strictly scoped to the tenant business_id.
    """

    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 80) -> List[str]:
        """Splits raw document text into overlapping character chunks."""
        cleaned = text.strip()
        if not cleaned:
            return []
        if len(cleaned) <= chunk_size:
            return [cleaned]

        chunks = []
        start = 0
        while start < len(cleaned):
            end = start + chunk_size
            chunk = cleaned[start:end].strip()
            if chunk:
                chunks.append(chunk)
            start += chunk_size - overlap
        return chunks

    async def ingest(
        self,
        session: AsyncSession,
        business_id: str,
        title: str,
        content: str,
        type: str = "text",
        metadata: Optional[Dict[str, Any]] = None
    ) -> KnowledgeDocument:
        """
        Ingests a document, generates chunk embeddings, and saves to database.
        """
        doc = KnowledgeDocument(
            business_id=business_id,
            title=title.strip(),
            type=type,
            content=content,
            metadata_json=metadata or {},
            status="PROCESSING"
        )
        session.add(doc)
        await session.flush()

        # Chunk document
        raw_chunks = self.chunk_text(content)
        for idx, chunk_str in enumerate(raw_chunks):
            embedding_vec = await ai_provider.generate_embedding(chunk_str)
            chunk_record = KnowledgeChunk(
                document_id=doc.id,
                business_id=business_id,
                content=chunk_str,
                embedding=embedding_vec,
                metadata_json={"chunk_index": idx, "title": title}
            )
            session.add(chunk_record)

        doc.status = "INDEXED"
        await session.commit()
        await session.refresh(doc)
        logger.info(f"Ingested document '{title}' ({len(raw_chunks)} chunks) for business #{business_id}")
        return doc

    async def ingest_document(
        self,
        session: AsyncSession,
        business_id: str,
        title: str,
        content: str,
        doc_type: str = "text",
        source: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> KnowledgeDocument:
        meta = metadata or {}
        if source:
            meta["source"] = source
        return await self.ingest(
            session=session,
            business_id=business_id,
            title=title,
            content=content,
            type=doc_type,
            metadata=meta
        )

    async def search(
        self,
        session: AsyncSession,
        business_id: str,
        query: str,
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Performs semantic similarity search over business knowledge chunks.
        Strictly isolated by business_id.
        """
        query_vec = await ai_provider.generate_embedding(query)

        # Load chunks for this business
        stmt = select(KnowledgeChunk).where(KnowledgeChunk.business_id == business_id)
        res = await session.execute(stmt)
        chunks = res.scalars().all()

        scored_chunks = []
        for c in chunks:
            sim = cosine_similarity(query_vec, c.embedding)
            scored_chunks.append({
                "chunk_id": c.id,
                "document_id": c.document_id,
                "content": c.content,
                "similarity": round(sim, 4),
                "metadata": c.metadata_json
            })

        # Sort by similarity score descending
        scored_chunks.sort(key=lambda x: x["similarity"], reverse=True)
        return scored_chunks[:top_k]

    async def delete_document(
        self,
        session: AsyncSession,
        business_id: str,
        document_id: str
    ) -> bool:
        """Deletes a knowledge document and its associated chunks."""
        stmt = select(KnowledgeDocument).where(
            KnowledgeDocument.id == document_id,
            KnowledgeDocument.business_id == business_id
        )
        res = await session.execute(stmt)
        doc = res.scalar_one_or_none()
        if not doc:
            raise HTTPException(status_code=404, detail=f"Knowledge document #{document_id} not found")

        await session.delete(doc)
        await session.commit()
        return True

knowledge_service = KnowledgeService()
