"""
Rine Forge Systems V5 - Knowledge RAG API Router
Handles ingestion, chunking, vector embedding, and semantic search of business documents.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models.v5 import KnowledgeDocument, Business
from backend.app.auth.dependencies import get_current_tenant, require_role
from backend.app.knowledge.rag_service import knowledge_service

router = APIRouter(prefix="/knowledge", tags=["V5 Knowledge RAG"])

class DocumentIngestRequest(BaseModel):
    title: str
    content: str
    doc_type: str = "text"
    source: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class SearchRequest(BaseModel):
    query: str
    top_k: int = 3

@router.get("/documents")
async def list_documents(
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """Lists ingested knowledge documents for the authenticated business tenant."""
    stmt = select(KnowledgeDocument).where(KnowledgeDocument.business_id == tenant.id)
    res = await session.execute(stmt)
    docs = res.scalars().all()
    return [
        {
            "id": d.id,
            "title": d.title,
            "type": d.type,
            "source": d.source,
            "status": d.status,
            "created_at": d.created_at.isoformat() if d.created_at else None
        }
        for d in docs
    ]

@router.post("/documents", status_code=status.HTTP_201_CREATED)
async def ingest_document(
    payload: DocumentIngestRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant),
    _role = Depends(require_role(["BUSINESS_OWNER", "BUSINESS_ADMIN"]))
):
    """
    Ingests document, executes recursive text chunking, generates embeddings,
    and stores chunks in the tenant vector index.
    """
    doc = await knowledge_service.ingest_document(
        session=session,
        business_id=tenant.id,
        title=payload.title,
        content=payload.content,
        doc_type=payload.doc_type,
        source=payload.source,
        metadata=payload.metadata
    )
    return {
        "status": "success",
        "document_id": doc.id,
        "title": doc.title,
        "status_label": doc.status
    }

@router.delete("/documents/{document_id}")
async def delete_document(
    document_id: str,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant),
    _role = Depends(require_role(["BUSINESS_OWNER", "BUSINESS_ADMIN"]))
):
    """Removes a document and cascades deletion of its vector chunks."""
    stmt = select(KnowledgeDocument).where(KnowledgeDocument.id == document_id, KnowledgeDocument.business_id == tenant.id)
    res = await session.execute(stmt)
    doc = res.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found in tenant")

    await session.delete(doc)
    await session.commit()
    return {"status": "success", "message": f"Document {document_id} deleted"}

@router.post("/search")
async def search_knowledge_base(
    payload: SearchRequest,
    session: AsyncSession = Depends(get_db),
    tenant: Business = Depends(get_current_tenant)
):
    """
    Runs dense cosine vector similarity search strictly within the tenant's chunk index.
    """
    results = await knowledge_service.search(
        session=session,
        business_id=tenant.id,
        query=payload.query,
        top_k=payload.top_k
    )
    return {"query": payload.query, "results": results}
