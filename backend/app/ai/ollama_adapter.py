"""
Rine Forge Systems V5 - Production Ollama Connection Layer (Phase AS)
Authoritative adapter for Ollama runtime (http://localhost:11434).
Supports model lifecycle (health, list, get, pull, delete), inference (generate, chat, stream_chat),
embeddings, tool-augmented requests, retry with exponential backoff, request correlation,
and strict privacy-preserving structured logging.
"""
import time
import json
import logging
import asyncio
from typing import Dict, Any, List, Optional, AsyncIterator
import httpx

from backend.app.config import settings
from backend.app.logging.context import get_request_id

logger = logging.getLogger("rine_forge.ai.ollama_adapter")


class OllamaAdapterError(Exception):
    """Base exception for Ollama adapter operations."""
    def __init__(self, message: str, status_code: int = 500, error_category: str = "OLLAMA_ERROR", raw_error: Optional[str] = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_category = error_category
        self.raw_error = raw_error


class OllamaOfflineError(OllamaAdapterError):
    def __init__(self, message: str = "Ollama daemon is offline or unreachable"):
        super().__init__(message, status_code=503, error_category="OLLAMA_OFFLINE")


class OllamaTimeoutError(OllamaAdapterError):
    def __init__(self, timeout_seconds: float):
        super().__init__(f"Ollama request timed out after {timeout_seconds}s", status_code=504, error_category="OLLAMA_TIMEOUT")


class OllamaModelNotFoundError(OllamaAdapterError):
    def __init__(self, model_name: str):
        super().__init__(f"Model '{model_name}' is not installed in local Ollama", status_code=404, error_category="MODEL_NOT_FOUND")


class OllamaAdapter:
    """
    Production connection layer communicating with local or remote Ollama server.
    All operations log structured metadata without revealing private customer prompt content.
    """

    def __init__(
        self,
        base_url: Optional[str] = None,
        default_model: str = "llama3:8b",
        timeout_seconds: float = 30.0,
        max_retries: int = 2
    ):
        self.base_url = (base_url or getattr(settings, "OLLAMA_BASE_URL", "http://localhost:11434")).rstrip("/")
        self.default_model = default_model
        self.timeout_seconds = timeout_seconds
        self.max_retries = max_retries

    def _get_req_id(self, override_id: Optional[str] = None) -> str:
        return override_id or get_request_id() or "RF-LOCAL-AI"

    def _log_event(
        self,
        event: str,
        request_id: str,
        model: str,
        duration_ms: float,
        success: bool,
        workspace_id: Optional[str] = None,
        user_id: Optional[str] = None,
        error_category: Optional[str] = None
    ):
        """Structured telemetry without storing private prompt content."""
        payload = {
            "event": event,
            "requestId": request_id,
            "model": model,
            "durationMs": round(duration_ms, 2),
            "success": success,
            "workspaceId": workspace_id or "default",
            "userId": user_id or "system",
            "errorCategory": error_category
        }
        if success:
            logger.info(f"[OllamaTelemetry] {json.dumps(payload)}")
        else:
            logger.warning(f"[OllamaTelemetry] {json.dumps(payload)}")

    # ============================================================
    # 1. HEALTH & METADATA
    # ============================================================
    async def health(self) -> Dict[str, Any]:
        """Checks connectivity, latency, and Ollama server version."""
        t0 = time.perf_counter()
        req_id = self._get_req_id()

        try:
            async with httpx.AsyncClient(timeout=2.5) as client:
                res = await client.get(f"{self.base_url}/api/tags")
                duration = (time.perf_counter() - t0) * 1000

                if res.status_code == 200:
                    version = "unknown"
                    try:
                        vres = await client.get(f"{self.base_url}/api/version")
                        if vres.status_code == 200:
                            version = vres.json().get("version", "unknown")
                    except Exception:
                        pass

                    self._log_event("health_check", req_id, "n/a", duration, True)
                    return {
                        "status": "READY",
                        "reachable": True,
                        "endpoint": self.base_url,
                        "version": version,
                        "latency_ms": round(duration, 2)
                    }
                else:
                    self._log_event("health_check", req_id, "n/a", duration, False, error_category="HTTP_ERROR")
                    return {
                        "status": "ERROR",
                        "reachable": False,
                        "endpoint": self.base_url,
                        "version": None,
                        "error": f"HTTP {res.status_code}"
                    }
        except httpx.ConnectError:
            duration = (time.perf_counter() - t0) * 1000
            self._log_event("health_check", req_id, "n/a", duration, False, error_category="OFFLINE")
            return {
                "status": "OFFLINE",
                "reachable": False,
                "endpoint": self.base_url,
                "version": None,
                "error": "Ollama daemon unreachable"
            }
        except Exception as e:
            duration = (time.perf_counter() - t0) * 1000
            self._log_event("health_check", req_id, "n/a", duration, False, error_category=type(e).__name__)
            return {
                "status": "ERROR",
                "reachable": False,
                "endpoint": self.base_url,
                "version": None,
                "error": str(e)
            }

    # ============================================================
    # 2. MODEL LIFECYCLE MANAGEMENT
    # ============================================================
    async def list_models(self) -> List[Dict[str, Any]]:
        """Returns all models currently downloaded and available locally."""
        t0 = time.perf_counter()
        req_id = self._get_req_id()

        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.get(f"{self.base_url}/api/tags")
                duration = (time.perf_counter() - t0) * 1000

                if res.status_code == 200:
                    data = res.json()
                    models_out = []
                    for m in data.get("models", []):
                        size_b = m.get("size", 0)
                        models_out.append({
                            "name": m.get("name"),
                            "model": m.get("model"),
                            "size_bytes": size_b,
                            "size_gb": round(size_b / (1024 ** 3), 2),
                            "digest": m.get("digest", "")[:12],
                            "modified_at": m.get("modified_at")
                        })
                    self._log_event("list_models", req_id, "n/a", duration, True)
                    return models_out
                else:
                    self._log_event("list_models", req_id, "n/a", duration, False, error_category="HTTP_ERROR")
                    return []
        except Exception as e:
            duration = (time.perf_counter() - t0) * 1000
            self._log_event("list_models", req_id, "n/a", duration, False, error_category="CONNECTION_ERROR")
            return []

    async def get_model(self, model_name: str) -> Dict[str, Any]:
        """Retrieves low-level parameters, template, and license for a model."""
        t0 = time.perf_counter()
        req_id = self._get_req_id()

        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.post(f"{self.base_url}/api/show", json={"name": model_name})
                duration = (time.perf_counter() - t0) * 1000

                if res.status_code == 200:
                    data = res.json()
                    self._log_event("get_model", req_id, model_name, duration, True)
                    return {
                        "name": model_name,
                        "template": data.get("template"),
                        "parameters": data.get("parameters"),
                        "system": data.get("system"),
                        "details": data.get("details", {})
                    }
                elif res.status_code == 404:
                    self._log_event("get_model", req_id, model_name, duration, False, error_category="MODEL_NOT_FOUND")
                    raise OllamaModelNotFoundError(model_name)
                else:
                    self._log_event("get_model", req_id, model_name, duration, False, error_category="HTTP_ERROR")
                    raise OllamaAdapterError(f"HTTP {res.status_code}: {res.text}")
        except httpx.ConnectError:
            raise OllamaOfflineError()

    async def pull_model(self, model_name: str, stream: bool = False) -> Dict[str, Any]:
        """Initiates downloading a model from the Ollama library."""
        t0 = time.perf_counter()
        req_id = self._get_req_id()

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(f"{self.base_url}/api/pull", json={"name": model_name, "stream": stream})
                duration = (time.perf_counter() - t0) * 1000

                if res.status_code == 200:
                    self._log_event("pull_model", req_id, model_name, duration, True)
                    return {
                        "status": "SUCCESS",
                        "model": model_name,
                        "message": f"Model '{model_name}' successfully installed or updated."
                    }
                else:
                    self._log_event("pull_model", req_id, model_name, duration, False, error_category="PULL_FAILED")
                    return {
                        "status": "FAILED",
                        "model": model_name,
                        "error": f"Ollama pull returned status {res.status_code}: {res.text}"
                    }
        except httpx.ConnectError:
            raise OllamaOfflineError()
        except Exception as e:
            return {
                "status": "ERROR",
                "model": model_name,
                "error": str(e)
            }

    async def delete_model(self, model_name: str) -> Dict[str, Any]:
        """Deletes a local model to free host storage."""
        t0 = time.perf_counter()
        req_id = self._get_req_id()

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                # httpx delete with json payload
                req = client.build_request("DELETE", f"{self.base_url}/api/delete", json={"name": model_name})
                res = await client.send(req)
                duration = (time.perf_counter() - t0) * 1000

                if res.status_code == 200:
                    self._log_event("delete_model", req_id, model_name, duration, True)
                    return {"status": "SUCCESS", "model": model_name, "message": f"Model '{model_name}' removed."}
                else:
                    self._log_event("delete_model", req_id, model_name, duration, False, error_category="DELETE_FAILED")
                    return {"status": "FAILED", "model": model_name, "error": f"HTTP {res.status_code}"}
        except httpx.ConnectError:
            raise OllamaOfflineError()

    # ============================================================
    # 3. INFERENCE: CHAT & GENERATE
    # ============================================================
    async def chat(
        self,
        messages: List[Dict[str, Any]],
        model: Optional[str] = None,
        options: Optional[Dict[str, Any]] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        request_id: Optional[str] = None,
        workspace_id: Optional[str] = None,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes a chat completion with retry, backoff, and optional tool calling.
        """
        target_model = model or self.default_model
        req_id = self._get_req_id(request_id)
        opts = options or {}
        payload: Dict[str, Any] = {
            "model": target_model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": opts.get("temperature", 0.7),
                "num_predict": opts.get("max_tokens", 2048)
            }
        }
        if opts.get("format") == "json":
            payload["format"] = "json"
        if tools:
            payload["tools"] = tools

        attempt = 0
        backoffs = [0.3, 0.7]

        while attempt <= self.max_retries:
            t0 = time.perf_counter()
            try:
                timeout = opts.get("timeout_seconds", self.timeout_seconds)
                async with httpx.AsyncClient(timeout=timeout) as client:
                    res = await client.post(f"{self.base_url}/api/chat", json=payload)
                    duration = (time.perf_counter() - t0) * 1000

                    if res.status_code == 200:
                        data = res.json()
                        msg = data.get("message", {})
                        self._log_event(
                            "chat", req_id, target_model, duration, True,
                            workspace_id=workspace_id, user_id=user_id
                        )
                        return {
                            "text": msg.get("content", ""),
                            "role": msg.get("role", "assistant"),
                            "tool_calls": msg.get("tool_calls", []),
                            "finish_reason": "stop" if data.get("done") else None,
                            "usage": {
                                "prompt_tokens": data.get("prompt_eval_count", 0),
                                "completion_tokens": data.get("eval_count", 0),
                                "total_tokens": data.get("prompt_eval_count", 0) + data.get("eval_count", 0)
                            },
                            "latency_ms": round(duration, 2),
                            "model": target_model
                        }
                    elif res.status_code == 404:
                        self._log_event(
                            "chat", req_id, target_model, duration, False,
                            workspace_id=workspace_id, user_id=user_id, error_category="MODEL_NOT_FOUND"
                        )
                        raise OllamaModelNotFoundError(target_model)
                    else:
                        raise OllamaAdapterError(f"HTTP {res.status_code}: {res.text}", status_code=res.status_code)

            except httpx.ConnectError:
                duration = (time.perf_counter() - t0) * 1000
                self._log_event(
                    "chat", req_id, target_model, duration, False,
                    workspace_id=workspace_id, user_id=user_id, error_category="OFFLINE"
                )
                raise OllamaOfflineError()

            except httpx.TimeoutException:
                duration = (time.perf_counter() - t0) * 1000
                self._log_event(
                    "chat", req_id, target_model, duration, False,
                    workspace_id=workspace_id, user_id=user_id, error_category="TIMEOUT"
                )
                if attempt < self.max_retries:
                    attempt += 1
                    await asyncio.sleep(backoffs[min(attempt - 1, len(backoffs) - 1)])
                    continue
                raise OllamaTimeoutError(opts.get("timeout_seconds", self.timeout_seconds))

            except asyncio.CancelledError:
                logger.info(f"[{req_id}] Ollama chat operation aborted/cancelled by caller.")
                raise

            except Exception as e:
                if isinstance(e, OllamaAdapterError):
                    raise
                duration = (time.perf_counter() - t0) * 1000
                self._log_event(
                    "chat", req_id, target_model, duration, False,
                    workspace_id=workspace_id, user_id=user_id, error_category=type(e).__name__
                )
                raise OllamaAdapterError(str(e))

    async def stream_chat(
        self,
        messages: List[Dict[str, Any]],
        model: Optional[str] = None,
        options: Optional[Dict[str, Any]] = None,
        request_id: Optional[str] = None
    ) -> AsyncIterator[Dict[str, Any]]:
        """Streams chunk tokens as they are produced by local model."""
        target_model = model or self.default_model
        opts = options or {}
        payload = {
            "model": target_model,
            "messages": messages,
            "stream": True,
            "options": {
                "temperature": opts.get("temperature", 0.7),
                "num_predict": opts.get("max_tokens", 2048)
            }
        }
        if opts.get("format") == "json":
            payload["format"] = "json"

        try:
            async with httpx.AsyncClient(timeout=opts.get("timeout_seconds", 60.0)) as client:
                async with client.stream("POST", f"{self.base_url}/api/chat", json=payload) as response:
                    if response.status_code != 200:
                        raise OllamaAdapterError(f"HTTP {response.status_code}")

                    async for line in response.aiter_lines():
                        if not line:
                            continue
                        chunk = json.loads(line)
                        yield {
                            "token": chunk.get("message", {}).get("content", ""),
                            "done": chunk.get("done", False),
                            "model": target_model
                        }
        except httpx.ConnectError:
            raise OllamaOfflineError()

    async def generate(
        self,
        prompt: str,
        model: Optional[str] = None,
        options: Optional[Dict[str, Any]] = None,
        request_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Simple text generation endpoint (/api/generate)."""
        return await self.chat(
            messages=[{"role": "user", "content": prompt}],
            model=model,
            options=options,
            request_id=request_id
        )

    # ============================================================
    # 4. EMBEDDINGS
    # ============================================================
    async def embeddings(
        self,
        prompt: str,
        model: Optional[str] = None,
        request_id: Optional[str] = None
    ) -> List[float]:
        """Generates dense vector embeddings via local model (/api/embeddings)."""
        target_model = model or "nomic-embed-text"
        req_id = self._get_req_id(request_id)
        t0 = time.perf_counter()

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    f"{self.base_url}/api/embeddings",
                    json={"model": target_model, "prompt": prompt}
                )
                duration = (time.perf_counter() - t0) * 1000

                if res.status_code == 200:
                    self._log_event("embeddings", req_id, target_model, duration, True)
                    return res.json().get("embedding", [])
                else:
                    self._log_event("embeddings", req_id, target_model, duration, False, error_category="HTTP_ERROR")
                    return []
        except Exception as e:
            duration = (time.perf_counter() - t0) * 1000
            self._log_event("embeddings", req_id, target_model, duration, False, error_category="EMBED_ERROR")
            return []


# Global shared instance
ollama_adapter = OllamaAdapter()
