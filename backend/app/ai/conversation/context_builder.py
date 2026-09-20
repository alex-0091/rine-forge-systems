"""
Rine Forge Systems V5 - Context Builder
Builds sliding window context budgets, merges verified business context,
and enforces prompt injection boundary tags.
"""
from typing import List, Optional
from backend.app.ai.gateway.interface import ChatMessage
from backend.app.ai.safety.prompt_injection import format_safe_user_message, get_security_preamble

class ContextBuilder:
    """
    Assembles conversation context within model token budgets.
    Maintains system instruction integrity and truncates oldest conversational turns first.
    """

    @staticmethod
    def estimate_tokens(text: str) -> int:
        if not text:
            return 0
        return max(1, len(text.split()) * 4 // 3)

    def build_context(
        self,
        system_prompt: str,
        business_context: Optional[str] = None,
        history: Optional[List[ChatMessage]] = None,
        latest_user_input: str = "",
        max_context_tokens: int = 4000
    ) -> List[ChatMessage]:
        # 1. Assemble Full System Directive
        parts = [system_prompt.strip()]
        if business_context:
            parts.append(f"[VERIFIED BUSINESS CONTEXT]\n{business_context.strip()}")
        parts.append(get_security_preamble().strip())
        full_system_text = "\n\n".join(parts)

        system_tokens = self.estimate_tokens(full_system_text)
        system_msg = ChatMessage(role="system", content=full_system_text)

        # 2. Format safe latest user turn
        safe_user_text = format_safe_user_message(latest_user_input)
        latest_user_tokens = self.estimate_tokens(safe_user_text)
        latest_user_msg = ChatMessage(role="user", content=safe_user_text)

        # 3. Sliding window over history
        budget = max_context_tokens - (system_tokens + latest_user_tokens + 150) # 150 token reserve
        history_msgs = history or []
        selected_history: List[ChatMessage] = []

        # Iterate in reverse (newest first)
        for msg in reversed(history_msgs):
            msg_tokens = self.estimate_tokens(msg.content)
            if budget >= msg_tokens:
                selected_history.insert(0, msg)
                budget -= msg_tokens
            else:
                break

        return [system_msg] + selected_history + [latest_user_msg]

context_builder = ContextBuilder()
