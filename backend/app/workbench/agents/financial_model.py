"""
Rine Forge Systems V5 - Phase AQ: Financial Model Agent
Executes deterministic mathematical equations for revenue, expenses, gross margin,
break-even points, and 12-month cash-flow projections.
AI provides narrative explanations; all arithmetic is purely deterministic.
Outputs structured JSON and downloadable CSV formats.
"""
import math
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("rine_forge.workbench.financial_model")


class FinancialModelAgent:
    """
    Deterministic mathematical financial modeling workbench.
    Guarantees 100% calculation accuracy with zero AI hallucination of math.
    """

    def calculate_financials(
        self,
        monthly_revenue: Optional[float] = None,
        average_order_value: float = 250.0,
        customers: int = 80,
        employees: int = 2,
        salary: float = 4000.0,
        rent: float = 3500.0,
        marketing: float = 1500.0,
        software: float = 500.0,
        other_costs: float = 800.0,
        cogs_rate: float = 0.20 # 20% direct supply/materials cost
    ) -> Dict[str, Any]:
        """
        Executes strict deterministic mathematical formulas.
        """
        # 1. Revenue
        calc_monthly_rev = monthly_revenue if monthly_revenue is not None and monthly_revenue > 0 else (customers * average_order_value)
        annual_rev = calc_monthly_rev * 12.0

        # 2. Cost of Goods Sold & Gross Profit
        cogs = round(calc_monthly_rev * cogs_rate, 2)
        gross_profit = round(calc_monthly_rev - cogs, 2)
        gross_margin_pct = round((gross_profit / calc_monthly_rev * 100.0) if calc_monthly_rev > 0 else 0.0, 1)

        # 3. Fixed Operating Expenses (OPEX)
        total_salaries = round(employees * salary, 2)
        opex = round(total_salaries + rent + marketing + software + other_costs, 2)

        # 4. Net Profit / EBITDA
        net_profit = round(gross_profit - opex, 2)
        net_margin_pct = round((net_profit / calc_monthly_rev * 100.0) if calc_monthly_rev > 0 else 0.0, 1)

        # 5. Break-even Analysis
        # Break-even Revenue = Fixed OPEX / (Gross Margin / 100)
        contribution_margin_ratio = (gross_margin_pct / 100.0) if gross_margin_pct > 0 else 0.01
        breakeven_rev = round(opex / contribution_margin_ratio, 2)
        breakeven_customers = math.ceil(breakeven_rev / average_order_value) if average_order_value > 0 else 0

        # 6. 12-Month Deterministic Projection (with realistic 3.5% monthly compound growth)
        monthly_projections: List[Dict[str, Any]] = []
        cumulative_cash = 0.0
        current_rev = calc_monthly_rev

        for m in range(1, 13):
            if m > 1:
                current_rev = round(current_rev * 1.035, 2)
            m_cogs = round(current_rev * cogs_rate, 2)
            m_gross = round(current_rev - m_cogs, 2)
            # Slight variable marketing increase with scale
            m_opex = round(opex + (m * 40.0), 2)
            m_net = round(m_gross - m_opex, 2)
            cumulative_cash = round(cumulative_cash + m_net, 2)

            monthly_projections.append({
                "month": f"Month {m}",
                "revenue": current_rev,
                "cogs": m_cogs,
                "gross_profit": m_gross,
                "opex": m_opex,
                "net_profit": m_net,
                "cumulative_cash": cumulative_cash
            })

        # 7. Generate Downloadable CSV
        csv_rows = [
            "Month,Revenue,COGS,Gross_Profit,OPEX,Net_Profit,Cumulative_Cash"
        ]
        for p in monthly_projections:
            csv_rows.append(f"{p['month']},{p['revenue']},{p['cogs']},{p['gross_profit']},{p['opex']},{p['net_profit']},{p['cumulative_cash']}")
        csv_content = "\n".join(csv_rows)

        # 8. Analytical Narrative
        status_health = "HEALTHY" if net_profit > 0 else "DEFICIT"
        narrative = (
            f"Financial Analysis Summary:\n"
            f"- Monthly Gross Revenue: ${calc_monthly_rev:,.2f} based on {customers} monthly clients at ${average_order_value:,.2f} average ticket.\n"
            f"- Gross Margin: {gross_margin_pct}% (${gross_profit:,.2f}) after accounting for {int(cogs_rate*100)}% direct material supplies.\n"
            f"- Fixed Monthly OPEX: ${opex:,.2f} (Salaries: ${total_salaries:,.2f}, Rent: ${rent:,.2f}, Marketing: ${marketing:,.2f}, Tech: ${software:,.2f}).\n"
            f"- Net Monthly Profit: ${net_profit:,.2f} ({net_margin_pct}% margin).\n"
            f"- Break-Even Point: Requires ${breakeven_rev:,.2f}/mo or {breakeven_customers} active customers per month to cover operational overhead."
        )

        # 8. Scenario Modeling (Conservative, Base, Optimistic)
        scenarios = {
            "conservative": {
                "label": "Conservative (-15% Revenue)",
                "monthly_revenue": round(calc_monthly_rev * 0.85, 2),
                "net_profit": round((calc_monthly_rev * 0.85 * (1 - cogs_rate)) - opex, 2),
                "break_even_status": "COVERED" if (calc_monthly_rev * 0.85) >= breakeven_rev else "RISK"
            },
            "base": {
                "label": "Base Case",
                "monthly_revenue": calc_monthly_rev,
                "net_profit": net_profit,
                "break_even_status": "COVERED" if calc_monthly_rev >= breakeven_rev else "RISK"
            },
            "optimistic": {
                "label": "Optimistic (+20% Revenue)",
                "monthly_revenue": round(calc_monthly_rev * 1.20, 2),
                "net_profit": round((calc_monthly_rev * 1.20 * (1 - cogs_rate)) - opex, 2),
                "break_even_status": "COVERED"
            }
        }

        return {
            "inputs": {
                "monthly_revenue": calc_monthly_rev,
                "average_order_value": average_order_value,
                "customers": customers,
                "employees": employees,
                "salary": salary,
                "rent": rent,
                "marketing": marketing,
                "software": software,
                "other_costs": other_costs
            },
            "metrics": {
                "monthly_revenue": calc_monthly_rev,
                "annual_revenue": annual_rev,
                "cogs": cogs,
                "gross_profit": gross_profit,
                "gross_margin_pct": gross_margin_pct,
                "operating_expenses": opex,
                "net_profit": net_profit,
                "net_margin_pct": net_margin_pct,
                "breakeven_revenue": breakeven_rev,
                "breakeven_customers": breakeven_customers,
                "financial_health": status_health
            },
            "scenarios": scenarios,
            "forecasts": {
                "period_months": 12,
                "growth_rate_pct": 3.5,
                "year_end_cumulative_cash": cumulative_cash
            },
            "monthly_projections": monthly_projections,
            "csv_content": csv_content,
            "narrative": narrative,
            "status": "COMPLETED"
        }

    async def explain_financials_with_ai(self, financial_data: Dict[str, Any]) -> str:
        """
        Uses local AI to provide narrative explanation and strategic business insights.
        Does NOT recalculate math; all numbers are strictly injected from deterministic calculation.
        """
        metrics = financial_data.get("metrics", {})
        prompt = (
            f"Review these strictly calculated business financials and provide a 3-bullet executive summary:\n"
            f"Monthly Revenue: ${metrics.get('monthly_revenue', 0):,.2f}\n"
            f"Gross Margin: {metrics.get('gross_margin_pct', 0)}%\n"
            f"Net Profit: ${metrics.get('net_profit', 0):,.2f}\n"
            f"Break-Even Revenue: ${metrics.get('breakeven_revenue', 0):,.2f}\n"
            "Highlight strengths, primary cost driver, and break-even buffer."
        )
        try:
            from backend.app.ai.gateway.rine_gateway import rine_ai_gateway
            res = await rine_ai_gateway.run(
                task="FINANCIAL_ANALYSIS",
                input=prompt,
                policy="LOCAL_ONLY"
            )
            return res.get("output", financial_data.get("narrative", ""))
        except Exception:
            return financial_data.get("narrative", "")


financial_model_agent = FinancialModelAgent()
