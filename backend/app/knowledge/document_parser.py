"""
Rine Forge Systems - Multi-Format Document Ingestion Parser
Extracts clean, normalized text and metadata from TXT, MD, CSV, JSON, DOCX, and PDF.
Operates natively with Python standard library (zipfile, xml, csv) with optional pypdf fallback.
"""
import os
import io
import csv
import json
import logging
import zipfile
import xml.etree.ElementTree as ET
from typing import Dict, Any, Tuple, Optional

logger = logging.getLogger("rine_forge_systems.knowledge.parser")

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB limit

class DocumentParsingError(Exception):
    """Raised when document extraction fails due to corruption or unsupported format."""
    pass

class DocumentParser:
    """
    Production document parser for enterprise knowledge ingestion.
    Extracts text, calculates metrics, and tags structure.
    """

    @classmethod
    def validate_file(cls, filename: str, content_bytes: bytes) -> Tuple[str, int]:
        """Validates file extension and size constraints."""
        if len(content_bytes) > MAX_FILE_SIZE_BYTES:
            raise DocumentParsingError(
                f"File '{filename}' exceeds maximum allowed size of 10 MB ({len(content_bytes)} bytes)."
            )
        ext = os.path.splitext(filename)[1].lower().lstrip(".")
        if not ext:
            ext = "txt"
        supported = ["txt", "md", "csv", "json", "docx", "pdf"]
        if ext not in supported:
            raise DocumentParsingError(
                f"Unsupported file type '.{ext}'. Supported types: {', '.join(supported)}"
            )
        return ext, len(content_bytes)

    @classmethod
    def parse_txt(cls, content_bytes: bytes) -> str:
        """Parses plain text and markdown with UTF-8 / latin-1 fallback."""
        try:
            return content_bytes.decode("utf-8")
        except UnicodeDecodeError:
            return content_bytes.decode("latin-1", errors="replace")

    @classmethod
    def parse_csv(cls, content_bytes: bytes) -> str:
        """Parses CSV into human-readable row summaries suitable for LLM RAG indexing."""
        text_data = cls.parse_txt(content_bytes)
        reader = csv.reader(io.StringIO(text_data))
        lines = []
        headers = None
        for row in reader:
            if not row or all(not cell.strip() for cell in row):
                continue
            if headers is None:
                headers = [h.strip() for h in row]
                lines.append(f"Headers: {', '.join(headers)}")
            else:
                row_str = " | ".join(f"{h}: {val.strip()}" for h, val in zip(headers, row) if val.strip())
                lines.append(row_str)
        return "\n".join(lines)

    @classmethod
    def parse_json(cls, content_bytes: bytes) -> str:
        """Parses JSON structures into indented formatted text."""
        text_data = cls.parse_txt(content_bytes)
        parsed = json.loads(text_data)
        return json.dumps(parsed, indent=2)

    @classmethod
    def parse_docx(cls, content_bytes: bytes) -> str:
        """Parses DOCX files using zipfile and XML extraction without heavy dependencies."""
        try:
            with zipfile.ZipFile(io.BytesIO(content_bytes)) as docx_zip:
                xml_content = docx_zip.read("word/document.xml")
                root = ET.fromstring(xml_content)
                # WordprocessingML namespace
                namespaces = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
                paragraphs = []
                for p in root.findall(".//w:p", namespaces):
                    texts = [node.text for node in p.findall(".//w:t", namespaces) if node.text]
                    if texts:
                        paragraphs.append("".join(texts))
                return "\n\n".join(paragraphs)
        except Exception as e:
            raise DocumentParsingError(f"Failed to parse DOCX document: {e}")

    @classmethod
    def parse_pdf(cls, content_bytes: bytes) -> str:
        """
        Parses PDF documents using pypdf if available, or regex stream extraction as robust fallback.
        """
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(content_bytes))
            pages = []
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text:
                    pages.append(text)
            return "\n\n".join(pages)
        except ImportError:
            # Fallback: Extract text from uncompressed PDF streams
            import re
            text_chunks = []
            # Find stream objects
            stream_matches = re.findall(b"stream[\r\n]+(.*?)[\r\n]+endstream", content_bytes, re.DOTALL)
            for s in stream_matches:
                # Look for TJ / Tj text operators
                tj_matches = re.findall(rb"\((.*?)\)\s*Tj", s)
                if tj_matches:
                    chunk = "".join(m.decode("latin-1", errors="ignore") for m in tj_matches)
                    if chunk.strip():
                        text_chunks.append(chunk)
            if text_chunks:
                return "\n".join(text_chunks)
            # If no plain text extracted, return decoded ASCII content
            clean_str = re.sub(r"[^\x20-\x7E\n\r\t]", " ", content_bytes.decode("latin-1", errors="ignore"))
            return " ".join(clean_str.split()[:5000])

    @classmethod
    def extract_text_and_metadata(
        cls,
        filename: str,
        content_bytes: bytes
    ) -> Tuple[str, Dict[str, Any]]:
        """
        Master extraction entrypoint. Validates, parses, and produces normalized text and metadata.
        """
        ext, size = cls.validate_file(filename, content_bytes)
        
        if ext in ["txt", "md"]:
            raw_text = cls.parse_txt(content_bytes)
        elif ext == "csv":
            raw_text = cls.parse_csv(content_bytes)
        elif ext == "json":
            raw_text = cls.parse_json(content_bytes)
        elif ext == "docx":
            raw_text = cls.parse_docx(content_bytes)
        elif ext == "pdf":
            raw_text = cls.parse_pdf(content_bytes)
        else:
            raw_text = cls.parse_txt(content_bytes)

        clean_text = raw_text.strip()
        word_count = len(clean_text.split())
        char_count = len(clean_text)

        metadata = {
            "filename": filename,
            "format": ext,
            "size_bytes": size,
            "word_count": word_count,
            "char_count": char_count,
        }

        return clean_text, metadata

document_parser = DocumentParser()
