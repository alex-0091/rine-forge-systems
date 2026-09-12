import re
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

BUYING_SIGNAL_PATTERNS = {
    "DEMO_OR_CALL_REQUEST": [
        r"(let'?s|can\s+we|can\s+you|could\s+we)?\s*(hop\s+on|schedule|book|set\s+up)\s+a\s+(quick\s+)?(call|meeting|chat|zoom|demo)",
        r"send\s+(over\s+)?(your|a)\s+(calendar|calendly|link)",
        r"when\s+are\s+you\s+free",
        r"what\s+does\s+your\s+availability\s+look\s+like",
        r"available\s+this\s+(week|thursday|friday|monday|tuesday|wednesday)"
    ],
    "PRICING_INQUIRY": [
        r"how\s+much\s+does\s+(this|it)\s+cost",
        r"what\s+(is|are)\s+your\s+(rates|pricing|fees|price)",
        r"pricing\s+(structure|sheet|info|details|list)",
        r"send\s+(over\s+)?(your\s+|a\s+)?(pricing|quote|rate)",
        r"ballpark\s+figure"
    ],
    "PORTFOLIO_OR_CASE_STUDY": [
        r"can\s+you\s+share\s+examples",
        r"who\s+else\s+have\s+you\s+worked\s+with",
        r"case\s+studies",
        r"past\s+work",
        r"portfolio"
    ],
    "TECHNICAL_FEASIBILITY": [
        r"do\s+you\s+integrate\s+with",
        r"can\s+you\s+support\s+(wordpress|shopify|hubspot|zapier|our\s+system)",
        r"does\s+this\s+work\s+with"
    ]
}

class BuyingSignalExtractor:
    """
    Extracts high-intent commercial buying signals from prospect inbound replies.
    """

    def analyze_signals(self, reply_text: str) -> Dict[str, Any]:
        signals_detected = []
        urgency = "NORMAL"
        text_lower = reply_text.lower()

        for signal_type, patterns in BUYING_SIGNAL_PATTERNS.items():
            for pat in patterns:
                if re.search(pat, text_lower):
                    signals_detected.append(signal_type)
                    break

        if "DEMO_OR_CALL_REQUEST" in signals_detected or "PRICING_INQUIRY" in signals_detected:
            urgency = "HIGH"
            
        return {
            "has_buying_signal": len(signals_detected) > 0,
            "signals": list(set(signals_detected)),
            "urgency": urgency,
            "requires_owner_attention": urgency == "HIGH"
        }

buying_signal_extractor = BuyingSignalExtractor()
