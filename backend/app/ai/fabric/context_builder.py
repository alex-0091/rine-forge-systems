"""
Rine Forge Systems V5 - Forge Intelligence Fabric: Context Builder
Constructs explicitly labeled prompt contexts with strict epistemological boundaries.
Segregates AUTHORITATIVE BUSINESS FACTS from MODEL INFERENCES.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone


class ContextBuilder:
    """Constructs prompt context with explicitly demarcated, authoritative boundaries."""

    @classmethod
    def build_context(
        cls,
        task_type: str,
        user_prompt: str,
        business_profile: Dict[str, Any],
        system_role: str = "Rine Forge Operating System Intelligence",
        conversation_history: Optional[List[Dict[str, str]]] = None,
        retrieved_knowledge: Optional[List[str]] = None,
        inferences: Optional[List[str]] = None,
        available_tools: Optional[List[str]] = None,
        policy_statement: str = "LOCAL_FIRST. Do not hallucinate business facts. Use tools for real actions."
    ) -> str:
        """
        Builds a cleanly structured prompt with 8 explicitly labeled sections:
        SYSTEM, BUSINESS, USER, CONVERSATION, KNOWLEDGE, TOOLS, TASK, POLICY.
        """
        sections: List[str] = []

        # 1. SYSTEM
        sections.append(f"### [SECTION: SYSTEM]\n{system_role}\nTimestamp: {datetime.now(timezone.utc).isoformat()}")

        # 2. BUSINESS (Authoritative Facts)
        biz_lines = [
            f"AUTHORITATIVE BUSINESS FACT: Business Name = {business_profile.get('name', 'Forge Business')}",
            f"AUTHORITATIVE BUSINESS FACT: Industry = {business_profile.get('industry', 'General Services')}",
            f"AUTHORITATIVE BUSINESS FACT: Location = {business_profile.get('location', 'Austin, TX')}",
            f"AUTHORITATIVE BUSINESS FACT: Operating Hours = {business_profile.get('hours', 'Mon-Fri 8:00 AM - 6:00 PM')}",
            f"AUTHORITATIVE BUSINESS FACT: Verified Services = {', '.join(business_profile.get('services', []))}"
        ]
        sections.append(f"### [SECTION: BUSINESS]\n" + "\n".join(biz_lines))

        # 3. KNOWLEDGE & INFERENCES (Strictly Segregated)
        knowledge_lines = []
        if retrieved_knowledge:
            for fact in retrieved_knowledge:
                knowledge_lines.append(f"AUTHORITATIVE GROUNDED FACT: {fact}")
        if inferences:
            for inf in inferences:
                knowledge_lines.append(f"MODEL INFERENCE (Subject to verification): {inf}")
        if not knowledge_lines:
            knowledge_lines.append("No external knowledge documents attached.")
        sections.append("### [SECTION: KNOWLEDGE]\n" + "\n".join(knowledge_lines))

        # 4. CONVERSATION
        if conversation_history:
            history_lines = [f"{msg.get('role', 'user').capitalize()}: {msg.get('text', '')}" for msg in conversation_history]
            sections.append("### [SECTION: CONVERSATION]\n" + "\n".join(history_lines))
        else:
            sections.append("### [SECTION: CONVERSATION]\nNo prior conversation turns.")

        # 5. USER
        sections.append(f"### [SECTION: USER]\nPrompt: \"{user_prompt}\"")

        # 6. TOOLS
        if available_tools:
            tools_str = ", ".join(available_tools)
            sections.append(f"### [SECTION: TOOLS]\nPermitted Tools: [{tools_str}]\nNote: Tools must be invoked via structured tool calls.")
        else:
            sections.append("### [SECTION: TOOLS]\nNo tools permitted for this task.")

        # 7. TASK
        sections.append(f"### [SECTION: TASK]\nTarget Objective: {task_type}\nExpected Deliverable: Grounded, high-integrity output.")

        # 8. POLICY
        sections.append(f"### [SECTION: POLICY]\n{policy_statement}\nStrict Rule: Never present MODEL INFERENCE as an AUTHORITATIVE BUSINESS FACT.")

        return "\n\n".join(sections)
