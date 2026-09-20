"""
Rine Forge Systems V5 - Forge Intelligence Fabric: Task Classifier
Classifies natural language requests across 25 authoritative domains and 4 complexity tiers.
Outputs structured classification metrics without hardcoded or fake assumptions.
"""
import re
from typing import Dict, Any, List
from backend.app.ai.fabric.constants import TaskCategory, TaskComplexity, ALL_TASK_CATEGORIES


class TaskClassifier:
    """Classifies user requests into authoritative task categories and complexity tiers."""

    KEYWORD_SIGNALS: Dict[TaskCategory, List[str]] = {
        TaskCategory.WEBSITE_BUILD: ["build website", "create website", "make website", "web page", "landing page", "html", "tailwind", "develop site", "design site"],
        TaskCategory.WEBSITE_AUDIT: ["audit website", "audit site", "review site", "inspect website", "seo audit", "conversion audit", "scorecard", "page speed", "audit this screenshot"],
        TaskCategory.CUSTOMER_RESPONSE: ["reply to customer", "respond to customer", "receptionist", "answer customer", "customer message", "patient message", "client message"],
        TaskCategory.CUSTOMER_SUPPORT: ["support ticket", "help customer", "troubleshoot", "complaint", "refund", "faq"],
        TaskCategory.SALES: ["sales pitch", "close deal", "proposal", "outreach message", "pitch deck", "sell"],
        TaskCategory.LEAD_QUALIFICATION: ["qualify leads", "score leads", "icp fit", "b2b leads", "lead qualification", "find leads", "prospects"],
        TaskCategory.CODE_GENERATION: ["write code", "generate function", "api route", "python script", "sql query", "implement endpoint", "backend"],
        TaskCategory.CODE_REVIEW: ["review code", "debug code", "fix bug", "security audit code", "refactor"],
        TaskCategory.DOCUMENT_GENERATION: ["write document", "generate pdf", "contract", "terms of service", "brief", "handbook"],
        TaskCategory.IMAGE_ANALYSIS: ["analyze image", "inspect image", "read image", "describe image", "ocr image"],
        TaskCategory.VISION: ["screenshot", "visual review", "inspect screenshot", "ui layout review", "visual audit"],
        TaskCategory.VOICE: ["voice call", "transcribe audio", "voice turn", "speak response", "stt", "tts", "audio"],
        TaskCategory.BUSINESS_PLAN: ["business plan", "executive summary", "business model", "swot analysis", "go to market strategy"],
        TaskCategory.MARKETING_PLAN: ["marketing plan", "growth strategy", "ad campaign", "content strategy", "social media plan"],
        TaskCategory.FINANCIAL_ANALYSIS: ["analyze finances", "financial model", "revenue forecast", "cash flow", "cogs", "breakeven", "gross profit", "projections", "balance sheet", "budget"],
        TaskCategory.SEO: ["seo ranking", "keywords", "meta tags", "backlinks", "serp", "sitemap"],
        TaskCategory.COMPETITOR_ANALYSIS: ["competitor analysis", "competitive landscape", "market benchmark", "industry rival"],
        TaskCategory.AUTOMATION: ["automation workflow", "webhook trigger", "zapier", "automate task", "auto reply", "crm automation"],
        TaskCategory.AI_AGENT_CREATION: ["create ai agent", "build ai employee", "create ai receptionist", "generate ai bot", "create an ai"],
        TaskCategory.VOICE_AGENT_CREATION: ["create voice receptionist", "build voice bot", "voice agent creation", "voice employee"],
        TaskCategory.LEAD_AGENT_CREATION: ["create lead bot", "lead agent creation", "lead generation bot"],
        TaskCategory.DATA_ANALYSIS: ["analyze data", "csv analysis", "metrics review", "conversion rates", "churn analysis"],
        TaskCategory.RESEARCH: ["research", "investigate", "find information", "market data", "gather info"],
        TaskCategory.QUESTION: ["what time", "how do i", "can you tell me", "when is", "where is", "who is", "why"],
        TaskCategory.CHAT: ["hello", "hi", "hey", "good morning", "how are you", "thanks", "thank you"],
        TaskCategory.BRAND_DESIGN: ["logo", "vector logo", "logo concept", "color palette", "brand concept", "brand design", "brand identity", "typography", "palette", "favicon"]
    }

    @classmethod
    def classify(cls, request: str, attachments: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        req_lower = (request or "").lower().strip()
        attachments = attachments or []

        scores: Dict[str, int] = {cat: 0 for cat in ALL_TASK_CATEGORIES}

        # Check visual attachments
        if attachments:
            has_images = any(att.get("type", "").startswith("image") or "screenshot" in str(att).lower() for att in attachments)
            if has_images:
                scores[TaskCategory.VISION.value] += 8
                scores[TaskCategory.IMAGE_ANALYSIS.value] += 7

        # Evaluate keyword matches
        for cat, keywords in cls.KEYWORD_SIGNALS.items():
            for kw in keywords:
                if kw in req_lower:
                    scores[cat.value] += 5
                    # Extra weight for exact phrases
                    if f" {kw} " in f" {req_lower} ":
                        scores[cat.value] += 3

        # Specific disambiguation rules
        if "what time" in req_lower or "hours" in req_lower or "close" in req_lower:
            scores[TaskCategory.QUESTION.value] += 10
            scores[TaskCategory.CUSTOMER_RESPONSE.value] += 8
        if "reply to this customer" in req_lower or "respond to this customer" in req_lower:
            scores[TaskCategory.CUSTOMER_RESPONSE.value] += 15
        if any(w in req_lower for w in ["build a website", "build website", "build a modern website", "make my dental clinic a website", "make a website", "responsive website"]):
            scores[TaskCategory.WEBSITE_BUILD.value] += 30
        if any(w in req_lower for w in ["audit the website", "audit website", "audit this screenshot", "audit screenshot", "audit and conversion", "audit"]):
            scores[TaskCategory.WEBSITE_AUDIT.value] += 30
            scores[TaskCategory.VISION.value] += 5
        if any(w in req_lower for w in ["vector logo", "logo concept", "color palette", "brand concept", "brand identity"]):
            scores[TaskCategory.BRAND_DESIGN.value] += 35
        if "create a business plan" in req_lower or "create business plan" in req_lower:
            scores[TaskCategory.BUSINESS_PLAN.value] += 20
        if any(w in req_lower for w in ["calculate a 12-month", "financial cash flow", "break-even model", "financial model", "analyze these finances", "analyze finances"]):
            scores[TaskCategory.FINANCIAL_ANALYSIS.value] += 30
        if "create an ai receptionist" in req_lower or "create ai receptionist" in req_lower:
            scores[TaskCategory.AI_AGENT_CREATION.value] += 20
        if "create a voice receptionist" in req_lower or "create voice receptionist" in req_lower:
            scores[TaskCategory.VOICE_AGENT_CREATION.value] += 20
        if "find and qualify leads" in req_lower or "qualify leads" in req_lower:
            scores[TaskCategory.LEAD_QUALIFICATION.value] += 20
        if "whatsapp" in req_lower or "send sms" in req_lower:
            scores[TaskCategory.AUTOMATION.value] += 10
        if any(w in req_lower for w in ["grow my", "grow our", "business growth", "marketing strategy", "customer acquisition", "marketing plan"]):
            scores[TaskCategory.MARKETING_PLAN.value] += 25
            scores[TaskCategory.BUSINESS_PLAN.value] += 10

        # Fallback to CHAT or QUESTION
        if max(scores.values()) == 0:
            if "?" in request or any(req_lower.startswith(w) for w in ["what", "how", "why", "where", "can", "is"]):
                scores[TaskCategory.QUESTION.value] = 5
            else:
                scores[TaskCategory.CHAT.value] = 5

        # Primary and secondary determination
        sorted_cats = sorted(scores.items(), key=lambda item: item[1], reverse=True)
        primary_category = sorted_cats[0][0]
        secondary_categories = [c for c, s in sorted_cats[1:] if s >= 5][:3]

        # Calculate confidence
        top_score = sorted_cats[0][1]
        sum_scores = sum(scores.values())
        confidence = round(min(1.0, top_score / max(1, sum_scores * 0.7)), 2) if top_score > 0 else 0.50

        # Determine Complexity
        complexity = TaskComplexity.LOW
        estimated_steps = 1
        requires_multi_agent = False

        if primary_category in [
            TaskCategory.WEBSITE_BUILD.value,
            TaskCategory.BUSINESS_PLAN.value,
            TaskCategory.AI_AGENT_CREATION.value,
            TaskCategory.VOICE_AGENT_CREATION.value
        ]:
            complexity = TaskComplexity.HIGH
            estimated_steps = 6
            requires_multi_agent = True
        elif primary_category in [
            TaskCategory.FINANCIAL_ANALYSIS.value,
            TaskCategory.WEBSITE_AUDIT.value,
            TaskCategory.MARKETING_PLAN.value,
            TaskCategory.LEAD_QUALIFICATION.value,
            TaskCategory.CODE_GENERATION.value
        ]:
            complexity = TaskComplexity.MEDIUM
            estimated_steps = 3
            requires_multi_agent = len(secondary_categories) > 0
        elif primary_category in [
            TaskCategory.AUTOMATION.value
        ] and any(w in req_lower for w in ["whatsapp", "email", "sms", "publish", "delete", "charge"]):
            complexity = TaskComplexity.CRITICAL
            estimated_steps = 4

        return {
            "primary_category": primary_category,
            "secondary_categories": secondary_categories,
            "complexity": complexity.value,
            "confidence": confidence,
            "scores": scores,
            "requires_multi_agent": requires_multi_agent,
            "estimated_steps": estimated_steps
        }
