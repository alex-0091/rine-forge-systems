import logging
from datetime import datetime, timezone, time
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Default timezone offsets in hours relative to UTC
COUNTRY_TIMEZONE_OFFSETS = {
    "US": -5,      # Eastern Standard Time
    "USA": -5,
    "United States": -5,
    "UK": 0,       # GMT/BST
    "GB": 0,
    "United Kingdom": 0,
    "CA": -5,      # Canada EST
    "Canada": -5,
    "AU": 10,      # AEST
    "Australia": 10
}

class OutreachScheduler:
    """
    Manages recipient timezone-aware sending windows.
    Ensures outreach emails are only dispatched during local business hours (09:00 - 17:00, Mon-Fri).
    """

    def is_within_business_hours(self, country: str = "US", current_utc: Optional[datetime] = None) -> Dict[str, Any]:
        utc_now = current_utc or datetime.now(timezone.utc)
        
        # 1. Weekday check (0=Monday, 6=Sunday)
        offset_hours = COUNTRY_TIMEZONE_OFFSETS.get(country, -5)
        local_hour = (utc_now.hour + offset_hours) % 24
        
        # Calculate local weekday roughly
        day_shift = (utc_now.hour + offset_hours) // 24
        local_weekday = (utc_now.weekday() + day_shift) % 7

        is_weekend = local_weekday in [5, 6]
        is_business_hours = (9 <= local_hour < 17) and not is_weekend

        return {
            "is_sendable_now": is_business_hours,
            "local_hour": local_hour,
            "local_weekday": local_weekday,
            "is_weekend": is_weekend,
            "country": country,
            "reason": "Within local business hours (9am-5pm Mon-Fri)" if is_business_hours else "Outside target business hours or on weekend."
        }

outreach_scheduler = OutreachScheduler()
