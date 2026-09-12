import os
import re
from pathlib import Path
from typing import Dict, Any

class PromptManager:
    """
    Loads versioned prompt templates from prompts/ folder and renders template variables
    with prompt-injection defense and untrusted content wrapping.
    """
    def __init__(self, prompts_dir: str = None):
        if prompts_dir is None:
            # Default to root /prompts
            base_dir = Path(__file__).resolve().parent.parent.parent.parent
            self.prompts_dir = base_dir / "prompts"
        else:
            self.prompts_dir = Path(prompts_dir)
            
        self._cache: Dict[str, str] = {}

    @classmethod
    def sanitize_untrusted_input(cls, text: str) -> str:
        """
        Neutralizes prompt injection patterns and wraps untrusted external data.
        """
        if not text:
            return ""
        
        # Remove null bytes
        sanitized = text.replace("\x00", "")
        
        # Strip potential jailbreak commands inside quotes/delimiters
        dangerous_patterns = [
            r"ignore\s+(all\s+)?(previous|above|prior)\s+instructions",
            r"disregard\s+(all\s+)?(previous|above|prior)\s+instructions",
            r"you\s+are\s+now\s+(an?\s+)?unrestricted",
            r"system\s*prompt\s*override",
            r"new\s*instructions\s*follow",
            r"<\|im_start\|>",
            r"<\|im_end\|>",
            r"\[SYSTEM\]",
            r"\[ASSISTANT\]"
        ]
        for pattern in dangerous_patterns:
            sanitized = re.sub(pattern, "[FILTERED_INJECTION_ATTEMPT]", sanitized, flags=re.IGNORECASE)
            
        return f"<UNTRUSTED_EXTERNAL_CONTENT>\n{sanitized.strip()}\n</UNTRUSTED_EXTERNAL_CONTENT>"

    def get_prompt_template(self, filename: str) -> str:
        if not filename.endswith(".md"):
            filename = f"{filename}.md"
            
        if filename in self._cache:
            return self._cache[filename]
            
        file_path = self.prompts_dir / filename
        if not file_path.exists():
            raise FileNotFoundError(f"Prompt template file '{filename}' not found at {file_path}")
            
        content = file_path.read_text(encoding="utf-8")
        self._cache[filename] = content
        return content

    def render_prompt(self, filename: str, context: Dict[str, Any], sanitize_external_keys: list = None) -> str:
        template = self.get_prompt_template(filename)
        sanitize_keys = sanitize_external_keys or ["raw_extracted_text", "website_snippet", "reply_text", "untrusted_content", "email_body"]
        
        for key, value in context.items():
            placeholder = f"{{{{{key}}}}}"
            val_str = str(value) if value is not None else ""
            if key in sanitize_keys and val_str:
                val_str = self.sanitize_untrusted_input(val_str)
            template = template.replace(placeholder, val_str)
        return template

prompt_manager = PromptManager()

