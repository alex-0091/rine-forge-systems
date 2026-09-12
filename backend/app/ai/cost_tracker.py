from datetime import datetime, timezone
from typing import Dict, Any, List

class AICostTracker:
    """
    Tracks token consumption and estimated API costs for LLM operations.
    Standard rates (approximate for Gemini 1.5 Flash / Pro):
    Flash: $0.075 / 1M input tokens, $0.30 / 1M output tokens
    Pro: $1.25 / 1M input tokens, $5.00 / 1M output tokens
    """
    RATES = {
        "gemini-1.5-flash": {"input_per_million": 0.075, "output_per_million": 0.30},
        "gemini-2.0-flash": {"input_per_million": 0.10, "output_per_million": 0.40},
        "gemini-1.5-pro": {"input_per_million": 1.25, "output_per_million": 5.00},
        "gemini-2.5-pro": {"input_per_million": 1.50, "output_per_million": 6.00},
        "mock": {"input_per_million": 0.0, "output_per_million": 0.0}
    }

    _total_input_tokens: int = 0
    _total_output_tokens: int = 0
    _total_cost_usd: float = 0.0
    _operation_logs: List[Dict[str, Any]] = []

    @classmethod
    def calculate_cost(cls, model: str, input_tokens: int, output_tokens: int) -> float:
        model_rates = cls.RATES.get(model, cls.RATES["gemini-1.5-flash"])
        cost = (input_tokens / 1_000_000 * model_rates["input_per_million"]) + \
               (output_tokens / 1_000_000 * model_rates["output_per_million"])
        return round(cost, 6)

    @classmethod
    def record_usage(cls, operation: str, model: str, input_tokens: int, output_tokens: int, lead_id: str = None) -> float:
        cost = cls.calculate_cost(model, input_tokens, output_tokens)
        cls._total_input_tokens += input_tokens
        cls._total_output_tokens += output_tokens
        cls._total_cost_usd += cost
        
        entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "operation": operation,
            "model": model,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cost_usd": cost,
            "lead_id": lead_id
        }
        cls._operation_logs.append(entry)
        if len(cls._operation_logs) > 500:
            cls._operation_logs.pop(0)
        return cost

    @classmethod
    def get_summary(cls) -> Dict[str, Any]:
        return {
            "total_input_tokens": cls._total_input_tokens,
            "total_output_tokens": cls._total_output_tokens,
            "total_tokens": cls._total_input_tokens + cls._total_output_tokens,
            "total_cost_usd": round(cls._total_cost_usd, 4),
            "operations_count": len(cls._operation_logs),
            "recent_operations": cls._operation_logs[-20:]
        }

cost_tracker = AICostTracker()
