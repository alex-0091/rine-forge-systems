import logging
from typing import Optional
from backend.app.config import settings

logger = logging.getLogger(__name__)

class KillSwitchManager:
    """
    Global Kill Switch to immediately halt all outbound sending, automated sequences,
    and automatic AI responses across all active campaigns and mailboxes.
    """
    _is_paused: bool = settings.GLOBAL_KILL_SWITCH
    _reason: Optional[str] = None
    _paused_by: str = "system"

    @classmethod
    def is_paused(cls) -> bool:
        return cls._is_paused

    @classmethod
    def activate(cls, reason: str = "Manual Emergency Pause Triggered by Owner", actor: str = "owais") -> None:
        cls._is_paused = True
        cls._reason = reason
        cls._paused_by = actor
        logger.critical(f"🚨 GLOBAL OUTREACH KILL SWITCH ACTIVATED by {actor}. Reason: {reason}")

    @classmethod
    def deactivate(cls, actor: str = "owais") -> None:
        cls._is_paused = False
        cls._reason = None
        cls._paused_by = actor
        logger.info(f"✅ Global Outreach Kill Switch DEACTIVATED by {actor}. System operations resumed.")

    @classmethod
    def get_status(cls) -> dict:
        return {
            "kill_switch_active": cls._is_paused,
            "reason": cls._reason,
            "updated_by": cls._paused_by
        }

kill_switch = KillSwitchManager()
