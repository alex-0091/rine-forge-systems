import random
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Tuple
from backend.app.config import settings

class RateController:
    """
    Enforces per-day and per-hour sending limits, domain concurrency controls,
    and calculates randomized delay intervals.
    """
    def __init__(self):
        self.sent_timestamps: List[datetime] = []
        self.domain_sent_counts: Dict[str, int] = {}

    def clean_old_timestamps(self):
        cutoff_24h = datetime.now(timezone.utc) - timedelta(hours=24)
        self.sent_timestamps = [ts for ts in self.sent_timestamps if ts > cutoff_24h]

    def can_send(self, target_domain: str = None) -> Tuple[bool, str]:
        self.clean_old_timestamps()
        now = datetime.now(timezone.utc)
        
        # 1. Check daily limit
        if len(self.sent_timestamps) >= settings.MAX_DAILY_EMAILS:
            return False, f"Daily limit reached ({settings.MAX_DAILY_EMAILS} emails/day)."

        # 2. Check hourly limit
        cutoff_1h = now - timedelta(hours=1)
        hourly_count = len([ts for ts in self.sent_timestamps if ts > cutoff_1h])
        if hourly_count >= settings.MAX_HOURLY_EMAILS:
            return False, f"Hourly rate limit reached ({settings.MAX_HOURLY_EMAILS} emails/hour)."

        return True, "Rate check passed."

    def record_send(self, target_domain: str = None):
        self.sent_timestamps.append(datetime.now(timezone.utc))
        if target_domain:
            self.domain_sent_counts[target_domain] = self.domain_sent_counts.get(target_domain, 0) + 1

    def calculate_next_delay_seconds(self) -> int:
        """Returns randomized delay between configured min and max to prevent mechanical bursts."""
        return random.randint(settings.MIN_SEND_DELAY_SECONDS, settings.MAX_SEND_DELAY_SECONDS)

rate_controller = RateController()
