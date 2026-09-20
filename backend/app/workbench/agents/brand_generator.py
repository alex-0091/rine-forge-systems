"""
Rine Forge Systems V5 - Phase AQ: Brand & Logo Generator Agent
Creates multi-concept visual identity packages with parametric SVG logos,
semantic color palettes, typography pairings, favicons, and social avatars.
Supports dynamic style transformations: Minimal, Premium, Playful, Bold.
"""
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("rine_forge.workbench.brand_generator")


class BrandGeneratorAgent:
    """
    Generates multi-concept brand design systems with production SVG assets.
    """

    STYLES = {
        "PREMIUM": {"rx": "36", "border": "none", "font_weight": "800", "subtitle": "LUXURY & TRUST"},
        "MINIMAL": {"rx": "16", "border": "none", "font_weight": "700", "subtitle": "CLEAN & MODERN"},
        "PLAYFUL": {"rx": "60", "border": "none", "font_weight": "900", "subtitle": "FRIENDLY & OPEN"},
        "BOLD": {"rx": "8", "border": "none", "font_weight": "900", "subtitle": "STRONG & RELIABLE"}
    }

    async def generate_brand_identity(
        self,
        business_name: str,
        industry: str = "Dental Clinic",
        target_customer: Optional[str] = None,
        style: str = "PREMIUM",
        preferred_colors: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Creates multiple brand concepts with vector SVG marks, palettes, and typography rules.
        """
        initial = business_name[:1].upper() if business_name else "F"
        style_key = style.upper() if style.upper() in self.STYLES else "PREMIUM"
        style_meta = self.STYLES[style_key]

        # Concept 1: Modern Sapphire (Trust & Authority)
        c1_colors = {
            "primary": "#2563eb",
            "secondary": "#1d4ed8",
            "accent": "#38bdf8",
            "surface": "#f8fafc",
            "ink": "#0f172a"
        }
        svg1 = (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">'
            f'<defs>'
            f'<linearGradient id="c1_grad" x1="0%" y1="0%" x2="100%" y2="100%">'
            f'<stop offset="0%" stop-color="{c1_colors["primary"]}" />'
            f'<stop offset="100%" stop-color="{c1_colors["secondary"]}" />'
            f'</linearGradient>'
            f'</defs>'
            f'<rect width="200" height="200" rx="{style_meta["rx"]}" fill="url(#c1_grad)" />'
            f'<circle cx="100" cy="100" r="62" fill="none" stroke="#ffffff" stroke-width="4" stroke-opacity="0.25" />'
            f'<text x="100" y="126" font-family="system-ui, -apple-system, sans-serif" font-size="78" '
            f'font-weight="{style_meta["font_weight"]}" fill="#ffffff" text-anchor="middle">{initial}</text>'
            f'</svg>'
        )

        # Concept 2: Warm Violet & Coral (Modern Hospitality)
        c2_colors = {
            "primary": "#7c3aed",
            "secondary": "#6d28d9",
            "accent": "#f43f5e",
            "surface": "#faf5ff",
            "ink": "#1e1b4b"
        }
        svg2 = (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">'
            f'<defs>'
            f'<linearGradient id="c2_grad" x1="0%" y1="0%" x2="100%" y2="100%">'
            f'<stop offset="0%" stop-color="{c2_colors["primary"]}" />'
            f'<stop offset="100%" stop-color="{c2_colors["accent"]}" />'
            f'</linearGradient>'
            f'</defs>'
            f'<rect width="200" height="200" rx="{style_meta["rx"]}" fill="url(#c2_grad)" />'
            f'<path d="M 60 100 Q 100 60 140 100 Q 100 140 60 100" fill="none" stroke="#ffffff" stroke-width="4" stroke-opacity="0.3" />'
            f'<text x="100" y="126" font-family="system-ui, -apple-system, sans-serif" font-size="78" '
            f'font-weight="{style_meta["font_weight"]}" fill="#ffffff" text-anchor="middle">{initial}</text>'
            f'</svg>'
        )

        # Concept 3: Deep Emerald (Wellness, Calm & Precision)
        c3_colors = {
            "primary": "#059669",
            "secondary": "#047857",
            "accent": "#10b981",
            "surface": "#f0fdf4",
            "ink": "#064e3b"
        }
        svg3 = (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">'
            f'<defs>'
            f'<linearGradient id="c3_grad" x1="0%" y1="0%" x2="100%" y2="100%">'
            f'<stop offset="0%" stop-color="{c3_colors["primary"]}" />'
            f'<stop offset="100%" stop-color="{c3_colors["accent"]}" />'
            f'</linearGradient>'
            f'</defs>'
            f'<rect width="200" height="200" rx="{style_meta["rx"]}" fill="url(#c3_grad)" />'
            f'<polygon points="100,45 155,145 45,145" fill="none" stroke="#ffffff" stroke-width="3" stroke-opacity="0.25" />'
            f'<text x="100" y="126" font-family="system-ui, -apple-system, sans-serif" font-size="78" '
            f'font-weight="{style_meta["font_weight"]}" fill="#ffffff" text-anchor="middle">{initial}</text>'
            f'</svg>'
        )

        favicon_svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">'
            f'<rect width="32" height="32" rx="8" fill="{c1_colors["primary"]}" />'
            f'<text x="16" y="22" font-family="sans-serif" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle">{initial}</text>'
            f'</svg>'
        )

        # Concept 4: Apex Obsidian & Gold (Executive & Precision)
        c4_colors = {
            "primary": "#0f172a",
            "secondary": "#1e293b",
            "accent": "#f59e0b",
            "surface": "#ffffff",
            "ink": "#0f172a"
        }
        svg4 = (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">'
            f'<defs>'
            f'<linearGradient id="c4_grad" x1="0%" y1="0%" x2="100%" y2="100%">'
            f'<stop offset="0%" stop-color="{c4_colors["primary"]}" />'
            f'<stop offset="100%" stop-color="{c4_colors["secondary"]}" />'
            f'</linearGradient>'
            f'</defs>'
            f'<rect width="200" height="200" rx="{style_meta["rx"]}" fill="url(#c4_grad)" />'
            f'<circle cx="100" cy="100" r="68" fill="none" stroke="{c4_colors["accent"]}" stroke-width="3" stroke-dasharray="8 6" />'
            f'<text x="100" y="126" font-family="system-ui, -apple-system, sans-serif" font-size="78" '
            f'font-weight="{style_meta["font_weight"]}" fill="#ffffff" text-anchor="middle">{initial}</text>'
            f'</svg>'
        )

        concepts = [
            {
                "id": "concept_1",
                "name": f"Authoritative Trust ({style_key.title()})",
                "tagline": f"{business_name} • Professional Precision",
                "logo_svg": svg1,
                "palette": c1_colors,
                "typography": {
                    "heading_font": "Inter, system-ui, sans-serif",
                    "body_font": "Plus Jakarta Sans, sans-serif",
                    "scale": "Major Third (1.25)"
                },
                "usage_notes": "Primary mark for header navigation, patient portal, business stationery, and outdoor clinic signage."
            },
            {
                "id": "concept_2",
                "name": f"Warm Hospitality ({style_key.title()})",
                "tagline": f"{business_name} • Attentive & Caring",
                "logo_svg": svg2,
                "palette": c2_colors,
                "typography": {
                    "heading_font": "Cabinet Grotesk, sans-serif",
                    "body_font": "Inter, sans-serif",
                    "scale": "Perfect Fourth (1.33)"
                },
                "usage_notes": "Excellent for social media marketing, customer onboarding collateral, and digital advertising."
            },
            {
                "id": "concept_3",
                "name": f"Modern Wellness ({style_key.title()})",
                "tagline": f"{business_name} • Health & Balance",
                "logo_svg": svg3,
                "palette": c3_colors,
                "typography": {
                    "heading_font": "Geist Sans, sans-serif",
                    "body_font": "Geist Sans, sans-serif",
                    "scale": "Major Second (1.125)"
                },
                "usage_notes": "Clean aesthetic optimized for clinical hygiene, appointment reminder cards, and mobile app icon."
            },
            {
                "id": "concept_4",
                "name": f"Executive Distinction ({style_key.title()})",
                "tagline": f"{business_name} • Excellence & Prestige",
                "logo_svg": svg4,
                "palette": c4_colors,
                "typography": {
                    "heading_font": "Outfit, system-ui, sans-serif",
                    "body_font": "Inter, sans-serif",
                    "scale": "Augmented Fourth (1.414)"
                },
                "usage_notes": "High-contrast luxury presentation for executive suites, premium services, and corporate accounts."
            }
        ]

        return {
            "business_name": business_name,
            "style": style_key,
            "active_concept": concepts[0],
            "concepts": concepts,
            "assets": {
                "favicon_svg": favicon_svg,
                "social_avatar_svg": svg1
            },
            "status": "READY"
        }


brand_generator_agent = BrandGeneratorAgent()
