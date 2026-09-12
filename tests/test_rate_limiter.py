import pytest
from datetime import datetime, timezone
from backend.app.outreach.rate_limiter import RateController
from backend.app.config import settings

def test_rate_controller_limits():
    limiter = RateController()
    
    # Under limit
    can_send, reason = limiter.can_send()
    assert can_send is True

    # Simulate hitting max hourly limit
    for _ in range(settings.MAX_HOURLY_EMAILS):
        limiter.record_send()

    can_send_after, reason_after = limiter.can_send()
    assert can_send_after is False
    assert "Hourly rate limit reached" in reason_after
