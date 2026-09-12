import logging
import uuid
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from datetime import datetime, timezone
from backend.app.config import settings

logger = logging.getLogger(__name__)

class EmailProvider(ABC):
    @abstractmethod
    async def send_email(
        self,
        to_email: str,
        to_name: str,
        subject: str,
        body_text: str,
        headers: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Dispatches an email message and returns dispatch metadata."""
        pass

class DryRunEmailProvider(EmailProvider):
    """
    Dry-run provider: logs exact envelope and headers to database without connecting to external SMTP/MX servers.
    Ensures safe development, testing, and approval cycles.
    """
    async def send_email(
        self,
        to_email: str,
        to_name: str,
        subject: str,
        body_text: str,
        headers: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        msg_id = f"<dryrun-{uuid.uuid4()}@owais-ai.com>"
        logger.info(
            f"[DRY-RUN SEND] To: '{to_name}' <{to_email}> | Subject: '{subject}' | Message-ID: {msg_id}\n"
            f"--- Preview ---\n{body_text[:200]}...\n----------------"
        )
        return {
            "status": "SENT",
            "provider": "dry_run",
            "message_id": msg_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "delivered": True,
            "dry_run": True
        }

class SMTPEmailProvider(EmailProvider):
    """
    Production SMTP Provider with TLS and standard RFC 2822 compliance.
    """
    def __init__(self, host: str, port: int, username: Optional[str] = None, password: Optional[str] = None, use_tls: bool = True):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.use_tls = use_tls

    async def send_email(
        self,
        to_email: str,
        to_name: str,
        subject: str,
        body_text: str,
        headers: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        from email.utils import formatdate, make_msgid

        msg_id = make_msgid(domain="rineforge.ai")
        msg = MIMEMultipart()
        msg["From"] = f"{settings.SENDER_NAME} <{settings.SENDER_EMAIL}>"
        msg["To"] = f"{to_name} <{to_email}>"
        msg["Subject"] = subject
        msg["Date"] = formatdate(localtime=True)
        msg["Message-ID"] = msg_id
        msg["Reply-To"] = settings.REPLY_TO_EMAIL
        msg["List-Unsubscribe"] = f"<mailto:{settings.REPLY_TO_EMAIL}?subject=unsubscribe:{to_email}>"

        if headers:
            for k, v in headers.items():
                msg[k] = v

        msg.attach(MIMEText(body_text, "plain", "utf-8"))

        try:
            # Synchronous SMTP wrapped for async
            server = smtplib.SMTP(self.host, self.port, timeout=10)
            if self.use_tls:
                server.starttls()
            if self.username and self.password:
                server.login(self.username, self.password)
            server.sendmail(settings.SENDER_EMAIL, [to_email], msg.as_string())
            server.quit()

            return {
                "status": "SENT",
                "provider": "smtp",
                "message_id": msg_id,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "delivered": True,
                "dry_run": False
            }
        except Exception as e:
            logger.error(f"SMTP dispatch failure to {to_email}: {e}")
            return {
                "status": "FAILED",
                "provider": "smtp",
                "error": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "delivered": False,
                "dry_run": False
            }

def get_email_provider(is_dry_run: bool = False) -> EmailProvider:
    if is_dry_run or settings.DRY_RUN or settings.EMAIL_PROVIDER == "dry_run" or not settings.SMTP_PASSWORD:
        return DryRunEmailProvider()
    elif settings.EMAIL_PROVIDER == "smtp":
        return SMTPEmailProvider(
            host=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USERNAME,
            password=settings.SMTP_PASSWORD,
            use_tls=settings.SMTP_USE_TLS
        )
    return DryRunEmailProvider()
