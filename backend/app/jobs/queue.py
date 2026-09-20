"""
Rine Forge Systems - Asynchronous Background Job Queue
In-memory resilient job runner with concurrency control, exponential backoff retries,
dead-letter queue (DLQ) isolation, and real-time observability telemetry.
Redis-ready interface for seamless cluster scaling.
"""
import uuid
import asyncio
import logging
from enum import Enum
from datetime import datetime, timezone
from typing import Dict, Any, Callable, Awaitable, Optional, List

logger = logging.getLogger("rine_forge_systems.jobs.queue")

class JobStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    DEAD_LETTER = "DEAD_LETTER"

class Job:
    """Represents a single asynchronous background task."""
    def __init__(
        self,
        job_type: str,
        payload: Dict[str, Any],
        max_retries: int = 3,
        job_id: Optional[str] = None
    ):
        self.id = job_id or f"job_{uuid.uuid4().hex[:12]}"
        self.job_type = job_type
        self.payload = payload
        self.status = JobStatus.PENDING
        self.retry_count = 0
        self.max_retries = max_retries
        self.error: Optional[str] = None
        self.result: Optional[Any] = None
        self.created_at = datetime.now(timezone.utc)
        self.started_at: Optional[datetime] = None
        self.completed_at: Optional[datetime] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "job_type": self.job_type,
            "payload": self.payload,
            "status": self.status.value,
            "retry_count": self.retry_count,
            "max_retries": self.max_retries,
            "error": self.error,
            "created_at": self.created_at.isoformat(),
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
        }

class BackgroundJobQueue:
    """
    Authoritative background queue manager with concurrency limiting,
    bounded retries, and dead-letter isolation.
    """

    def __init__(self, max_concurrent: int = 5):
        self.max_concurrent = max_concurrent
        self._handlers: Dict[str, Callable[[Dict[str, Any]], Awaitable[Any]]] = {}
        self._jobs: Dict[str, Job] = {}
        self._queue: asyncio.Queue[str] = asyncio.Queue()
        self._semaphore: Optional[asyncio.Semaphore] = None
        self._worker_task: Optional[asyncio.Task] = None
        self._running = False

    def register_handler(self, job_type: str, handler: Callable[[Dict[str, Any]], Awaitable[Any]]) -> None:
        """Registers an asynchronous handler function for a specific job_type."""
        self._handlers[job_type] = handler
        logger.info(f"Registered background job handler for '{job_type}'")

    async def start(self) -> None:
        """Starts background worker polling."""
        if self._running:
            return
        self._running = True
        self._semaphore = asyncio.Semaphore(self.max_concurrent)
        self._worker_task = asyncio.create_task(self._process_queue())
        logger.info(f"BackgroundJobQueue started (concurrency={self.max_concurrent})")

    async def stop(self) -> None:
        """Gracefully halts background worker."""
        self._running = False
        if self._worker_task:
            self._worker_task.cancel()
            try:
                await self._worker_task
            except asyncio.CancelledError:
                pass
        logger.info("BackgroundJobQueue stopped.")

    async def enqueue(
        self,
        job_type: str,
        payload: Dict[str, Any],
        max_retries: int = 3,
        delay_seconds: float = 0
    ) -> Job:
        """Enqueues a new background job."""
        job = Job(job_type=job_type, payload=payload, max_retries=max_retries)
        self._jobs[job.id] = job

        if delay_seconds > 0:
            asyncio.create_task(self._delayed_enqueue(job.id, delay_seconds))
        else:
            await self._queue.put(job.id)

        logger.info(f"Enqueued job #{job.id} of type '{job_type}'")
        return job

    async def _delayed_enqueue(self, job_id: str, delay: float) -> None:
        await asyncio.sleep(delay)
        if job_id in self._jobs and self._jobs[job_id].status == JobStatus.PENDING:
            await self._queue.put(job_id)

    def get_job(self, job_id: str) -> Optional[Job]:
        return self._jobs.get(job_id)

    def list_jobs(self, limit: int = 50, status: Optional[str] = None) -> List[Dict[str, Any]]:
        jobs = list(self._jobs.values())
        if status:
            jobs = [j for j in jobs if j.status.value == status.upper()]
        jobs.sort(key=lambda j: j.created_at, reverse=True)
        return [j.to_dict() for j in jobs[:limit]]

    def get_stats(self) -> Dict[str, Any]:
        """Provides real-time health and throughput metrics."""
        counts = {s.value: 0 for s in JobStatus}
        for j in self._jobs.values():
            counts[j.status.value] += 1

        return {
            "status": "HEALTHY" if self._running else "IDLE",
            "is_running": self._running,
            "max_concurrent": self.max_concurrent,
            "pending": counts[JobStatus.PENDING.value],
            "running": counts[JobStatus.RUNNING.value],
            "completed": counts[JobStatus.COMPLETED.value],
            "failed": counts[JobStatus.FAILED.value],
            "dead_letter": counts[JobStatus.DEAD_LETTER.value],
            "total_processed": counts[JobStatus.COMPLETED.value] + counts[JobStatus.DEAD_LETTER.value]
        }

    async def _process_queue(self) -> None:
        while self._running:
            try:
                job_id = await self._queue.get()
                job = self._jobs.get(job_id)
                if not job:
                    self._queue.task_done()
                    continue

                if not self._semaphore:
                    self._semaphore = asyncio.Semaphore(self.max_concurrent)

                # Execute in concurrency-bounded task
                asyncio.create_task(self._execute_job_with_semaphore(job))
                self._queue.task_done()
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in queue dispatcher loop: {e}", exc_info=True)
                await asyncio.sleep(0.5)

    async def _execute_job_with_semaphore(self, job: Job) -> None:
        assert self._semaphore is not None
        async with self._semaphore:
            job.status = JobStatus.RUNNING
            job.started_at = datetime.now(timezone.utc)
            handler = self._handlers.get(job.job_type)

            if not handler:
                job.status = JobStatus.DEAD_LETTER
                job.error = f"No registered handler for job_type '{job.job_type}'"
                job.completed_at = datetime.now(timezone.utc)
                logger.error(f"Job #{job.id} moved to DEAD_LETTER: {job.error}")
                return

            try:
                result = await handler(job.payload)
                job.result = result
                job.status = JobStatus.COMPLETED
                job.completed_at = datetime.now(timezone.utc)
                logger.info(f"Job #{job.id} ({job.job_type}) completed successfully.")
            except Exception as e:
                job.error = str(e)
                job.retry_count += 1
                logger.warning(f"Job #{job.id} failed attempt {job.retry_count}/{job.max_retries}: {e}")

                if job.retry_count >= job.max_retries:
                    job.status = JobStatus.DEAD_LETTER
                    job.completed_at = datetime.now(timezone.utc)
                    logger.error(f"Job #{job.id} exceeded max retries. Moved to DEAD_LETTER.")
                else:
                    job.status = JobStatus.PENDING
                    backoff_delay = 0.5 * (2 ** (job.retry_count - 1))
                    asyncio.create_task(self._delayed_enqueue(job.id, backoff_delay))

job_queue = BackgroundJobQueue(max_concurrent=5)
