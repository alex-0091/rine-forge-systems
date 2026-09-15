"""
Rine Forge Systems V5 - Automation Engine
Evaluates business triggers, conditions, and dispatches automated actions (Tasks, Notifications, Leads).
"""
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.v5 import Automation, Task, Notification, Lead

logger = logging.getLogger("rine_forge_systems.automations")

class AutomationEngine:
    """
    Evaluates triggers and executes deterministic actions within tenant scope.
    """

    def evaluate_condition(self, condition: Dict[str, Any], context: Dict[str, Any]) -> bool:
        """
        Evaluates a single condition like:
        {"field": "score", "operator": ">=", "value": 70}
        """
        field = condition.get("field")
        op = condition.get("operator", "==")
        expected = condition.get("value")

        actual = context.get(field)
        if actual is None:
            return False

        try:
            if op == "==":
                return actual == expected
            elif op == "!=":
                return actual != expected
            elif op == ">=":
                return float(actual) >= float(expected)
            elif op == "<=":
                return float(actual) <= float(expected)
            elif op == ">":
                return float(actual) > float(expected)
            elif op == "<":
                return float(actual) < float(expected)
            elif op == "contains":
                return str(expected).lower() in str(actual).lower()
            elif op == "in":
                return actual in expected if isinstance(expected, list) else False
        except (ValueError, TypeError):
            return False

        return False

    def evaluate_all_conditions(self, conditions: List[Dict[str, Any]], context: Dict[str, Any]) -> bool:
        if not conditions:
            return True
        return all(self.evaluate_condition(cond, context) for cond in conditions)

    async def execute_action(
        self,
        session: AsyncSession,
        business_id: str,
        action: Dict[str, Any],
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Executes a configured action:
        - NOTIFY_STAFF / SEND_NOTIFICATION
        - CREATE_TASK / SCHEDULE_FOLLOW_UP
        - UPDATE_LEAD
        """
        action_type = action.get("type", "").upper()
        logger.info(f"[Automation Action] {action_type} for Business #{business_id}")

        if action_type in ("NOTIFY_STAFF", "SEND_NOTIFICATION"):
            recipient = action.get("recipient") or context.get("customer_email") or "admin@rineforge.ai"
            msg_tmpl = action.get("message", "System notification: {event}")
            msg = msg_tmpl.format(**context) if "{" in msg_tmpl else msg_tmpl

            notif = Notification(
                business_id=business_id,
                type=action.get("channel", "EMAIL"),
                recipient=recipient,
                message=msg,
                status="SENT"
            )
            session.add(notif)
            await session.flush()
            return {"action": action_type, "notification_id": notif.id, "status": "executed"}

        elif action_type in ("CREATE_TASK", "SCHEDULE_FOLLOW_UP"):
            delay_minutes = action.get("delay_minutes", 120)
            scheduled = datetime.utcnow() + timedelta(minutes=delay_minutes)
            customer_id = context.get("customer_id")
            
            task = Task(
                business_id=business_id,
                customer_id=customer_id,
                type=action.get("task_type", "FOLLOW_UP"),
                status="PENDING",
                scheduled_for=scheduled,
                payload={
                    "reason": action.get("reason", "Automated follow-up"),
                    "context": context
                }
            )
            session.add(task)
            await session.flush()
            return {"action": action_type, "task_id": task.id, "scheduled_for": scheduled.isoformat(), "status": "executed"}

        elif action_type == "UPDATE_LEAD":
            lead_id = context.get("lead_id")
            if lead_id:
                stmt = select(Lead).where(Lead.id == lead_id, Lead.business_id == business_id)
                res = await session.execute(stmt)
                lead = res.scalar_one_or_none()
                if lead:
                    if "status" in action:
                        lead.status = action["status"]
                    if "score_delta" in action:
                        lead.score = min(100, max(0, lead.score + action["score_delta"]))
                    await session.flush()
                    return {"action": action_type, "lead_id": lead.id, "new_status": lead.status, "status": "executed"}

        return {"action": action_type, "status": "skipped_or_unsupported"}

    async def trigger(
        self,
        session: AsyncSession,
        business_id: str,
        trigger_event: str,
        context: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Queries enabled automations matching trigger_event and runs their actions.
        """
        stmt = select(Automation).where(
            Automation.business_id == business_id,
            Automation.trigger == trigger_event,
            Automation.enabled == True
        )
        res = await session.execute(stmt)
        automations = res.scalars().all()

        results = []
        for auto in automations:
            if self.evaluate_all_conditions(auto.conditions, context):
                logger.info(f"[Automation Match] Rule '{auto.name}' matched event '{trigger_event}'")
                for action in auto.actions:
                    res_action = await self.execute_action(session, business_id, action, context)
                    results.append({"automation_id": auto.id, "rule_name": auto.name, **res_action})

        if results:
            await session.commit()

        return results

automation_engine = AutomationEngine()
