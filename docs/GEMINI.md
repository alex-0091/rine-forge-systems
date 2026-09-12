# Google Gemini AI Integration & Cost Governance

OWAIS OUTREACH AI leverages Google Gemini for deep reasoning, personalized email drafting, inbound reply classification, and suggested response generation.

---

## 1. Supported Models
- **`gemini-1.5-flash`** (Default): Fast, cost-efficient model for business analysis, quality checks, and reply classification.
- **`gemini-1.5-pro`** (Reasoning): High-depth model for complex custom proposal generation and high-value lead synthesis.
- **`gemini-2.0-flash`**: Next-generation low-latency model.

---

## 2. Anti-Hallucination Guardrails

The system enforces strict fact-grounding:
1. Every input prompt includes only verified facts extracted during website analysis.
2. The AI is explicitly forbidden from inventing testimonials, revenue claims, employee counts, or technical brokenness.
3. Pre-send Quality Check assesses every draft before queueing.

---

## 3. Cost & Token Governance

Every LLM call tracks:
- Operation name
- Model used
- Input & output token counts
- Calculated USD cost

View real-time AI spending in the Dashboard under **AI Spending Metrics**.
